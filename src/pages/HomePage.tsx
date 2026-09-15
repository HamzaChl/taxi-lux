import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRight,
  faBriefcase,
  faCalendarCheck,
  faCarSide,
  faCheck,
  faClock,
  faLocationDot,
  faPlane,
  faShieldHalved,
  faUser,
  faUserTie,
  faVanShuttle,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { BookingDialog } from '../components/BookingDialog'
import { AppDownloadSection } from '../components/AppDownloadSection'

const reassurance: { icon: IconDefinition; text: string }[] = [
  { icon: faCalendarCheck, text: 'Depuis 1996' },
  { icon: faLocationDot, text: 'Bruxelles & Brussels Airport' },
  { icon: faUserTie, text: 'Service privé & professionnel' },
  { icon: faVanShuttle, text: 'Berlines et véhicules adaptés' },
]

const audiences = [
  {
    icon: faUser,
    title: 'Clients privés',
    text: 'TAXI-LUX accompagne les particuliers pour leurs déplacements dans la Région de Bruxelles-Capitale ainsi que pour leurs transferts vers et depuis Brussels Airport. Réservez votre trajet à l’avance pour organiser votre prise en charge et connaître votre tarif avant le départ.',
    items: ['Trajets dans la Région de Bruxelles-Capitale', 'Transferts vers et depuis Brussels Airport', 'Réservation à l’avance', 'Tarif connu avant la prise en charge', 'Service adapté aux passagers et aux bagages', 'Véhicules adaptés selon vos besoins'],
    cta: 'Réserver un trajet',
    image: '/images/services/service-privee.jpeg',
    imageAlt: 'Véhicule TAXI-LUX pour les trajets privés à Bruxelles',
  },
  {
    icon: faBriefcase,
    title: 'Clients professionnels',
    text: 'TAXI-LUX accompagne les entreprises dans l’organisation des déplacements de leurs collaborateurs, clients et invités dans la Région de Bruxelles-Capitale ainsi que pour leurs transferts vers et depuis Brussels Airport. Les trajets peuvent être planifiés à l’avance selon les besoins de l’entreprise.',
    items: ['Déplacements professionnels à Bruxelles', 'Transferts de collaborateurs et d’invités', 'Transferts vers et depuis Brussels Airport', 'Réservations planifiées à l’avance', 'Service discret et professionnel', 'Solutions adaptées aux besoins des entreprises'],
    cta: 'Télécharger l’application',
    image: '/images/services/proff.jpeg',
    imageAlt: 'Véhicule TAXI-LUX devant Brussels Airport',
  },
]

