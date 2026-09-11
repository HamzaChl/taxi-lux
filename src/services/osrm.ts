import type { LocationValue, RouteData } from '../types/booking'

const OSRM_URL = 'https://router.project-osrm.org/route/v1/driving'

type OsrmResponse = {
  code: string
  routes?: Array<{ distance: number; duration: number; geometry: GeoJSON.LineString }>
}

export async function calculateOsrmRoute(start: LocationValue, destination: LocationValue, signal: AbortSignal): Promise<RouteData> {
  const coordinates = `${start.lon},${start.lat};${destination.lon},${destination.lat}`
  const response = await fetch(`${OSRM_URL}/${coordinates}?overview=full&geometries=geojson`, { signal })
  if (!response.ok) throw new Error('Route request failed')
  const data = await response.json() as OsrmResponse
  const route = data.routes?.[0]
  if (data.code !== 'Ok' || !route) throw new Error('Route not found')
  return { distanceKm: route.distance / 1000, durationMinutes: Math.ceil(route.duration / 60), geometry: route.geometry }
}
