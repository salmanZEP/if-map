import React, { useEffect, useState } from 'react'
import styles from './StatsBar.module.css'
import { formatEuro } from '../constants.js'
import { projectsToCSV, downloadCSV, getTodayDateString } from '../utils/csvExport.js'

export default function StatsBar({ projects, total, isLight, filters, onFilterChange, onToggleFilter, filterActiveCount = 0 }) {
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    fetch('./data/meta.json')
      .then(r => r.json())
      .then(setMeta)
      .catch(() => null)
  }, [])

  const totalGrant = projects.reduce((s, p) => {
    const v = parseFloat(p['Grant (€)'])
    return s + (isNaN(v) ? 0 : v)
  }, 0)
  const totalInvest = projects.reduce((s, p) => {
    const v = parseFloat(p['Total Invest. (€)'])
    return s + (isNaN(v) ? 0 : v)
  }, 0)
  const totalCO2    = projects.reduce((s, p) => {
    const v = parseFloat(p['CO₂ Capture (Mt/yr)'])
    return s + (isNaN(v) ? 0 : v)
  }, 0)
  const countries = new Set(projects.map(p => p.Country).filter(Boolean)).size

  function handleDownload() {
    const csv = projectsToCSV(projects)
    downloadCSV(csv, `IF_ICM_projects_database_CME_${getTodayDateString()}.csv`)
  }

  return (
    <header className={styles.bar}>
      <div className={styles.brand}>
        <a href="https://carbonmanagementeurope.org/" target="_blank" rel="noopener noreferrer">
          <img
            src="./Logotype_CME_FullWhite.png"
            alt="Carbon Management Europe logo"
            className={styles.logo}
          />
        </a>
        <div className={styles.divider} />
        <a
          className={styles.titleLink}
          href="."
          style={{ textDecoration: 'none' }}
          onClick={e => { e.preventDefault(); window.location.reload() }}
        >
          <div className={styles.titleWrap}>
            <div className={styles.title}>Industrial Carbon Management Projects Database</div>
          </div>
          <div className={styles.subDivider} />
          <div className={styles.subWrap}>
            <div className={styles.sub}>CCS, CCU & CDR projects supported by the Innovation&nbsp;Fund</div>
          </div>
        </a>
      </div>

      <div className={styles.stats}>
        <Stat value={projects.length} max={total} label="Projects" filtered={projects.length < total}/>
        <Stat value={countries} label="Countries"/>
        <Stat value={formatEuro(totalGrant)} label="Total Grant"/>
        <Stat value={formatEuro(totalInvest)} label="Total Investment"/>
        <Stat value={`${totalCO2.toFixed(1)} Mt/yr`} label="CO₂ Capture"/>
      </div>

      {/* Mobile-only: Google Maps style search + filter row (hidden on tablet/desktop via CSS) */}
      <div className={styles.mobileSearchRow}>
        <div className={styles.mobileSearchWrap}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <input
            className={styles.mobileSearchInput}
            type="text"
            placeholder="Search projects…"
            value={filters?.search || ''}
            onChange={e => onFilterChange({ ...filters, search: e.target.value })}
          />
        </div>
        <button className={styles.mobileFilterBtn} onClick={onToggleFilter} aria-label="Filters">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {filterActiveCount > 0 && <span className={styles.mobileFilterBadge}>{filterActiveCount}</span>}
        </button>
        <button className={styles.mobileFilterBtn} onClick={handleDownload} aria-label="Download data">
          <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
            <path d="M7 1v8M4 6l3 3 3-3M2 10.5v1.5a1 1 0 001 1h8a1 1 0 001-1v-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <button className={styles.downloadBtn} onClick={handleDownload}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v8M4 6l3 3 3-3M2 10.5v1.5a1 1 0 001 1h8a1 1 0 001-1v-1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className={styles.downloadLabel}>Download data</span>
      </button>

      <div className={styles.meta}>
        {meta
          ? `Latest update: ${meta.lastUpdatedFull}`
          : 'Loading…'
        }
      </div>
    </header>
  )
}

function Stat({ value, max, label, filtered }) {
  return (
    <div className={styles.stat}>
      <div className={`${styles.value} ${filtered ? styles.filtered : ''}`}>
        {value}
        {filtered && <span className={styles.maxOf}> / {max}</span>}
      </div>
      <div className={styles.label}>{label}</div>
    </div>
  )
}
