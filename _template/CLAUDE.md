# Project context

This project was spawned from [project-base](../Project-Base/), a personal
scaffold for high-fidelity React sketches.

## Dev server: always phone-accessible

These sketches are mobile UI prototypes — they're meant to be loaded on a phone
over local Wi-Fi. `vite.config.ts` is pre-configured with `server: { host: true,
port: process.env.PORT ?? 5173 }` so `npm run dev` exposes a `Network:` URL out
of the box. The port is env-overridable (`PORT=5174 npm run dev` or set in
`.env.local`) so anyone cloning the project can pick their own without editing
the config.

When starting the dev server, always:

1. Surface the **`Network:` URL** Vite prints (e.g. `http://<PC-IPv4>:5173/`). If
   missing, derive from `ipconfig`. Never tell him to use `localhost` / `127.0.0.1`
   for the phone.
2. Remind him once that the phone must be on the **same Wi-Fi** as the PC.
3. If the phone can't connect, suspect **Windows Firewall** blocking inbound Node —
   needs "Allow on Private networks". Don't suggest disabling the firewall as a fix
   (only as a brief diagnostic).
4. Mention "Add to Home Screen" in mobile Safari/Chrome for a chromeless launch,
   and that HMR works over LAN.

**Port collisions:** if running multiple sketches at once, give this clone a unique
port via `PORT=5174 npm run dev` (or a `.env.local` with `PORT=5174`) so saved phone
bookmarks stay stable instead of Vite silently incrementing. Don't hardcode a new
default in `vite.config.ts` — keep it env-driven so the project stays portable.

## Stack

