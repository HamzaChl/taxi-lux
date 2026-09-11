import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'nl', flag: '🇳🇱', label: 'Nederlands' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
]

export function LanguageSelector() {
  const { i18n } = useTranslation()
  const current = languages.find(language => language.code === i18n.language) ?? languages[0]

  function selectLanguage(code: string) {
    localStorage.setItem('taxilux-language', code)
    void i18n.changeLanguage(code)
  }

  return (
    <div className="group fixed bottom-5 left-5 z-[2000]">
      <div className="pointer-events-none absolute bottom-full left-0 mb-2 w-44 translate-y-2 rounded-[7px] border border-white/70 bg-white/82 p-1 opacity-0 shadow-card backdrop-blur-xl transition duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100">
        {languages.map(language => <button key={language.code} type="button" onClick={() => selectLanguage(language.code)} className={`flex w-full cursor-pointer items-center gap-3 rounded-[5px] px-3 py-2.5 text-left text-xs font-bold transition hover:bg-mist hover:text-brand-red ${i18n.language === language.code ? 'bg-mist text-brand-red' : 'text-navy'}`}><span className="text-lg leading-none">{language.flag}</span>{language.label}</button>)}
      </div>
      <button type="button" aria-label="Choisir la langue" className="flex h-12 cursor-pointer items-center gap-2 rounded-[7px] border border-white/70 bg-white/78 px-3.5 text-xs font-extrabold text-navy shadow-[0_10px_30px_rgba(7,23,39,.16)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-brand-red hover:bg-white/92"><span className="text-xl leading-none">{current.flag}</span><span>{current.code.toUpperCase()}</span><span className="text-[9px] text-muted">▲</span></button>
    </div>
  )
}
