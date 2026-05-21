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
- **Progressive blur** (custom, in [src/components/ui/progressive-blur.tsx](src/components/ui/progressive-blur.tsx)) — `<LinearBlur side="top|bottom|left|right">` for edge fades and `<RadialBlur origin="edge|center">` for radial vignettes/focal blurs. Configure via `strength` + `steps` for a geometric ramp, or pass `blurLevels=[...]` for explicit multi-stop control. Zero deps; pure CSS `backdrop-filter` + mask gradients.

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

#### Shadows with squircles (the parent-filter pattern)

`clip-path: path()` and `filter: drop-shadow()` **can't visibly coexist on the same element** in Chrome — the drop-shadow doesn't render outside the clipped silhouette. The fix is to split them across two elements:

- **Outer element:** carries `filter: drop-shadow(...)`. No clip-path.
- **Inner element:** carries `clip-path: path(...)`. No filter.

The outer filter then renders a drop-shadow from the inner element's clipped alpha mask, so the shadow follows the squircle outline exactly.

**How to use it in this template:**

- `<Squircle shadow="md">…</Squircle>` — the wrapper renders the outer/inner pair automatically. Acceptable values: `true` (= md), `'sm' | 'md' | 'lg'` (presets in `SQUIRCLE_SHADOW`), or any custom `filter` string.
- `<Card shadow="md">` and `<Button shadow="lg">` — both accept the same prop and route it through.
- `<SquircleShadow shadow="md">…</SquircleShadow>` — standalone wrapper for cases where you can't pass `shadow` directly (third-party render-prop components, foreign children).
- For Sonner: a `MutationObserver` in `sonner.tsx` applies the squircle to each `<li data-sonner-toast>` and sets `filter: drop-shadow(...)` on the `<ol data-sonner-toaster>` parent. The toaster's drop-shadow is generated from the toasts' clipped silhouettes.

**When adding a new shadcn component via `npx shadcn@latest add`:** decide if it needs elevation. If yes, surface a `shadow` prop that forwards to `<Squircle shadow={...}>` (or wrap externally with `<SquircleShadow>`). The squircle stays in either case.

#### Other notes

- Outset Tailwind `ring-*` is implemented as `box-shadow: 0 0 0 1px` and will be clipped away by the squircle. Use `inset-ring-*` instead — inset shadows render inside the box and survive the clip. Card already does this.
- Focus rings (`focus-visible:ring-*`) are clipped the same way. Acceptable since the ring follows the squircle outline tightly; if a component needs an unclipped focus ring, wrap it in `<SquircleShadow>` (or any non-clipped outer) and let the ring sit on the wrapper.
- Avoid animating `border-radius` directly on a squircled element; it fights the clip-path.
- `backdrop-filter` (used by `<LinearBlur>`/`<RadialBlur>`) does not see through a parent that has `filter:` or `clip-path:` set — the parent isolates the backdrop. If a progressive blur is nested inside a squircled Card, the blur will see only the Card's contents, not what's underneath the page. Place the blur OUTSIDE squircled elements (or apply the squircle to a wrapper) when you want the full backdrop.

## Commands

```
npm run dev      # start vite dev server
npm run build    # tsc -b && vite build
npm run lint     # eslint .
npm run preview  # serve the production build
```
