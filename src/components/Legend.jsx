import { useState, useEffect, useRef } from 'react'
import { STATUS_COLORS } from '../constants.js'
import styles from './Legend.module.css'

const STATUS_DESCRIPTIONS = {
  'Grant Preparation':
    'Grant application submitted or in preparation; no agreement signed. Project likely awaits CINEA evaluation or selection outcome.',
  'Early Development':
    'Grant agreement signed; project likely in early-award or front-end loading phase. Includes manufacturing and scale-up at early implementation.',
  'Engineering & Design':
    'Active pre-FEED engineering underway; technology selected and preliminary engineering ongoing or likely initiated. Project has not entered FEED stage.',
  'FEED & Permitting':
    'Front-End Engineering Design (FEED) formally underway and/or permitting/environmental assessment proceeding. Final Investment Decision (FID) not yet taken.',
  'Pre-FID / Advanced Development':
    'FEED completed; progressing toward FID with financing, procurement, and pre-construction activities likely ongoing.',
  'Under Construction':
    'Facility under construction or commissioning phase. Capital expenditure actively being deployed on site.',
  'Operational':
    'Facility in operation under normal commercial conditions',
  'On Hold / Cancelled':
    'Project on hold, cancelled, withdrawn, or relocated; no active progress evident.',
}

export default function Legend({ hasSelection }) {
  const [open, setOpen] = useState(false)
  const [activeStatus, setActiveStatus] = useState(null)
  const popupRef = useRef(null)

  // Close popup when clicking outside
  useEffect(() => {
    if (!activeStatus) return
    function handleOutsideClick(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setActiveStatus(null)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [activeStatus])

  function handleItemClick(status) {
    setActiveStatus(prev => (prev === status ? null : status))
  }

  return (
    <div
      className={styles.wrap}
      style={{
        right: hasSelection ? 'calc(var(--sidebar-w) + 12px)' : '12px',
        transition: 'right 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      ref={popupRef}
    >
      <button className={styles.toggle} onClick={() => { setOpen(o => !o); setActiveStatus(null) }}>
        <span>Legend</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className={styles.body}>
          <div className={styles.sectionLabel}>Status</div>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div
              key={status}
              className={`${styles.item} ${activeStatus === status ? styles.itemActive : ''}`}
              onClick={() => handleItemClick(status)}
              title="Click for description"
            >
              <span className={styles.dot} style={{ background: color }} />
              <span>{status}</span>
              <span className={styles.infoIcon}>ℹ</span>
            </div>
          ))}

          <div className={styles.sectionLabel} style={{ marginTop: 12 }}>
            Marker size = CO₂ avoided (Mt)
          </div>
        </div>
      )}

      {activeStatus && (
        <div className={styles.popup}>
          <div className={styles.popupTitle}>
            <span
              className={styles.popupDot}
              style={{ background: STATUS_COLORS[activeStatus] }}
            />
            {activeStatus}
          </div>
          <p className={styles.popupDesc}>{STATUS_DESCRIPTIONS[activeStatus]}</p>
        </div>
      )}
    </div>
  )
}
