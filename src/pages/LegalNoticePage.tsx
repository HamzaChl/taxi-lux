import { LegalPage } from '../components/LegalPage'

export function LegalNoticePage() {
  return <LegalPage eyebrow="Informations légales" title="Mentions légales" sections={[
    { title: 'Éditeur du site', content: <address className="not-italic"><strong className="text-navy">Taxi-Lux SPRL</strong><br />Grote Daalstraat 32<br />1930 Zaventem<br />Belgique<br /><br />Numéro d’entreprise (BCE / TVA) : <strong className="text-navy">BE0457471103</strong></address> },
    { title: 'Contact', content: <p>Pour toute question ou demande d’information, vous pouvez nous contacter par email via l’adresse indiquée sur le site.</p> },
    { title: 'Hébergement', content: <p>Le site est hébergé par un prestataire tiers assurant la disponibilité et la sécurité de la plateforme.</p> },
    { title: 'Objet du site', content: <><p>Le présent site a pour objet de présenter et promouvoir l’application Taxi-Lux et ses services de transport.</p><p>Les services de réservation et de transport sont accessibles exclusivement via l’application mobile Taxi-Lux.</p></> },
    { title: 'Propriété intellectuelle', content: <><p>L’ensemble des contenus présents sur ce site (textes, images, logos, éléments graphiques) est protégé par le droit de la propriété intellectuelle.</p><p>Toute reproduction, représentation ou utilisation sans autorisation préalable est interdite.</p></> },
    { title: 'Responsabilité', content: <p>Taxi-Lux SPRL s’efforce de fournir des informations exactes et à jour. Toutefois, la société ne saurait être tenue responsable d’erreurs, d’omissions ou d’une indisponibilité temporaire du site.</p> },
  ]} />
}
