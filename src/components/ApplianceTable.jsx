import { memo } from 'react'
import plannerArt from '../assets/6.png'

function ApplianceTable({ appliances, onChange, onAddRow, onRemoveRow, totalDailyLoad }) {
  return (
    <div className="art-panel rounded-[1.8rem] border border-black/8 bg-[rgba(255,252,246,0.72)] p-4 sm:p-5">
      <div className="section-art-shell" aria-hidden="true">
        <div
          className="section-art-image section-art-fade-side absolute right-[-10%] top-0 h-full w-[48%]"
          style={{ backgroundImage: `url(${plannerArt})`, '--art-opacity': 0.12 }}
        />
      </div>
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h3 className="font-['Syne'] text-2xl tracking-[-0.05em] text-[var(--color-ink)]">
            Appliance Load Planner
          </h3>
          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
            Add household or commercial loads to estimate total daily energy demand.
          </p>
        </div>
        <button className="outline-button w-full !py-3 !text-sm md:w-auto" data-motion="button" type="button" onClick={onAddRow}>
          Add Appliance
        </button>
      </div>

      <div className="space-y-4 md:hidden">
        {appliances.map((item) => (
          <div className="rounded-[1.35rem] border border-black/8 bg-white/72 p-4 shadow-[0_14px_28px_rgba(37,27,17,0.05)]" key={item.id}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-muted)]">
                  Appliance
                </p>
                <p className="mt-2 text-sm font-semibold text-[var(--color-ink)]">
                  {item.appliance || 'New appliance'}
                </p>
              </div>
              <button
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#d7b4ab] bg-[#f9eeeb] text-lg text-[#8a3c33] transition hover:bg-[#f5e2de]"
                data-motion="pill"
                type="button"
                onClick={() => onRemoveRow(item.id)}
                aria-label={`Remove ${item.appliance || 'appliance'} row`}
              >
                x
              </button>
            </div>

            <div className="grid gap-3">
              <label className="block">
                <span className="field-label">Appliance</span>
                <input
                  type="text"
                  value={item.appliance}
                  onChange={(event) => onChange(item.id, 'appliance', event.target.value)}
                  placeholder="Appliance name"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="field-label">Qty</span>
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(event) => onChange(item.id, 'quantity', event.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="field-label">Watts</span>
                  <input
                    type="number"
                    min="0"
                    value={item.watts}
                    onChange={(event) => onChange(item.id, 'watts', event.target.value)}
                  />
                </label>
              </div>

              <label className="block">
                <span className="field-label">Hours</span>
                <input
                  type="number"
                  min="0"
                  step="0.5"
                  value={item.hours}
                  onChange={(event) => onChange(item.id, 'hours', event.target.value)}
                />
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr>
              <th className="px-3 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Appliance
              </th>
              <th className="px-3 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Qty
              </th>
              <th className="px-3 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Watts
              </th>
              <th className="px-3 text-left text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">
                Hours
              </th>
              <th aria-label="Remove row" />
            </tr>
          </thead>
          <tbody>
            {appliances.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-1">
                  <input
                    type="text"
                    value={item.appliance}
                    onChange={(event) => onChange(item.id, 'appliance', event.target.value)}
                    placeholder="Appliance name"
                  />
                </td>
                <td className="px-3 py-1">
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(event) => onChange(item.id, 'quantity', event.target.value)}
                  />
                </td>
                <td className="px-3 py-1">
                  <input
                    type="number"
                    min="0"
                    value={item.watts}
                    onChange={(event) => onChange(item.id, 'watts', event.target.value)}
                  />
                </td>
                <td className="px-3 py-1">
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={item.hours}
                    onChange={(event) => onChange(item.id, 'hours', event.target.value)}
                  />
                </td>
                <td className="px-3 py-1">
                  <button
                    className="grid h-10 w-10 place-items-center rounded-full border border-[#d7b4ab] bg-[#f9eeeb] text-lg text-[#8a3c33] transition hover:bg-[#f5e2de]"
                    data-motion="pill"
                    type="button"
                    onClick={() => onRemoveRow(item.id)}
                    aria-label={`Remove ${item.appliance || 'appliance'} row`}
                  >
                    x
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex flex-col gap-2 rounded-[1.5rem] border border-[rgba(200,154,75,0.22)] bg-[linear-gradient(135deg,rgba(200,154,75,0.1),rgba(255,255,255,0.7))] px-4 py-4 shadow-[0_18px_36px_rgba(37,27,17,0.06)] sm:flex-row sm:items-center sm:justify-between">
        <span className="text-sm text-[var(--color-muted)]">Total connected load</span>
        <strong className="text-lg font-semibold text-[var(--color-ink)]">{totalDailyLoad.toFixed(2)} kWh/day</strong>
      </div>
    </div>
  )
}

export default memo(ApplianceTable)
