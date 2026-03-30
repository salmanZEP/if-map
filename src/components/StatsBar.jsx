import React from 'react'
import styles from './StatsBar.module.css'
import { formatEuro } from '../constants.js'

export default function StatsBar({ projects, total }) {
  const totalGrant  = projects.reduce((s, p) => s + (p['Grant (€)'] || 0), 0)
  const totalInvest = projects.reduce((s, p) => s + (p['Total Invest. (€)'] || 0), 0)
  const totalCO2    = projects.reduce((s, p) => {
    const v = parseFloat(p['CO₂ Capture (Mt/yr)'])
    return s + (isNaN(v) ? 0 : v)
  }, 0)
  const countries   = new Set(projects.map(p => p.Country).filter(Boolean)).size

  return (
    <header className={styles.bar}>
      <div className={styles.brand}>
        <span className={styles.logo}>🌍</span>
        <div>
          <div className={styles.title}>EU Innovation Fund</div>
          <div className={styles.sub}>CCS/CCU Project Intelligence</div>
        </div>
      </div>

      <div className={styles.stats}>
        <Stat
          value={projects.length}
          max={total}
          label="Projects"
          filtered={projects.length < total}
        />
        <Stat value={countries} label="Countries"/>
        <Stat value={formatEuro(totalGrant)} label="Total Grant"/>
        <Stat value={formatEuro(totalInvest)} label="Total Investment"/>
        <Stat value={`${totalCO2.toFixed(1)} Mt/yr`} label="CO₂ Capture"/>
      </div>

      <div className={styles.meta}>
        As of March 2026 · 62 projects
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
