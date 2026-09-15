// Tarifs de l'application mobile. Toute modification nécessite un redéploiement Vercel.
export const MOBILE_PRICING = {
  version: 1,
  pickupFee: {
    day: 15,
    night: 19.8,
  },
  includedKm: 3,
  rate: {
    upToKm: 35,
    upToRate: 3.2,
    afterRate: 2.5,
  },
  hourlyRate: 0,
  updatedAt: '2026-09-15T00:00:00.000Z',
} as const
