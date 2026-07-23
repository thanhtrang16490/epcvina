export type BillType = 'family' | 'business' | 'factory'
export type RoofType = 'metal' | 'tile' | 'flat'
export type PhaseType = 'one' | 'three'
export type SolarRegion = 'north' | 'central' | 'south'

export interface SolarCalculatorInput {
  region: SolarRegion
  billType: BillType
  monthlyBill: number
  roofType: RoofType
  roofArea: number
  dayUsage: number
  phaseType: PhaseType
}

export interface SolarCalculatorResult {
  estimatedKwp: number
  estimatedKwpByBill: number
  estimatedPanels: number
  inverterKw: number
  requiredRoofArea: number
  estimatedStorageKwh: number
  monthlyProductionKwh: number
  annualProductionKwh: number
  monthlySaving: number
  annualSaving: number
  afterBill: number
  billOffsetRatio: number
  costMin: number
  costMax: number
  paybackMin: number
  paybackMax: number
  paybackAverage: number
  netGain25Million: number
  co2Ton: number
  isRoofLimited: boolean
  systemType: 'on-grid' | 'hybrid-ready' | 'hybrid-storage'
  recommendation: string
}

export const REGION_PROVINCES: Record<SolarRegion, string[]> = {
  north: [
    'Hà Nội', 'Hải Phòng', 'Quảng Ninh', 'Hải Dương', 'Hưng Yên', 'Bắc Ninh',
    'Bắc Giang', 'Vĩnh Phúc', 'Phú Thọ', 'Thái Nguyên', 'Thái Bình', 'Nam Định',
    'Hà Nam', 'Ninh Bình', 'Hòa Bình', 'Lào Cai', 'Lạng Sơn', 'Sơn La',
  ],
  central: [
    'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Huế',
    'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa',
    'Ninh Thuận', 'Bình Thuận', 'Đắk Lắk', 'Gia Lai', 'Lâm Đồng',
  ],
  south: [
    'TP. HCM', 'Bình Dương', 'Đồng Nai', 'Bà Rịa - Vũng Tàu', 'Long An',
    'Tây Ninh', 'Tiền Giang', 'Bến Tre', 'Cần Thơ', 'An Giang', 'Kiên Giang',
  ],
}

export const DEFAULTS_BY_BILL_TYPE: Record<BillType, {
  monthlyBill: number
  roofArea: number
  roofType: RoofType
  dayUsage: number
  phaseType: PhaseType
}> = {
  family: { monthlyBill: 3_000_000, roofArea: 60, roofType: 'flat', dayUsage: 70, phaseType: 'one' },
  business: { monthlyBill: 10_000_000, roofArea: 180, roofType: 'flat', dayUsage: 50, phaseType: 'one' },
  factory: { monthlyBill: 50_000_000, roofArea: 900, roofType: 'metal', dayUsage: 90, phaseType: 'three' },
}

const REGION_FACTOR: Record<SolarRegion, number> = { north: 0.94, central: 1, south: 1.07 }
const ROOF_COST_ADDER: Record<RoofType, { min: number; max: number }> = {
  metal: { min: 0, max: 0 },
  tile: { min: 0.75, max: 1.15 },
  flat: { min: 0.45, max: 0.85 },
}
const STORAGE_PROFILE: Record<BillType, {
  triggerNightPercent: number
  nightCoverageRatio: number
  maxKwhPerKwp: number
  minKwh: number
  maxKwh: number
}> = {
  family: { triggerNightPercent: 25, nightCoverageRatio: 0.72, maxKwhPerKwp: 1.25, minKwh: 5, maxKwh: 40 },
  business: { triggerNightPercent: 35, nightCoverageRatio: 0.45, maxKwhPerKwp: 1.05, minKwh: 10, maxKwh: 160 },
  factory: { triggerNightPercent: 35, nightCoverageRatio: 0.25, maxKwhPerKwp: 0.65, minKwh: 30, maxKwh: 300 },
}

const roundOne = (value: number) => Math.round(value * 10) / 10

const storageStep = (value: number, billType: BillType) => {
  if (billType === 'factory') return value > 100 ? 50 : 20
  if (billType === 'business') return value > 80 ? 20 : value > 20 ? 10 : 5
  return value > 20 ? 10 : 5
}

const selectInverterKw = (systemKwp: number, phaseType: PhaseType) => {
  const targetKw = systemKwp * (phaseType === 'three' ? 0.95 : 0.9)
  const sizes = phaseType === 'three'
    ? [10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 100, 110, 125]
    : [3, 3.6, 5, 6, 8, 10, 12]
  return sizes.find(size => size >= targetKw) ?? Math.ceil(targetKw / 10) * 10
}

