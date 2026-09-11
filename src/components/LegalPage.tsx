import type { ReactNode } from 'react'

type LegalSection = {
  title: string
  content: ReactNode
}

type LegalPageProps = {
  eyebrow: string
  title: string
  introduction?: string
  sections: LegalSection[]
}

export function LegalPage({ eyebrow, title, introduction, sections }: LegalPageProps) {
  return (
    <>
      <section className="bg-navy px-5 py-20 text-white sm:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl"><p className="eyebrow">{eyebrow}</p><h1 className="mt-5 text-[40px] leading-[1.15] font-bold tracking-[-1.4px] sm:text-[50px]">{title}</h1>{introduction && <p className="mt-6 max-w-3xl text-[15px] leading-[1.8] text-white/70">{introduction}</p>}</div>
      </section>
      <section className="bg-mist px-5 py-16 sm:px-8 lg:py-24">
        <div className="mx-auto max-w-4xl rounded-[9px] border bg-white p-7 shadow-card sm:p-12 lg:p-16">
          <div className="space-y-12">{sections.map(({ title: sectionTitle, content }, index) => <section key={sectionTitle} className={index > 0 ? 'border-t pt-10' : ''}><p className="text-[11px] font-extrabold tracking-[1.7px] text-brand-red uppercase">{String(index + 1).padStart(2, '0')}</p><h2 className="mt-3 text-xl font-bold text-navy">{sectionTitle}</h2><div className="mt-5 space-y-4 text-sm leading-[1.8] text-muted">{content}</div></section>)}</div>
        </div>
      </section>
    </>
  )
}
