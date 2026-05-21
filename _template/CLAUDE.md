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
- **corner-smoothing** for Apple-style squircles — applied to every shadcn component (see Conventions)

## Conventions

- Path alias `@/` → `src/` (configured in both `tsconfig.app.json` and `vite.config.ts`)
- Pages: `src/pages/<PageName>.tsx`, registered in `src/App.tsx`
- Add shadcn components with: `npx shadcn@latest add <name>`
- Don't add a `tailwind.config.js` — Tailwind v4 uses CSS-first config in `src/index.css`

### Demos page is the inventory

Every library installed in this template **must** be demonstrated in [src/pages/Demos.tsx](src/pages/Demos.tsx) with a `<DemoSection title="…" lib="…" version="…">` block, added in the **same change** as the `npm install`. If it can't be visibly demoed, it doesn't belong here. Visit `/demos` after `npm run dev`.

### Squircles are global

Every shadcn component must render its root through `<Squircle as={…}>` or `useSquircle(ref, …)` from [@/components/squircle](src/components/squircle.tsx). When you run `npx shadcn@latest add <name>`:

1. Edit the new file before committing — wrap the root element in `<Squircle as="<tag>" cornerRadius={SQUIRCLE_RADIUS.<token>}>` matching its Tailwind `rounded-<token>` class. (Or use `useSquircle` for `useRender`-based components like Badge.)
2. Keep the Tailwind `rounded-*` class as a visual fallback for tools / dev-tools.
3. Default `cornerSmoothing = 0.6` (Apple iOS feel) is baked into our `<Squircle>` wrapper — don't pass it unless you want a different look.
4. Add a new `<DemoSection>` to `Demos.tsx` if the component is genuinely new (not a primitive of an existing one).

`SQUIRCLE_RADIUS` mirrors the `--radius-*` Tailwind tokens: `{ sm: 6, md: 8, lg: 10, xl: 14, '2xl': 18, '3xl': 22, '4xl': 26 }`. For pill shapes (Badge), pass `cornerRadius: 999`.

Note: `clip-path` clips outline and box-shadow, so focus rings follow the squircle outline. This usually looks tighter — accept it. Avoid animating `border-radius` directly; it fights the clip-path.

## Commands

```
npm run dev      # start vite dev server
npm run build    # tsc -b && vite build
npm run lint     # eslint .
npm run preview  # serve the production build
```
