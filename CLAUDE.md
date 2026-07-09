# Project-Base — setup & orientation

This repo is a personal scaffold for high-fidelity React sketches (Vite + React +
TypeScript + Tailwind v4). If you're an AI coding agent helping set this up on a
fresh machine, **follow the Setup steps below in order, then stop and hand back the
running URL** — don't start building features or refactoring unprompted.

The person you're helping may be non-technical. Be concrete, run the commands
yourself rather than asking them to, and explain what's happening in plain language.

## Setup (getting it running from a fresh clone)

Run these from the repo root (the folder containing this file):

1. **Bootstrap the toolchain and install dependencies:**
   ```bash
   ./setup.sh          # macOS / Linux
   .\setup.ps1         # Windows (PowerShell)
   ```
   `setup.sh` checks Node.js (needs **≥ 20.19**), enables **pnpm** via Corepack,
   and installs the template's dependencies. It's safe to re-run.

   - **If it reports Node is missing or too old:** relay its exact instructions to
     the user and **stop until they've installed Node** — don't try to install
     Node.js system-wide yourself unless they explicitly ask you to. Once they've
     installed it, re-run `./setup.sh`.

2. **Start the dev server:**
   ```bash
   cd _template
   pnpm dev
   ```

3. **Report the `Local:` URL** it prints (usually `http://localhost:5173`) so they
   can open it in a browser, then stop. The grey dot on the right edge of the page
   is the navigation — mention that.

That's a complete setup. Everything below is optional / for later.

## Optional: AI-powered demos (bring your own key)

A few demos call the Claude API. They're inert until the user adds **their own**
Anthropic key — this repo ships none. Only do this if they ask:

```bash
cp _template/.env.example _template/.env.local
# then put their key after ANTHROPIC_API_KEY= in _template/.env.local
cd _template && pnpm test:anthropic   # verifies the key with one tiny live call
```

Never paste in a key from anywhere else. The key is read server-side only and
`.env.local` is gitignored — it never enters git or the browser bundle.

## Making a new sketch

The template lives in `_template/` and shouldn't be edited directly for one-off
work. Spawn an independent copy from the repo root:

```bash
./new-project.sh <name>      # macOS / Linux  (.\new-project.ps1 <name> on Windows)
```

This creates `../<name>/` (a sibling of this repo), runs `pnpm install`, and
`git init`s it. Then `cd ../<name> && pnpm dev` and build in `src/pages/Home.tsx`.

## Where the real docs live

- **`README.md`** — human-facing getting-started and overview.
- **`_template/README.md`** — what's inside the template: design-system pages,
  the full library inventory, commands.
- **`_template/CLAUDE.md`** — the full conventions for *building* sketches (design
  tokens, squircles, motion, performance). It loads automatically when you work
  inside `_template/` or a spawned sketch — read it before writing sketch code.