export function calculateSolarSystem(input: SolarCalculatorInput): SolarCalculatorResult {
  const monthlyBill = Math.max(0, input.monthlyBill)
  const roofArea = Math.max(0, input.roofArea)
  const dayUsage = Math.max(10, Math.min(95, input.dayUsage))
  const nightUsage = 100 - dayUsage
  const regionFactor = REGION_FACTOR[input.region]
  const roofPotentialKwp = roundOne(roofArea / 6.5)
  const baseDemandKwp = (monthlyBill / 3_000_000) * 7.8
  const estimatedKwpByBill = regionFactor > 0 ? baseDemandKwp / regionFactor : baseDemandKwp
  const estimatedKwp = roundOne(Math.min(estimatedKwpByBill, roofPotentialKwp))
  const isRoofLimited = roofArea > 0 && estimatedKwpByBill > roofPotentialKwp
  const roofCoverageRatio = estimatedKwpByBill > 0
    ? Math.max(0, Math.min(1, estimatedKwp / estimatedKwpByBill))
    : 0

  const averageTariff = input.billType === 'factory' ? 2800 : input.billType === 'business' ? 3300 : 3000
  const nightlyConsumptionKwh = monthlyBill / averageTariff / 30 * (nightUsage / 100)
  const profile = STORAGE_PROFILE[input.billType]
  const storageDemandKwh = nightlyConsumptionKwh > 0
    ? (nightlyConsumptionKwh / 0.82) * 1.1 * profile.nightCoverageRatio
    : 0
  const storageRawKwh = Math.min(storageDemandKwh, estimatedKwp * profile.maxKwhPerKwp, profile.maxKwh)
  const estimatedStorageKwh = nightUsage >= profile.triggerNightPercent && storageRawKwh > 0
    ? Math.max(profile.minKwh, Math.ceil(storageRawKwh / storageStep(storageRawKwh, input.billType)) * storageStep(storageRawKwh, input.billType))
    : 0

  const noStorageOffsetRatio = Math.min(0.72, Math.max(0.34, 0.28 + dayUsage / 100 * 0.5))
  const storageOffsetBonus = estimatedStorageKwh > 0 ? Math.min(0.2, nightUsage / 100 * 0.42) : 0
  const billOffsetRatio = Math.max(0, Math.min(0.82, roofCoverageRatio * (noStorageOffsetRatio + storageOffsetBonus)))
  const monthlySaving = monthlyBill * billOffsetRatio
  const annualSaving = monthlySaving * 12
  const annualSavingMillion = annualSaving / 1_000_000
  const roofAdder = ROOF_COST_ADDER[input.roofType]
  const solarCostMin = estimatedKwp * (8.72 + roofAdder.min)
  const solarCostMax = estimatedKwp * (9.62 + roofAdder.max)
  const costMin = Math.round(solarCostMin + estimatedStorageKwh * 5.05)
  const costMax = Math.round(solarCostMax + estimatedStorageKwh * 5.65)
  const paybackMin = annualSavingMillion > 0 ? Math.max(1.2, roundOne(costMin / annualSavingMillion)) : 0
  const paybackMax = annualSavingMillion > 0 ? Math.max(paybackMin, roundOne(costMax / annualSavingMillion)) : 0
  const paybackAverage = annualSavingMillion > 0
    ? Math.max(1.2, roundOne(((costMin + costMax) / 2) / annualSavingMillion))
    : 0
  const systemType = estimatedStorageKwh > 0
    ? 'hybrid-storage'
    : input.billType === 'factory' ? 'on-grid' : 'hybrid-ready'
  const recommendation = systemType === 'hybrid-storage'
    ? `Nhu cầu dùng điện ban đêm phù hợp hệ Hybrid với pin lưu trữ khoảng ${estimatedStorageKwh} kWh.`
    : systemType === 'hybrid-ready'
      ? 'Chưa cần pin ngay; nên dùng inverter Hybrid-ready để có thể nâng cấp sau.'
      : 'Tải chủ yếu ban ngày; hệ hòa lưới phù hợp để tối ưu chi phí và hoàn vốn.'

  return {
    estimatedKwp,
    estimatedKwpByBill: roundOne(estimatedKwpByBill),
    estimatedPanels: Math.round(estimatedKwp * 1.54),
    inverterKw: selectInverterKw(estimatedKwp, input.phaseType),
    requiredRoofArea: Math.round(estimatedKwp * 6.5),
    estimatedStorageKwh,
    monthlyProductionKwh: Math.round(estimatedKwp * regionFactor * 1250 / 12),
    annualProductionKwh: Math.round(estimatedKwp * regionFactor * 1250),
    monthlySaving: Math.round(monthlySaving),
    annualSaving: Math.round(annualSaving),
    afterBill: Math.round(Math.max(0, monthlyBill - monthlySaving)),
    billOffsetRatio,
    costMin,
    costMax,
    paybackMin,
    paybackMax,
    paybackAverage,
    netGain25Million: Math.max(0, Math.round(annualSavingMillion * 25 - (costMin + costMax) / 2)),
    co2Ton: roundOne(estimatedKwp * regionFactor * 0.63),
    isRoofLimited,
    systemType,
    recommendation,
  }
}

export const formatVnd = (value: number) => `${Math.round(value).toLocaleString('vi-VN')}đ`
export const formatMillionRange = (min: number, max: number) => `${min.toLocaleString('vi-VN')}–${max.toLocaleString('vi-VN')} triệu`
