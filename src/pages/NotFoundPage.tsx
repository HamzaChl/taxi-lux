import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="flex min-h-[65vh] flex-col items-center justify-center bg-mist px-6 text-center">
      <p className="eyebrow">Erreur 404</p>
      <h1 className="mt-4 text-5xl font-bold tracking-tight text-navy">Cette route n’existe pas.</h1>
      <Link to="/" className="button-primary mt-8">Retour à l’accueil</Link>
    </section>
  )
}
