import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ApplianceTable from '../components/ApplianceTable.jsx'
import QuoteGenerator from '../components/QuoteGenerator.jsx'
import QuotePreview from '../components/QuotePreview.jsx'
import ResultsCard from '../components/ResultsCard.jsx'
import SectionReveal from '../components/SectionReveal.jsx'
import useGsapInteractiveMotion from '../hooks/useGsapInteractiveMotion.js'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js'
import { gsap } from '../lib/gsap.js'
import { MOTION } from '../lib/motion.js'
import {
  calculateDailyLoadFromAppliances,
  calculateDailyLoadFromBillOrUnits,
  calculateSolarRecommendation,
  getDefaultAppliances,
} from '../utils/solarEngine.js'

const LEAD_STORAGE_KEY = 'solarscope_latest_lead'

const getInitialFormValues = () => ({
  name: '',
  email: '',
  phone: '',
  roofAvailability: '',
  notes: '',
})

const getStoredLead = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const storedLead = window.localStorage.getItem(LEAD_STORAGE_KEY)

  if (!storedLead) {
    return null
  }

  try {
    return JSON.parse(storedLead)
  } catch {
    window.localStorage.removeItem(LEAD_STORAGE_KEY)
    return null
  }
}

const validateForm = (values) => {
  const nextErrors = {}

  if (!values.name.trim()) {
    nextErrors.name = 'Please enter your full name.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    nextErrors.email = 'Please enter a valid email address.'
  }

  if (!/^\d{10}$/.test(values.phone.replace(/\D/g, ''))) {
    nextErrors.phone = 'Please enter a valid 10-digit phone number.'
  }

  if (!values.roofAvailability) {
    nextErrors.roofAvailability = 'Please select your roof availability.'
  }

  return nextErrors
}

const parseNumberInput = (value) => (value === '' ? 0 : Number(value))
const formatNumberInput = (value) => (value === 0 ? '' : value)

