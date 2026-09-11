import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useSearchParams } from 'react-router-dom'
import { TaxiLuxBooking } from '../components/booking/TaxiLuxBooking'

export function ReservationPage() {
  const [searchParams] = useSearchParams()
  const paymentComplete = searchParams.get('payment') === 'complete'
  const bookingId = searchParams.get('booking')

  if (paymentComplete) {
    return <section className="bg-mist px-5 py-20 sm:px-8 lg:py-28"><div className="mx-auto max-w-2xl rounded-[10px] border bg-white p-8 text-center shadow-card sm:p-14"><FontAwesomeIcon icon={faCircleCheck} className="text-5xl text-brand-red" /><p className="eyebrow mt-7">Paiement en cours de confirmation</p><h1 className="mt-4 text-3xl font-bold tracking-[-.8px] text-navy sm:text-4xl">Merci pour votre réservation.</h1><p className="mt-5 text-sm leading-7 text-muted">Stripe traite votre paiement. Vous recevrez votre confirmation par e-mail dès sa validation.</p>{bookingId && <p className="mt-6 rounded-[5px] bg-mist p-4 text-xs font-bold text-navy">Référence : {bookingId}</p>}</div></section>
  }

  return (
    <section className="bg-mist px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <TaxiLuxBooking />
    </section>
  )
}
