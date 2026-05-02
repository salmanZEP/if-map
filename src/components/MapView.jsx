import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { getStatusColor, markerSize } from '../constants.js'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || ''

const STYLES = {
  dark:      'mapbox://styles/mapbox/dark-v11',
  light:     'mapbox://styles/mapbox/light-v11',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
}

export default function MapView({ projects, onProjectClick, selectedId }) {
  const containerRef  = useRef(null)
  const mapRef        = useRef(null)
  const markersRef    = useRef([])
  const onClickRef    = useRef(onProjectClick)
  const selectedIdRef = useRef(selectedId)
  const [activeStyle, setActiveStyle] = useState('dark')
  // const [activeStyle, setActiveStyle] = useState('light')

  useEffect(() => { onClickRef.current = onProjectClick }, [onProjectClick])

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: STYLES.dark,
      // style: STYLES.light,
      center: [9.5, 52],
      zoom: 3.2,
      minZoom: 2,
      maxZoom: 18,
      projection: 'mercator',
      attributionControl: false,
    })
    map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right')
    map.addControl(new mapboxgl.ScaleControl(), 'bottom-left')
    mapRef.current = map

    return () => {
      markersRef.current.forEach(({ marker, popup }) => { popup.remove(); marker.remove() })
      markersRef.current = []
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Switch style when toggle changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    map.setStyle(STYLES[activeStyle])
    // Markers are removed by style change, rebuild after new style loads
    map.once('styledata', () => buildMarkers(map))
  }, [activeStyle]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    if (map.isStyleLoaded()) buildMarkers(map)
    else map.once('load', () => buildMarkers(map))
  }, [projects]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    selectedIdRef.current = selectedId
    markersRef.current.forEach(({ el, project, size, color }) => {
      setMarkerStyle(el, size, color, project.Project === selectedId)
    })
  }, [selectedId])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selectedId) return
    const p = projects.find(p => p.Project === selectedId)
    if (!p?.Latitude || !p?.Longitude) return
    map.flyTo({
      center: [parseFloat(p.Longitude), parseFloat(p.Latitude)],
      zoom: Math.max(map.getZoom(), 7),
      duration: 1000,
      essential: true,
    })
  }, [selectedId]) // eslint-disable-line react-hooks/exhaustive-deps

  function buildMarkers(map) {
    markersRef.current.forEach(({ marker, popup }) => { popup.remove(); marker.remove() })
    markersRef.current = []

    projects.forEach(project => {
      if (!project.Latitude || !project.Longitude) return
      const lat = parseFloat(project.Latitude)
      const lng = parseFloat(project.Longitude)
      if (isNaN(lat) || isNaN(lng)) return

      const color = getStatusColor(project.Status)
      const size  = markerSize(project)

      const el = document.createElement('div')
      el.style.borderRadius = '50%'
      el.style.cursor = 'pointer'
      setMarkerStyle(el, size, color, selectedIdRef.current === project.Project)

      const co2   = parseFloat(project['CO₂ Capture (Mt/yr)'])
      const grant = project['Grant (€)']
      const popup = new mapboxgl.Popup({
        offset: size / 2 + 6,
        closeButton: false,
        closeOnClick: false,
        maxWidth: '260px',
      }).setHTML(`
        <div style="font-family:system-ui;min-width:160px">
          <div style="font-weight:700;font-size:13px;color:#e8eaf0;margin-bottom:6px">${project.Project}</div>
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
            <span style="width:7px;height:7px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0"></span>
            <span style="font-size:11px;color:#8b93a8">${project.Status || 'Unknown'}</span>
          </div>
          <div style="font-size:11px;color:#8b93a8">${project.Country} · ${project.Call}</div>
          ${!isNaN(co2) && co2 > 0 ? `<div style="font-size:11px;color:#60a5fa;margin-top:4px">CO₂ ${co2.toFixed(2)} Mt/yr</div>` : ''}
          ${grant ? `<div style="font-size:11px;color:#f59e0b">Grant ${formatEuroShort(grant)}</div>` : ''}
          <div style="font-size:10px;color:#5a6478;margin-top:6px;font-style:italic">Click for details</div>
        </div>
      `)

      el.addEventListener('mouseenter', () => {
        el.style.width      = `${size * 1.35}px`
        el.style.height     = `${size * 1.35}px`
        el.style.marginLeft = `-${(size * 0.35) / 2}px`
        el.style.marginTop  = `-${(size * 0.35) / 2}px`
        el.style.boxShadow  = `0 0 0 4px ${color}44, 0 0 22px ${color}99`
        el.style.zIndex     = '9999'
        popup.addTo(map)
      })
      el.addEventListener('mouseleave', () => {
        el.style.width      = `${size}px`
        el.style.height     = `${size}px`
        el.style.marginLeft = '0px'
        el.style.marginTop  = '0px'
        el.style.zIndex     = ''
        setMarkerStyle(el, size, color, selectedIdRef.current === project.Project)
        popup.remove()
      })
      el.addEventListener('click', e => {
        e.stopPropagation()
        popup.remove()
        onClickRef.current(project)
      })

      const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat([lng, lat])
        .addTo(map)

      markersRef.current.push({ marker, el, popup, project, size, color })
    })
  }

  return (
    <>
      <div
        ref={containerRef}
        style={{ position: 'fixed', top: 'var(--header-h)', left: 0, right: 0, bottom: 0, zIndex: 0 }}
      />

      {/* Style toggle — sits over the map, top-right below navigation controls */}
      <div style={{
        position: 'fixed',
        top: 'calc(var(--header-h) + 130px)',
        right: '10px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        background: 'rgba(10,14,26,0.9)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '8px',
        padding: '4px',
        backdropFilter: 'blur(8px)',
      }}>
        {[
          { key: 'dark',      label: '🌙', title: 'Dark' },
          { key: 'light',     label: '☀️', title: 'Light' },
          { key: 'satellite', label: '🛰️', title: 'Satellite' },
        ].map(({ key, label, title }) => (
          <button
            key={key}
            title={title}
            onClick={() => setActiveStyle(key)}
            style={{
              background: activeStyle === key ? 'rgba(59,130,246,0.3)' : 'none',
              border: activeStyle === key ? '1px solid rgba(59,130,246,0.6)' : '1px solid transparent',
              borderRadius: '5px',
              color: activeStyle === key ? '#60a5fa' : '#8b93a8',
              cursor: 'pointer',
              fontSize: '16px',
              padding: '5px 7px',
              lineHeight: 1,
              transition: 'all 0.15s',
            }}
          >{label}</button>
        ))}
      </div>
    </>
  )
}

function setMarkerStyle(el, size, color, isSelected) {
  el.style.width        = `${size}px`
  el.style.height       = `${size}px`
  el.style.borderRadius = '50%'
  el.style.background   = color
  el.style.border       = `2px solid ${isSelected ? '#ffffff' : color + 'bb'}`
  el.style.outline   = '1px solid rgba(0,0,0,0.5)'
  el.style.boxShadow    = isSelected
    ? `0 0 0 3px ${color}55, 0 0 16px ${color}88`
    : `0 0 8px ${color}55`
  el.style.cursor = 'pointer'
}

function formatEuroShort(v) {
  if (!v) return '—'
  if (typeof v === 'string' && isNaN(parseFloat(v))) return v
  const n = parseFloat(v)
  if (isNaN(n)) return '—'
  if (n >= 1e9) return `€${Math.round(n/1e9)}B`
  if (n >= 1e6) return `€${Math.round(n/1e6)}M`
  return `€${Math.round(n/1e3)}K`
}