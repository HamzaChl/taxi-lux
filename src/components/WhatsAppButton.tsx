import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

export function WhatsAppButton() {
  return <a href="https://api.whatsapp.com/send?phone=32492654413" target="_blank" rel="noreferrer" aria-label="Contacter TAXI-LUX sur WhatsApp" className="group fixed right-5 bottom-5 z-[1900] flex size-14 items-center justify-center rounded-full bg-[#25D366] text-2xl text-white shadow-[0_10px_30px_rgba(7,23,39,.22)] transition duration-200 hover:-translate-y-1 hover:bg-[#1fbd5a]"><FontAwesomeIcon icon={faWhatsapp} /><span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-[5px] bg-navy px-3 py-2 text-[11px] font-bold text-white opacity-0 shadow-card transition group-hover:opacity-100">WhatsApp</span></a>
}
