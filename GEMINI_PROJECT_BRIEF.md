# Spiral Portfolio — Gemini Project Brief

**Owner:** Lovepreet Parmar  
**Repository:** `lovepreetparmar/lovepreet-portfolio-terminal` (GitHub)  
**Local path:** `/Users/lovepreetparmar/Projects/lovepreet-potfolio-terminal ` (note trailing space in folder name)  
**Live dev URL:** [http://localhost:3000](http://localhost:3000) (`npm run dev`)

This document is the single source of context for continuing development in **Google Gemini** (or any other assistant). Read it before changing layout, data, or interaction.

---

## 1. What we are building

A **personal spatial portfolio** for Lovepreet Parmar. Visitors explore **52 skills/technologies** arranged on the **inner surface of a 360° sphere**, not a flat grid or fake desktop OS.

Each cell is a **skill with real work behind it** — click opens projects and context tied to that craft. The experience should feel **premium, warm, and editorial** (cream paper, serif headlines), with **recognizable brand logos** on cream cards.

### Primary references

| Reference | URL | What to borrow |
|-----------|-----|----------------|
| SOOT SPIRAL | https://spiral.soot.com/ | Original inspiration: spatial discovery, search, soft canvas |
| OpenPurpose (landing.love) | https://www.landing.love/sites/openpurpose-2/ | Inside-a-sphere feel: camera amid content, cells on inner surface, one item can come forward |

### Product goal

- Show **breadth of stack** (LinkedIn-aligned skills) without feeling like a boring skills chart.
- Every technology cell should **link to portfolio proof** (projects, repos, blurbs) where possible.
- Motion and 3D should **help orientation**, not distract — drag to look, scroll to zoom inside/out, hover/click for depth.

### Non-goals

- Not a macOS/Windows parody desktop (`store/`, `components/apps/`, old LP OS shell are legacy).
- Not a public skills-only infographic — **projects stay attached to crafts**.

---

## 2. Current experience (as built today)

### Home (`app/page.tsx` → `SpiralWorld`)

1. Optional **boot splash** once per session (`SpiralBootSplash`, `sessionStorage` key `lp-spiral-boot-seen`).
2. Full-viewport **3D canvas** (`HexField`) with **52 cards** on a Fibonacci sphere.
3. **Chrome** above canvas (`SpiralChrome`): location, title toggle, About/Resume, search, hint line.
4. **Interactions:**
   - **Drag** (pointer): yaw/pitch the sphere + inertia + slow idle spin when not dragging.
   - **Scroll / pinch**: zoom from **planet view** → **inside sphere** → **close-up on the card in front** (negative zoom range).
   - **Hover**: card scales, warm glow, floating label (name + sublabel).
   - **Click**: 720ms launch (align cell, color wash) → **craft overlay** → projects inside that overlay.
5. **Search**: filters which cells stay bright; others dim. Single match can auto-focus rotation to that cell.
6. **Overlays**: About, Resume (print), Craft detail, Project detail. **Escape** closes overlay.

### Default camera

- Opens at **planet view** (`REST_ZOOM = 0.875`, camera ~z=21).
- Scroll **in** → center of sphere → scroll further → **card-forward** view (centers nearest card in view).
- Scroll **out** → full sphere cluster again.

### Mobile

- Breakpoint: **768px** (`lib/compact.ts`, `COMPACT_BREAKPOINT`).
- Same **HexField** 3D experience (not `SpiralMobileExplore` — that component exists but is **unused** on `/`).
- FOV and touch pinch use `compact` flag in `SphereRig` / `HexField`.

---

## 3. Visual design system

### Palette (do not drift without explicit request)

| Role | Value | Usage |
|------|-------|--------|
| Page background | `#efe6da` | `SpiralWorld`, overlays base |
| Canvas clear | `#e4d9cc` | Three.js background |
| Primary text | `#241c16` | Body, chrome |
| Muted text | `#5c5148`, `#6d6258` | Hints, secondary |
| Accent label | `#8a5a32` | Uppercase eyebrows, links |
| Card paper | `#f7f1e8` | Face texture base |
| Inner shell (inside only) | `#ddd2c4` | BackSide sphere when camera inside radius |

### Typography

- **Sans / UI:** Geist Sans (`--font-geist-sans`)
- **Mono:** Geist Mono (`--font-geist-mono`) — location line, small caps tracking
- **Display / editorial:** Instrument Serif (`--font-instrument-serif`, class `lp-editorial-display`)

### Chrome layout

- **Top left:** `CHANDIGARH, INDIA` (mono) + **Spiral** (click expands to full name from `about.txt`).
- **Top right:** pill buttons **About**, **Resume**.
- **Top center:** large centered search — placeholder **`Search languages and tools…`**
- **Under search:** count line — default **`52 cells · drag to look · scroll to zoom`** (do not change copy unless user asks).
- **Bottom:** rotating hints (`SpiralChrome` `LINES` array, 7s interval).

### Card appearance

- **Shape:** rounded vertical **paper cards** (not hexagons, not thin coins).
- **Face texture:** `createHexFaceCanvas` in `lib/spiral-texture.ts` (512×704 canvas).
- **Logo:** real brand marks via `lib/brand-marks.ts` + `lib/brand-logos.ts` (extracted Simple Icons paths, CC0); Photoshop from Devicon paths; Word/Excel/PowerPoint/Office as styled tiles; practices use `lib/craft-icons.ts` line symbols.
- **3D mesh:** thin `PlaneGeometry` in `lib/hex-geometry.ts`; cards billboard toward camera (`aimTile` in `HexCell.tsx`).

---

## 4. The 52 skills (frozen set)

**Do not add, remove, rename, or duplicate** technologies in `lib/spiral-nodes.ts` `CRAFTS` without explicit user approval. Labels and blurbs may be refined for copy, but IDs are stable.

```
react, next, typescript, tailwind, html, css, react-native, jquery, javascript,
node, express, php, mysql, codeigniter, wordpress, firebase, laravel, bootstrap,
ajax, json, sql, mysqli, docker, gcp, github, linux, kali, photoshop, inkscape,
eclipse, sublime, word, excel, powerpoint, office, logo-design, poster-design,
graphic-design, software-design, web-development, web-applications, web-services,
php-applications, research, strategic-planning, social-media, management,
leadership, ethical-hacking, information-technology, coding-languages, tools
```

### Craft kinds

- `language` — eyebrow **Language** in craft overlay
- `tools` — eyebrow **Bench**
- `skill` — eyebrow **Skill**

### Search & project linking

- `buildSpiralNodes()` attaches `sublabel` (often project count), `searchText`, palettes.
- `projectsForCraft(id)` maps projects from `getExplorerProjects()` via `match` / `implyFrom` arrays on each craft.
- `tools` craft is special-cased in bonds; chord lines were removed from inside view.

---

## 5. 3D implementation reference

### Key files

| File | Responsibility |
|------|----------------|
| `components/spiral/HexField.tsx` | R3F `Canvas`, lights, `InnerShell`, mounts cells |
| `components/spiral/SphereRig.tsx` | Drag, inertia, idle spin, zoom, focus quaternion |
| `components/spiral/HexCell.tsx` | Per-card texture, depth scale/fade, hover, click, Html label |
| `lib/spiral-layout.ts` | `SPHERE_RADIUS = 4.75`, Fibonacci `layoutSphere()` |
| `lib/spiral-texture.ts` | Card face canvas + palette helpers |
| `lib/brand-marks.ts` | SVG path data for brands (generated from simple-icons) |
| `lib/brand-logos.ts` | Canvas drawing for logos + Office tiles + Photoshop |

### Sphere layout

- Golden-angle distribution on full sphere (`GOLDEN_ANGLE`), not a front cap only.
- Scale fit: `Math.min(1.22, 8.8 / Math.sqrt(count))`; slight boost for multi-project sublabels.

### Zoom model (`SphereRig.tsx`)

| Constant | Value | Meaning |
|----------|-------|---------|
| `OUTSIDE_DISTANCE` | 24 | Camera z at zoom=1 |
| `REST_ZOOM` | 0.875 | Default page load (planet) |
| `INNER_ZOOM` | 0.62 | Max negative zoom (card close-up) |
| `CLOSE_CLEARANCE` | 1.8 | How close camera gets to shell along -Z |

- `zoom >= 0`: camera on +Z axis, distance `zoom * OUTSIDE_DISTANCE`.
- `zoom < 0`: camera moves **forward** along -Z toward shell; **nearest card in view** is gently centered via quaternion correction.
- Wheel: `deltaY` positive = zoom out; gain `0.0016` (higher with ctrl for trackpad pinch).
- Inside FOV lerps 78→46 (desktop); outside 32–40 depending on compact.

### Depth / facing

- Cards **face the camera** (not radial edge-on) — `aimTile`.
- Outside sphere: nearer tiles slightly larger, far tiles faded (opacity ~0.62).
- Near center of sphere: depth fade disabled so inside view stays readable.

### Focus

- Search **single match** or **launch** sets `focusNode` → sphere slerps to put that cell toward screen center (`tight` = faster during launch).

---

## 6. Content & data layer

### VFS (`lib/vfs.ts`)

In-memory virtual filesystem — **source of truth** for About, Resume skill groups, contact, project blurbs. Do not point Gemini at random external JSON; edit VFS and readers.

Important paths under `HOME_PATH = "/home/lovepreet"`:

- `about.txt` — name, headline, location, paragraphs
- `skills/*.txt` — grouped skills for Resume (frontend, backend, design, platforms, practice, tools)
- Project/experience content consumed by `lib/portfolio.ts`

### Portfolio API (`lib/portfolio.ts`)

- `getAboutProfile()`, `getExperienceDocument()`, `getSkillGroups()`, `getExplorerProjects()`, etc.
- Feeds overlays and `spiral-nodes` project matching.

### When updating copy

- **About/Resume:** `vfs.ts` + overlays.
- **Which projects appear under PHP, React, etc.:** project records + `match`/`implyFrom` in `spiral-nodes.ts`.
- **Skill list for Resume sidebar:** skill `.txt` files in VFS (keep aligned with 52 sphere crafts where possible).

---

## 7. Tech stack & constraints

- **Next.js 16.4** App Router, **Turbopack** (`npm run dev`)
- **React 19**, TypeScript strict
- **Tailwind CSS 4**
- **Three.js** + **@react-three/fiber** + **@react-three/drei**
- **No `simple-icons` npm dependency at runtime** — brand paths are vendored in `lib/brand-marks.ts` (dev used package once to generate file)
- **Zustand** present but **unused** by main `/` route
- **AGENTS.md** in repo: Next.js 16 may differ from training data — check `node_modules/next/dist/docs/` before API changes

### Commands

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
npx tsc --noEmit
```

---

## 8. Repository map (accurate for `/`)

```
app/
  page.tsx              # SpiralWorld only
  layout.tsx            # fonts + metadata
  globals.css           # spiral/hex/overlay styles

components/spiral/      # ACTIVE UI
  SpiralWorld.tsx       # state: search, overlay, launch, compact
  SpiralChrome.tsx      # header, search, footer hints
  HexField.tsx          # Canvas wrapper + scene
  HexCell.tsx           # single skill card mesh
  SphereRig.tsx         # camera + rotation
  SpiralCraftOverlay.tsx
  SpiralProjectOverlay.tsx
  SpiralAboutOverlay.tsx
  SpiralResumeOverlay.tsx
  Honeycomb.tsx         # legacy 2D (unused on home)
  SpiralMobileExplore.tsx # legacy (unused on home)

components/os/
  SpiralBootSplash.tsx
  spiral/               # older rectangular spiral experiment (not home)

lib/
  spiral-nodes.ts       # 52 CRAFTS + filter/build helpers
  spiral-layout.ts      # sphere + unused honeycomb/spiral layouts
  spiral-texture.ts     # card textures
  brand-marks.ts        # SVG paths
  brand-logos.ts        # draw logos on canvas
  craft-icons.ts        # fallback symbols
  hex-geometry.ts       # card plane sizes
  portfolio.ts, vfs.ts, compact.ts

store/, components/apps/  # legacy LP OS — do not revive unless asked
```

---

## 9. User flows (acceptance checklist)

| Flow | Expected behavior |
|------|-------------------|
| Land on `/` | Planet of logo cards, cream background, search visible |
| Drag | Smooth 360° look, inertia on release, gentle idle spin |
| Scroll in | Enter sphere, cards surround viewer |
| Scroll in more | Front card grows large (e.g. Word, PHP) |
| Scroll out | Return to planet |
| Hover card | Scale up, glow, name label |
| Click card | Wash + align → craft overlay with blurb + projects |
| Click project | Project overlay; back returns to craft if opened from craft |
| Search "php" | Non-matches dim; multiple matches stay; single match rotates to cell |
| About / Resume | Full-screen overlays, Escape closes |
| Reduced motion | Skip launch animation, open overlay immediately |

---

## 10. Known gaps & ideas (not implemented — discuss with user first)

User has **not** approved these as a bundle; treat as backlog:

- **UI chrome upgrade:** left column for focused skill, search off center, filter chips (Languages / Tools / Practice), dedicated zoom +/- controls.
- **Far-side culling:** hide back hemisphere when outside so planet reads cleaner.
- **Faint outer shell** visible only in planet view.
- **Pause idle spin** while hovering a card.
- **README.md** is **outdated** (still describes old 3D spiral arm, not skill sphere) — update when convenient.
- Inside view: wide FOV can make off-axis cards slightly **oval** (perspective); tuning FOV is a tradeoff vs coverage.
- `THREE.Clock` deprecation warning in console from R3F — harmless.

---

## 11. Rules for Gemini when editing

### Always preserve unless user asks

- 52 craft **IDs** and display **labels** in `CRAFTS`
- Header structure: location, Spiral/name toggle, About, Resume
- Search placement and placeholder
- Background colors and typography families above
- Footer/count copy: **`52 cells · drag to look · scroll to zoom`**
- Zoom range: inside center **and** outside planet **and** card close-up
- Click → craft → project flow

### Safe to improve (typical tasks)

- Visual polish on cards, lighting, shadows, planet readability
- Performance (texture reuse, instance limits)
- Accessibility (focus order, aria on canvas region)
- Mobile touch ergonomics
- README and docs
- Deploy/hosting setup

### Avoid without explicit approval

- Replacing sphere with flat grid or carousel as the main `/` experience
- Adding npm icon packs that bloat bundle (prefer vendored paths like today)
- Rewriting all of `vfs.ts` or deleting legacy folders in one shot
- Changing skill list to match a new LinkedIn paste without user review

---

## 12. Git history (recent)

- `767cdad` — Zoom continues past sphere center until front card fills view
- `ed3c438` — Skill sphere with real logos on cream cards (52 crafts)
- `426b20e` — SOOT-style Spiral base (pre-sphere evolution)

---

## 13. Prompt template for new Gemini sessions

Copy-paste when starting a chat:

```
You are helping build the Spiral portfolio for Lovepreet Parmar.
Read GEMINI_PROJECT_BRIEF.md in the repo root first.
Stack: Next.js 16, React 19, R3F, Three.js, Tailwind 4.
The home page is a 360° inner sphere of 52 skill cards with real logos.
Do not add/remove/rename the 52 crafts without permission.
Preserve cream palette, search chrome, About/Resume, and zoom inside→card→planet.
Workspace path may have a trailing space: lovepreet-potfolio-terminal 
```

---

## 14. Contact & identity (from content)

- **Name:** Lovepreet Parmar  
- **Location:** Chandigarh, India  
- **Role focus:** Software engineering, web applications, PHP/JS stack, design touchpoints  
- **Site title:** Spiral — Lovepreet Parmar  

For biography details, experience, and links, always read current `lib/vfs.ts` and `getAboutProfile()` output rather than hardcoding in this file.

---

*Last updated for Gemini handoff: November 2026. Regenerate or extend this file when major features ship (e.g. new chrome, deployment URL, CMS).*