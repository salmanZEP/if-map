import React, { useState } from 'react'
import { STATUS_COLORS } from '../constants.js'
import styles from './Legend.module.css'

export default function Legend() {
  const [open, setOpen] = useState(true)

  return (
    <div className={styles.wrap}>
      <button className={styles.toggle} onClick={() => setOpen(o => !o)}>
        <span>Legend</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div className={styles.body}>
          <div className={styles.sectionLabel}>Status</div>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className={styles.item}>
              <span className={styles.dot} style={{ background: color }}/>
              <span>{status}</span>
            </div>
          ))}

          <div className={styles.sectionLabel} style={{ marginTop: 10 }}>Marker size</div>
          <div className={styles.sizeDemo}>
            <span className={styles.sizeCircle} style={{ width: 8, height: 8 }}/>
            <span className={styles.hint}>small CO₂</span>
            <span className={styles.sizeCircle} style={{ width: 18, height: 18 }}/>
            <span className={styles.hint}>large CO₂</span>
          </div>
        </div>
      )}
    </div>
  )
}
