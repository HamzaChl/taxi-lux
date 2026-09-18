import Stripe from 'stripe'
import { contactEmail, escapeHtml, getMailer, json, mailFrom, sendCustomerMail } from '../_shared.js'

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') return json({ error: 'METHOD_NOT_ALLOWED' }, 405)

    const secretKey = process.env.STRIPE_SECRET_KEY
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    const signature = request.headers.get('stripe-signature')

    if (!secretKey || !webhookSecret || !signature) return json({ error: 'WEBHOOK_NOT_CONFIGURED' }, 503)

    const stripe = new Stripe(secretKey)
    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(await request.text(), signature, webhookSecret)
    } catch {
      return json({ error: 'INVALID_SIGNATURE' }, 400)
    }

    if (event.type === 'payment_intent.succeeded') {
      const intent = event.data.object
      const bookingId = intent.metadata.bookingId ?? intent.id
      const customerEmail = intent.receipt_email
      const mailer = getMailer()

      if (mailer) {
        await mailer.sendMail({
          from: mailFrom,
          to: contactEmail,
          subject: `Paiement confirmé · ${bookingId}`,
          html: `<h1>Réservation TAXI-LUX payée</h1><p><strong>Référence :</strong> ${escapeHtml(bookingId)}</p><p><strong>Statut :</strong> paiement confirmé</p><p><strong>Type :</strong> ${intent.metadata.tripType === 'round-trip' ? 'Aller-retour' : 'Aller simple'}</p><p><strong>Client :</strong> ${escapeHtml(intent.metadata.firstName)} ${escapeHtml(intent.metadata.lastName)}</p><p><strong>Téléphone :</strong> ${escapeHtml(intent.metadata.phone)}</p><p><strong>E-mail :</strong> ${escapeHtml(customerEmail)}</p><p><strong>Départ :</strong> ${escapeHtml(intent.metadata.pickup)}</p><p><strong>Destination :</strong> ${escapeHtml(intent.metadata.destination)}</p><p><strong>Aller :</strong> ${escapeHtml(intent.metadata.pickupDate)} à ${escapeHtml(intent.metadata.pickupTime)} · ${escapeHtml(intent.metadata.distanceKm)} km</p>${intent.metadata.tripType === 'round-trip' ? `<p><strong>Retour :</strong> ${escapeHtml(intent.metadata.returnDate)} à ${escapeHtml(intent.metadata.returnTime)} · ${escapeHtml(intent.metadata.returnDistanceKm)} km</p>` : ''}<p><strong>Passagers :</strong> ${escapeHtml(intent.metadata.passengers)}</p><p><strong>Bagages :</strong> ${escapeHtml(intent.metadata.luggage)}</p><p><strong>Instructions :</strong> ${escapeHtml(intent.metadata.notes)}</p><p><strong>Montant payé :</strong> ${(intent.amount_received / 100).toFixed(2)} ${intent.currency.toUpperCase()}</p><p><strong>PaymentIntent :</strong> ${escapeHtml(intent.id)}</p>`,
        })

        if (customerEmail && sendCustomerMail) {
          await mailer.sendMail({
            from: mailFrom,
            to: customerEmail,
            replyTo: contactEmail,
            subject: `Votre réservation TAXI-LUX · ${bookingId}`,
            html: `<h1>Votre paiement est confirmé</h1><p>Merci pour votre réservation TAXI-LUX.</p><p><strong>Référence :</strong> ${escapeHtml(bookingId)}</p><p><strong>Type :</strong> ${intent.metadata.tripType === 'round-trip' ? 'Aller-retour' : 'Aller simple'}</p><p><strong>Montant payé :</strong> ${(intent.amount_received / 100).toFixed(2)} ${intent.currency.toUpperCase()}</p><p><strong>Aller :</strong> ${escapeHtml(intent.metadata.pickupDate)} à ${escapeHtml(intent.metadata.pickupTime)}</p>${intent.metadata.tripType === 'round-trip' ? `<p><strong>Retour :</strong> ${escapeHtml(intent.metadata.returnDate)} à ${escapeHtml(intent.metadata.returnTime)}</p>` : ''}<p>Notre équipe reste disponible à l’adresse ${escapeHtml(contactEmail)}.</p>`,
          })
        }
      }
    }

    return json({ received: true })
  },
}
