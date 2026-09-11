import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { faApple, faGooglePlay } from '@fortawesome/free-brands-svg-icons'
import { useEffect, useLayoutEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { cn } from '../lib/cn'
import { LanguageSelector } from './LanguageSelector'
import { CookieConsent } from './CookieConsent'
import { WhatsAppButton } from './WhatsAppButton'
import { PageAnimations } from './PageAnimations'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/services', label: 'Services' },
  { to: '/a-propos', label: 'À propos' },
  { to: '/contact', label: 'Contact' },
]

function resetScroll() {
  window.scrollTo(0, 0)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

function ScrollToTop() {
  const { pathname, key } = useLocation()

  useLayoutEffect(() => {
    const html = document.documentElement
    const previousScrollBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    resetScroll()

    const frame = window.requestAnimationFrame(() => {
      resetScroll()
    })

    return () => {
      window.cancelAnimationFrame(frame)
      html.style.scrollBehavior = previousScrollBehavior
    }
  }, [pathname, key])

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    const timeout = window.setTimeout(resetScroll, 0)
    const delayedTimeout = window.setTimeout(resetScroll, 120)

    return () => {
      window.clearTimeout(timeout)
      window.clearTimeout(delayedTimeout)
    }
  }, [pathname, key])

  return null
}

export function AppLayout() {
  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <PageAnimations />
      <div className="bg-brand-red px-5 py-2.5 text-center text-[11px] font-semibold tracking-wide text-white">
        Service de taxi premium à Bruxelles & Brussels Airport · Disponible 24h/24, 7j/7
      </div>
      <header className="sticky inset-x-0 top-0 z-30 border-b bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link to="/" aria-label="Taxi-Lux, accueil" className="block">
            <img src="/images/logo/logo-1-300x46.png" alt="Taxi-Lux" className="h-auto w-[170px] sm:w-[190px]" />
          </Link>
          <nav className="ml-auto hidden items-center gap-7 lg:flex">
            {links.map((link) => (
              <NavLink key={link.label} to={link.to} className={({ isActive }) => cn('text-[13px] font-semibold text-[#4d535a] transition hover:text-brand-red', isActive && 'text-brand-red')}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-7 hidden items-center gap-5 md:flex">
            <Link to="/reservation" className="button-primary h-[46px] px-5">Réserver <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" /></Link>
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger className="flex size-11 cursor-pointer items-center justify-center rounded-[5px] bg-navy text-white md:hidden" aria-label="Ouvrir le menu">
              <FontAwesomeIcon icon={faBars} />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content align="end" sideOffset={12} className="z-50 w-64 rounded-lg border bg-white p-2 shadow-card">
                {links.map((link) => <DropdownMenu.Item key={link.label} asChild><Link to={link.to} className="block rounded-[5px] px-4 py-3 text-sm font-bold text-navy hover:bg-mist hover:text-brand-red">{link.label}</Link></DropdownMenu.Item>)}
                <DropdownMenu.Separator className="my-2 h-px bg-line" />
                <DropdownMenu.Item asChild><a href="tel:+32492654413" className="block px-4 py-3 text-sm font-bold text-brand-red">+32 492 65 44 13</a></DropdownMenu.Item>
                <DropdownMenu.Arrow className="fill-white" />
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="border-t bg-white text-navy">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-16 lg:py-20">
          <div>
            <img src="/images/logo/logo-1-300x46.png" alt="Taxi-Lux" className="h-auto w-[185px]" />
            <div className="mt-6 flex flex-wrap gap-2.5">
              <a href="https://apps.apple.com/be/app/taxi-lux/id6758548652" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2.5 rounded-[5px] bg-navy px-4 text-white transition hover:-translate-y-0.5 hover:bg-navy-light">
                <FontAwesomeIcon icon={faApple} className="text-xl" />
                <span><span className="block text-[7px] font-bold tracking-wide uppercase">Télécharger sur</span><span className="block text-[11px] font-extrabold">App Store</span></span>
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.hamzaachl.taxislux" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2.5 rounded-[5px] border border-navy/15 bg-white px-4 text-navy transition hover:-translate-y-0.5 hover:border-brand-red hover:text-brand-red">
                <FontAwesomeIcon icon={faGooglePlay} className="text-base" />
                <span><span className="block text-[7px] font-bold tracking-wide uppercase">Disponible sur</span><span className="block text-[11px] font-extrabold">Google Play</span></span>
              </a>
            </div>
            <p className="mt-6 max-w-sm text-[13px] leading-7 text-muted">Votre partenaire de confiance pour vos déplacements privés et professionnels à Bruxelles, ainsi que vos transferts vers et depuis Brussels Airport.</p>
          </div>
          <div>
            <p className="text-[11px] font-extrabold tracking-[1.5px] text-navy uppercase">Navigation</p>
            <nav className="mt-6 flex flex-col items-start gap-4 text-[13px] font-medium text-muted"><Link to="/" className="transition hover:text-brand-red">Accueil</Link><Link to="/services" className="transition hover:text-brand-red">Services</Link><Link to="/a-propos" className="transition hover:text-brand-red">À propos</Link></nav>
          </div>
          <div>
            <p className="text-[11px] font-extrabold tracking-[1.5px] text-navy uppercase">TAXI-LUX</p>
            <nav className="mt-6 flex flex-col items-start gap-4 text-[13px] font-medium text-muted"><Link to="/reservation" className="transition hover:text-brand-red">Réserver un trajet</Link><Link to="/services" className="transition hover:text-brand-red">Nos services</Link><Link to="/contact" className="transition hover:text-brand-red">Contact</Link></nav>
          </div>
          <div>
            <p className="text-[11px] font-extrabold tracking-[1.5px] text-navy uppercase">Nous contacter</p>
            <div className="mt-6 space-y-4 text-[13px] leading-6 text-muted"><p>Grote Daalstraat 32<br />1930 Zaventem</p><a href="mailto:info@taxi-lux.be" className="block transition hover:text-brand-red">info@taxi-lux.be</a></div>
          </div>
        </div>
        <div className="px-5 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 border-t py-7 text-[11px] text-muted sm:flex-row">
            <p>© {new Date().getFullYear()} TAXI-LUX. Tous droits réservés.</p>
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-3"><Link to="/mentions-legales" className="transition hover:text-brand-red">Mentions légales</Link><Link to="/politique-de-confidentialite" className="transition hover:text-brand-red">Politique de confidentialité</Link><Link to="/conditions-generales-utilisation" className="transition hover:text-brand-red">Conditions générales d’utilisation</Link></nav>
          </div>
        </div>
      </footer>
      <LanguageSelector />
      <WhatsAppButton />
      <CookieConsent />
    </div>
  )
}
