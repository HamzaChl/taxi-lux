import type { LocationValue } from '../types/booking'

const PHOTON_URL = 'https://photon.komoot.io/api/'

type PhotonFeature = {
  geometry: { coordinates: [number, number] }
  properties: {
    name?: string
    street?: string
    housenumber?: string
    postcode?: string
    city?: string
    district?: string
    country?: string
    countrycode?: string
  }
}

function formatAddress({ name, street, housenumber, postcode, city, district, country }: PhotonFeature['properties']) {
  const streetAddress = [street, housenumber].filter(Boolean).join(' ')
  const place = [postcode, city ?? district].filter(Boolean).join(' ')
  return [name && name !== street && name !== streetAddress ? name : null, streetAddress || name, place, country].filter(Boolean).join(', ')
}

export async function searchPhoton(query: string, signal: AbortSignal): Promise<LocationValue[]> {
  const params = new URLSearchParams({ q: query.trim(), limit: '8', lang: 'fr', lat: '50.8503', lon: '4.3517', location_bias_scale: '0.3' })
  for (const country of ['BE', 'NL', 'LU']) params.append('countrycode', country)
  const response = await fetch(`${PHOTON_URL}?${params}`, { signal })
  if (!response.ok) throw new Error('Address search failed')
  const data = await response.json() as { features: PhotonFeature[] }
  return data.features
    .filter(({ properties, geometry }) => ['BE', 'NL', 'LU'].includes(properties.countrycode?.toUpperCase() ?? '') && geometry.coordinates.every(Number.isFinite))
    .map(({ properties, geometry }) => ({ displayName: formatAddress(properties), lat: geometry.coordinates[1], lon: geometry.coordinates[0] }))
    .filter(location => location.displayName)
}
