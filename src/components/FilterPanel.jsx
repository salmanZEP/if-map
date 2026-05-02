import React, { useState } from 'react'
import { CALL_COLORS, STATUS_COLORS, getStatusColor } from '../constants.js'
import styles from './FilterPanel.module.css'

const STATUSES = [
  'Operational',
  'Under Construction',
  'FEED & Permitting',
  'Pre-FID / Advanced Development',
  'Engineering & Design',
  'Early Development',
  'Grant Preparation',
  'On Hold / Cancelled',
]

const SCALES = ['large-scale', 'medium-scale', 'small-scale', 'pilots', 'other']
const CALLS = ['IF20', 'IF21', 'IF22', 'IF23', 'IF24']

export default function FilterPanel({ projects, filters, onFilterChange, isOpen, onToggle }) {
  const countries  = [...new Set(projects.map(p => p.Country).filter(Boolean))].sort()
  const sectors    = [...new Set(projects.map(p => p.Sector).filter(Boolean))].sort()
  const categories = [...new Set(
    projects.flatMap(p =>
      (p.Category || '').split('&').map(c => c.trim()).filter(Boolean)
    )
  )].sort()

  const [sectorOpen,   setSectorOpen]   = useState(false)
  const [countryOpen,  setCountryOpen]  = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [quickFilters, setQuickFilters] = useState([])
  const [statusOpen, setStatusOpen] = useState(false)
  const [grantOpen, setGrantOpen] = useState(false)
  const [co2Open,   setCo2Open]   = useState(false)
  const [callOpen,   setCallOpen]   = useState(false)

  const toggle = (key, value) => {
    const current = filters[key] || []
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onFilterChange({ ...filters, [key]: next })
  }

  const setRange = (key, value) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const clearAll = () => onFilterChange({
    countries: [], statuses: [], scales: [], calls: [],
    sectors: [], categories: [],
    grantMin: 0, grantMax: 400,
    co2Min: 0, co2Max: 10,
    search: '',
  })

  const activeCount = (
    (filters.countries?.length  || 0) +
    (filters.statuses?.length   || 0) +
    (filters.scales?.length     || 0) +
    (filters.calls?.length      || 0) +
    (filters.sectors?.length    || 0) +
    (filters.categories?.length || 0) +
    (filters.search ? 1 : 0)
  )

  function CollapseSection({ label, filterKey, open, setOpen, children }) {
    const count = (filters[filterKey] || []).length
    return (
      <div className={styles.section}>
        <button className={styles.collapseHeader} onClick={() => setOpen(o => !o)}>
          <label className={styles.sectionLabel} style={{ pointerEvents: 'none', marginBottom: 0 }}>
            {label}
            {count > 0 && <span className={styles.badge} style={{ marginLeft: 8 }}>{count}</span>}
          </label>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
            style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          </svg>
        </button>
        {open && <div className={styles.checkGrid} style={{ marginTop: 10 }}>{children}</div>}
      </div>
    )
  }

  return (
    <>
      <button
        className={styles.toggleBtn}
        onClick={onToggle}
        style={{
          left: isOpen ? 'calc(var(--filter-w) + 16px)' : '16px',
          transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        Filters
        {activeCount > 0 && <span className={styles.badge}>{activeCount}</span>}
      </button>

      <aside className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <span className={styles.title}>Filters</span>
          {activeCount > 0 && (
            <button className={styles.clearBtn} onClick={clearAll}>Clear all ({activeCount})</button>
          )}
        </div>

        {/* Search */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>Search by any keyword</label>
          <div className={styles.searchWrap}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Project name, company, sector…"
              value={filters.search || ''}
              onChange={e => onFilterChange({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        {/* Quick filters */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>Quick Filter</label>
          <div className={styles.pillGroup}>
            {[
              { label: 'CCS', color: '#3b82f6', tooltip: 'Carbon Capture & Storage projects' },
              { label: 'CCU', color: '#14b8a6', tooltip: 'Carbon Capture & Utilisation projects' },
              { label: 'CDR', color: '#10b981', tooltip: 'Carbon Dioxide Removal projects' },
            ].map(({ label, color, tooltip }) => {
              const active = quickFilters.includes(label)
              return (
                <button
                  key={label}
                  title={tooltip}
                  className={`${styles.pill} ${active ? styles.active : ''}`}
                  style={active ? { background: color, borderColor: color, color: '#fff' } : { borderColor: color, color: color }}
                  onClick={() => {
                    const next = active
                      ? quickFilters.filter(q => q !== label)
                      : [...quickFilters, label]
                    setQuickFilters(next)
                    onFilterChange({ ...filters, quickFilters: next })
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Country — collapsible */}
        <CollapseSection label="Country" filterKey="countries" open={countryOpen} setOpen={setCountryOpen}>
          {countries.map(c => (
            <label key={c} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={(filters.countries || []).includes(c)}
                onChange={() => toggle('countries', c)}
              />
              <span>{c}</span>
            </label>
          ))}
        </CollapseSection>

        {/* Sector — collapsible */}
        <CollapseSection label="Sector" filterKey="sectors" open={sectorOpen} setOpen={setSectorOpen}>
          {sectors.map(s => (
            <label key={s} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={(filters.sectors || []).includes(s)}
                onChange={() => toggle('sectors', s)}
              />
              <span>{s}</span>
            </label>
          ))}
        </CollapseSection>

        {/* Category — collapsible */}
        <CollapseSection label="Category" filterKey="categories" open={categoryOpen} setOpen={setCategoryOpen}>
          {categories.map(c => (
            <label key={c} className={styles.checkItem}>
              <input
                type="checkbox"
                checked={(filters.categories || []).includes(c)}
                onChange={() => toggle('categories', c)}
              />
              <span>{c}</span>
            </label>
          ))}
        </CollapseSection>

        {/* Status — collapsible */}
        <div className={styles.section}>
          <button className={styles.collapseHeader} onClick={() => setStatusOpen(o => !o)}>
            <label className={styles.sectionLabel} style={{ pointerEvents: 'none', marginBottom: 0 }}>
              Status
              {(filters.statuses || []).length > 0 &&
                <span className={styles.badge} style={{ marginLeft: 8 }}>{filters.statuses.length}</span>
              }
            </label>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
              style={{ transform: statusOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
          {statusOpen && (
            <div className={styles.statusList} style={{ marginTop: 10 }}>
              {STATUSES.map(s => {
                const active = (filters.statuses || []).includes(s)
                const color = getStatusColor(s)
                return (
                  <button
                    key={s}
                    className={`${styles.statusItem} ${active ? styles.active : ''}`}
                    onClick={() => toggle('statuses', s)}
                  >
                    <span className={styles.dot} style={{ background: color, boxShadow: active ? `0 0 6px ${color}` : 'none' }}/>
                    <span>{s}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Grant Range — collapsible */}
        <div className={styles.section}>
          <button className={styles.collapseHeader} onClick={() => setGrantOpen(o => !o)}>
            <label className={styles.sectionLabel} style={{ pointerEvents: 'none', marginBottom: 0 }}>
              Grant Size
            </label>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
              style={{ transform: grantOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
          {grantOpen && (
            <div style={{ marginTop: 10 }}>
              <div className={styles.sectionLabel} style={{ marginBottom: 8 }}>
                {filters.grantMin > 0 || filters.grantMax < 400
                  ? `€${filters.grantMin}M — €${filters.grantMax}M`
                  : 'Any range'
                }
              </div>
              <div className={styles.dualSlider}>
                <input
                  type="range"
                  min={0} max={400} step={10}
                  value={filters.grantMin ?? 0}
                  onChange={e => {
                    const val = +e.target.value
                    if (val < (filters.grantMax ?? 400))
                      onFilterChange({ ...filters, grantMin: val })
                  }}
                  className={styles.rangeMin}
                />
                <input
                  type="range"
                  min={0} max={400} step={10}
                  value={filters.grantMax ?? 400}
                  onChange={e => {
                    const val = +e.target.value
                    if (val > (filters.grantMin ?? 0))
                      onFilterChange({ ...filters, grantMax: val })
                  }}
                  className={styles.rangeMax}
                />
              </div>
              <div className={styles.rangeLabels}><span>€0</span><span>€400M+</span></div>
            </div>
          )}
        </div>

        {/* CO2 Range — collapsible */}
        <div className={styles.section}>
          <button className={styles.collapseHeader} onClick={() => setCo2Open(o => !o)}>
            <label className={styles.sectionLabel} style={{ pointerEvents: 'none', marginBottom: 0 }}>
              CO₂ Capture
              {filters.co2Min > 0 &&
                <span className={styles.badge} style={{ marginLeft: 8 }}>min {filters.co2Min} Mt/yr</span>
              }
            </label>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
              style={{ transform: co2Open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
          {co2Open && (
            <div style={{ marginTop: 10 }}>
              <label className={styles.sectionLabel}>
                Min {filters.co2Min || 0} Mt/yr
              </label>
              <input
                type="range"
                min={0} max={5} step={0.1}
                value={filters.co2Min ?? 0}
                onChange={e => setRange('co2Min', +e.target.value)}
                className={styles.slider}
              />
              <div className={styles.rangeLabels}><span>0</span><span>5 Mt/yr</span></div>
            </div>
          )}
        </div>

        {/* Funding Call — collapsible */}
        <div className={styles.section}>
          <button className={styles.collapseHeader} onClick={() => setCallOpen(o => !o)}>
            <label className={styles.sectionLabel} style={{ pointerEvents: 'none', marginBottom: 0 }}>
              Funding Call
              {(filters.calls || []).length > 0 &&
                <span className={styles.badge} style={{ marginLeft: 8 }}>{filters.calls.length}</span>
              }
            </label>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
              style={{ transform: callOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
          </button>
          {callOpen && (
            <div className={styles.pillGroup} style={{ marginTop: 10 }}>
              {CALLS.map(c => (
                <button
                  key={c}
                  className={`${styles.pill} ${(filters.calls || []).includes(c) ? styles.active : ''}`}
                  style={(filters.calls || []).includes(c) ? { background: CALL_COLORS[c], borderColor: CALL_COLORS[c] } : {}}
                  onClick={() => toggle('calls', c)}
                >{c}</button>
              ))}
            </div>
          )}
        </div>

      </aside>
    </>
  )
}