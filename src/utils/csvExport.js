const CSV_COLUMNS = [
  'Scale', 'Project', 'Sector', 'Category', 'Country', 'Coordinator', 'Site Owner',
  'CO₂ Avoid (Mt/yr)', 'CO₂ Capture (Mt/yr)', 'CO₂ Seq (Mt/yr)', 'CO₂ Util (Mt/yr)',
  'CO₂ Avoid Total (Mt)', 'CO₂ Capture Total (Mt)', 'CO₂ Seq Total (Mt)', 'CO₂ Util Total (Mt)',
  'Start Date', 'Operational Year', 'Evaluation End Year', 'Call',
  'Grant (€)', 'Total Invest. (€)', 'Latitude', 'Longitude', 'Confidence',
  'Address', 'Facility Type', 'Link', 'Full Description', 'Technology Type', 'Status',
]

function escapeCsvValue(value) {
  if (value === null || value === undefined) return ''
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function projectsToCSV(projects) {
  const header = CSV_COLUMNS.map(escapeCsvValue).join(',')
  const rows = projects.map(p =>
    CSV_COLUMNS.map(col => escapeCsvValue(p[col])).join(',')
  )
  return [header, ...rows].join('\n')
}

export function downloadCSV(csvContent, filename) {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function getTodayDateString() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}