import React, { useState } from 'react'

export default function Disclaimer({ hasSelection }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position:       'fixed',
          bottom:         '12px',
          right:      hasSelection ? 'calc(var(--sidebar-w) + 12px)' : '12px',
          transition: 'right 0.25s cubic-bezier(0.4, 0, 0.2, 1), color 0.15s, border-color 0.15s',
        //   left:           '50%',
        //   transform:      'translateX(-50%)',
          zIndex:         300,
          background:     'var(--surface)',
          border:         '1px solid var(--border2)',
          borderRadius:   '20px',
          color:          'var(--text2)',
          fontSize:       '12.5px',
          fontWeight:     500,
          padding:        '7px 18px',
          cursor:         'pointer',
          backdropFilter: 'blur(8px)',
          letterSpacing:  '0.02em',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--text)'; e.currentTarget.style.borderColor = 'var(--accent)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text3)'; e.currentTarget.style.borderColor = 'var(--border2)' }}
      >
        ⚠ Disclaimer
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position:        'fixed',
            inset:           0,
            zIndex:          500,
            background:      'rgba(0,0,0,0.55)',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            backdropFilter:  'blur(4px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background:   'var(--surface)',
              border:       '1px solid var(--border2)',
              borderRadius: '14px',
              padding:      '32px 36px',
              maxWidth:     '520px',
              width:        '90%',
              position:     'relative',
            }}
          >
            <button
              onClick={() => setOpen(false)}
              style={{
                position:   'absolute',
                top:        '14px',
                right:      '14px',
                background: 'none',
                border:     'none',
                color:      'var(--text3)',
                fontSize:   '18px',
                cursor:     'pointer',
                lineHeight: 1,
              }}
            >✕</button>

            <div style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>
              Disclaimer
            </div>

            <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '16px', lineHeight: 1.3 }}>
              Data Sources & Accuracy
            </div>

            <div style={{ fontSize: '13.5px', color: 'var(--text2)', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p>
                All project data presented in this tool is sourced exclusively from publicly available information, including publications by the European Commission, CINEA, and official press releases and announcements of the company.
              </p>
              <p>
                The data has been compiled, evaluated, and assessed by <strong style={{ color: 'var(--text)' }}>Carbon Management Europe</strong> to the best of our ability. While every effort has been made to ensure accuracy and completeness, the information may contain errors, omissions, or outdated figures.
              </p>
              <p>
                Project metrics such as CO₂ capture capacity, investment figures, and operational timelines are based on reported estimates and are subject to change. This tool is intended for informational and analytical purposes only.
              </p>
              <p>
                In case of any discrepancies or questions regarding the data, please contact us at <a href="mailto:salman.muhammad@cmeurope.org" style={{ color: 'var(--accent2)' }}>salman.muhammad@cmeurope.org</a>.
              </p>
              <p>
                The <strong style={{ color: 'var(--text)' }}>sector classification</strong> used in this tool refers to the <strong style={{ color: 'var(--text)' }}>industrial origin of the CO₂</strong> (i.e., the sector from which CO₂ is captured or sourced), rather than the final product or application.
              </p>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)', fontSize: '11px', color: 'var(--text3)' }}>
              Last reviewed April 2026 · Carbon Management Europe
            </div>
          </div>
        </div>
      )}
    </>
  )
}