import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCircleCheck, faClock, faEnvelope, faLocationDot, faPhone, faSpinner } from '@fortawesome/free-solid-svg-icons'

const contactDetails = [
  { icon: faPhone, label: 'Téléphone', value: '+32 492 65 44 13', href: 'tel:+32492654413' },
  { icon: faEnvelope, label: 'E-mail', value: 'info@taxi-lux.be', href: 'mailto:info@taxi-lux.be' },
  { icon: faLocationDot, label: 'Zone de service', value: 'Bruxelles-Capitale & Brussels Airport' },
  { icon: faClock, label: 'Disponibilité', value: '24 heures sur 24, 7 jours sur 7' },
]

export function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('sending')
    setErrorMessage('')
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData)),
      })

      if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('ROUTE_UNAVAILABLE')
      const result = await response.json() as { ok?: boolean; error?: string }
      if (!response.ok || result.ok !== true) throw new Error(result.error ?? 'CONTACT_FAILED')
      form.reset()
      setStatus('success')
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'CONTACT_FAILED'
      setErrorMessage(reason === 'MAIL_NOT_CONFIGURED' ? 'Le service e-mail n’est pas configuré. Contactez-nous directement à info@taxi-lux.be.' : reason === 'MAIL_AUTH_FAILED' ? 'Le service e-mail refuse la connexion. Contactez-nous directement à info@taxi-lux.be.' : reason === 'ROUTE_UNAVAILABLE' ? 'Le formulaire n’est pas connecté au service d’envoi. Contactez-nous directement à info@taxi-lux.be.' : 'Impossible d’envoyer votre message. Veuillez réessayer ou nous contacter directement.')
      setStatus('error')
    }
  }

  return (
    <>
      <section className="bg-navy px-5 py-20 text-white sm:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-5 max-w-3xl text-[42px] leading-[1.15] font-bold tracking-[-1.5px] sm:text-[52px]">Parlons de votre prochain trajet.</h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-[1.8] text-white/70">Notre équipe vous accompagne pour vos déplacements à Bruxelles et vos transferts vers ou depuis Brussels Airport.</p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow">Nous joindre</p>
            <h2 className="section-title">Une réponse claire et rapide.</h2>
            <p className="mt-5 text-sm leading-[1.8] text-muted">Pour une réservation immédiate, une demande professionnelle ou une question sur votre transfert, contactez-nous directement.</p>
            <div className="mt-10 space-y-7">
              {contactDetails.map(({ icon, label, value, href }) => (
                <div key={label} className="flex gap-4">
                  <span className="icon-disc shrink-0"><FontAwesomeIcon icon={icon} /></span>
                  <div><p className="text-[11px] font-extrabold tracking-[1.5px] text-muted uppercase">{label}</p>{href ? <a href={href} className="mt-1 block text-sm font-bold text-navy transition hover:text-brand-red">{value}</a> : <p className="mt-1 text-sm font-bold text-navy">{value}</p>}</div>
                </div>
              ))}
            </div>
          </div>

          <form className="rounded-[9px] border bg-white p-6 shadow-card sm:p-10" onSubmit={submitContact}>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-xs font-extrabold text-navy">Nom complet<input required name="name" minLength={2} maxLength={100} className="mt-2 h-[52px] w-full rounded-[5px] border bg-mist px-4 text-sm font-medium focus:border-brand-red" placeholder="Votre nom" /></label>
              <label className="text-xs font-extrabold text-navy">Téléphone<input required name="phone" minLength={6} maxLength={30} type="tel" className="mt-2 h-[52px] w-full rounded-[5px] border bg-mist px-4 text-sm font-medium focus:border-brand-red" placeholder="+32 492 65 44 13" /></label>
              <label className="text-xs font-extrabold text-navy sm:col-span-2">Adresse e-mail<input required name="email" maxLength={254} type="email" className="mt-2 h-[52px] w-full rounded-[5px] border bg-mist px-4 text-sm font-medium focus:border-brand-red" placeholder="vous@exemple.be" /></label>
              <label className="text-xs font-extrabold text-navy sm:col-span-2">Objet<select required name="subject" className="mt-2 h-[52px] w-full rounded-[5px] border bg-mist px-4 text-sm font-medium text-ink focus:border-brand-red" defaultValue=""><option value="" disabled>Sélectionnez votre demande</option><option>Réservation d’un trajet</option><option>Transfert Brussels Airport</option><option>Demande entreprise</option><option>Autre demande</option></select></label>
              <label className="text-xs font-extrabold text-navy sm:col-span-2">Votre message<textarea required name="message" minLength={10} maxLength={3000} rows={5} className="mt-2 w-full resize-none rounded-[5px] border bg-mist p-4 text-sm font-medium focus:border-brand-red" placeholder="Comment pouvons-nous vous aider ?" /></label>
              <label className="absolute -left-[9999px]" aria-hidden="true">Site web<input name="website" tabIndex={-1} autoComplete="off" /></label>
            </div>
            {status === 'success' && <p className="mt-6 rounded-[5px] bg-[#ecf8f1] p-4 text-xs font-bold text-[#146c43]"><FontAwesomeIcon icon={faCircleCheck} className="mr-2" />Votre message a bien été envoyé.</p>}
            {status === 'error' && <p role="alert" className="mt-6 rounded-[5px] bg-brand-red/8 p-4 text-xs font-bold text-brand-red">{errorMessage}</p>}
            <button type="submit" disabled={status === 'sending'} className="button-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">{status === 'sending' ? <><FontAwesomeIcon icon={faSpinner} spin />Envoi en cours…</> : <>Envoyer ma demande <FontAwesomeIcon icon={faArrowRight} /></>}</button>
            <p className="mt-4 text-[11px] leading-5 text-muted">En envoyant ce formulaire, vous acceptez que TAXI-LUX utilise vos informations pour répondre à votre demande.</p>
          </form>
        </div>
      </section>
    </>
  )
}
