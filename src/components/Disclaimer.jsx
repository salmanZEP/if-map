import React from 'react'
import styles from './Disclaimer.module.css'

export default function Disclaimer({ hasSelection, open, onOpenChange }) {
  return (
    <>
      {/* Trigger button (hidden on mobile — triggered from the map tools drawer there instead) */}
      <button
        onClick={() => onOpenChange(true)}
        className={`${styles.trigger} ${hasSelection ? styles.shifted : ''}`}
      >
        <span className={styles.icon}>⚠</span>
        <span className={styles.label}>⚠ Disclaimer</span>
      </button>

      {/* Modal overlay */}
      {open && (
        <div className={styles.overlay} onClick={() => onOpenChange(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => onOpenChange(false)}>✕</button>

            <div className={styles.heading}>Data Sources & Accuracy</div>

            <div className={styles.body}>
              <p>
                All project data presented in this tool is sourced exclusively from publicly available information, including publications by the European Commission, CINEA, and official press releases and announcements of the company.
              </p>
              <p>
                The data has been compiled, evaluated, and assessed by Carbon Management Europe to the best of our ability. While every effort has been made to ensure accuracy and completeness, the information may contain errors, omissions, or outdated figures.
              </p>
              <p>
                Project metrics such as CO₂ capture capacity, investment figures, and operational timelines are based on reported estimates and are subject to change. This tool is intended for informational and analytical purposes only.
              </p>
              <p>
                The sector classification used in this tool refers to the industrial origin of the CO₂ (i.e., the sector from which CO₂ is captured or sourced), rather than the final product or application.
              </p>
              <p>
                In case of any discrepancies or questions regarding the data, please contact us at <a href="mailto:salman.muhammad@cmeurope.org">salman.muhammad@cmeurope.org</a>.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