- Vite 7 + React 19 + TypeScript (strict) — using `@vitejs/plugin-react-swc` (SWC, not Babel)
- Tailwind CSS **v4** via `@tailwindcss/vite` (no PostCSS / no `tailwind.config.js` — config lives in `src/index.css` under `@theme`)
- shadcn/ui (base / nova preset, neutral palette) — components live in `src/components/ui/`. shadcn v4+ uses **Base UI** (`@base-ui/react`) as its headless primitive layer (replacing Radix from earlier versions). Button and Badge already use Base UI; future `npx shadcn add` components will too. Base UI is a dependency of shadcn, not something we manage directly.
- motion (formerly framer-motion) — import from `motion/react` for React APIs, `motion/dom` for the Motion One-style vanilla API
- GSAP for timeline/stagger animations
- React Router v7
- Zustand for state — stores in `src/store/`
- Sonner for toasts (mounted in `src/main.tsx`)
- **DM Sans** (`@fontsource-variable/dm-sans`) — default `--font-sans`, variable font with weights 100–900. Typography tuning page at `/typography` with live controls for base size, scale ratio, weights, line-height, and letter-spacing.
- **DM Mono** (`@fontsource/dm-mono`) — default `--font-mono`, used via Tailwind `font-mono` for code chips, value displays, tabular numbers, and any monospaced UI element. Centralized in the `@theme` block in `index.css`; never hardcode `ui-monospace`/`monospace` stacks in components.
- **Tabler Icons** (`@tabler/icons-react`) — 5,400+ icons in outline + filled, consistent 2px/24px grid. Import directly from the package. When `npx shadcn add` brings in a new component with `lucide-react` imports, swap to the Tabler equivalent in the same commit. Custom icons go in `src/components/icons/` as individual files.
- **corner-smoothing** for Apple-style squircles — applied to every shadcn component (see Conventions)
- **Progressive blur** (custom, in [src/components/ui/progressive-blur.tsx](src/components/ui/progressive-blur.tsx)) — `<LinearBlur side="top|bottom|left|right">` for edge fades and `<RadialBlur origin="edge|center">` for radial vignettes/focal blurs. Configure via `strength` + `steps` for a geometric ramp, or pass `blurLevels=[...]` for explicit multi-stop control. Zero deps; pure CSS `backdrop-filter` + mask gradients.
- **Motion tokens** in [src/lib/motion.ts](src/lib/motion.ts) — unified spring/easing/duration presets. `SPRING.*` (gentle, smooth, snappy, bouncy, magnetic), `SPRING_FAST.*` (same names, higher damping, professional feel), `EASE.*` (Apple curve, Material standard/emphasized, CSS keywords), `GSAP_EASE.*`, `DURATION.*`. Import and use these instead of inline `{ stiffness, damping }` literals.
- **motion-primitives** (ibelick) — 32 copy-paste animation components built on `motion`, installed into `src/components/ui/`. Includes TextEffect, AnimatedNumber, InfiniteSlider, Tilt, Spotlight, GlowEffect, ScrollProgress, InView, Carousel, Dock, MorphingDialog, and more. Install additional ones on demand: `npx shadcn@latest add "https://motion-primitives.com/c/<name>.json"`. Skip their `progressive-blur` (we have our own).
- **colorthief** v3.x for color extraction from images — `getColorSync(img)` for dominant color, `getPaletteSync(img, { colorCount, colorSpace: 'oklch' })` for a palette, `getSwatchesSync(img)` for semantic swatches (Vibrant/Muted/DarkVibrant/DarkMuted/LightVibrant/LightMuted). In React, use the `useImagePalette(ref, options)` hook from [src/components/ui/color-thief.tsx](src/components/ui/color-thief.tsx). Color harmony (complementary, analogous, triadic, split-complementary) is exposed via the inline `harmonies(hex)` utility in the same file — no extra dep. Pairs naturally with `<LinearBlur tint={dominant.hex()}>` for the Apple Music-style image-into-color blend.
- **Recharts** v3 via shadcn's `ChartContainer` — declarative charts (area, bar, radial, sparkline). SVG output styled with CSS variable tokens. Install new chart types: `npx shadcn@latest add chart`.
- **visx** (`@visx/shape`, `@visx/scale`, `@visx/group`) — low-level SVG primitives for custom visuals Recharts can't express (radial arcs, bespoke gauges). Use as an escape hatch, not the default.
- **next-themes** — light/dark mode provider (wraps the app in `main.tsx`). FOUC prevention script in `index.html`.
- **react-use-measure** — `useMeasure()` hook for reading element dimensions. Used by Motion page demos.
- **Pretext** (`@chenglou/pretext`) — Cheng Lou's pure-JS multiline text measurement & layout engine. Computes paragraph heights, line counts, and tight widths from canvas font metrics with **zero DOM reflow**. Live walkthrough on `/demos` (Pretext section), full `<Accordion>` component docs at `/components/accordion`. Hooks, primitive, and component shipped:
  - **Hooks** ([src/lib/pretext.ts](src/lib/pretext.ts)):
    - `usePretextHeight(text, font, maxWidth, lineHeight)` → `{ height, lineCount }`
    - `useTightWidth(text, font, maxWidth, minWidth, lineHeight)` → binary-searches the narrowest width holding the same line count
    - `pretextStyleFromElement(el)` → samples `{ font, lineHeight, letterSpacing, fontSize }` from a DOM node's computed styles so you can drive Pretext from Tailwind tokens (e.g. `text-body leading-snug`) instead of hardcoding pixels
  - **Primitive** ([src/components/ui/tight-text.tsx](src/components/ui/tight-text.tsx)): `<TightText>` — drop-in `<span>` that shrinks to the narrowest box still fitting its text in the same line count. Solves the chat-bubble problem.
  - **Component** ([src/components/ui/accordion.tsx](src/components/ui/accordion.tsx)): `<Accordion items={…} bodyWidth={N} />` — accordion whose open/close springs to a *predicted* pixel height (motion can't truly spring-animate to `auto`).

  **When to reach for Pretext:**
  - Masonry / virtualized lists with text-driven heights — pack in one paint
  - Chat-style bubbles that should hug content (use `<TightText>`)
  - Accordions / disclosures animated with real spring overshoot (use `<Accordion>` or feed `usePretextHeight` to your own motion)
  - Responsive layouts that branch on whether text overflows N lines at a given breakpoint
  - Pre-paint title fitting (truncate at a measured N lines without thrash)

  **When NOT to reach for it:**
  - Single-line text — no measurement needed
  - Anything CSS already solves cheaply (`line-clamp`, `text-wrap: balance`/`pretty`, container queries)
  - Mixed content with images, icons, or arbitrary HTML children — Pretext's rich-inline API handles fragments but isn't a full HTML layout engine
  - Static body copy you can measure once at build time

  **Gotchas:**
  - Pretext wants a real CSS font shorthand (e.g. `'500 16px "DM Sans Variable"'`). `system-ui` is unsafe on macOS per upstream — always pass an explicit family. Use `pretextStyleFromElement(ref.current)` after mount instead of hardcoding.
  - Never inline `lineHeight: 20` etc. into Pretext calls — sample it from a hidden probe element that wears the same Tailwind classes as the real rendered text. That keeps measurement and render in lockstep when the design system changes.

## System pages

Reference pages documenting the design system. Visit during `npm run dev`:

- `/colors` — every color token (surfaces, labels, strokes, fills, accents, neutrals, black/white opacity, charts, sidebar)
- `/typography` — type scale with live tuning controls for size, weight, line-height, letter-spacing
- `/motion` — spring and easing curve visualizations with play/replay, duration tokens
- `/spacing` — spacing scale, annotated layout demo, interactive tuner, recommended pairings
- `/breakpoints` — responsive breakpoint scale, live viewport indicator, reflow demo, container widths
- `/demos` — inventory of every installed library with working demos

## Conventions

- Path alias `@/` → `src/` (configured in both `tsconfig.app.json` and `vite.config.ts`)
- Pages: `src/pages/<PageName>.tsx`, registered in `src/App.tsx`
- Add shadcn components with: `npx shadcn@latest add <name>` — use `--legacy-peer-deps` if npm complains (visx peer dep conflict)
- Don't add a `tailwind.config.js` — Tailwind v4 uses CSS-first config in `src/index.css`

### After adding a new shadcn component

Every `npx shadcn add` drops a file into `src/components/ui/` that needs restyling before use:

1. **Colors** — replace any old shadcn token classes (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, etc.) with our semantic tokens (`bg-surface`, `text-label`, `border-stroke-faint`, `text-label-secondary`). The full mapping is in the Color page at `/colors`.
2. **Squircle** — wrap the root element (see Squircles section below).
3. **Icons** — swap `lucide-react` imports to `@tabler/icons-react` equivalents.
4. **Motion** — replace any hardcoded `duration`, `ease`, or spring values with imports from `@/lib/motion` (`DURATION.*`, `EASE.*`, `SPRING.*`).
5. **Demo** — add a `<DemoSection>` block in `Demos.tsx` in the same commit.

### Borders and outlines

Three border widths are defined as `--border-width-*` tokens in `@theme`:

| Token | Value | When to use |
|-------|-------|-------------|
| `border` | 1px | Default — separators, card outlines, section dividers. This is the only width used across existing components. |
| `border-2` | 2px | Emphasis — active/selected states, stronger visual separation. |
| `border-4` | 4px | Decorative — accent stripes, heavy visual anchors. |

**Inside squircled elements**, use `inset-ring-1` instead of `border` — outset `border` and `ring-*` are clipped away by `clip-path`, but inset box-shadows survive. Card already does this.

**Important:** `inset-ring-*` alone is **not enough** on a squircled element. The inset ring is a `box-shadow` that traces the element's actual CSS `border-radius` — if you only rely on the squircle clip-path and don't add a `rounded-*` class, the underlying radius is 0 and the inset ring draws a sharp-cornered rectangle that gets carved by the clip, leaving visible rectangular artifacts at each corner. **Always pair `inset-ring-*` with a matching `rounded-*` class** (e.g. `rounded-md` for `SQUIRCLE_RADIUS.md`, `rounded-xl` for `SQUIRCLE_RADIUS.xl`). Card, Button, and Badge in this template all do this — model new outlined squircled surfaces on them.

**Color** always comes from the stroke tokens: `border-stroke-faint` (default) or `border-stroke-strong` (inputs, emphasis). Never use raw color values on borders.

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

**Presets** — 7 tiers aligned with Tailwind v4's shadow scale (`2xs → xs → sm → md → lg → xl → 2xl`):

```tsx
<Card shadow="md" />          // preset
<Card shadow="xl" />          // larger
<Card shadow={true} />        // shorthand for "md"
```

**Custom directional shadows** via `buildShadow()`:

```tsx
import { buildShadow } from "@/components/squircle"

// Light from upper-left — shadow falls toward bottom-right:
<Card shadow={buildShadow({ elevation: 3, direction: 315 })} />

// Blue-tinted shadow:
<Card shadow={buildShadow({ elevation: 2, color: "rgba(59, 130, 246, 0.4)" })} />
```

`buildShadow({ elevation, direction, color, layers })` returns a stacked `drop-shadow()` CSS filter string with 3–5 layers of progressively larger offsets and decreasing opacities. `elevation` (0.5–5) controls depth; `direction` (degrees, default 0 = straight down) shifts X/Y offsets; `color` tints the shadow.

**Other ways to apply:**

- `<SquircleShadow shadow="md">…</SquircleShadow>` — standalone wrapper for cases where you can't pass `shadow` directly (third-party render-prop components, foreign children).
- For Sonner: a `MutationObserver` in `sonner.tsx` applies the squircle to each `<li data-sonner-toast>` and sets `filter: drop-shadow(...)` on the `<ol data-sonner-toaster>` parent.

**When adding a new shadcn component via `npx shadcn@latest add`:** decide if it needs elevation. If yes, surface a `shadow` prop that forwards to `<Squircle shadow={...}>` (or wrap externally with `<SquircleShadow>`). The squircle stays in either case.

#### Other notes

- Outset Tailwind `ring-*` is implemented as `box-shadow: 0 0 0 1px` and will be clipped away by the squircle. Use `inset-ring-*` instead — inset shadows render inside the box and survive the clip. Card already does this.
- Focus rings (`focus-visible:ring-*`) are clipped the same way. Acceptable since the ring follows the squircle outline tightly; if a component needs an unclipped focus ring, wrap it in `<SquircleShadow>` (or any non-clipped outer) and let the ring sit on the wrapper.
- Avoid animating `border-radius` directly on a squircled element; it fights the clip-path.
- `backdrop-filter` (used by `<LinearBlur>`/`<RadialBlur>`) does not see through a parent that has `filter:` or `clip-path:` set — the parent isolates the backdrop. If a progressive blur is nested inside a squircled Card, the blur will see only the Card's contents, not what's underneath the page. Place the blur OUTSIDE squircled elements (or apply the squircle to a wrapper) when you want the full backdrop.

## Experimental web APIs

Newer browser APIs that likely postdate your training data. Read the
doc before generating code that uses them — don't guess the surface.

- **HTML in Canvas** ⚠️ — see [../../Project-Base/docs/html-in-canvas.md](../../Project-Base/docs/html-in-canvas.md). **Never put `drawElementImage` in a continuous `onpaint` → `requestAnimationFrame` → `requestPaint` loop on a page with significant layout activity** — Chromium's origin-trial implementation crashes the renderer (`STATUS_BREAKPOINT`) when the API is called every frame mid-reflow. Use hover-to-animate (`pointerenter` attaches `onpaint`, `pointerleave` detaches), one-shot draws on user events, or visible-and-idle gating instead. The `/demos` HtmlInCanvasDemo demonstrates the hover-to-animate pattern. See
  (and the live demo on `/demos`). Lets a `<canvas layoutsubtree>` render
  real, interactive HTML descendants via `ctx.drawElementImage(el, ...)`,
  with hooks for WebGL (`texElementImage2D`), WebGPU
  (`copyElementImageToTexture`), and OffscreenCanvas
  (`captureElementImage`). The DOM element stays focusable, accessible,
  and form-fillable — the canvas pixels are just the visual layer. Reach
  for this when the sketch needs *"a real working UI control treated as
  a graphic object"* (wavy form fields, shader-lit buttons, live HUD on
  a 3D mesh). Always feature-detect — Chromium flag only as of 2026-05.

## Commands

```
npm run dev      # start vite dev server
npm run build    # tsc -b && vite build
npm run lint     # eslint .
npm run preview  # serve the production build
```
