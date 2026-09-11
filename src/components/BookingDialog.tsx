import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'

type BookingDialogProps = {
  label?: string
  variant?: 'primary' | 'secondary'
}

export function BookingDialog({ label = 'Réserver un trajet', variant = 'primary' }: BookingDialogProps) {
  const destination = label.toLowerCase().includes('estimer') ? '/reservation#estimation' : '/reservation#reservation'

  return <Link to={destination} className={variant === 'primary' ? 'button-primary' : 'inline-flex h-[54px] cursor-pointer items-center justify-center gap-3 rounded-[5px] border border-white/45 bg-white/10 px-7 text-sm font-bold text-white shadow-[0_10px_30px_rgba(7,23,39,.16)] backdrop-blur-xl transition duration-200 hover:border-white hover:bg-white hover:text-navy'}>{label} <FontAwesomeIcon icon={faArrowRight} /></Link>
}
