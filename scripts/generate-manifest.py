#!/usr/bin/env python3
"""Regenerate FILE-MANIFEST.md — a complete, accurate listing of the project."""
from pathlib import Path
from datetime import date

root = Path('.')
EXCLUDE = {'node_modules', '.next', '.git', '.netlify', 'out', 'dist', 'build'}
files = []
for p in root.rglob('*'):
    if any(part in EXCLUDE for part in p.parts): continue
    if p.name.endswith('.tsbuildinfo'): continue
    if p.is_file():
        rel = str(p).replace('\\','/')
        size = p.stat().st_size
        try: lines = len(p.read_text(errors='ignore').splitlines())
        except Exception: lines = 0
        files.append((rel, size, lines))
files.sort()

tree = {}
for rel, size, lines in files:
    parts = rel.split('/'); node = tree
    for part in parts[:-1]: node = node.setdefault(part, {})
    node[parts[-1]] = (size, lines)

out = [
 '# Author Reach Studio — Complete File Manifest','',
 '> Workspace location: `/home/user/author-reach-studio/` (sandboxed workspace, not your local hard drive).',
 f'> **{len(files)} files** · regenerated {date.today().isoformat()}. Excludes `node_modules/`, `.next/`, build caches.','',
 '## Directory tree','','```']
def render(node, prefix=''):
    items = sorted(node.items(), key=lambda kv:(not isinstance(kv[1],dict), kv[0].lower()))
    for i,(name,val) in enumerate(items):
        last = i == len(items)-1
        conn = '└── ' if last else '├── '
        if isinstance(val,dict):
            out.append(f'{prefix}{conn}{name}/'); render(val, prefix + ('    ' if last else '│   '))
        else:
            size,lines = val
            out.append(f'{prefix}{conn}{name}  ({size:,} B, {lines} lines)')
render(tree)
out += ['```','','## Full file list (path · size · lines)','','| # | File | Size | Lines |','|---:|---|---:|---:|']
for i,(rel,size,lines) in enumerate(files,1):
    out.append(f'| {i} | `{rel}` | {size:,} B | {lines} |')
out += ['','## Areas','',
 '- **`START-HERE.md`, `README.md`, `DRIVE-CONTENTS.md`, `FILE-MANIFEST.md`** — entry points and inventories.',
 '- **`app/`** — 45 routes: public site, client portal, team workspace, admin, sign-in, design system, global CSS, favicon.',
 '- **`components/`** — brand logos, header/footer, dashboard shell, theme toggle, print button, forms, UI primitives.',
 '- **`lib/`** — types, demo data, navigation, Supabase clients.','- **`netlify/functions/`** — inquiry, Paystack init/webhook/callback, shared server helpers.',
 '- **`supabase/`** — 2 migrations (source of truth), seed, config, auth email templates.',
 '- **`public/`, `brand-assets/`** — real logos from Google Drive, favicon, design-board references, contact sheet.',
 '- **`docs/`** — charter, decisions, intake checklist, Supabase setup, security, roadmap, content inventory, build report, visual redesign.',
 '- **`tests/`, `scripts/`** — 14 architecture/security tests, verify script, manifest generator.','',
 '## Not persisted in the workspace snapshot','',
 '- `node_modules/` (run `npm install`), `.next/` (run `npm run build`), `.env.local` (your secrets).']
Path('FILE-MANIFEST.md').write_text('\n'.join(out)+'\n')
print(f'FILE-MANIFEST.md regenerated — {len(files)} files')
