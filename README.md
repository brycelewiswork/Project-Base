# project-base

Personal scaffold for fast, high-fidelity React sketches.

## Getting started (from zero)

New to this? These steps take you from nothing installed to the app running in
your browser. On a Mac, in the **Terminal** app.

**1. Install the two prerequisites** (skip any you already have):

- **Node.js 20.19 or newer** — the JavaScript runtime everything is built on.
  Get it from [nodejs.org](https://nodejs.org) (click the big **LTS** button and
  run the installer), or if you use [Homebrew](https://brew.sh): `brew install node`.
- **git** — to download the code. Macs usually have it; run `git --version` and,
  if it offers to install the "command line developer tools", accept.

**2. Download the project and run the setup script:**

```bash
git clone <REPO_URL>        # ← replace with this repo's URL from GitHub
cd Project-Base
./setup.sh
```

`setup.sh` checks your Node version, turns on **pnpm** (the package manager,
which comes bundled with Node), and installs everything. It only touches this
folder and is safe to re-run. If a prerequisite is missing it tells you exactly
what to do.

**3. Start the app:**

```bash
cd _template
pnpm dev
```

Open the **`Local:`** URL it prints — usually `http://localhost:5173`. That's the
running design system. The grey dot on the right edge is the navigation — hover
to expand.

> On Windows, use `.\setup.ps1` and `.\new-project.ps1` instead of the `./…sh`
> versions — everything else is identical.

## Making your own sketch

The template lives in `_template/` — don't edit it directly. Instead spawn a new,
independent copy. From the `Project-Base/` folder:

```bash
./new-project.sh my-sketch
```

That creates `my-sketch/` (a sibling of `Project-Base/`), renames it, runs
`pnpm install`, and `git init`s it. Then:

```bash
cd ../my-sketch
pnpm dev
```

Build in `src/pages/Home.tsx` — that's your canvas. See `_template/README.md` and
`_template/CLAUDE.md` (loaded automatically by Claude Code) for the design-system
conventions.

### Flags

| Bash (`.sh`)   | PowerShell (`.ps1`) | Effect                                                       |
| -------------- | ------------------- | ------------------------------------------------------------ |
| `--path <dir>` | `-Path <dir>`       | Parent directory for the new project (default: `..` of root) |
| `--no-git`     | `-NoGit`            | Skip `git init`                                              |

Example: `./new-project.sh fancy-thing --path ~/Projects`

The spawn never copies `node_modules` — it runs `pnpm install`, which hardlinks
every package from a shared global store. Each sketch is fast to create and adds
almost no disk (≈20 MB) instead of a full ≈480 MB copy.

## Optional: AI-powered demos

A few demos call the Claude API. They're inert until you add **your own** key —
none is shipped with this repo. To enable them:

1. Get a key from [console.anthropic.com](https://console.anthropic.com).
2. Copy the example env file and paste your key in:
   ```bash
   cp _template/.env.example _template/.env.local
   # then edit _template/.env.local and put your key after ANTHROPIC_API_KEY=
   ```
3. Verify it works: `cd _template && pnpm test:anthropic`

The key is read **server-side only** (by the Vite dev proxy) and never enters the
browser bundle or git — `.env.local` is gitignored.

## Stack

- **Vite 8** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **shadcn/ui** (base / nova preset, neutral palette)
- **motion** (formerly framer-motion) + **GSAP** — animation
- **React Router v7** — multi-page sketches
- **Zustand** — lightweight state
- **Sonner** — toasts
- **@tabler/icons-react** — icons

See `_template/README.md` for the full inventory (charts, shaders, dialkit,
color extraction, and more) and `_template/CLAUDE.md` for conventions.

## Layout

```
Project-Base/
├── _template/          ← the actual scaffold (uses pnpm; node_modules hardlinks from a shared store)
├── setup.sh / .ps1     ← one-command bootstrap: checks Node, enables pnpm, installs deps
├── new-project.sh/.ps1 ← copies _template to a sibling folder, pnpm installs, git inits
├── docs/               ← notes on experimental browser APIs
└── README.md
```

## Experimental web APIs to know about

New browser APIs that postdate most LLM training data — read the doc before
generating code that touches them:

- **HTML in Canvas** ([docs/html-in-canvas.md](docs/html-in-canvas.md)) — render
  real, interactive HTML *through* a canvas (scale, rotate, shade, post-process
  with WebGL/WebGPU) while the underlying DOM stays live, focusable, and
  accessible. Chromium flag only as of 2026-05.

## Adding to the template

Edit anything under `_template/` directly. Common changes:

- `pnpm add <pkg>` inside `_template/` to add a library to every future sketch
- `pnpm dlx shadcn@latest add <component>` to bake more shadcn components in
- Edit `_template/src/pages/` or `_template/src/App.tsx` to change the starter layout
- Update `_template/CLAUDE.md` to change the context Claude sees inside spawned projects

Commit changes to lock them into the source of truth.
