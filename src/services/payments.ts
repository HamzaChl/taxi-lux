import type { BookingData } from '../types/booking'

const API_URL = (import.meta.env.VITE_PAYMENTS_API_URL ?? '').replace(/\/$/, '')

type PaymentIntentResponse = {
  clientSecret: string
  bookingId: string
  price: number
}

export async function createPaymentIntent(booking: BookingData, signal?: AbortSignal): Promise<PaymentIntentResponse> {
  const response = await fetch(`${API_URL}/api/payments/create-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(booking),
    signal,
  })
  if (!response.ok) throw new Error('PAYMENT_API_UNAVAILABLE')
  const data = await response.json() as Partial<PaymentIntentResponse>
  if (!data.clientSecret || !data.bookingId || typeof data.price !== 'number') throw new Error('INVALID_PAYMENT_RESPONSE')
  return { clientSecret: data.clientSecret, bookingId: data.bookingId, price: data.price }
}
