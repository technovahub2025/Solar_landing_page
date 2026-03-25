import { memo } from 'react'

function QuoteGenerator({
  formValues,
  errors,
  onChange,
  onSubmit,
  submissionState,
}) {
  const statusTone = {
    success: 'border-[#b8d6bc] bg-[#edf6ee] text-[#325338]',
    error: 'border-[#e8b6b0] bg-[#fbefee] text-[#8a3c33]',
    info: 'border-[#ddcfb7] bg-[#f8f1e5] text-[#5f4f39]',
  }

  return (
    <div className="anchor-target paper-panel mt-2 p-5 md:p-7" id="quote-panel">
      <div className="motion-line mb-8 grid gap-5 border-b border-black/8 pb-6 md:grid-cols-[0.75fr_1.25fr] md:items-start">
        <div>
          <span className="kicker">Proposal capture</span>
          <h3 className="mt-5 font-['Syne'] text-3xl tracking-[-0.06em] text-[var(--color-ink)]">
            Prepare a clean quote handoff
          </h3>
        </div>
        <p className="section-copy">
          Capture customer details, note roof conditions, and prepare the system data for local save plus
          PDF export. The functionality stays the same, but the presentation now fits the editorial landing page.
        </p>
      </div>

      <form className="stagger-grid grid gap-5 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" onSubmit={onSubmit} noValidate>
        <label className="block" style={{ '--stagger-delay': 80 }}>
          <span className="field-label">Full name</span>
          <input
            name="name"
            type="text"
            value={formValues.name}
            onChange={onChange}
            placeholder="Your full name"
          />
          {errors.name && <span className="mt-2 block text-sm text-[#8a3c33]">{errors.name}</span>}
        </label>

        <label className="block" style={{ '--stagger-delay': 140 }}>
          <span className="field-label">Email address</span>
          <input
            name="email"
            type="email"
            value={formValues.email}
            onChange={onChange}
            placeholder="name@example.com"
          />
          {errors.email && <span className="mt-2 block text-sm text-[#8a3c33]">{errors.email}</span>}
        </label>

        <label className="block" style={{ '--stagger-delay': 200 }}>
          <span className="field-label">Phone number</span>
          <input
            name="phone"
            type="tel"
            value={formValues.phone}
            onChange={onChange}
            placeholder="10-digit mobile number"
          />
          {errors.phone && <span className="mt-2 block text-sm text-[#8a3c33]">{errors.phone}</span>}
        </label>

        <label className="block" style={{ '--stagger-delay': 260 }}>
          <span className="field-label">Roof availability</span>
          <select name="roofAvailability" value={formValues.roofAvailability} onChange={onChange}>
            <option value="">Select roof status</option>
            <option value="Enough roof area">Enough roof area</option>
            <option value="Limited roof area">Limited roof area</option>
            <option value="Need site survey">Need site survey</option>
          </select>
          {errors.roofAvailability && (
            <span className="mt-2 block text-sm text-[#8a3c33]">{errors.roofAvailability}</span>
          )}
        </label>

        <label className="block md:col-span-2" style={{ '--stagger-delay': 320 }}>
          <span className="field-label">Notes</span>
          <textarea
            name="notes"
            rows="4"
            value={formValues.notes}
            onChange={onChange}
            placeholder="Any site, billing, operational, or backup requirements we should note?"
          />
        </label>

        <div className="flex flex-col gap-4 border-t border-black/8 pt-5 md:col-span-2 md:flex-row md:items-center md:justify-between" style={{ '--stagger-delay': 380 }}>
          <button className="primary-button w-full md:w-auto" data-motion="button" type="submit">
            Download Quote
          </button>

          {submissionState.message && (
            <p
              className={`rounded-full border px-4 py-2 text-sm ${
                statusTone[submissionState.type] || 'border-black/8 bg-white/70 text-[var(--color-ink)]'
              }`}
            >
              {submissionState.message}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default memo(QuoteGenerator)
