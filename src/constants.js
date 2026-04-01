export const STATUS_COLORS = {
  'Operational':             '#10b981',
  'Operational / Scaling':   '#10b981',
  'Operational / Pilot':     '#34d399',
  'Under Construction':      '#f59e0b',
  'FEED / Engineering':      '#60a5fa',
  'Development / Design':    '#818cf8',
  'Grant Prep (IF24)':       '#a78bfa',
  'FID Pending / On Hold':   '#f97316',
  'On Hold / Paused':        '#ef4444',
}

export const CATEGORY_COLORS = {
  'CCS':                              '#3b82f6',
  'CO2 T&S':                          '#6366f1',
  'CCU':                              '#14b8a6',
  'CCU (mineralisation)':             '#10b981',
  'CCU (SAF)':                        '#8b5cf6',
  'CCU (bio-methanol)':               '#a78bfa',
  'BioCCU (methanol)':                '#c084fc',
  'Low-carbon hydrogen production':   '#f59e0b',
  'Power-to-X (e-fuels / hydrogen)':  '#f97316',
  'Maritime CO2 capture':             '#22d3ee',
}

export const CALL_COLORS = {
  'IF20': '#3b82f6',
  'IF21': '#8b5cf6',
  'IF22': '#10b981',
  'IF23': '#f59e0b',
  'IF24': '#ef4444',
}

export const SCALE_ICONS = {
  'large-scale':  '◆',
  'medium-scale': '●',
  'small-scale':  '▲',
  'pilots':       '■',
  'other':        '◉',
}

export function getStatusColor(status) {
  return STATUS_COLORS[status] || '#6b7280'
}

export function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || '#6b7280'
}

export function formatEuro(v) {
  if (!v) return '—'
  if (typeof v === 'string' && isNaN(parseFloat(v))) return v
  const n = parseFloat(v)
  if (isNaN(n)) return '—'
  if (n >= 1e9) return `€${(n/1e9).toFixed(2)}B`
  if (n >= 1e6) return `€${(n/1e6).toFixed(1)}M`
  return `€${(n/1e3).toFixed(0)}K`
}

export function formatCO2(v) {
  if (v === null || v === undefined || v === '-') return '—'
  const n = parseFloat(v)
  if (isNaN(n)) return '—'
  return `${n.toFixed(2)} Mt/yr`
}

export function markerSize(project) {
  const cap = parseFloat(project['CO₂ Capture (Mt/yr)'])
  if (!isNaN(cap) && cap > 0) {
    return Math.max(8, Math.min(28, 8 + cap * 10))
  }
  return 10
}