function SolarCalculator() {
  const initialLead = getStoredLead()
  const calculatorRef = useRef(null)
  const [inputMode, setInputMode] = useState('bill')
  const [monthlyBill, setMonthlyBill] = useState(6500)
  const [monthlyUnits, setMonthlyUnits] = useState(0)
  const [tariffPerUnit, setTariffPerUnit] = useState(8)
  const [appliances, setAppliances] = useState(getDefaultAppliances)
  const [batteryEnabled, setBatteryEnabled] = useState(true)
  const [backupHours, setBackupHours] = useState(4)
  const [formValues, setFormValues] = useState(initialLead?.customer || getInitialFormValues)
  const [formErrors, setFormErrors] = useState({})
  const [downloadRequestId, setDownloadRequestId] = useState(0)
  const [isPreparingQuote, setIsPreparingQuote] = useState(false)
  const [submissionState, setSubmissionState] = useState(
    initialLead
      ? {
          message: 'Latest quote request restored from this browser.',
          type: 'info',
        }
      : { message: '', type: '' },
  )
  const [latestLead, setLatestLead] = useState(initialLead)
  const rowIdRef = useRef(4)
  const prefersReducedMotion = usePrefersReducedMotion()
  useGsapInteractiveMotion(calculatorRef)

  const applianceDailyLoad = useMemo(() => calculateDailyLoadFromAppliances(appliances), [appliances])
  const billDailyLoad = useMemo(
    () =>
      calculateDailyLoadFromBillOrUnits({
        monthlyBill,
        monthlyUnits,
        tariffPerUnit,
      }),
    [monthlyBill, monthlyUnits, tariffPerUnit],
  )
  const activeDailyLoad = inputMode === 'bill' ? billDailyLoad : applianceDailyLoad

  const results = useMemo(
    () =>
      calculateSolarRecommendation({
        dailyLoad: activeDailyLoad,
        batteryEnabled,
        backupHours,
        tariffPerUnit,
      }),
    [activeDailyLoad, backupHours, batteryEnabled, tariffPerUnit],
  )

  const proposalInputs = useMemo(
    () => ({
      monthlyBill,
      monthlyUnits,
      tariffPerUnit,
      appliances,
      batteryEnabled,
      backupHours,
    }),
    [appliances, backupHours, batteryEnabled, monthlyBill, monthlyUnits, tariffPerUnit],
  )

  const generatedAt = useMemo(
    () =>
      new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    [],
  )

  const proposalData = useMemo(
    () => ({
      customer: formValues,
      inputMode,
      inputs: proposalInputs,
      results,
      generatedAt,
    }),
    [formValues, generatedAt, inputMode, proposalInputs, results],
  )

  const handleApplianceChange = useCallback((id, field, value) => {
    setAppliances((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === 'appliance'
                  ? value
                  : value === ''
                    ? ''
                    : Number(value),
            }
          : item,
      ),
    )
  }, [])

  const handleAddRow = useCallback(() => {
    setAppliances((current) => [
      ...current,
      {
        id: rowIdRef.current,
        appliance: '',
        quantity: 1,
        watts: 100,
        hours: 4,
      },
    ])
    rowIdRef.current += 1
  }, [])

  const handleRemoveRow = useCallback((id) => {
    setAppliances((current) => (current.length > 1 ? current.filter((item) => item.id !== id) : current))
  }, [])

  const handleFormChange = useCallback((event) => {
    const { name, value } = event.target
    setFormValues((current) => ({ ...current, [name]: value }))
    setFormErrors((current) => ({ ...current, [name]: '' }))
  }, [])

  const handleQuoteDownloaded = useCallback(() => {
    setIsPreparingQuote(false)
    setLatestLead(null)
    setInputMode('bill')
    setMonthlyBill(6500)
    setMonthlyUnits(0)
    setTariffPerUnit(8)
    setAppliances(getDefaultAppliances())
    setBatteryEnabled(true)
    setBackupHours(4)
    setFormValues(getInitialFormValues())
    setFormErrors({})
    setSubmissionState({
      message: 'Quote downloaded and local data cleared from this browser.',
      type: 'success',
    })
    rowIdRef.current = 4
    window.localStorage.removeItem(LEAD_STORAGE_KEY)
  }, [])

  const handleSubmit = useCallback((event) => {
    event.preventDefault()
    const nextErrors = validateForm(formValues)

    if (Object.keys(nextErrors).length > 0) {
      setIsPreparingQuote(false)
      setFormErrors(nextErrors)
      setSubmissionState({
        message: 'Please correct the highlighted fields before preparing the quote.',
        type: 'error',
      })
      return
    }

    const leadPayload = {
      customer: formValues,
      proposalData,
      crmReadyJson: {
        source: 'frontend-only-solar-scope',
        createdAt: new Date().toISOString(),
        customer: formValues,
        inputs: proposalInputs,
        recommendation: results,
      },
    }

    setIsPreparingQuote(true)
    setLatestLead(leadPayload)
    window.localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(leadPayload))
    setSubmissionState({
      message: 'Preparing your quote download...',
      type: 'info',
    })
    setDownloadRequestId((current) => current + 1)
  }, [formValues, proposalData, proposalInputs, results])

  useEffect(() => {
    if (prefersReducedMotion || !calculatorRef.current) {
      return undefined
    }

    const activeButton = calculatorRef.current.querySelector('[data-active="true"]')

    if (!activeButton) {
      return undefined
    }

    gsap.fromTo(
      activeButton,
      { y: 8, scale: 0.98, autoAlpha: 0.8 },
      {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        duration: 0.46,
        ease: MOTION.ease.soft,
        overwrite: 'auto',
      },
    )

    return undefined
  }, [inputMode, prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion || !calculatorRef.current) {
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.results-metric, .results-card-title, .results-card-copy, .results-summary-value',
        {
          autoAlpha: 0.72,
          y: 10,
        },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.52,
          ease: MOTION.ease.soft,
          stagger: 0.04,
          overwrite: 'auto',
          clearProps: 'opacity,visibility,transform',
        },
      )
    }, calculatorRef)

    return () => ctx.revert()
  }, [prefersReducedMotion, results])

  return (
    <SectionReveal className="section-band section-space" id="calculator" variant="up">
      <div className="wide-shell" ref={calculatorRef}>
        <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] 2xl:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.82fr)]">
          <div className="min-w-0 grid gap-5">
            <div className="anchor-target calculator-surface paper-panel bg-[linear-gradient(180deg,rgba(255,253,248,0.98),rgba(245,237,226,0.96)),radial-gradient(circle_at_top_right,rgba(232,200,145,0.2),transparent_28%)] p-4 sm:p-5 md:p-6" id="calculator-panel">
              <div className="motion-line border-b border-black/8 pb-6">
                <div>
                  <span className="kicker">Calculator and recommendation</span>
                  <h2 className="mt-5 font-['Syne'] text-[clamp(2.15rem,7vw,4rem)] leading-[0.95] tracking-[-0.06em] text-[var(--color-ink)]">
                    From energy usage to a ready-to-share solar proposal
                  </h2>
                  <div className="stagger-grid mt-5 flex flex-wrap gap-2 text-xs font-semibold">
                    {['Residential and business friendly', 'Bill or appliance based', 'Local save plus PDF export'].map((item, index) => (
                      <span
                        className="rounded-full border border-black/8 bg-white/76 px-3 py-2 text-[var(--color-muted)]"
                        key={item}
                        style={{ '--stagger-delay': 100 + index * 70, '--stagger-scale': 0.95 }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="stagger-grid mt-6 grid gap-5">
                <div className="rounded-[1.8rem] border border-black/8 bg-[rgba(255,252,246,0.72)] p-4 sm:p-5 shadow-[0_25px_45px_rgba(37,27,17,0.06)]" style={{ '--stagger-delay': 100, '--stagger-x': '-16px' }}>
                  <div className="mb-6">
                    <h3 className="font-['Syne'] text-2xl tracking-[-0.05em] text-[var(--color-ink)]">Usage Inputs</h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                      Select the sizing mode that best matches the information you have available.
                    </p>
                  </div>

                  <div className="mb-6 flex w-full rounded-[1.25rem] border border-black/8 bg-[#efe6d7] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] sm:inline-flex sm:w-auto sm:rounded-full">
                    <div className="relative grid w-full grid-cols-2 rounded-[1rem] sm:inline-grid sm:w-auto sm:rounded-full">
                      <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute inset-y-0 left-0 z-0 rounded-full bg-[#2d2722] shadow-[0_12px_22px_rgba(33,28,23,0.18)] transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          inputMode === 'appliance' ? 'translate-x-full' : 'translate-x-0'
                        }`}
                        style={{ width: '50%' }}
                      />
                    <button
                      className={`relative z-10 min-w-0 rounded-[1rem] px-3 py-3 text-center text-sm font-semibold transition-colors duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] sm:min-w-[180px] sm:rounded-full sm:px-5 ${
                        inputMode === 'bill'
                          ? 'text-white'
                          : 'bg-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                      }`}
                      data-active={inputMode === 'bill'}
                      data-motion="pill"
                      type="button"
                      onClick={() => setInputMode('bill')}
                    >
                      Monthly Bill or Units
                    </button>
                    <button
                      className={`relative z-10 min-w-0 rounded-[1rem] px-3 py-3 text-center text-sm font-semibold transition-colors duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] sm:min-w-[180px] sm:rounded-full sm:px-5 ${
                        inputMode === 'appliance'
                          ? 'text-white'
                          : 'bg-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]'
                      }`}
                      data-active={inputMode === 'appliance'}
                      data-motion="pill"
                      type="button"
                      onClick={() => setInputMode('appliance')}
                    >
                      Appliance-Based
                    </button>
                    </div>
                  </div>

                  {inputMode === 'bill' ? (
                    <div className="grid gap-5 md:grid-cols-2">
                      <label className="block">
                        <span className="field-label">Monthly electricity bill (INR)</span>
                        <input
                          type="number"
                          min="0"
                          value={formatNumberInput(monthlyBill)}
                          onChange={(event) => setMonthlyBill(parseNumberInput(event.target.value))}
                          placeholder="Enter amount"
                        />
                      </label>
                      <label className="block">
                        <span className="field-label">Monthly units (optional override)</span>
                        <input
                          type="number"
                          min="0"
                          value={formatNumberInput(monthlyUnits)}
                          onChange={(event) => setMonthlyUnits(parseNumberInput(event.target.value))}
                          placeholder="Optional"
                        />
                      </label>
                      <label className="block">
                        <span className="field-label">Tariff per unit (INR)</span>
                        <input
                          type="number"
                          min="1"
                          value={formatNumberInput(tariffPerUnit)}
                          onChange={(event) => setTariffPerUnit(parseNumberInput(event.target.value))}
                          placeholder="Enter tariff"
                        />
                      </label>
                      <div className="flex items-end">
                        <div className="w-full rounded-[1.5rem] border border-[rgba(200,154,75,0.22)] bg-[linear-gradient(180deg,#fffaf1,#f4ead9)] px-4 py-4">
                          <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                            Estimated daily load
                          </span>
                          <strong className="mt-3 block font-['Syne'] text-[clamp(2rem,7vw,2.25rem)] tracking-[-0.05em] text-[var(--color-ink)]">
                            {billDailyLoad.toFixed(2)} kWh/day
                          </strong>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <ApplianceTable
                      appliances={appliances}
                      onChange={handleApplianceChange}
                      onAddRow={handleAddRow}
                      onRemoveRow={handleRemoveRow}
                      totalDailyLoad={applianceDailyLoad}
                    />
                  )}
                </div>

                <div className="rounded-[1.8rem] border border-black/8 bg-[rgba(255,252,246,0.72)] p-4 sm:p-5 shadow-[0_25px_45px_rgba(37,27,17,0.06)]" style={{ '--stagger-delay': 220, '--stagger-x': '16px' }}>
                  <div className="mb-6">
                    <h3 className="font-['Syne'] text-2xl tracking-[-0.05em] text-[var(--color-ink)]">
                      Configuration Preferences
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                      Refine the recommendation with backup requirements and storage preferences.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-black/8 bg-white/76 px-4 py-4">
                      <span className="field-label">Battery backup</span>
                      <span className="block text-sm text-[var(--color-muted)]">Enable storage sizing</span>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-[1.15rem] border px-4 py-3 transition ${
                            batteryEnabled
                              ? 'border-[rgba(200,154,75,0.34)] bg-[linear-gradient(180deg,#fffaf1,#f4ead9)] shadow-[0_12px_24px_rgba(200,154,75,0.12)]'
                              : 'border-black/8 bg-white/72'
                          }`}
                          data-motion="soft"
                        >
                          <input
                            className="sr-only"
                            type="radio"
                            name="battery-backup"
                            checked={batteryEnabled}
                            onChange={() => setBatteryEnabled(true)}
                          />
                          <span
                            className={`grid h-5 w-5 place-items-center rounded-full border transition ${
                              batteryEnabled
                                ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                                : 'border-black/16 bg-white'
                            }`}
                            aria-hidden="true"
                          >
                            <span className={`h-2.5 w-2.5 rounded-full bg-current ${batteryEnabled ? 'opacity-100' : 'opacity-0'}`} />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-[var(--color-ink)]">Yes</span>
                            <span className="block text-xs text-[var(--color-muted)]">Include battery backup</span>
                          </span>
                        </label>

                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-[1.15rem] border px-4 py-3 transition ${
                            !batteryEnabled
                              ? 'border-[rgba(32,27,23,0.18)] bg-[rgba(32,27,23,0.04)] shadow-[0_12px_24px_rgba(32,27,23,0.06)]'
                              : 'border-black/8 bg-white/72'
                          }`}
                          data-motion="soft"
                        >
                          <input
                            className="sr-only"
                            type="radio"
                            name="battery-backup"
                            checked={!batteryEnabled}
                            onChange={() => setBatteryEnabled(false)}
                          />
                          <span
                            className={`grid h-5 w-5 place-items-center rounded-full border transition ${
                              !batteryEnabled
                                ? 'border-[var(--color-ink)] bg-[var(--color-ink)] text-white'
                                : 'border-black/16 bg-white'
                            }`}
                            aria-hidden="true"
                          >
                            <span className={`h-2.5 w-2.5 rounded-full bg-current ${!batteryEnabled ? 'opacity-100' : 'opacity-0'}`} />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-[var(--color-ink)]">No</span>
                            <span className="block text-xs text-[var(--color-muted)]">Solar only</span>
                          </span>
                        </label>
                      </div>
                    </div>

                    <label className="block">
                      <span className="field-label">Backup hours required</span>
                      <input
                        type="number"
                        min="0"
                        max="24"
                        step="1"
                        value={formatNumberInput(backupHours)}
                        onChange={(event) => setBackupHours(parseNumberInput(event.target.value))}
                        placeholder="Hours"
                        disabled={!batteryEnabled}
                      />
                    </label>
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="min-w-0 self-start">
            <ResultsCard results={results} />
          </div>

          <div className="xl:col-span-2">
            <QuoteGenerator
              formValues={formValues}
              errors={formErrors}
              isPreparing={isPreparingQuote}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              submissionState={submissionState}
            />
          </div>

          <QuotePreview
            downloadRequestId={downloadRequestId}
            onDownloadComplete={handleQuoteDownloaded}
            proposalData={latestLead?.proposalData || proposalData}
          />
        </div>
      </div>
    </SectionReveal>
  )
}

export default SolarCalculator
