export type LocationValue = {
  displayName: string
  lat: number
  lon: number
}

export type RouteData = {
  distanceKm: number
  durationMinutes: number
  geometry: GeoJSON.LineString
}

export type BookingStatus = 'idle' | 'searching-address' | 'calculating-route' | 'route-ready' | 'route-error' | 'submitting' | 'success' | 'error'

export type BookingFormValues = {
  pickupDate: string
  pickupTime: string
  waitingMinutes: number
  firstName: string
  lastName: string
  phone: string
  email: string
  passengers?: number
  luggage?: number
  notes?: string
}

export type BookingData = {
  pickup: LocationValue
  destination: LocationValue
  pickupDate: string
  pickupTime: string
  waitingMinutes: number
  customer: {
    firstName: string
    lastName: string
    phone: string
    email: string
    passengers?: number
    luggage?: number
    notes?: string
  }
  route: RouteData
  estimatedPrice: number
}
