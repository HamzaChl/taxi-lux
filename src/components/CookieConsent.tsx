import { useCookies } from 'react-cookie'
import { Link } from 'react-router-dom'

const COOKIE_NAME = 'taxilux_cookie_consent'

export function CookieConsent() {
  const [cookies, setCookie] = useCookies([COOKIE_NAME])

  if (cookies[COOKIE_NAME]) return null

  function saveConsent(value: 'accepted' | 'essential') {
    setCookie(COOKIE_NAME, value, { path: '/', maxAge: 60 * 60 * 24 * 180, sameSite: 'lax', secure: window.location.protocol === 'https:' })
  }

  return (
    <aside className="fixed right-4 bottom-4 left-4 z-[3000] mx-auto max-w-3xl rounded-[8px] border border-white/70 bg-white/88 p-5 shadow-[0_18px_55px_rgba(7,23,39,.18)] backdrop-blur-xl sm:right-6 sm:bottom-6 sm:left-6 sm:flex sm:items-center sm:gap-7 sm:p-6">
      <div className="flex-1"><p className="text-sm font-bold text-navy">Votre confidentialité</p><p className="mt-2 text-xs leading-6 text-muted">Nous utilisons uniquement les cookies nécessaires au bon fonctionnement du site et à la mémorisation de vos préférences.</p><Link to="/politique-de-confidentialite" className="mt-2 inline-block text-[11px] font-bold text-brand-red hover:text-brand-red-hover">Politique de confidentialité</Link></div>
      <div className="mt-5 flex shrink-0 gap-3 sm:mt-0"><button type="button" onClick={() => saveConsent('essential')} className="h-11 cursor-pointer rounded-[5px] border px-4 text-xs font-bold text-navy transition hover:border-navy">Refuser</button><button type="button" onClick={() => saveConsent('accepted')} className="h-11 cursor-pointer rounded-[5px] bg-brand-red px-5 text-xs font-bold text-white transition hover:bg-brand-red-hover">Accepter</button></div>
    </aside>
  )
}
