import React, { useEffect, useState } from 'react'
import styles from './StatsBar.module.css'
import { formatEuro } from '../constants.js'

export default function StatsBar({ projects, total }) {
  const [meta, setMeta] = useState(null)

  useEffect(() => {
    fetch('./data/meta.json')
      .then(r => r.json())
      .then(setMeta)
      .catch(() => null)
  }, [])

  const totalGrant  = projects.reduce((s, p) => s + (p['Grant (€)'] || 0), 0)
  const totalInvest = projects.reduce((s, p) => s + (p['Total Invest. (€)'] || 0), 0)
  const totalCO2    = projects.reduce((s, p) => {
    const v = parseFloat(p['CO₂ Capture (Mt/yr)'])
    return s + (isNaN(v) ? 0 : v)
  }, 0)
  const countries = new Set(projects.map(p => p.Country).filter(Boolean)).size

  return (
    <header className={styles.bar}>
      <div className={styles.brand}>
        <img src="./Logotype_VerticalBaseline_FullWhite.png" alt="ZEP logo" className={styles.logo} />
        <div className={styles.divider} />
        <div>
          <div className={styles.title}>EU Innovation Fund Projects</div>
          <div className={styles.sub}>CCS/CCU Project Databse</div>
        </div>
      </div>

      <div className={styles.stats}>
        <Stat value={projects.length} max={total} label="Projects" filtered={projects.length < total}/>
        <Stat value={countries} label="Countries"/>
        <Stat value={formatEuro(totalGrant)} label="Total Grant"/>
        <Stat value={formatEuro(totalInvest)} label="Total Investment"/>
        <Stat value={`${totalCO2.toFixed(1)} Mt/yr`} label="CO₂ Capture"/>
      </div>

      <div className={styles.meta}>
        {meta
          ? `Last updated ${meta.lastUpdatedFull}`
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