import { useState } from 'react'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCircleCheck, faLock, faSpinner } from '@fortawesome/free-solid-svg-icons'

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripePromise = publishableKey ? loadStripe(publishableKey) : null

type StripePaymentProps = {
  clientSecret: string
  bookingId: string
  price: number
  onBack: () => void
}

function PaymentForm({ bookingId, price, onBack }: Omit<StripePaymentProps, 'clientSecret'>) {
  const stripe = useStripe()
  const elements = useElements()
  const [isPaying, setIsPaying] = useState(false)
  const [error, setError] = useState('')
  const [succeeded, setSucceeded] = useState(false)

  async function handlePayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!stripe || !elements) return
    setIsPaying(true)
    setError('')
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/reservation?payment=complete&booking=${encodeURIComponent(bookingId)}` },
      redirect: 'if_required',
    })
    if (result.error) {
      setError(result.error.message ?? 'Le paiement n’a pas pu être confirmé.')
      setIsPaying(false)
    } else if (result.paymentIntent?.status === 'succeeded' || result.paymentIntent?.status === 'processing') {
      setSucceeded(true)
    }
  }

  if (succeeded) return <div className="bg-navy p-10 text-center text-white sm:p-14"><FontAwesomeIcon icon={faCircleCheck} className="text-5xl text-brand-red" /><p className="eyebrow mt-7">Paiement confirmé</p><h2 className="mt-4 text-3xl font-bold">Votre réservation est enregistrée.</h2><p className="mt-5 text-sm leading-7 text-white/65">Une confirmation vous sera envoyée par e-mail. Conservez votre référence : {bookingId}</p></div>

  return (
    <form onSubmit={handlePayment} className="bg-navy p-6 text-white sm:p-10 lg:p-12">
      <button type="button" onClick={onBack} className="cursor-pointer text-xs font-bold text-white/60 transition hover:text-white"><FontAwesomeIcon icon={faArrowLeft} className="mr-2" />Modifier le trajet</button>
      <p className="eyebrow mt-8">Paiement sécurisé</p>
      <h2 className="mt-3 text-3xl font-bold tracking-[-.8px]">Finalisez votre réservation</h2>
      <div className="mt-7 rounded-[7px] bg-white p-5 text-navy"><PaymentElement options={{ layout: 'tabs' }} /></div>
      {error && <p className="mt-4 text-xs font-semibold text-[#ff6680]">{error}</p>}
      <button type="submit" disabled={!stripe || !elements || isPaying} className="button-primary mt-6 w-full disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/40">{isPaying ? <><FontAwesomeIcon icon={faSpinner} spin />Paiement en cours…</> : <>Payer {price.toFixed(2).replace('.', ',')} €</>}</button>
      <p className="mt-4 text-center text-[10px] leading-5 text-white/45"><FontAwesomeIcon icon={faLock} className="mr-2" />Vos informations de paiement sont traitées directement et sécurisées par Stripe.</p>
    </form>
  )
}

export function StripePayment({ clientSecret, bookingId, price, onBack }: StripePaymentProps) {
  if (!stripePromise) return <div className="bg-navy p-10 text-white"><p className="eyebrow">Configuration requise</p><h2 className="mt-3 text-2xl font-bold">Stripe n’est pas encore configuré</h2><p className="mt-4 text-sm leading-7 text-white/65">Ajoutez la clé publiable Stripe dans VITE_STRIPE_PUBLISHABLE_KEY pour afficher le formulaire de paiement.</p><button type="button" onClick={onBack} className="button-primary mt-7">Retour au trajet</button></div>

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#DF1738',
            colorText: '#071727',
            borderRadius: '5px',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          },
        },
      }}
    >
      <PaymentForm bookingId={bookingId} price={price} onBack={onBack} />
    </Elements>
  )
}
