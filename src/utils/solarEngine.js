const DEFAULTS = {
  tariffPerUnit: 8,
  irradiance: 4.5,
  lossFactor: 1.15,
  panelWattage: 550,
  roofAreaPerKw: 10,
  batteryVoltage: 48,
  costPerKw: 55000,
  co2Factor: 0.82,
  carCo2PerKm: 0.12,
}

const roundTo = (value, decimals = 2) => {
  const factor = 10 ** decimals
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor
}

const safeNumber = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0
}

export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0)

export const formatNumber = (value, maximumFractionDigits = 2) =>
  new Intl.NumberFormat('en-IN', {
    maximumFractionDigits,
  }).format(value || 0)

export const getDefaultAppliances = () => [
  { id: 1, appliance: 'LED Lights', quantity: 8, watts: 12, hours: 5 },
  { id: 2, appliance: 'Fans', quantity: 4, watts: 70, hours: 8 },
  { id: 3, appliance: 'Refrigerator', quantity: 1, watts: 180, hours: 12 },
]

export function calculateDailyLoadFromAppliances(appliances = []) {
  // Daily connected load is the sum of watts x quantity x usage hours, converted into kWh.
  return roundTo(
    appliances.reduce((sum, item) => {
      const watts = safeNumber(item.watts)
      const quantity = safeNumber(item.quantity)
      const hours = safeNumber(item.hours)
      return sum + (watts * quantity * hours) / 1000
    }, 0),
  )
}

export function calculateDailyLoadFromBillOrUnits({
  monthlyBill = 0,
  monthlyUnits = 0,
  tariffPerUnit = DEFAULTS.tariffPerUnit,
} = {}) {
  const units = safeNumber(monthlyUnits)
  const bill = safeNumber(monthlyBill)
  const tariff = safeNumber(tariffPerUnit) || DEFAULTS.tariffPerUnit
  const derivedMonthlyUnits = units > 0 ? units : bill / tariff
  return roundTo(derivedMonthlyUnits / 30)
}

const getInverterSpec = (systemSizeKw) => {
  const rounded = Math.max(1, Math.ceil(systemSizeKw))
  return `${rounded} kW hybrid inverter`
}

const getBatterySpec = (batteryKwh, batteryAh) => {
  if (!batteryKwh) {
    return 'Optional backup battery not selected'
  }

  return `${roundTo(batteryKwh, 1)} kWh / ${Math.ceil(batteryAh)} Ah lithium battery bank`
}

export function buildQuoteBreakdown(results) {
  const totalCost = results.totalCost
  const batteryShare = results.batteryEnabled ? 0.16 : 0
  const panelShare = results.batteryEnabled ? 0.48 : 0.58
  const inverterShare = results.batteryEnabled ? 0.16 : 0.2
  const installationShare = results.batteryEnabled ? 0.1 : 0.12
  const gstShare = 1 - panelShare - inverterShare - batteryShare - installationShare

  return {
    panels: roundTo(totalCost * panelShare),
    inverter: roundTo(totalCost * inverterShare),
    battery: roundTo(totalCost * batteryShare),
    installation: roundTo(totalCost * installationShare),
    gst: roundTo(totalCost * gstShare),
    total: roundTo(totalCost),
  }
}

export function calculateSolarRecommendation(config = {}) {
  const {
    dailyLoad = 0,
    batteryEnabled = false,
    backupHours = 0,
    irradiance = DEFAULTS.irradiance,
    lossFactor = DEFAULTS.lossFactor,
    panelWattage = DEFAULTS.panelWattage,
    roofAreaPerKw = DEFAULTS.roofAreaPerKw,
    batteryVoltage = DEFAULTS.batteryVoltage,
    tariffPerUnit = DEFAULTS.tariffPerUnit,
    costPerKw = DEFAULTS.costPerKw,
    co2Factor = DEFAULTS.co2Factor,
    carCo2PerKm = DEFAULTS.carCo2PerKm,
  } = config

  const normalizedDailyLoad = safeNumber(dailyLoad)
  const normalizedBackupHours = safeNumber(backupHours)

  // Solar sizing follows daily load divided by irradiance, then uplifted for losses.
  const baseSystemSizeKw = normalizedDailyLoad / irradiance
  const systemSizeKw = baseSystemSizeKw * lossFactor

  // Panel count rounds up so the recommendation always covers the target generation.
  const panelCount = Math.max(
    1,
    Math.ceil((systemSizeKw * 1000) / panelWattage || 0),
  )
  const roofAreaSqm = systemSizeKw * roofAreaPerKw

  const batteryKwh = batteryEnabled
    ? (normalizedDailyLoad * normalizedBackupHours) / 24
    : 0
  const batteryAh = batteryEnabled ? (batteryKwh * 1000) / batteryVoltage : 0

  const monthlyUnits = normalizedDailyLoad * 30
  const annualUnits = monthlyUnits * 12

  // Savings are modeled using the supplied tariff per unit for the estimated offset energy.
  const monthlySavings = monthlyUnits * tariffPerUnit
  const annualSavings = monthlySavings * 12
  const totalCost = systemSizeKw * costPerKw
  const paybackYears = annualSavings > 0 ? totalCost / annualSavings : 0
  const annualCo2Saved = annualUnits * co2Factor
  const carKmEquivalent = annualCo2Saved / carCo2PerKm

  const results = {
    dailyLoad: roundTo(normalizedDailyLoad),
    monthlyUnits: roundTo(monthlyUnits),
    annualUnits: roundTo(annualUnits),
    baseSystemSizeKw: roundTo(baseSystemSizeKw),
    systemSizeKw: roundTo(systemSizeKw),
    panelCount,
    roofAreaSqm: roundTo(roofAreaSqm),
    inverterSpec: getInverterSpec(systemSizeKw),
    batteryEnabled,
    backupHours: normalizedBackupHours,
    batteryKwh: roundTo(batteryKwh),
    batteryAh: roundTo(batteryAh),
    batterySpec: getBatterySpec(batteryKwh, batteryAh),
    monthlySavings: roundTo(monthlySavings),
    annualSavings: roundTo(annualSavings),
    totalCost: roundTo(totalCost),
    paybackYears: roundTo(paybackYears, 1),
    annualCo2Saved: roundTo(annualCo2Saved),
    carKmEquivalent: roundTo(carKmEquivalent),
    subsidyNote:
      'Subsidy eligibility varies by state and consumer category. Our advisory team can validate the latest residential incentives.',
  }

  return {
    ...results,
    quoteBreakdown: buildQuoteBreakdown(results),
  }
}
