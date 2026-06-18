# project-base

Personal scaffold for fast, high-fidelity React sketches.

## Stack

- **Vite 8** + **React 19** + **TypeScript**
- **Tailwind CSS v4** (via `@tailwindcss/vite`)
- **shadcn/ui** (base / nova preset, neutral palette)
- **motion** (formerly framer-motion) + **GSAP** — animation
- **React Router v7** — multi-page sketches
- **Zustand** — lightweight state
- **Sonner** — toasts
- **lucide-react** — icons

## Layout

```
Project-Base/
├── _template/          ← the actual scaffold (uses pnpm; node_modules hardlinks from a shared store)
├── new-project.sh      ← macOS / Linux: copies _template to a sibling folder, pnpm installs, git inits
├── new-project.ps1     ← Windows: same thing in PowerShell
└── README.md
```

## Usage

```bash
# from inside Project-Base/ (macOS / Linux)
./new-project.sh my-sketch
```

```powershell
# from inside Project-Base/ (Windows)
.\new-project.ps1 my-sketch
```

That creates `my-sketch/` (sibling of `Project-Base`), renames the project in
`package.json` and `index.html`, and runs `git init`.

### Flags

| Bash (`.sh`)   | PowerShell (`.ps1`) | Effect                                                       |
| -------------- | ------------------- | ------------------------------------------------------------ |
| `--path <dir>` | `-Path <dir>`       | Parent directory for the new project (default: `..` of root) |
| `--no-git`     | `-NoGit`            | Skip `git init`                                              |

The spawn never copies `node_modules` — it runs `pnpm install`, which hardlinks
every package from a shared global store. So each sketch is fast to create and
adds almost no disk (≈20 MB) instead of a full ≈480 MB copy.

Example:

```bash
./new-project.sh fancy-thing --path ~/Projects
```

## Cloning to a new machine

`_template/node_modules` is gitignored, so a fresh clone needs one bootstrap step
(pnpm ships with Node via corepack):

```powershell
git clone <this-repo>
cd Project-Base/_template
corepack enable        # one-time — makes `pnpm` available
pnpm install
```

After that, `./new-project.sh <name>` (or `.\new-project.ps1 <name>` on Windows)
spawns sketches that hardlink from the shared pnpm store — fast to create, and
each adds almost no disk.

## Experimental web APIs to know about

New browser APIs that postdate most LLM training data — read the doc
before generating code that touches them:

- **HTML in Canvas** ([docs/html-in-canvas.md](docs/html-in-canvas.md)) —
  render real, interactive HTML *through* a canvas (scale, rotate,
  shade, post-process with WebGL/WebGPU) while the underlying DOM stays
  live, focusable, and accessible. Chromium flag only as of 2026-05.

## Adding to the template

Edit anything under `_template/` directly. Common changes:

- `pnpm add <pkg>` inside `_template/` to add a library to every future sketch
- `npx shadcn@latest add <component>` to bake more shadcn components in
- Edit `_template/src/pages/` or `_template/src/App.tsx` to change the starter layout
- Update `_template/CLAUDE.md` to change the context Claude sees inside spawned projects

Commit changes to lock them into the source of truth.
