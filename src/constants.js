export const STATUS_COLORS = {
  'Operational':                    '#10b981',
  'Under Construction':             '#f59e0b',
  'FEED & Permitting':              '#2065d5',
  'Pre-FID / Advanced Development': '#818cf8',
  'Engineering & Design':           '#14b8a6',
  'Early Development':              '#c084fc',
  'Grant Preparation':              '#deafe5',
  'On Hold / Cancelled':            '#ef4444',
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
  'IF20': '#9ca1ff',
  'IF21': '#9ca1ff',
  'IF22': '#9ca1ff',
  'IF23': '#9ca1ff',
  'IF24': '#9ca1ff',
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
  // Primary: CO₂ Avoid Total (Mt)
  let val = parseFloat(project['CO₂ Avoid Total (Mt)'])

  // Fallback 1: CO₂ Capture Total (Mt)
  if (isNaN(val) || val <= 0) val = parseFloat(project['CO₂ Capture Total (Mt)'])

  // Fallback 2: CO₂ Seq Total (Mt)
  if (isNaN(val) || val <= 0) val = parseFloat(project['CO₂ Seq Total (Mt)'])

  // No data at all
  if (isNaN(val) || val <= 0) return 10

  // Square root scale — good visual spread, not too extreme
  // ~0.2 Mt → 10px, ~1 Mt → 14px, ~5 Mt → 20px, ~14 Mt → 26px, ~50 Mt → 34px
  const size = 7 + Math.sqrt(val) * 4.5
  return Math.round(Math.min(36, Math.max(10, size)))
}
