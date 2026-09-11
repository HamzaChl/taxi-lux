import { useEffect, useState } from 'react'
import { searchNominatim } from '../services/nominatim'
import type { LocationValue } from '../types/booking'

export function useAddressSearch(query: string) {
  const [results, setResults] = useState<LocationValue[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (query.trim().length < 3) {
      return
    }
    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setIsSearching(true)
      try {
        setResults(await searchNominatim(query, controller.signal))
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) setResults([])
      } finally {
        if (!controller.signal.aborted) setIsSearching(false)
      }
    }, 400)
    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  return { results: query.trim().length < 3 ? [] : results, isSearching: query.trim().length >= 3 && isSearching, clearResults: () => setResults([]) }
}
