import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faBriefcase, faCarSide, faCheck, faLocationDot, faPlane, faSuitcase, faUser } from '@fortawesome/free-solid-svg-icons'
import { BookingDialog } from '../components/BookingDialog'
import { AppDownloadSection } from '../components/AppDownloadSection'

const clientServices = [
  {
    icon: faUser,
    title: 'Clients privés',
    text: 'TAXI-LUX accompagne les particuliers pour leurs déplacements dans la Région de Bruxelles-Capitale ainsi que pour leurs transferts vers et depuis Brussels Airport. Réservez à l’avance sur notre site ou via l’application afin d’organiser votre prise en charge et de connaître votre tarif avant le départ.',
    items: ['Trajets dans la Région de Bruxelles-Capitale', 'Transferts vers et depuis Brussels Airport', 'Réservation à l’avance', 'Tarif connu avant la prise en charge', 'Service adapté aux passagers et aux bagages', 'Véhicules adaptés selon vos besoins'],
    cta: 'Réserver un trajet',
    href: '/reservation',
    image: '/images/services/service-1.png',
  },
  {
    icon: faBriefcase,
    title: 'Clients professionnels',
    text: 'TAXI-LUX accompagne les entreprises dans l’organisation des déplacements de leurs collaborateurs, clients et invités dans la Région de Bruxelles-Capitale ainsi que pour leurs transferts vers et depuis Brussels Airport. Les trajets peuvent être réservés et planifiés à l’avance selon les besoins de l’entreprise.',
    items: ['Déplacements professionnels à Bruxelles', 'Transferts de collaborateurs et d’invités', 'Transferts vers et depuis Brussels Airport', 'Réservations planifiées à l’avance', 'Service discret et professionnel', 'Solutions adaptées aux besoins des entreprises'],
    cta: 'Télécharger l’application',
    href: '#application',
    image: '/images/services/service-2.png',
  },
]

export function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy px-5 py-24 text-center text-white sm:px-8 lg:py-30">
        <div className="absolute inset-0 bg-[url('/images/header/file_000000006db0821087314619dbd0642c.png')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="relative mx-auto max-w-3xl"><p className="eyebrow">TAXI-LUX</p><h1 className="mt-5 text-[44px] leading-[1.15] font-bold tracking-[-1.5px] sm:text-[52px]">Services</h1><p className="mt-6 text-[15px] leading-[1.8] text-white/70">Particulier ou professionnel, TAXI-LUX organise vos déplacements dans la Région de Bruxelles-Capitale ainsi que vos transferts vers et depuis Brussels Airport, avec un service ponctuel, confortable et adapté à vos besoins.</p></div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:py-30">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center"><p className="eyebrow">Nos services</p><h2 className="section-title">Un service adapté à chaque trajet</h2><p className="mt-6 text-[15px] leading-[1.8] text-muted">Particulier ou professionnel, TAXI-LUX organise vos déplacements dans la Région de Bruxelles-Capitale ainsi que vos transferts vers et depuis Brussels Airport, avec un service ponctuel, confortable et adapté à vos besoins.</p></div>
          <div className="mt-14 grid items-stretch gap-7 lg:grid-cols-2">
            {clientServices.map(({ icon, title, text, items, cta, href, image }) => <article key={title} className="grid overflow-hidden rounded-[9px] border bg-white shadow-card"><div className="flex flex-col p-7 sm:p-9"><span className="icon-disc"><FontAwesomeIcon icon={icon} /></span><h3 className="mt-6 text-2xl font-bold tracking-[-.5px] text-navy">{title}</h3><p className="mt-4 text-sm leading-[1.8] text-muted">{text}</p><ul className="mt-6 space-y-3">{items.map(item => <li key={item} className="flex gap-3 text-[13px] font-semibold leading-6 text-ink"><FontAwesomeIcon icon={faCheck} className="mt-1.5 text-brand-red" />{item}</li>)}</ul><div className="mt-auto pt-8"><a href={href} className="button-primary">{cta}<FontAwesomeIcon icon={faArrowRight} /></a></div></div><img src={image} alt={`Service TAXI-LUX pour ${title.toLowerCase()} à Bruxelles`} className="h-72 w-full object-cover" /></article>)}
          </div>
        </div>
      </section>

      <section className="bg-mist px-5 py-24 sm:px-8 lg:py-30">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div><p className="eyebrow">Service aéroport</p><h2 className="section-title">Transferts Brussels Airport</h2><p className="mt-6 text-[15px] leading-[1.8] text-muted">Voyagez vers ou depuis Brussels Airport en toute sérénité. TAXI-LUX organise votre prise en charge depuis l’adresse convenue jusqu’à l’aéroport. À votre arrivée, votre chauffeur vous retrouve au point de rendez-vous convenu, à proximité de la sortie des arrivées, pour vous conduire à destination.</p><p className="mt-5 text-[15px] leading-[1.8] text-muted">Réservez votre trajet à l’avance sur le site ou via l’application TAXI-LUX. Votre prise en charge est planifiée selon vos horaires, le nombre de passagers et vos bagages, avec un tarif connu avant le départ.</p><div className="mt-8"><BookingDialog /></div></div>
          <div className="relative min-h-[460px] overflow-hidden rounded-[9px]"><img src="/images/services/transfert-2.png" alt="Véhicule TAXI-LUX pour un transfert Brussels Airport" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute right-5 bottom-5 left-5 rounded-[8px] border border-white/60 bg-white/85 p-5 shadow-card backdrop-blur-xl"><div className="flex items-center gap-4"><span className="icon-disc"><FontAwesomeIcon icon={faPlane} /></span><div><p className="font-bold text-navy">Brussels Airport</p><p className="mt-1 text-xs text-muted">Transferts planifiés vers et depuis l’aéroport</p></div></div></div></div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:py-30">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="relative min-h-[460px] overflow-hidden rounded-[9px]"><img src="/images/services/transfert.png" alt="Prise en charge TAXI-LUX à proximité des arrivées" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute top-5 left-5 rounded-[7px] border border-white/60 bg-white/85 px-5 py-4 text-navy shadow-card backdrop-blur-xl"><FontAwesomeIcon icon={faLocationDot} className="mr-3 text-brand-red" /><span className="text-xs font-bold">Prise en charge dans les emplacements autorisés</span></div></div>
          <div><p className="eyebrow">Une prise en charge simplifiée</p><h2 className="section-title">Votre TAXI-LUX, au plus près des arrivées</h2><p className="mt-6 text-[15px] leading-[1.8] text-muted">Grâce à son autorisation d’accès à Brussels Airport, TAXI-LUX organise votre prise en charge au plus près de la zone des arrivées, dans les emplacements autorisés. À votre sortie du terminal, vous rejoignez rapidement votre véhicule.</p><p className="mt-5 text-[15px] leading-[1.8] text-muted">Pas de longue marche à travers les parkings avec vos bagages : votre prise en charge est pensée pour être simple, rapide et confortable. Pour votre départ, TAXI-LUX vous dépose également au plus près du hall des départs, dans les zones autorisées.</p><div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs font-bold text-navy"><span><FontAwesomeIcon icon={faSuitcase} className="mr-2 text-brand-red" />Accès rapide avec vos bagages</span><span><FontAwesomeIcon icon={faCarSide} className="mr-2 text-brand-red" />Véhicule à proximité</span></div></div>
        </div>
      </section>

      <AppDownloadSection />
    </>
  )
}
