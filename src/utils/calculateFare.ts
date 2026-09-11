import { TAXILUX_PRICING } from '../constants/pricing'

export function calculateFare(distanceKm: number, pickupTime: string, waitingMinutes: number) {
  const isDay = pickupTime >= TAXILUX_PRICING.dayStart && pickupTime < TAXILUX_PRICING.nightStart
  const pickupFee = isDay ? TAXILUX_PRICING.dayPickup : TAXILUX_PRICING.nightPickup
  const fare = pickupFee + distanceKm * TAXILUX_PRICING.pricePerKm + waitingMinutes * TAXILUX_PRICING.waitingPerMinute
  return Math.round(Math.max(TAXILUX_PRICING.minimumFare, fare) * 100) / 100
}
