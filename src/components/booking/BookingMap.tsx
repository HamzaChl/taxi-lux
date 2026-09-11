import { useEffect } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'
import type { LocationValue, RouteData } from '../../types/booking'

type BookingMapProps = {
  pickup: LocationValue | null
  destination: LocationValue | null
  route: RouteData | null
  children?: React.ReactNode
}

const pickupIcon = L.divIcon({ className: '', html: '<span class="taxilux-marker taxilux-marker-pickup">A</span>', iconSize: [34, 34], iconAnchor: [17, 17] })
const destinationIcon = L.divIcon({ className: '', html: '<span class="taxilux-marker taxilux-marker-destination">B</span>', iconSize: [34, 34], iconAnchor: [17, 17] })

function RouteViewport({ route }: { route: RouteData | null }) {
  const map = useMap()
  useEffect(() => {
    if (!route) return
    const bounds = L.latLngBounds(route.geometry.coordinates.map(([lon, lat]) => [lat, lon] as [number, number]))
    map.fitBounds(bounds, { padding: [55, 55] })
  }, [map, route])
  return null
}

export function BookingMap({ pickup, destination, route, children }: BookingMapProps) {
  const line = route?.geometry.coordinates.map(([lon, lat]) => [lat, lon] as [number, number]) ?? []
  return (
    <div className="relative min-h-[500px] lg:min-h-[760px]">
      <MapContainer center={[50.8503, 4.3517]} zoom={12} scrollWheelZoom zoomControl className="taxilux-map absolute inset-0 z-0 h-full w-full">
        <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
        {pickup && <Marker position={[pickup.lat, pickup.lon]} icon={pickupIcon} />}
        {destination && <Marker position={[destination.lat, destination.lon]} icon={destinationIcon} />}
        {line.length > 0 && <Polyline positions={line} pathOptions={{ color: '#DF1738', weight: 5, opacity: 0.95 }} />}
        <RouteViewport route={route} />
      </MapContainer>
      {children}
    </div>
  )
}
