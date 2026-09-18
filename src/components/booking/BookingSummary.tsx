import type { BookingFormValues, LocationValue, RouteData } from '../../types/booking'

type BookingSummaryProps = {
  pickup: LocationValue | null
  destination: LocationValue | null
  route: RouteData | null
  returnRoute: RouteData | null
  values: BookingFormValues
  price: number | null
}

function shortAddress(location: LocationValue | null) {
  return location?.displayName.split(',').slice(0, 3).join(',') ?? 'À sélectionner'
}

export function BookingSummary({ pickup, destination, route, returnRoute, values, price }: BookingSummaryProps) {
  const roundTrip = values.tripType === 'round-trip'
  const distance = route ? route.distanceKm + (roundTrip ? returnRoute?.distanceKm ?? 0 : 0) : null
  const duration = route ? route.durationMinutes + (roundTrip ? returnRoute?.durationMinutes ?? 0 : 0) : null
  return (
    <aside className="relative z-[500] m-4 rounded-[8px] border border-white/70 bg-white/88 p-5 shadow-[0_15px_45px_rgba(7,23,39,.18)] backdrop-blur-xl lg:absolute lg:right-5 lg:bottom-5 lg:left-5 lg:m-0">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1.2fr_1.2fr_.6fr_.6fr_.8fr]">
        <div><p className="text-[10px] font-extrabold tracking-[1.3px] text-muted uppercase">Départ</p><p className="mt-1 truncate text-xs font-bold text-navy">{shortAddress(pickup)}</p></div>
        <div><p className="text-[10px] font-extrabold tracking-[1.3px] text-muted uppercase">Destination</p><p className="mt-1 truncate text-xs font-bold text-navy">{shortAddress(destination)}</p></div>
        <div><p className="text-[10px] font-extrabold tracking-[1.3px] text-muted uppercase">{roundTrip ? 'Distance totale' : 'Distance'}</p><p className="mt-1 text-xs font-bold text-navy">{distance !== null ? `${distance.toFixed(1)} km` : '—'}</p></div>
        <div><p className="text-[10px] font-extrabold tracking-[1.3px] text-muted uppercase">{roundTrip ? 'Durée totale' : 'Durée'}</p><p className="mt-1 text-xs font-bold text-navy">{duration !== null ? `${duration} min` : '—'}</p></div>
        <div><p className="text-[10px] font-extrabold tracking-[1.3px] text-muted uppercase">Tarif estimé</p><p className="mt-1 text-2xl font-bold tracking-[-.5px] text-brand-red">{price !== null ? `${price.toFixed(2).replace('.', ',')} €` : '—'}</p></div>
      </div>
      {(values.pickupDate || values.pickupTime) && <p className="mt-4 border-t pt-3 text-[11px] font-semibold text-muted">Prise en charge : {values.pickupDate || 'date à définir'} {values.pickupTime && `à ${values.pickupTime}`} · {values.passengers || 1} passager(s) · {values.luggage || 0} bagage(s)</p>}
      {roundTrip && <p className="mt-2 text-[11px] font-semibold text-muted">Retour : {values.returnDate || 'date à définir'} {values.returnTime && `à ${values.returnTime}`} · {shortAddress(destination)} → {shortAddress(pickup)}</p>}
    </aside>
  )
}
