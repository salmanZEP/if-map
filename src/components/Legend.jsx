import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
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
    'Facility in operation under normal commercial conditions.',
  'On Hold / Cancelled':
    'Project on hold, cancelled, withdrawn, or relocated; no active progress evident.',
}

const SIZE_TIERS = [
  { label: '< 1 Mt',     size: 10 },
  { label: '1 – 5 Mt',   size: 14 },
  { label: '5 – 10 Mt',  size: 19 },
  { label: '10 – 20 Mt', size: 24 },
  { label: '> 20 Mt',    size: 30 },
]

function Co2Tooltip() {
  const [visible, setVisible] = useState(false)
  const [pos, setPos]         = useState({ top: 0, left: 0 })
  const iconRef = useRef(null)

  function handleEnter() {
    const rect = iconRef.current.getBoundingClientRect()
    setPos({
      top:  rect.top - 8,
      left: rect.left - 220,
    })
    setVisible(true)
  }

  return (
    <>
      <span
        ref={iconRef}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setVisible(false)}
        style={{
          fontSize:   '12px',
          color:      'var(--text2)',
          cursor:     'pointer',
          lineHeight: '14px',
          display:    'block',
          marginTop:  '0',
        }}
      >ⓘ</span>

      {visible && createPortal(
        <div style={{
          position:     'fixed',
          top:          pos.top,
          left:         pos.left,
          width:        '210px',
          background:   'var(--surface)',
          border:       '1px solid var(--border2)',
          borderRadius: '8px',
          padding:      '8px 10px',
          fontSize:     '12px',
          color:        'var(--text2)',
          lineHeight:   1.5,
          zIndex:       99999,
          boxShadow:    '0 4px 20px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
          transform:    'translateY(-100%)',
        }}>
          Total CO₂ avoided in Mt during the evaluation period of the EU Innovation Fund grant.
        </div>,
        document.body
      )}
    </>
  )
}

export default function Legend({ hasSelection }) {
  const [open,         setOpen]         = useState(false)
  const [activeStatus, setActiveStatus] = useState(null)
  const popupRef = useRef(null)

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
      {/* Main legend toggle */}
      <button
        className={styles.toggle}
        onClick={() => { setOpen(o => !o); setActiveStatus(null) }}
      >
        <span>Legend</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        </svg>
      </button>

      {open && (
        <div className={styles.body}>

          {/* CO2 size section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, lineHeight: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text1)', letterSpacing: '0.08em', lineHeight: '14px' }}>CO₂ Avoided (Mt)</span>
            <Co2Tooltip />
          </div>

          {SIZE_TIERS.map(({ label, size }) => (
            <div key={label} className={styles.sizeRow}>
              <div style={{
                width:        size,
                height:       size,
                minWidth:     size,
                borderRadius: '50%',
                background:   '#9ca3af',
                border:       '1px solid rgba(0,0,0,0.2)',
                flexShrink:   0,
              }}/>
              <span className={styles.sizeLabel}>{label}</span>
            </div>
          ))}

          <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0' }}/>

          {/* Status section */}
          <div className={styles.sectionLabel}>Status</div>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div
              key={status}
              className={`${styles.item} ${activeStatus === status ? styles.itemActive : ''}`}
              onClick={() => handleItemClick(status)}
              title="Click for description"
            >
              <span className={styles.dot} style={{ background: color }}/>
              <span>{status}</span>
              <span className={styles.infoIcon}>ⓘ</span>
            </div>
          ))}

        </div>
      )}

      {/* Status description popup */}
      {activeStatus && (
        <div className={styles.popup}>
          <div className={styles.popupTitle}>
            <span className={styles.popupDot} style={{ background: STATUS_COLORS[activeStatus] }}/>
            {activeStatus}
          </div>
          <p className={styles.popupDesc}>{STATUS_DESCRIPTIONS[activeStatus]}</p>
        </div>
      )}
    </div>
  )
}