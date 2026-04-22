import React, { useState, useEffect, useMemo } from 'react'
import MapView          from './components/MapView.jsx'
import FilterPanel      from './components/FilterPanel.jsx'
import ProjectSidebar   from './components/ProjectSidebar.jsx'
import StatsBar         from './components/StatsBar.jsx'
import Legend           from './components/Legend.jsx'
import Disclaimer       from './components/Disclaimer.jsx'
import ProjectListPanel from './components/ProjectListPanel.jsx'

const DEFAULT_FILTERS = {
  countries:   [],
  statuses:    [],
  scales:      [],
  calls:       [],
  sectors:     [],
  categories:  [],
  grantMax:    400,
  co2Min:      0,
  search:      '',
}

export default function App() {
  const [allProjects, setAllProjects]     = useState([])
  const [filters, setFilters]             = useState(DEFAULT_FILTERS)
  const [selectedProject, setSelectedProject] = useState(null)
  const [filterOpen, setFilterOpen]       = useState(false)
  const [loading, setLoading]             = useState(true)

  // Load data
  useEffect(() => {
    fetch('./data/projects.json')
      .then(r => r.json())
      .then(data => {
        setAllProjects(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load project data:', err)
        setLoading(false)
      })
  }, [])

  // Filter logic
  const filteredProjects = useMemo(() => {
    return allProjects.filter(p => {
      const { countries, statuses, scales, calls, sectors, categories, grantMax, co2Min, search } = filters

      if (countries.length   && !countries.includes(p.Country))                          return false
      if (statuses.length    && !statuses.includes(p.Status))                             return false
      if (scales.length      && !scales.includes((p.Scale || '').toLowerCase().trim()))   return false
      if (calls.length       && !calls.includes(p.Call))                                  return false
      if (sectors.length     && !sectors.includes(p.Sector))                              return false
      if (categories.length  && !categories.includes(p.Category))                         return false

      if (grantMax < 400 && p['Grant (€)']) {
        if ((p['Grant (€)'] / 1e6) > grantMax) return false
      }

      if (co2Min > 0) {
        const co2 = parseFloat(p['CO₂ Capture (Mt/yr)'])
        if (isNaN(co2) || co2 < co2Min) return false
      }

      if (search) {
        const q = search.toLowerCase()
        const searchable = [
          p.Project, p.Coordinator, p['Site Owner'],
          p.Country, p.Category, p.Sector, p.Status,
          p['Short Description'], p['Technology Type'],
        ].filter(Boolean).join(' ').toLowerCase()
        if (!searchable.includes(q)) return false
      }

      return true
    })
  }, [allProjects, filters])

  // Close sidebar when filter changes remove the selected project
  useEffect(() => {
    if (selectedProject && !filteredProjects.find(p => p.Project === selectedProject.Project)) {
      setSelectedProject(null)
    }
  }, [filteredProjects, selectedProject])

  const handleProjectClick = (project) => {
    setSelectedProject(prev => prev?.Project === project.Project ? null : project)
  }

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', flexDirection: 'column', gap: 16,
        background: 'var(--bg)', color: 'var(--text2)',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          border: '4px solid var(--surface2)',
          borderTopColor: 'var(--accent, #3b82f6)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{ fontSize: 14 }}>Loading project data…</div>
      </div>
    )
  }

  return (
    <>
      <StatsBar projects={filteredProjects} total={allProjects.length} />

      <MapView
        projects={filteredProjects}
        onProjectClick={handleProjectClick}
        selectedId={selectedProject?.Project}
      />

      <FilterPanel
        projects={allProjects}
        filters={filters}
        onFilterChange={setFilters}
        isOpen={filterOpen}
        onToggle={() => setFilterOpen(o => !o)}
      />

      {selectedProject && (
        <ProjectSidebar
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <ProjectListPanel
        projects={filteredProjects}
        onProjectClick={handleProjectClick}
        selectedId={selectedProject?.Project}
        filterOpen={filterOpen}
      />

      <Legend hasSelection={!!selectedProject} />
      <Disclaimer hasSelection={!!selectedProject} />
    </>
  )
}
