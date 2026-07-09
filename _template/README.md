# Modern Project Template

A suite of tools and primitives to make launching into high fidelity work easier.

## Quick start

```bash
pnpm install   # only needed the first time (a spawned sketch is already installed)
pnpm dev
```

Open the `Local:` URL it prints — usually `http://localhost:5173`. The grey dot on the right edge is the navigation — hover to expand.

## What's inside

This template ships a complete design system with interactive documentation pages. Every token, component, and pattern is visualized and adjustable.

### System pages

| Page | URL | What it covers |
|------|-----|----------------|
| **Color** | `/colors` | Surfaces, labels, strokes, fills, accents (12 hues × 13 steps), black/white opacity scales, neutral scale |
| **Type** | `/typography` | Base size, scale ratio, weights, line-height, letter-spacing — all adjustable with live preview and a Save button that persists across the system |
| **Motion** | `/motion` | Spring presets, easing curves, duration tokens — each with an animated curve graph and replay |
| **Spacing** | `/spacing` | 10-step spacing scale, annotated layout demo, interactive tuner, recommended pairings |
| **Layout** | `/breakpoints` | Responsive breakpoints, live viewport indicator, reflow demo, container widths |
| **Demos** | `/demos` | Every installed library demonstrated — if it's not on this page, it doesn't belong in the template |

### Component pages

Navigate via the Components dropdown in the side nav. Each component page documents:
- **Preview** — the component in action
- **Anatomy** — visual breakdown of sub-elements with token annotations
- **Examples** — interactive demos of every variant
- **API** — full props table
- **Tokens** — which design system tokens it uses
- **Accessibility** — keyboard and screen reader support
- **Guidelines** — when to use / when not to
- **Source** — file path, install command, import statement

Currently documented: Button, Badge, Card, Slider. Add more by creating a page in `src/pages/components/` using the shared template at `src/pages/components/_template.tsx`.

## How to build something new

This template lives inside `Project-Base/_template/`. Don't edit it directly — spawn a new project from it.

From the `Project-Base/` directory:

```bash
./new-project.sh my-project-name      # macOS / Linux
.\new-project.ps1 my-project-name     # Windows
```

This copies `_template/` into a sibling folder (`../my-project-name/`), renames the package, runs `pnpm install`, and initializes git. The new project is fully independent — edit freely without affecting the template.

**Flags:**
- `--path <dir>` (`-Path` on Windows) — override the target parent directory
- `--no-git` (`-NoGit` on Windows) — skip git init

Once your project is spawned:

1. **Run `pnpm dev`**
2. **Start building in `src/pages/Home.tsx`** — this is your canvas. The system pages stay in the nav for reference.
4. **Use the design system** — don't invent new values:
   - Colors: `bg-surface`, `text-label`, `border-stroke-faint`, `bg-blue-500`, etc. See `/colors`
   - Typography: `text-h3`, `text-h6`, `text-body`, `text-sm`. Headings get weight/line-height/letter-spacing automatically. Adjust on `/typography` and Save.
   - Spacing: `gap-4`, `p-6`, `py-12`. See `/spacing` for the scale.
   - Motion: `import { SPRING, EASE, DURATION } from "@/lib/motion"`. See `/motion` for presets.
   - Shadows: `shadow="sm"` on `<Card>` or `<Squircle>`. See Demos for examples.
5. **Add pages** in `src/pages/` and register routes in `src/App.tsx`
6. **Add shadcn components** with `pnpm dlx shadcn@latest add <name>`, then restyle (see CLAUDE.md for the checklist)

## Design system architecture

```
src/
├── index.css              ← All tokens: colors, spacing, type, shadows, z-index, borders, breakpoints
├── lib/
│   ├── motion.ts          ← Spring, easing, duration presets
│   └── typography.ts      ← Type scale computation, save/load from localStorage
├── components/
│   ├── PageLayout.tsx      ← Shared page structure: PageShell, PageHeader, Section, SectionCard
│   ├── squircle.tsx        ← Apple-style smooth corners + shadow system
│   └── ui/                 ← shadcn components (Button, Card, Slider, Skeleton, etc.)
└── pages/
    ├── Home.tsx            ← Your canvas
    ├── Colors.tsx           ← Color system documentation
    ├── Typography.tsx       ← Type scale tuner
    ├── Motion.tsx           ← Motion preset visualizer
    ├── Spacing.tsx          ← Spacing scale + annotated layout
    ├── Breakpoints.tsx      ← Responsive layout reference
    ├── Demos.tsx            ← Library inventory
    └── components/          ← Component documentation pages
        ├── _template.tsx    ← Shared doc layout (change once → all component pages update)
        ├── SliderPage.tsx
        ├── ButtonPage.tsx
        ├── BadgePage.tsx
        └── CardPage.tsx
```

## Key conventions

- **Surfaces layer**: `surface` (page) → `surface-secondary` (cards) → `surface-tertiary` (nested elements). Never skip levels.
- **Borders inside squircles**: Use `inset-ring-1 inset-ring-stroke-faint`, not `border` — CSS borders get clipped by squircle's `clip-path`.
- **Typography is live**: The Type page's Save button writes to localStorage. All `text-h*`, `text-body`, `text-sm`, `text-xs` utilities read from CSS custom properties that update.
- **Dark mode**: Toggle via the nav menu. Theme-aware tokens (surfaces, labels, strokes, fills, accent colors) switch automatically. Use `dark:` prefix only for static-value tokens like the neutral scale.
- **One source of truth**: Every shared pattern lives in a component (`PageLayout.tsx`, `DemoSection.tsx`, `_template.tsx`). Change the component, every page updates.

## Commands

```bash
pnpm dev      # Vite dev server
pnpm build    # TypeScript check + production build
pnpm lint     # ESLint
pnpm preview  # Serve production build locally
```
