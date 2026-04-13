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
  const countries = [...new Set(projects.map(p => p.Country).filter(Boolean))].sort()
  const sectors   = [...new Set(projects.map(p => p.Sector).filter(Boolean))].sort()
  const categories = [...new Set(projects.map(p => p.Category).filter(Boolean))].sort()

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
    (filters.countries?.length || 0) +
    (filters.statuses?.length || 0) +
    (filters.scales?.length || 0) +
    (filters.calls?.length || 0) +
    (filters.sectors?.length || 0) +
    (filters.categories?.length || 0) +
    (filters.search ? 1 : 0)
  )

  return (
    <>
      <button className={styles.toggleBtn} onClick={onToggle}>
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
          <label className={styles.sectionLabel}>Search</label>
          <div className={styles.searchWrap}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Project name, company…"
              value={filters.search || ''}
              onChange={e => onFilterChange({ ...filters, search: e.target.value })}
            />
          </div>
        </div>

        {/* Funding Call */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>Funding Call</label>
          <div className={styles.pillGroup}>
            {CALLS.map(c => (
              <button
                key={c}
                className={`${styles.pill} ${(filters.calls || []).includes(c) ? styles.active : ''}`}
                style={(filters.calls || []).includes(c) ? { background: CALL_COLORS[c], borderColor: CALL_COLORS[c] } : {}}
                onClick={() => toggle('calls', c)}
              >{c}</button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>Status</label>
          <div className={styles.statusList}>
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
        </div>

        {/* Country */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>Country</label>
          <div className={styles.checkGrid}>
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
          </div>
        </div>

        {/* Scale */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>Scale</label>
          <div className={styles.pillGroup}>
            {SCALES.map(s => (
              <button
                key={s}
                className={`${styles.pill} ${(filters.scales || []).includes(s) ? styles.active : ''}`}
                onClick={() => toggle('scales', s)}
              >{s}</button>
            ))}
          </div>
        </div>

        {/* Sector */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>Sector</label>
          <div className={styles.checkGrid}>
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
          </div>
        </div>

        {/* Category */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>Category</label>
          <div className={styles.checkGrid}>
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
          </div>
        </div>

        {/* Grant Range */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>
            Grant size — up to {filters.grantMax >= 400 ? 'any' : `€${filters.grantMax}M`}
          </label>
          <input
            type="range"
            min={0} max={400} step={10}
            value={filters.grantMax ?? 400}
            onChange={e => setRange('grantMax', +e.target.value)}
            className={styles.slider}
          />
          <div className={styles.rangeLabels}><span>€0</span><span>€400M+</span></div>
        </div>

        {/* CO2 Range */}
        <div className={styles.section}>
          <label className={styles.sectionLabel}>
            CO₂ capture — min {filters.co2Min || 0} Mt/yr
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
      </aside>
    </>
  )
}
