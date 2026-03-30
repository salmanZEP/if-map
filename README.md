# EU Innovation Fund — CCS/CCU Project Map

An interactive GIS mapping tool for the EU Innovation Fund CCS/CCU project portfolio.
62 projects across 16 European countries, with rich filters, project details sidebar, and live stats.

## Features

- 🗺️ **Dark satellite map** (Mapbox GL JS) with smooth zoom/pan
- 🔵 **Colour-coded markers** by project status, sized by CO₂ capture volume
- 🔍 **Full-text search** across project name, company, technology, country
- 🎛️ **Advanced filters**: country, status, scale, funding call, sector, category, grant range, CO₂ range
- 📋 **Project sidebar** with full details: metrics, technology, timeline, CO₂ table, funding
- 📊 **Live KPI header**: total projects, countries, grant, investment, CO₂ capture
- 📍 **Project list panel** sortable by grant, CO₂, name, country
- 🗺️ **Legend** with status colour key
- 📱 Responsive layout

## Tech Stack

- **React 18 + Vite** (fast build, hot reload)
- **Mapbox GL JS v3** (WebGL map, smooth 60fps)
- **CSS Modules** (scoped styles, no class conflicts)
- **Static JSON data** (no backend required)

## Quick Start

### 1. Get a Mapbox Token (free)

Go to [https://account.mapbox.com/](https://account.mapbox.com/), create a free account,
and copy your **public access token** (starts with `pk.`).

### 2. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/innovation-fund-map.git
cd innovation-fund-map
npm install
```

### 3. Set your token

```bash
cp .env.example .env
# Edit .env and paste your Mapbox token as VITE_MAPBOX_TOKEN
```

### 4. Run locally

```bash
npm run dev
# Open http://localhost:5173
```

### 5. Build for production

```bash
npm run build
# Output goes to dist/
```

## Deployment Options

### Netlify (recommended — easiest)

1. Push this repo to GitHub
2. Go to [netlify.com](https://netlify.com) → New site from Git
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variable: `VITE_MAPBOX_TOKEN` = your token
6. Deploy → done, you get a live URL

### Vercel

```bash
npm install -g vercel
vercel
# Follow prompts, set VITE_MAPBOX_TOKEN in dashboard
```

### GitHub Pages

```bash
# Add to package.json scripts:
# "deploy": "npm run build && gh-pages -d dist"
npm install --save-dev gh-pages
npm run deploy
```

Note: Set `base: '/your-repo-name/'` in `vite.config.js` if using a subdirectory.

### Any static host (nginx, Apache, S3, Cloudflare Pages)

Just upload the contents of `dist/` after running `npm run build`.

## Updating the Data

To update the project data:

1. Export a new `projects.json` from your Excel file
2. Replace `public/data/projects.json`
3. Rebuild: `npm run build`

The JSON schema expected per project:

```json
{
  "Project": "Kairos-at-C",
  "Scale": "large-scale",
  "Sector": "Chemicals",
  "Category": "CO2 T&S",
  "Country": "Belgium",
  "Coordinator": "Air Liquide",
  "Site Owner": "...",
  "CO₂ Capture (Mt/yr)": 1.4,
  "CO₂ Avoid (Mt/yr)": 1.4,
  "CO₂ Seq (Mt/yr)": 1.4,
  "CO₂ Util (Mt/yr)": null,
  "CO₂ Capture Total (Mt)": 14.0,
  "Grant (€)": 356900000,
  "Total Invest. (€)": 900000000,
  "Latitude": 51.368588,
  "Longitude": 4.271366,
  "Start Date": 2020,
  "Op. Year": 2025,
  "End Year": 2035,
  "Call": "IF20",
  "Status": "FID Pending / On Hold",
  "Facility Type": "Emitter (CCS)",
  "Technology Type": "...",
  "Short Description": "...",
  "Full Description": "...",
  "Link": "https://...",
  "Address": "...",
  "Confidence": "High"
}
```

## Project Structure

```
if-map/
├── public/
│   └── data/
│       └── projects.json        # All 62 project records
├── src/
│   ├── components/
│   │   ├── MapView.jsx          # Mapbox GL map + markers
│   │   ├── FilterPanel.jsx      # Left filter sidebar
│   │   ├── ProjectSidebar.jsx   # Right project detail panel
│   │   ├── StatsBar.jsx         # Top header with KPIs
│   │   ├── Legend.jsx           # Bottom-right colour legend
│   │   └── ProjectListPanel.jsx # Bottom-left project list
│   ├── constants.js             # Colors, formatters, helpers
│   ├── App.jsx                  # Root component + filter logic
│   ├── index.css                # Global styles + Mapbox overrides
│   └── main.jsx                 # React entry point
├── index.html
├── vite.config.js
├── package.json
└── .env.example
```

## Customisation

**Add new filters**: Edit `FilterPanel.jsx` and the filter logic in `App.jsx`

**Change map style**: Edit `MAPBOX_STYLE` in `MapView.jsx`
Options: `mapbox://styles/mapbox/satellite-streets-v12`, `dark-v11`, `light-v11`, `navigation-night-v1`

**Change marker colours**: Edit `STATUS_COLORS` and `CATEGORY_COLORS` in `constants.js`

**Add new fields to sidebar**: Edit `ProjectSidebar.jsx`

## License

MIT — use freely for your own deployments.
