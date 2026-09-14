import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationDot, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useAddressSearch } from '../../hooks/useAddressSearch'
import type { LocationValue } from '../../types/booking'

type AddressAutocompleteProps = {
  label: string
  value: LocationValue | null
  onChange: (value: LocationValue | null) => void
  accent?: boolean
  error?: string
}

export function AddressAutocomplete({ label, value, onChange, accent = false, error }: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value?.displayName ?? '')
  const [isOpen, setIsOpen] = useState(false)
  const { results, isSearching, clearResults } = useAddressSearch(query, isOpen && !value)

  function selectAddress(location: LocationValue) {
    onChange(location)
    setQuery(location.displayName)
    setIsOpen(false)
    clearResults()
  }

  return (
    <label className="relative block text-[11px] font-extrabold tracking-wide text-white/80 uppercase">
      {label}
      <span className="relative mt-2 block">
        <FontAwesomeIcon icon={faLocationDot} className={accent ? 'absolute top-1/2 left-4 -translate-y-1/2 text-brand-red' : 'absolute top-1/2 left-4 -translate-y-1/2 text-white/70'} />
        <input value={query} onFocus={() => setIsOpen(true)} onChange={event => { setQuery(event.target.value); onChange(null); setIsOpen(true) }} autoComplete="off" className="h-[52px] w-full rounded-[5px] border border-white/15 bg-white/8 pr-10 pl-11 text-sm font-medium text-white placeholder:text-white/35 focus:border-brand-red" placeholder="Saisissez une adresse" />
        {isSearching && <FontAwesomeIcon icon={faSpinner} spin className="absolute top-1/2 right-4 -translate-y-1/2 text-white/60" />}
      </span>
      {isOpen && results.length > 0 && <span className="absolute right-0 left-0 z-[1000] mt-2 max-h-64 overflow-y-auto rounded-[6px] border border-line bg-white p-1 shadow-card">{results.map(result => { const [name, ...details] = result.displayName.split(','); return <button key={`${result.lat}-${result.lon}`} type="button" onClick={() => selectAddress(result)} className="block w-full cursor-pointer rounded-[4px] px-4 py-3 text-left hover:bg-mist"><span className="block text-sm font-bold normal-case text-navy">{name}</span><span className="mt-1 block truncate text-[11px] font-medium normal-case text-muted">{details.join(',').trim()}</span></button> })}</span>}
      {error && <span className="mt-2 block text-[11px] font-semibold normal-case text-[#ff6680]">{error}</span>}
    </label>
  )
}
