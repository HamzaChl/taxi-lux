import { useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCircleCheck, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'
import { useRoute } from '../../hooks/useRoute'
import type { BookingFormValues, LocationValue } from '../../types/booking'
import { calculateFare } from '../../utils/calculateFare'
import { AddressAutocomplete } from './AddressAutocomplete'
import { BookingMap } from './BookingMap'
import { BookingSummary } from './BookingSummary'
import { StripePayment } from './StripePayment'
import { createPaymentIntent } from '../../services/payments'

const bookingSchema = z.object({
  tripType: z.enum(['one-way', 'round-trip']),
  pickupDate: z.string().min(1, 'Sélectionnez une date'),
  pickupTime: z.string().min(1, 'Sélectionnez une heure'),
  waitingMinutes: z.number().min(0),
  returnDate: z.string().optional(),
  returnTime: z.string().optional(),
  returnWaitingMinutes: z.number().min(0).optional(),
  firstName: z.string().trim().min(2, 'Minimum 2 caractères'),
  lastName: z.string().trim().min(2, 'Minimum 2 caractères'),
  phone: z.string().trim().min(6, 'Téléphone requis'),
  email: z.email('Adresse e-mail invalide'),
  passengers: z.number().min(1).max(8).optional(),
  luggage: z.number().min(0).max(12).optional(),
  notes: z.string().optional(),
}).superRefine((values, context) => {
  if (values.tripType !== 'round-trip') return
  if (!values.returnDate) context.addIssue({ code: 'custom', path: ['returnDate'], message: 'Sélectionnez une date de retour' })
  if (!values.returnTime) context.addIssue({ code: 'custom', path: ['returnTime'], message: 'Sélectionnez une heure de retour' })
  if (values.returnDate && values.returnTime && `${values.returnDate}T${values.returnTime}` <= `${values.pickupDate}T${values.pickupTime}`) context.addIssue({ code: 'custom', path: ['returnTime'], message: 'Le retour doit avoir lieu après l’aller' })
})

const inputClass = 'mt-2 h-[52px] w-full rounded-[5px] border border-white/15 bg-white/8 px-4 text-sm font-medium text-white placeholder:text-white/35 focus:border-brand-red'
const labelClass = 'block text-[11px] font-extrabold tracking-wide text-white/80 uppercase'

export function TaxiLuxBooking() {
  const [pickup, setPickup] = useState<LocationValue | null>(null)
  const [destination, setDestination] = useState<LocationValue | null>(null)
  const [addressErrors, setAddressErrors] = useState({ pickup: '', destination: '' })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [payment, setPayment] = useState<{ clientSecret: string; bookingId: string; price: number } | null>(null)
  const { register, handleSubmit, control, formState: { errors, isValid } } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    mode: 'onChange',
    defaultValues: { tripType: 'one-way', waitingMinutes: 0, returnWaitingMinutes: 0, passengers: 1, luggage: 1, pickupDate: '', pickupTime: '', returnDate: '', returnTime: '', firstName: '', lastName: '', phone: '', email: '', notes: '' },
  })
  const values = useWatch({ control }) as BookingFormValues
  const roundTrip = values.tripType === 'round-trip'
  const { route, status } = useRoute(pickup, destination)
  const { route: returnRoute, status: returnStatus } = useRoute(roundTrip ? destination : null, roundTrip ? pickup : null)
  const price = useMemo(() => {
    if (!route || !values.pickupTime) return null
    const outboundFare = calculateFare(route.distanceKm, values.pickupTime, Number(values.waitingMinutes) || 0)
    if (!roundTrip) return outboundFare
    if (!returnRoute || !values.returnTime) return null
    return Math.round((outboundFare + calculateFare(returnRoute.distanceKm, values.returnTime, Number(values.returnWaitingMinutes) || 0)) * 100) / 100
  }, [route, returnRoute, roundTrip, values.pickupTime, values.returnTime, values.waitingMinutes, values.returnWaitingMinutes])
  const canSubmit = Boolean(pickup && destination && route && status === 'route-ready' && (!roundTrip || (returnRoute && returnStatus === 'route-ready')) && isValid)

  function updatePickup(value: LocationValue | null) {
    setPickup(value)
    if (value) setAddressErrors(current => ({ ...current, pickup: '' }))
  }

  function updateDestination(value: LocationValue | null) {
    setDestination(value)
    if (value) setAddressErrors(current => ({ ...current, destination: '' }))
  }

  async function submitBooking(formValues: BookingFormValues) {
    if (!pickup || !destination || !route || price === null) {
      setAddressErrors({ pickup: pickup ? '' : 'Sélectionnez une adresse proposée', destination: destination ? '' : 'Sélectionnez une adresse proposée' })
      return
    }
    setSubmitStatus('submitting')
    try {
      const result = await createPaymentIntent({
        tripType: formValues.tripType,
        pickup,
        destination,
        pickupDate: formValues.pickupDate,
        pickupTime: formValues.pickupTime,
        waitingMinutes: formValues.waitingMinutes,
        returnDate: roundTrip ? formValues.returnDate : undefined,
        returnTime: roundTrip ? formValues.returnTime : undefined,
        returnWaitingMinutes: roundTrip ? formValues.returnWaitingMinutes : undefined,
        customer: {
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          phone: formValues.phone,
          email: formValues.email,
          passengers: formValues.passengers,
          luggage: formValues.luggage,
          notes: formValues.notes,
        },
        route,
        returnRoute: roundTrip ? returnRoute ?? undefined : undefined,
        estimatedPrice: price,
      })
      setPayment(result)
      setSubmitStatus('success')
    } catch {
      setSubmitStatus('error')
    }
  }

  if (payment) return <div className="mx-auto max-w-[950px] overflow-hidden rounded-[10px] bg-white shadow-[0_20px_60px_rgba(7,23,39,.12)]"><StripePayment clientSecret={payment.clientSecret} bookingId={payment.bookingId} price={payment.price} onBack={() => { setPayment(null); setSubmitStatus('idle') }} /></div>

  return (
    <div className="mx-auto max-w-[1450px] overflow-hidden rounded-[10px] bg-white shadow-[0_20px_60px_rgba(7,23,39,.12)] lg:grid lg:min-h-[760px] lg:grid-cols-[39%_61%]">
      <form className="bg-navy px-6 py-9 text-white sm:px-10 lg:px-11" onSubmit={handleSubmit(submitBooking)}>
        <p className="eyebrow">Taxi-Lux</p>
        <h1 className="mt-3 text-[32px] leading-tight font-bold tracking-[-1px]">Réservez votre trajet</h1>
        <p className="mt-2 text-sm font-semibold text-white/55">Bruxelles & Brussels Airport</p>

        <div className="mt-9 border-t border-white/10 pt-7">
          <h2 className="text-sm font-bold">Votre trajet</h2>
          <div className="mt-5 space-y-5">
            <div className="grid grid-cols-2 rounded-[6px] border border-white/15 bg-white/5 p-1">
              <label className={`cursor-pointer rounded-[4px] px-4 py-3 text-center text-xs font-bold transition ${!roundTrip ? 'bg-white text-navy' : 'text-white/65 hover:text-white'}`}><input type="radio" value="one-way" {...register('tripType')} className="sr-only" />Aller simple</label>
              <label className={`cursor-pointer rounded-[4px] px-4 py-3 text-center text-xs font-bold transition ${roundTrip ? 'bg-white text-navy' : 'text-white/65 hover:text-white'}`}><input type="radio" value="round-trip" {...register('tripType')} className="sr-only" />Aller-retour</label>
            </div>
            <AddressAutocomplete label="Adresse de départ" value={pickup} onChange={updatePickup} error={addressErrors.pickup} />
            <AddressAutocomplete label="Adresse de destination" value={destination} onChange={updateDestination} accent error={addressErrors.destination} />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>Date de prise en charge<input type="date" {...register('pickupDate')} className={inputClass} />{errors.pickupDate && <span className="mt-2 block text-[11px] normal-case text-[#ff6680]">{errors.pickupDate.message}</span>}</label>
              <label className={labelClass}>Heure de prise en charge<input type="time" {...register('pickupTime')} className={inputClass} />{errors.pickupTime && <span className="mt-2 block text-[11px] normal-case text-[#ff6680]">{errors.pickupTime.message}</span>}</label>
            </div>
            <label className={labelClass}>Temps d’attente<select {...register('waitingMinutes', { valueAsNumber: true })} className={inputClass}>{[0, 5, 10, 15, 20, 30, 45, 60].map(minutes => <option key={minutes} value={minutes} className="text-navy">{minutes === 0 ? 'Sans attente' : `${minutes} min`}</option>)}</select></label>
            {roundTrip && <div className="space-y-4 rounded-[6px] border border-white/15 bg-white/5 p-4"><p className="text-xs font-bold text-white">Trajet retour · destination vers départ</p><div className="grid gap-4 sm:grid-cols-2"><label className={labelClass}>Date du retour<input type="date" {...register('returnDate')} className={inputClass} />{errors.returnDate && <span className="mt-2 block text-[11px] normal-case text-[#ff6680]">{errors.returnDate.message}</span>}</label><label className={labelClass}>Heure du retour<input type="time" {...register('returnTime')} className={inputClass} />{errors.returnTime && <span className="mt-2 block text-[11px] normal-case text-[#ff6680]">{errors.returnTime.message}</span>}</label></div><label className={labelClass}>Attente au retour<select {...register('returnWaitingMinutes', { valueAsNumber: true })} className={inputClass}>{[0, 5, 10, 15, 20, 30, 45, 60].map(minutes => <option key={minutes} value={minutes} className="text-navy">{minutes === 0 ? 'Sans attente' : `${minutes} min`}</option>)}</select></label></div>}
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-7">
          <h2 className="text-sm font-bold">Vos informations</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className={labelClass}>Prénom<input {...register('firstName')} className={inputClass} placeholder="Votre prénom" />{errors.firstName && <span className="mt-2 block text-[11px] normal-case text-[#ff6680]">{errors.firstName.message}</span>}</label>
            <label className={labelClass}>Nom<input {...register('lastName')} className={inputClass} placeholder="Votre nom" />{errors.lastName && <span className="mt-2 block text-[11px] normal-case text-[#ff6680]">{errors.lastName.message}</span>}</label>
            <label className={labelClass}>Téléphone<input type="tel" {...register('phone')} className={inputClass} placeholder="+32 492 65 44 13" />{errors.phone && <span className="mt-2 block text-[11px] normal-case text-[#ff6680]">{errors.phone.message}</span>}</label>
            <label className={labelClass}>E-mail<input type="email" {...register('email')} className={inputClass} placeholder="vous@exemple.be" />{errors.email && <span className="mt-2 block text-[11px] normal-case text-[#ff6680]">{errors.email.message}</span>}</label>
            <label className={labelClass}>Passagers<input type="number" min="1" max="8" {...register('passengers', { valueAsNumber: true })} className={inputClass} /></label>
            <label className={labelClass}>Bagages<input type="number" min="0" max="12" {...register('luggage', { valueAsNumber: true })} className={inputClass} /></label>
            <label className={`${labelClass} sm:col-span-2`}>Instructions<textarea rows={3} {...register('notes')} className="mt-2 w-full resize-none rounded-[5px] border border-white/15 bg-white/8 p-4 text-sm font-medium text-white placeholder:text-white/35 focus:border-brand-red" placeholder="Informations complémentaires pour votre chauffeur…" /></label>
          </div>
        </div>

        {(status === 'calculating-route' || (roundTrip && returnStatus === 'calculating-route')) && <p className="mt-5 text-xs font-semibold text-white/65"><FontAwesomeIcon icon={faSpinner} spin className="mr-2 text-brand-red" />Calcul de votre trajet…</p>}
        {(status === 'route-error' || (roundTrip && returnStatus === 'route-error')) && <p className="mt-5 text-xs font-semibold leading-5 text-[#ff6680]">Impossible de calculer cet itinéraire. Veuillez vérifier les adresses sélectionnées.</p>}
        {submitStatus === 'success' && <p className="mt-5 rounded-[5px] bg-white/10 p-4 text-xs font-semibold text-white"><FontAwesomeIcon icon={faCircleCheck} className="mr-2 text-brand-red" />Votre trajet est prêt pour la prochaine étape de paiement.</p>}
        {submitStatus === 'error' && <p className="mt-5 rounded-[5px] bg-white/10 p-4 text-xs font-semibold leading-5 text-[#ff6680]">Le paiement en ligne n’est pas encore disponible. L’API TAXI-LUX doit fournir le service sécurisé de création du paiement.</p>}
        <button type="submit" disabled={!canSubmit || submitStatus === 'submitting'} className="button-primary mt-7 w-full disabled:cursor-not-allowed disabled:bg-white/15 disabled:text-white/40 disabled:hover:translate-y-0">{submitStatus === 'submitting' ? <><FontAwesomeIcon icon={faSpinner} spin />Préparation…</> : <>Réserver ce trajet <FontAwesomeIcon icon={faArrowRight} /></>}</button>
        <p className="mt-3 text-center text-[10px] leading-5 text-white/40">Le montant sera recalculé et vérifié par le serveur avant tout paiement.</p>
      </form>

      <BookingMap pickup={pickup} destination={destination} route={route}>
        <BookingSummary pickup={pickup} destination={destination} route={route} returnRoute={returnRoute} values={values} price={price} />
      </BookingMap>
    </div>
  )
}
