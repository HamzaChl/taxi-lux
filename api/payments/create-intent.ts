import Stripe from 'stripe'
import { isEmail, isText, json } from '../_shared.js'

type LocationInput = { displayName?: unknown; lat?: unknown; lon?: unknown }
type BookingInput = {
  tripType?: unknown
  pickup?: LocationInput
  destination?: LocationInput
  pickupDate?: unknown
  pickupTime?: unknown
  waitingMinutes?: unknown
  returnDate?: unknown
  returnTime?: unknown
  returnWaitingMinutes?: unknown
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
    const tripType = booking.tripType === 'round-trip' ? 'round-trip' : 'one-way'
    const returnWaitingMinutes = Number(booking.returnWaitingMinutes ?? 0)
    const passengers = Number(customer?.passengers ?? 1)
    const luggage = Number(customer?.luggage ?? 0)

    const invalidReturn = tripType === 'round-trip' && (!isText(booking.returnDate, 10, 10) || !/^\d{2}:\d{2}$/.test(String(booking.returnTime)) || `${booking.returnDate}T${booking.returnTime}` <= `${booking.pickupDate}T${booking.pickupTime}` || !Number.isFinite(returnWaitingMinutes) || returnWaitingMinutes < 0 || returnWaitingMinutes > 180)

    if (!validLocation(booking.pickup) || !validLocation(booking.destination) || !isText(booking.pickupDate, 10, 10) || !/^\d{2}:\d{2}$/.test(String(booking.pickupTime)) || !Number.isFinite(waitingMinutes) || waitingMinutes < 0 || waitingMinutes > 180 || invalidReturn || !customer || !isText(customer.firstName, 2, 100) || !isText(customer.lastName, 2, 100) || !isText(customer.phone, 6, 30) || !isEmail(customer.email) || !Number.isFinite(passengers) || passengers < 1 || passengers > 8 || !Number.isFinite(luggage) || luggage < 0 || luggage > 12 || (customer.notes !== undefined && !isText(customer.notes, 0, 1000))) {
      return json({ error: 'INVALID_BOOKING_DATA' }, 400)
    }

    try {
      const distanceKm = await routeDistance(booking.pickup as LocationInput, booking.destination as LocationInput)
      const returnDistanceKm = tripType === 'round-trip' ? await routeDistance(booking.destination as LocationInput, booking.pickup as LocationInput) : 0
      const outboundPrice = calculateFare(distanceKm, String(booking.pickupTime), waitingMinutes)
      const returnPrice = tripType === 'round-trip' ? calculateFare(returnDistanceKm, String(booking.returnTime), returnWaitingMinutes) : 0
      const price = Math.round((outboundPrice + returnPrice) * 100) / 100
      const bookingId = crypto.randomUUID()
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(price * 100),
        currency: 'eur',
        automatic_payment_methods: { enabled: true },
        receipt_email: customer.email,
        metadata: {
          bookingId,
          tripType,
          firstName: String(customer.firstName).slice(0, 500),
          lastName: String(customer.lastName).slice(0, 500),
          phone: String(customer.phone).slice(0, 500),
          pickup: String(booking.pickup?.displayName).slice(0, 500),
          destination: String(booking.destination?.displayName).slice(0, 500),
          passengers: String(passengers),
          luggage: String(luggage),
          notes: String(customer.notes ?? '').slice(0, 500),
          pickupDate: String(booking.pickupDate),
          pickupTime: String(booking.pickupTime),
          distanceKm: distanceKm.toFixed(2),
          returnDate: tripType === 'round-trip' ? String(booking.returnDate) : '',
          returnTime: tripType === 'round-trip' ? String(booking.returnTime) : '',
          returnDistanceKm: tripType === 'round-trip' ? returnDistanceKm.toFixed(2) : '',
        },
      }, { idempotencyKey: bookingId })

      if (!intent.client_secret) return json({ error: 'PAYMENT_INTENT_FAILED' }, 502)

      return json({ clientSecret: intent.client_secret, bookingId, price })
    } catch {
      return json({ error: 'PAYMENT_CREATION_FAILED' }, 502)
    }
  },
}
