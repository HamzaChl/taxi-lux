import { useEffect, useState } from 'react'
import { calculateOsrmRoute } from '../services/osrm'
import type { BookingStatus, LocationValue, RouteData } from '../types/booking'

export function useRoute(start: LocationValue | null, destination: LocationValue | null) {
  const [route, setRoute] = useState<RouteData | null>(null)
  const [status, setStatus] = useState<BookingStatus>('idle')

  useEffect(() => {
    if (!start || !destination) {
      return
    }
    const controller = new AbortController()
    const timer = window.setTimeout(() => setStatus('calculating-route'), 0)
    calculateOsrmRoute(start, destination, controller.signal)
      .then(data => {
        setRoute(data)
        setStatus('route-ready')
      })
      .catch(error => {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
          setRoute(null)
          setStatus('route-error')
        }
      })
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [start, destination])

  return { route: start && destination ? route : null, status: start && destination ? status : 'idle' as BookingStatus }
}
