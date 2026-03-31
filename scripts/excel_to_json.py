import pandas as pd
import json
import os
from datetime import datetime, timezone

INPUT  = os.path.join(os.path.dirname(__file__), '../excel_data/Innovation_Fund_Projects_data - 290326.xlsx')
OUTPUT = os.path.join(os.path.dirname(__file__), '../public/data/projects.json')

# Load Excel
df = pd.read_excel(INPUT, sheet_name='IF Projects')
df.columns = [c.replace('\n', ' ').strip() for c in df.columns]

def safe(v):
    if pd.isna(v): return None
    if hasattr(v, 'item'): return v.item()
    return v

# Load existing JSON if it exists
if os.path.exists(OUTPUT):
    with open(OUTPUT, 'r', encoding='utf-8') as f:
        existing = json.load(f)
    existing_map = {p['Project']: p for p in existing if p.get('Project')}
else:
    existing_map = {}

# Process Excel rows
records = []
missing_coords = []
added   = []
updated = []
unchanged = []

for _, row in df.iterrows():
    r = {k: safe(v) for k, v in row.items()}
    if r.get('Scale'):
        r['Scale'] = r['Scale'].lower().strip()

    name = r.get('Project', 'Unknown')

    if not r.get('Latitude') or not r.get('Longitude'):
        missing_coords.append(name)

    if name not in existing_map:
        added.append(name)
        records.append(r)
    elif r != existing_map[name]:
        updated.append(name)
        records.append(r)
    else:
        unchanged.append(name)
        records.append(existing_map[name])  # keep existing untouched

# Write output
with open(OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(records, f, ensure_ascii=False, indent=2)

# Summary
print(f'Done — {len(records)} projects written to projects.json')
print(f'  {len(added)} new      : {added if added else "none"}')
print(f'  {len(updated)} updated  : {updated if updated else "none"}')
print(f'  {len(unchanged)} unchanged')

meta = {
    'lastUpdated': datetime.now(timezone.utc).strftime('%B %Y'),
    'lastUpdatedFull': datetime.now(timezone.utc).strftime('%d %B %Y'),
    'projectCount': len(records),
}

META_OUTPUT = os.path.join(os.path.dirname(__file__), '../public/data/meta.json')
with open(META_OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(meta, f, indent=2)
    
if missing_coords:
    print(f'\nWARNING — {len(missing_coords)} projects missing coordinates (will not appear on map):')
    for name in missing_coords:
        print(f'  - {name}')