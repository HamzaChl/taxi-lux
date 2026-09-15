// Tarifs de l'application mobile. Toute modification nécessite un redéploiement Vercel.
export const MOBILE_PRICING = {
  version: 1,
  pickupFee: {
    day: 2.6,
    night: 4.6,
  },
  includedKm: 0,
  rate: {
    upToKm: 35,
    upToRate: 2.3,
    afterRate: 2.3,
  },
  hourlyRate: 0,
  updatedAt: '2026-09-15T00:00:00.000Z',
} as const
