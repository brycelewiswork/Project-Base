# Project context

This project was spawned from [project-base](../Project-Base/), a personal
scaffold for high-fidelity React sketches.

## Stack

- Vite 8 + React 19 + TypeScript (strict)
- Tailwind CSS **v4** via `@tailwindcss/vite` (no PostCSS / no `tailwind.config.js` — config lives in `src/index.css` under `@theme`)
- shadcn/ui (base / nova preset, neutral palette) — components live in `src/components/ui/`
- motion (formerly framer-motion) — import from `motion/react` for React APIs, `motion/dom` for the Motion One-style vanilla API
- GSAP for timeline/stagger animations
- React Router v7
- Zustand for state — stores in `src/store/`
- Sonner for toasts (mounted in `src/main.tsx`)
- lucide-react for icons

## Conventions

- Path alias `@/` → `src/` (configured in both `tsconfig.app.json` and `vite.config.ts`)
- Pages: `src/pages/<PageName>.tsx`, registered in `src/App.tsx`
- Add shadcn components with: `npx shadcn@latest add <name>`
- Don't add a `tailwind.config.js` — Tailwind v4 uses CSS-first config in `src/index.css`

## Commands

```
npm run dev      # start vite dev server
npm run build    # tsc -b && vite build
npm run lint     # eslint .
npm run preview  # serve the production build
```
