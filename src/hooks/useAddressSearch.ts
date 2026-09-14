import { useEffect, useState } from 'react'
import { searchPhoton } from '../services/photon'
import type { LocationValue } from '../types/booking'

export function useAddressSearch(query: string, enabled = true) {
  const [results, setResults] = useState<LocationValue[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (!enabled || query.trim().length < 3) {
      return
    }
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setIsSearching(true)
      try {
        setResults(await searchPhoton(query, controller.signal))
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setResults([])
      } finally {
        if (!controller.signal.aborted) setIsSearching(false)
      }
    }, 600)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query, enabled])

  return { results: enabled && query.trim().length >= 3 ? results : [], isSearching: enabled && query.trim().length >= 3 && isSearching, clearResults: () => setResults([]) }
}
