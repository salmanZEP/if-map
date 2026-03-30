import React, { useState } from 'react'
import { getStatusColor, getCategoryColor, formatEuro } from '../constants.js'
import styles from './ProjectListPanel.module.css'

export default function ProjectListPanel({ projects, onProjectClick, selectedId }) {
  const [open, setOpen] = useState(false)
  const [sort, setSort] = useState('grant')

  const sorted = [...projects].sort((a, b) => {
    if (sort === 'grant')   return (b['Grant (€)'] || 0) - (a['Grant (€)'] || 0)
    if (sort === 'co2')     return (parseFloat(b['CO₂ Capture (Mt/yr)']) || 0) - (parseFloat(a['CO₂ Capture (Mt/yr)']) || 0)
    if (sort === 'name')    return a.Project.localeCompare(b.Project)
    if (sort === 'country') return (a.Country || '').localeCompare(b.Country || '')
    return 0
  })

  return (
    <div className={`${styles.panel} ${open ? styles.open : ''}`}>
      <button className={styles.toggle} onClick={() => setOpen(o => !o)}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="2" width="12" height="2" rx="1" fill="currentColor"/>
          <rect x="1" y="6" width="8"  height="2" rx="1" fill="currentColor"/>
          <rect x="1" y="10" width="10" height="2" rx="1" fill="currentColor"/>
        </svg>
        <span>Project List</span>
        <span className={styles.count}>{projects.length}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginLeft: 'auto' }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <>
          <div className={styles.sortBar}>
            <span className={styles.sortLabel}>Sort:</span>
            {[['grant', 'Grant'], ['co2', 'CO₂'], ['name', 'Name'], ['country', 'Country']].map(([k, l]) => (
              <button
                key={k}
                className={`${styles.sortBtn} ${sort === k ? styles.active : ''}`}
                onClick={() => setSort(k)}
              >{l}</button>
            ))}
          </div>

          <div className={styles.list}>
            {sorted.map(p => {
              const statusColor = getStatusColor(p.Status)
              const co2 = parseFloat(p['CO₂ Capture (Mt/yr)'])
              const isSelected = p.Project === selectedId

              return (
                <button
                  key={p.Project}
                  className={`${styles.item} ${isSelected ? styles.selected : ''}`}
                  onClick={() => onProjectClick(p)}
                >
                  <span className={styles.dot} style={{ background: statusColor }}/>
                  <div className={styles.itemBody}>
                    <div className={styles.itemName}>{p.Project}</div>
                    <div className={styles.itemMeta}>
                      {p.Country} · {p.Call}
                      {!isNaN(co2) && co2 > 0 && ` · ${co2.toFixed(1)} Mt/yr`}
                    </div>
                  </div>
                  <div className={styles.itemGrant}>{formatEuro(p['Grant (€)'])}</div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
