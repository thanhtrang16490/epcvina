import { calculateSolarSystem } from '../solar-calculator'

describe('Solar calculator', () => {
  it('matches the residential baseline used by the website', () => {
    const result = calculateSolarSystem({
      region: 'north',
      billType: 'family',
      monthlyBill: 3_000_000,
      roofType: 'flat',
      roofArea: 60,
      dayUsage: 70,
      phaseType: 'one',
    })

    expect(result.estimatedKwp).toBe(8.3)
    expect(result.estimatedPanels).toBe(13)
    expect(result.estimatedStorageKwh).toBeGreaterThan(0)
    expect(result.monthlySaving).toBeGreaterThan(0)
    expect(result.costMax).toBeGreaterThan(result.costMin)
  })

  it('caps capacity when the roof is too small', () => {
    const result = calculateSolarSystem({
      region: 'south',
      billType: 'business',
      monthlyBill: 20_000_000,
      roofType: 'metal',
      roofArea: 30,
      dayUsage: 80,
      phaseType: 'three',
    })

    expect(result.isRoofLimited).toBe(true)
    expect(result.estimatedKwp).toBeLessThanOrEqual(4.7)
  })

  it('prefers on-grid for factories with high daytime use', () => {
    const result = calculateSolarSystem({
      region: 'central',
      billType: 'factory',
      monthlyBill: 50_000_000,
      roofType: 'metal',
      roofArea: 900,
      dayUsage: 90,
      phaseType: 'three',
    })

    expect(result.systemType).toBe('on-grid')
    expect(result.estimatedStorageKwh).toBe(0)
  })
})
