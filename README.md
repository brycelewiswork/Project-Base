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
├── _template/          ← the actual scaffold (pre-installed node_modules for instant copies)
├── new-project.ps1     ← copies _template to a new sibling folder, renames, git inits, opens VS Code
└── README.md
```

## Usage

```powershell
# from inside Project-Base/
.\new-project.ps1 my-sketch
```

That creates `..\my-sketch\` (sibling of `Project-Base`), renames the project in
`package.json` and `index.html`, runs `git init`, and opens VS Code.

### Flags

| Flag       | Effect                                                       |
| ---------- | ------------------------------------------------------------ |
| `-Path`    | Parent directory for the new project (default: `..` of root) |
| `-Clean`   | Skip copying `node_modules`; runs `npm install` instead      |
| `-NoGit`   | Skip `git init`                                              |
| `-NoOpen`  | Skip opening in VS Code                                      |

Example:

```powershell
.\new-project.ps1 fancy-thing -Clean -Path C:\Projects
```

## Cloning to a new machine

`_template/node_modules` is gitignored, so a fresh clone needs one bootstrap step:

```powershell
git clone <this-repo>
cd Project-Base/_template
npm install
```

After that, `.\new-project.ps1 <name>` produces instant copies just like the original machine.

## Adding to the template

Edit anything under `_template/` directly. Common changes:

- `npm install <pkg>` inside `_template/` to add a library to every future sketch
- `npx shadcn@latest add <component>` to bake more shadcn components in
- Edit `_template/src/pages/` or `_template/src/App.tsx` to change the starter layout
- Update `_template/CLAUDE.md` to change the context Claude sees inside spawned projects

Commit changes to lock them into the source of truth.
