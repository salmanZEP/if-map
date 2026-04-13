import React from 'react'
import { getStatusColor, getCategoryColor, formatEuro, formatCO2, CALL_COLORS } from '../constants.js'
import styles from './ProjectSidebar.module.css'

function Badge({ children, color }) {
  return (
    <span className={styles.badge} style={{ background: color + '22', color, borderColor: color + '55' }}>
      {children}
    </span>
  )
}

function MetricCard({ label, value, sub, color }) {
  return (
    <div className={styles.metricCard} style={{ borderColor: (color || '#3b82f6') + '33' }}>
      <div className={styles.metricValue} style={{ color: color || 'var(--accent2)' }}>{value}</div>
      <div className={styles.metricLabel}>{label}</div>
      {sub && <div className={styles.metricSub}>{sub}</div>}
    </div>
  )
}

export default function ProjectSidebar({ project, onClose }) {
  if (!project) return null

  const statusColor = getStatusColor(project.Status)
  const categoryColor = getCategoryColor(project.Category)
  const callColor = CALL_COLORS[project.Call] || '#6b7280'

  const co2Capture = parseFloat(project['CO₂ Capture (Mt/yr)'])
  const co2Avoid   = parseFloat(project['CO₂ Avoid (Mt/yr)'])
  const co2Seq     = parseFloat(project['CO₂ Seq (Mt/yr)'])
  const co2Util    = parseFloat(project['CO₂ Util (Mt/yr)'])
  const co2TotCap  = parseFloat(project['CO₂ Capture Total (Mt)'])

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div className={styles.badges}>
            <div className={styles.badgeGroup}>
              <span className={styles.badgeLabel}>Status</span>
              <Badge color={statusColor}>{project.Status || 'Unknown'}</Badge>
            </div>
            {project.Scale && (
              <div className={styles.badgeGroup}>
                <span className={styles.badgeLabel}>Scale</span>
                <Badge color="#6b7280">{project.Scale}</Badge>
              </div>
            )}
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <h2 className={styles.projectName}>{project.Project}</h2>
        {project.Address && (
          <div className={styles.address}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1a3.5 3.5 0 100 7A3.5 3.5 0 006 1z" stroke="currentColor" strokeWidth="1" fill="none"/>
              <path d="M6 8v3M4 11h4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            {project.Address}
          </div>
        )}
      </div>

      <div className={styles.body}>
        {/* Key metrics */}
        <div className={styles.metricsGrid}>
          {/* Annual metrics */}
          {!isNaN(parseFloat(project['CO₂ Capture (Mt/yr)'])) && parseFloat(project['CO₂ Capture (Mt/yr)']) > 0 &&
            <MetricCard label="CO₂ Capture" value={parseFloat(project['CO₂ Capture (Mt/yr)']).toFixed(2)} sub="Mt/yr annual" color="#3b82f6"/>}
          {!isNaN(parseFloat(project['CO₂ Avoid (Mt/yr)'])) && parseFloat(project['CO₂ Avoid (Mt/yr)']) > 0 &&
            <MetricCard label="CO₂ Avoided" value={parseFloat(project['CO₂ Avoid (Mt/yr)']).toFixed(2)} sub="Mt/yr annual" color="#10b981"/>}
          {!isNaN(parseFloat(project['CO₂ Seq (Mt/yr)'])) && parseFloat(project['CO₂ Seq (Mt/yr)']) > 0 &&
            <MetricCard label="CO₂ Stored" value={parseFloat(project['CO₂ Seq (Mt/yr)']).toFixed(2)} sub="Mt/yr annual" color="#6366f1"/>}
          {!isNaN(parseFloat(project['CO₂ Util (Mt/yr)'])) && parseFloat(project['CO₂ Util (Mt/yr)']) > 0 &&
            <MetricCard label="CO₂ Utilised" value={parseFloat(project['CO₂ Util (Mt/yr)']).toFixed(2)} sub="Mt/yr annual" color="#14b8a6"/>}

          {/* Totals */}
          {!isNaN(parseFloat(project['CO₂ Avoid Total (Mt)'])) && parseFloat(project['CO₂ Avoid Total (Mt)']) > 0 &&
            <MetricCard label="Total CO₂ Avoided" value={parseFloat(project['CO₂ Avoid Total (Mt)']).toFixed(1)} sub="Mt" color="#10b981"/>}
          {!isNaN(parseFloat(project['CO₂ Capture Total (Mt)'])) && parseFloat(project['CO₂ Capture Total (Mt)']) > 0 &&
            <MetricCard label="Total CO₂ Capture" value={parseFloat(project['CO₂ Capture Total (Mt)']).toFixed(1)} sub="Mt" color="#3b82f6"/>}

          {/* Funding */}
          {project['Grant (€)'] &&
            <MetricCard label="EU Grant" value={formatEuro(project['Grant (€)'])} color="#f59e0b"/>}
          {project['Total Invest. (€)'] &&
            <MetricCard label="Total Investment" value={formatEuro(project['Total Invest. (€)'])} color="#f97316"/>}
        </div>

        {/* Description */}
        {project['Full Description'] && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Description</div>
            <p className={styles.description}>{project['Full Description']}</p>
          </div>
        )}

        {/* Technology */}
        {project['Technology Type'] && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Technology</div>
            <p className={styles.techText}>{project['Technology Type']}</p>
          </div>
        )}

        {/* Project details */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Project Details</div>
          <div className={styles.detailGrid}>
            {project.Call && <DetailRow label="Funding Call" value={<span style={{ color: callColor, fontWeight: 600 }}>{project.Call}</span>}/>}
            {project.Coordinator && <DetailRow label="Coordinator" value={project.Coordinator}/>}
            {project['Site Owner'] && <DetailRow label="Site Owner" value={project['Site Owner']}/>}
            {project.Country && <DetailRow label="Country" value={project.Country}/>}
            {project.Sector && <DetailRow label="Sector" value={project.Sector}/>}
            {project.Category && (
              <DetailRow label="Category" value={
                <span style={{ color: categoryColor }}>{project.Category}</span>
              }/>
            )}
            {project['Facility Type'] && <DetailRow label="Facility Type" value={project['Facility Type']}/>}
            {/* {project.Confidence && <DetailRow label="Data Confidence" value={project.Confidence}/>} */}
          </div>
        </div>

        {/* Timeline */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Timeline</div>
          <div className={styles.timeline}>
            {project['Start Date'] && <TimeNode label="Start" year={project['Start Date']}/>}
            {project['Operational Year'] && <TimeNode label="Operational" year={project['Operational Year']} highlight/>}
            {project['Evaluation End Year'] && <TimeNode label={<>End of Evaluation</>} year={project['Evaluation End Year']}/>}
          </div>
        </div>

        {/* CO2 metrics table */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>CO₂ Metrics</div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Metric</th>
                <th>Annual (Mt/yr)</th>
                <th>Total (Mt)</th>
              </tr>
            </thead>
            <tbody>
              <CO2Row label="Avoided"  ann={project['CO₂ Avoid (Mt/yr)']} tot={project['CO₂ Avoid Total (Mt)']} color="#10b981"/>
              <CO2Row label="Captured" ann={project['CO₂ Capture (Mt/yr)']} tot={project['CO₂ Capture Total (Mt)']} color="#3b82f6"/>
              <CO2Row label="Sequestered" ann={project['CO₂ Seq (Mt/yr)']} tot={project['CO₂ Seq Total (Mt)']} color="#6366f1"/>
              <CO2Row label="Utilised" ann={project['CO₂ Util (Mt/yr)']} tot={project['CO₂ Util Total (Mt)']} color="#14b8a6"/>
            </tbody>
          </table>
        </div>

        {/* Link */}
        {project.Link && (
          <div className={styles.section}>
            <a
              href={project.Link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.extLink}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M6 2H2.5A1.5 1.5 0 001 3.5v8A1.5 1.5 0 002.5 13h8A1.5 1.5 0 0012 11.5V8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                <path d="M8.5 1H13v4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M13 1L7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              View Official Project Page
            </a>
          </div>
        )}
      </div>
    </aside>
  )
}

function DetailRow({ label, value }) {
  return (
    <div className={styles.detailRow}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  )
}

function TimeNode({ label, year, highlight }) {
  return (
    <div className={`${styles.timeNode} ${highlight ? styles.timeHighlight : ''}`}>
      <div className={styles.timeYear}>{year}</div>
      <div className={styles.timeLabel}>{label}</div>
    </div>
  )
}

function CO2Row({ label, ann, tot, color }) {
  const a = parseFloat(ann)
  const t = parseFloat(tot)
  if ((isNaN(a) || a <= 0) && (isNaN(t) || t <= 0)) return null
  return (
    <tr>
      <td><span style={{ color, fontWeight: 500 }}>{label}</span></td>
      <td>{isNaN(a) || a <= 0 ? '—' : a.toFixed(2)}</td>
      <td>{isNaN(t) || t <= 0 ? '—' : t.toFixed(1)}</td>
    </tr>
  )
}
