# Spiral — Lovepreet Parmar

Spatial portfolio inspired by [SOOT SPIRAL](https://spiral.soot.com/): a soft gray canvas, project tiles on a **3D spiral path**, live **search**, and full-screen detail overlays — not a fake desktop OS.

## Features

- **Spiral explorer** — drag to orbit; project cards sit along a curved arm (Three.js + React Three Fiber)
- **Search** — filters tiles on the spiral (title, stack, category)
- **Overlays** — About (wordmark), Resume (print-friendly), project detail — no window chrome or dock
- **Mobile** — grid explore view with the same search and overlays
- **Content** — still driven by the in-memory VFS in `lib/vfs.ts` via `lib/portfolio.ts`

## Tech stack

- Next.js 16 (App Router, Turbopack)
- React 19
- TypeScript (strict)
- Tailwind CSS 4
- Three.js, `@react-three/fiber`, `@react-three/drei`
- Geist Sans, Geist Mono, Instrument Serif

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description        |
|-----------------|--------------------|
| `npm run dev`   | Development server |
| `npm run build` | Production build   |
| `npm run start` | Serve production   |
| `npm run lint`  | ESLint             |

## Project structure

```
app/                    Layout, globals, home (SpiralWorld)
components/spiral/      Chrome, overlays, mobile explore
components/os/spiral/     R3F canvas and scene
lib/spiral-*.ts         Node data and layout math
lib/vfs.ts, portfolio.ts  Portfolio content
store/                  Legacy window manager (unused by Spiral UI)
components/apps/        Legacy app panels (content patterns reused in overlays)
```

## Updating portfolio content

Edit `lib/vfs.ts`. Readers in `lib/portfolio.ts` feed the spiral tiles and overlays.

## License

Private portfolio project.
