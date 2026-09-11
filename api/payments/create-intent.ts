import Stripe from 'stripe'
import { contactEmail, escapeHtml, getMailer, isEmail, isText, json, mailFrom } from '../_shared.js'

type LocationInput = { displayName?: unknown; lat?: unknown; lon?: unknown }
type BookingInput = {
  pickup?: LocationInput
  destination?: LocationInput
  pickupDate?: unknown
  pickupTime?: unknown
  waitingMinutes?: unknown
  customer?: {
    firstName?: unknown
    lastName?: unknown
    phone?: unknown
    email?: unknown
    passengers?: unknown
    luggage?: unknown
    notes?: unknown
  }
}

function validLocation(value: LocationInput | undefined) {
  return Boolean(value && isText(value.displayName, 2, 500) && typeof value.lat === 'number' && Number.isFinite(value.lat) && value.lat >= -90 && value.lat <= 90 && typeof value.lon === 'number' && Number.isFinite(value.lon) && value.lon >= -180 && value.lon <= 180)
}

function calculateFare(distanceKm: number, pickupTime: string, waitingMinutes: number) {
  const isDay = pickupTime >= '06:00' && pickupTime < '22:00'
  const pickupFee = isDay ? 2.6 : 4.6
  const fare = pickupFee + distanceKm * 2.3 + waitingMinutes * 0.6
  return Math.round(Math.max(20, fare) * 100) / 100
}

async function routeDistance(pickup: LocationInput, destination: LocationInput) {
  const coordinates = `${pickup.lon},${pickup.lat};${destination.lon},${destination.lat}`
  const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=false`)
  if (!response.ok) throw new Error('ROUTE_UNAVAILABLE')
  const data = await response.json() as { routes?: Array<{ distance?: number }> }
  const distance = data.routes?.[0]?.distance
  if (typeof distance !== 'number' || !Number.isFinite(distance) || distance <= 0) throw new Error('INVALID_ROUTE')
  return distance / 1000
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') return json({ error: 'METHOD_NOT_ALLOWED' }, 405)
    if (!process.env.STRIPE_SECRET_KEY) return json({ error: 'STRIPE_NOT_CONFIGURED' }, 503)

    let booking: BookingInput

    try {
      booking = await request.json() as BookingInput
    } catch {
      return json({ error: 'INVALID_JSON' }, 400)
    }

    const customer = booking.customer
    const waitingMinutes = Number(booking.waitingMinutes)
    const passengers = Number(customer?.passengers ?? 1)
    const luggage = Number(customer?.luggage ?? 0)

    if (!validLocation(booking.pickup) || !validLocation(booking.destination) || !isText(booking.pickupDate, 10, 10) || !/^\d{2}:\d{2}$/.test(String(booking.pickupTime)) || !Number.isFinite(waitingMinutes) || waitingMinutes < 0 || waitingMinutes > 180 || !customer || !isText(customer.firstName, 2, 100) || !isText(customer.lastName, 2, 100) || !isText(customer.phone, 6, 30) || !isEmail(customer.email) || !Number.isFinite(passengers) || passengers < 1 || passengers > 8 || !Number.isFinite(luggage) || luggage < 0 || luggage > 12 || (customer.notes !== undefined && !isText(customer.notes, 0, 1000))) {
      return json({ error: 'INVALID_BOOKING_DATA' }, 400)
    }

    try {
      const distanceKm = await routeDistance(booking.pickup as LocationInput, booking.destination as LocationInput)
      const price = calculateFare(distanceKm, String(booking.pickupTime), waitingMinutes)
      const bookingId = crypto.randomUUID()
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(price * 100),
        currency: 'eur',
        automatic_payment_methods: { enabled: true },
        receipt_email: customer.email,
        metadata: {
          bookingId,
          pickupDate: String(booking.pickupDate),
          pickupTime: String(booking.pickupTime),
          distanceKm: distanceKm.toFixed(2),
        },
      }, { idempotencyKey: bookingId })

      if (!intent.client_secret) return json({ error: 'PAYMENT_INTENT_FAILED' }, 502)

      const mailer = getMailer()
      if (mailer) {
        await mailer.sendMail({
          from: mailFrom,
          to: contactEmail,
          replyTo: customer.email,
          subject: `Nouvelle réservation en attente · ${bookingId}`,
          html: `<h1>Nouvelle réservation TAXI-LUX</h1><p><strong>Référence :</strong> ${bookingId}</p><p><strong>Client :</strong> ${escapeHtml(customer.firstName)} ${escapeHtml(customer.lastName)}</p><p><strong>Téléphone :</strong> ${escapeHtml(customer.phone)}</p><p><strong>E-mail :</strong> ${escapeHtml(customer.email)}</p><p><strong>Départ :</strong> ${escapeHtml(booking.pickup?.displayName)}</p><p><strong>Destination :</strong> ${escapeHtml(booking.destination?.displayName)}</p><p><strong>Date :</strong> ${escapeHtml(booking.pickupDate)} à ${escapeHtml(booking.pickupTime)}</p><p><strong>Passagers :</strong> ${passengers}</p><p><strong>Bagages :</strong> ${luggage}</p><p><strong>Distance :</strong> ${distanceKm.toFixed(2)} km</p><p><strong>Tarif :</strong> ${price.toFixed(2)} €</p><p><strong>Statut :</strong> paiement en attente</p><p><strong>Instructions :</strong> ${escapeHtml(customer.notes)}</p>`,
        })
      }

      return json({ clientSecret: intent.client_secret, bookingId, price })
    } catch {
      return json({ error: 'PAYMENT_CREATION_FAILED' }, 502)
    }
  },
}
