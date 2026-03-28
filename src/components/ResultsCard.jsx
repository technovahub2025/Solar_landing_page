import { memo } from 'react'
import resultsArt from '../assets/5.png'
import { formatCurrency, formatNumber } from '../utils/solarEngine.js'

function ResultsCard({ results, compact = false }) {
  const summaryMetrics = [
    { label: 'System size', value: `${formatNumber(results.systemSizeKw)} kW` },
    { label: 'Panel count', value: `${formatNumber(results.panelCount, 0)} panels` },
    { label: 'Roof area', value: `${formatNumber(results.roofAreaSqm)} sq m` },
    { label: 'Monthly savings', value: formatCurrency(results.monthlySavings), accent: true },
  ]

  const detailedMetrics = [
    { label: 'Inverter', value: results.inverterSpec },
    { label: 'Battery', value: results.batterySpec },
    { label: 'Units offset / month', value: `${formatNumber(results.monthlyUnits)} units` },
    { label: 'Annual savings', value: formatCurrency(results.annualSavings) },
    { label: 'Payback period', value: `${formatNumber(results.paybackYears, 1)} years` },
    { label: 'CO2 saved', value: `${formatNumber(results.annualCo2Saved)} kg/year` },
  ]

  const metrics = compact ? summaryMetrics : [...summaryMetrics, ...detailedMetrics]

  return (
    <aside className="results-card dark-panel art-panel overflow-hidden p-4 lg:p-5 2xl:p-6">
      <div className="section-art-shell" aria-hidden="true">
        <div
          className="section-art-image section-art-fade-bottom absolute right-[-6%] top-0 h-full w-[72%]"
          data-tone="dark"
          style={{ backgroundImage: `url(${resultsArt})`, '--art-opacity': 0.18, '--art-blur': '0.6px' }}
        />
      </div>
      <div className="border-b border-white/10 pb-4 lg:pb-5">
        <span className="kicker !border-white/12 !bg-white/6 !text-white/64">Recommended system</span>
        <p className="results-card-copy mt-4 max-w-2xl text-sm leading-6 text-white/72 2xl:leading-7">
          The calculator remains fully functional inside this premium, conversion-first landing page. Users can
          estimate system size, compare backup needs, and prepare a polished quote.
        </p>
        <h3 className="results-card-title mt-4 font-['Syne'] text-[2.15rem] tracking-[-0.06em] text-white md:text-[2.25rem] 2xl:mt-5 2xl:text-[2.4rem]">
          {formatNumber(results.systemSizeKw)} kW solar recommendation
        </h3>
        <p className="results-card-copy mt-3 max-w-2xl text-sm leading-6 text-white/72 2xl:mt-4 2xl:leading-7">
          Sized around {formatNumber(results.dailyLoad)} kWh/day with an estimated{' '}
          {formatNumber(results.monthlyUnits)} units each month and room to discuss storage, roof fit,
          and long-term savings.
        </p>
      </div>

      <div className="stagger-grid mt-4 grid gap-2.5 md:grid-cols-2 2xl:mt-5 2xl:gap-3">
        {metrics.map((metric, index) => (
          <div
            className={`results-metric rounded-[1.25rem] border px-3.5 py-3.5 transition-colors duration-300 2xl:rounded-[1.35rem] 2xl:px-4 2xl:py-4 ${
              metric.accent
                ? 'border-[rgba(232,200,145,0.22)] bg-[rgba(232,200,145,0.1)]'
                : 'border-white/10 bg-white/5'
            }`}
            key={metric.label}
            style={{ '--stagger-delay': 100 + index * 60, '--stagger-scale': 0.985 }}
          >
            <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/48">
              {metric.label}
            </span>
            <strong className="results-metric-value mt-2.5 block break-words text-[13px] font-semibold leading-5 text-white 2xl:mt-3 2xl:text-sm 2xl:leading-6">
              {metric.value}
            </strong>
          </div>
        ))}
      </div>

      {!compact && (
        <div className="mt-4 border-t border-white/10 pt-4 2xl:mt-5 2xl:pt-5">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.22em] text-white/48">
            Estimated installed cost
          </span>
          <strong className="results-summary-value mt-2.5 block font-['Syne'] text-[2.2rem] tracking-[-0.06em] text-white 2xl:mt-3 2xl:text-4xl">
            {formatCurrency(results.totalCost)}
          </strong>
          <p className="results-card-copy mt-3 text-sm leading-6 text-white/70 2xl:mt-4 2xl:leading-7">{results.subsidyNote}</p>
        </div>
      )}
    </aside>
  )
}

export default memo(ResultsCard)