const advantages: { icon: IconDefinition; title: string; text: string }[] = [
  { icon: faClock, title: 'Ponctualité', text: 'Votre prise en charge est planifiée à l’avance selon l’heure et le lieu convenus.' },
  { icon: faShieldHalved, title: 'Service professionnel', text: 'Un service discret et soigné pour les particuliers comme pour les professionnels.' },
  { icon: faCarSide, title: 'Véhicules adaptés', text: 'Le véhicule est sélectionné selon votre trajet, vos passagers et vos besoins en bagages.' },
  { icon: faPlane, title: 'Bruxelles & Brussels Airport', text: 'Trajets dans la Région de Bruxelles-Capitale et transferts vers et depuis Brussels Airport.' },
]

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 bg-[url('/images/header/header.jpeg')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,23,39,.98)_0%,rgba(7,23,39,.91)_50%,rgba(7,23,39,.72)_82%,rgba(7,23,39,.42)_92%,rgba(7,23,39,.12)_100%)]" />
        <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-5 py-24 sm:px-8 lg:min-h-[700px]">
          <div className="max-w-2xl">
            <p className="text-[14px] font-extrabold tracking-[1.8px] text-brand-red uppercase sm:text-[16px]">Taxi officiel Brussels Airport</p>
            <h1 className="mt-6 text-[40px] leading-[1.12] font-bold tracking-[-1.8px] sm:text-[52px]">À Bruxelles.<br />Vers et depuis Brussels Airport.</h1>
            <p className="mt-7 max-w-[670px] text-[14px] leading-[1.8] text-white/75 sm:text-[15px]">TAXI-LUX organise vos déplacements privés et professionnels dans la Région de Bruxelles-Capitale, ainsi que vos transferts vers et depuis Brussels Airport. Réservez votre trajet à l’avance sur notre site ou via l’application et connaissez votre tarif avant votre prise en charge.</p>
            <div className="mt-6 flex items-center gap-3 text-sm font-bold text-white"><span className="h-0.5 w-8 bg-brand-red" />Des tarifs avantageux, connus à l’avance.</div>
            <div className="mt-9 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"><BookingDialog /><BookingDialog label="Estimer un trajet" variant="secondary" /></div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-16 px-5 text-white sm:px-8">
        <div className="mx-auto grid w-full max-w-7xl overflow-hidden rounded-[10px] border border-white/15 bg-navy-soft/82 shadow-[0_20px_55px_rgba(7,23,39,0.24)] backdrop-blur-xl sm:w-[90%] md:grid-cols-2 md:divide-x md:divide-white/10 lg:w-[70%] xl:grid-cols-4">
          {reassurance.map(({ icon, text }) => <div key={text} className="flex min-h-32 items-center gap-4 border-b border-white/10 px-6 py-8 last:border-b-0 md:border-b-0 lg:px-7"><FontAwesomeIcon icon={icon} className="w-5 shrink-0 text-xl text-brand-red" /><span className="text-[12px] font-bold leading-5 text-white/90">{text}</span></div>)}
        </div>
      </section>

      <section id="services" className="px-5 pt-24 pb-24 sm:px-8 lg:pt-30 lg:pb-30">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center"><p className="eyebrow">Nos services</p><h2 className="section-title">Un service adapté à chaque trajet</h2><p className="mt-6 text-[15px] leading-[1.8] text-muted">Particulier ou professionnel, TAXI-LUX organise vos trajets dans la Région de Bruxelles-Capitale ainsi que vos transferts vers et depuis Brussels Airport, avec un service ponctuel, confortable et adapté à vos besoins.</p></div>
          <div className="mt-14 grid items-stretch gap-7 lg:grid-cols-2">
            {audiences.map(({ icon, title, text, items, cta, image, imageAlt }, index) => (
              <article key={title} className="grid overflow-hidden rounded-[9px] border bg-white shadow-card">
                <div className="flex flex-col p-7 sm:p-9">
                  <span className="icon-disc"><FontAwesomeIcon icon={icon} /></span>
                  <h3 className="mt-6 text-2xl font-bold tracking-[-.5px] text-navy">{title}</h3>
                  <p className="mt-4 text-sm leading-[1.8] text-muted">{text}</p>
                  <ul className="mt-6 space-y-3">{items.map(item => <li key={item} className="flex gap-3 text-[13px] font-semibold leading-6 text-ink"><FontAwesomeIcon icon={faCheck} className="mt-1.5 text-brand-red" />{item}</li>)}</ul>
                  <div className="mt-auto pt-8">{index === 0 ? <BookingDialog label={cta} /> : <a href="#application" className="button-primary">{cta}<FontAwesomeIcon icon={faArrowRight} /></a>}</div>
                </div>
                <img src={image} alt={imageAlt} className="h-72 w-full object-cover" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="engagements" className="px-5 pb-24 sm:px-8 lg:pb-30">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[10px] border bg-white shadow-card lg:grid-cols-2">
        <div className="flex bg-navy px-5 py-20 text-white sm:px-12 lg:px-16 lg:py-24">
          <div className="w-full max-w-xl">
            <p className="eyebrow">Pourquoi Taxi-Lux ?</p>
            <h2 className="mt-5 text-[39px] leading-[1.15] font-bold tracking-[-1.3px] sm:text-[48px]">Votre trajet,<br />notre priorité.</h2>
            <span className="mt-6 block h-0.5 w-12 bg-brand-red" />
            <p className="mt-8 text-[15px] leading-[1.8] text-white/70">Depuis 1996, TAXI-LUX organise vos déplacements avec une attention particulière portée à la ponctualité, au confort et à la qualité de la prise en charge.</p>
            <p className="mt-5 text-[15px] leading-[1.8] text-white/70">Pour vos trajets dans la Région de Bruxelles-Capitale comme pour vos transferts vers et depuis Brussels Airport, nous vous proposons un service organisé selon vos besoins.</p>
            <div className="mt-9"><BookingDialog /></div>
            <div className="mt-16 border-t border-white/10 pt-7"><p className="text-3xl font-bold text-white">Depuis 1996</p><p className="mt-2 text-xs font-extrabold tracking-[1.5px] text-white/55 uppercase">au service de vos déplacements</p></div>
          </div>
        </div>
        <div className="bg-white px-5 py-20 sm:px-12 lg:px-16 lg:py-28">
          <div className="max-w-2xl">
            <p className="eyebrow">Un service pensé pour vous</p>
            <h2 className="section-title">Voyagez l’esprit tranquille</h2>
            <p className="mt-5 text-[15px] leading-[1.8] text-muted">De la réservation jusqu’à votre destination, nous veillons à rendre chaque étape de votre trajet simple et confortable.</p>
            <div className="mt-10 grid gap-x-9 gap-y-8 sm:grid-cols-2">{advantages.map(({ icon, title, text }) => <div key={title}><span className="icon-disc"><FontAwesomeIcon icon={icon} /></span><h3 className="mt-5 font-bold text-navy">{title}</h3><p className="mt-2 text-[13px] leading-6 text-muted">{text}</p></div>)}</div>
            <div className="mt-10 rounded-[8px] bg-mist p-6 sm:flex sm:items-center sm:justify-between sm:gap-6"><div><h3 className="text-sm font-bold leading-6 text-navy">Un trajet à Bruxelles ou un transfert vers/depuis Brussels Airport ?</h3><p className="mt-2 text-xs leading-5 text-muted">Réservez à l’avance et connaissez votre tarif avant la prise en charge.</p></div><div className="mt-5 shrink-0 sm:mt-0"><BookingDialog label="Réserver" /></div></div>
          </div>
        </div>
        </div>
      </section>

      <AppDownloadSection />
    </>
  )
}
