import type { LocationValue } from '../types/booking'

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

type NominatimResult = {
  display_name: string
  lat: string
  lon: string
}

export async function searchNominatim(query: string, signal: AbortSignal): Promise<LocationValue[]> {
  const params = new URLSearchParams({ q: query, format: 'jsonv2', addressdetails: '1', limit: '5', countrycodes: 'be', 'accept-language': 'fr' })
  const response = await fetch(`${NOMINATIM_URL}?${params}`, { signal })
  if (!response.ok) throw new Error('Address search failed')
  const data = await response.json() as NominatimResult[]
  return data.map(item => ({ displayName: item.display_name, lat: Number(item.lat), lon: Number(item.lon) }))
}
