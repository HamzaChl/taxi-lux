import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faApple, faGooglePlay } from '@fortawesome/free-brands-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'

const benefits = ['Réservation rapide', 'Paiement sécurisé', 'Historique de vos trajets']

export function AppDownloadSection() {
  return (
    <section id="application" className="relative isolate overflow-hidden px-5 py-14 sm:px-8 lg:py-16">
      <img src="/images/general/pexels-marianne-rixhon-10955129-6735534.jpg" alt="Bruxelles" className="absolute inset-0 -z-20 h-full w-full object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-navy/35" />
      <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[10px] border border-white/25 bg-navy-soft/70 px-6 py-12 text-white shadow-[0_20px_55px_rgba(7,23,39,0.3)] backdrop-blur-xl sm:px-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-16 lg:py-10">
        <div className="absolute -top-24 -right-24 size-80 rounded-full bg-brand-red/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="eyebrow">L’application TAXI-LUX</p>
          <h2 className="mt-5 text-[36px] leading-[1.15] font-bold tracking-[-1.2px] sm:text-[46px]">Votre trajet, directement dans votre poche.</h2>
          <p className="mt-6 text-[15px] leading-[1.8] text-white/70">Réservez votre taxi en quelques instants, suivez vos demandes et retrouvez facilement l’historique de vos trajets depuis l’application TAXI-LUX.</p>
          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
            {benefits.map((benefit) => <span key={benefit} className="flex items-center gap-2 text-xs font-bold text-white/85"><FontAwesomeIcon icon={faCheck} className="text-brand-red" />{benefit}</span>)}
          </div>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="https://apps.apple.com/be/app/taxi-lux/id6758548652" target="_blank" rel="noreferrer" className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-[5px] border border-white/20 bg-white px-6 text-navy transition duration-200 hover:-translate-y-0.5 hover:bg-mist">
              <FontAwesomeIcon icon={faApple} className="text-2xl" />
              <span><span className="block text-[9px] font-bold tracking-wide uppercase">Télécharger sur</span><span className="block text-sm font-extrabold">App Store</span></span>
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.hamzaachl.taxislux" target="_blank" rel="noreferrer" className="inline-flex min-h-[58px] items-center justify-center gap-3 rounded-[5px] border border-white/25 bg-white/8 px-6 text-white backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:bg-white/15">
              <FontAwesomeIcon icon={faGooglePlay} className="text-xl" />
              <span><span className="block text-[9px] font-bold tracking-wide uppercase">Disponible sur</span><span className="block text-sm font-extrabold">Google Play</span></span>
            </a>
          </div>
        </div>
        <div className="relative mt-10 h-[470px] lg:mt-0 lg:h-[520px]">
          <img src="/images/general/mcu01-scaled.png" alt="Application mobile TAXI-LUX" className="absolute top-1/2 right-[-45px] h-[min(520px,125vw)] w-auto max-w-none -translate-y-1/2 object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,0.3)] sm:right-[-20px] lg:right-[-70px] lg:h-[520px]" />
        </div>
      </div>
    </section>
  )
}
