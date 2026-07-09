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

   - **If it reports Node is missing or too old:**
     - **On macOS**, offer to install it for them with [Homebrew](https://brew.sh),
       and do it once they say yes (it may prompt for their Mac login password):
       - If Homebrew isn't installed yet, install it first via the official command
         at https://brew.sh, then run `brew install node`.
       - If Node is just outdated, `brew upgrade node`.
       - Then re-run `./setup.sh`.
     - **On Windows, or if they'd rather not use Homebrew**, relay setup's
       instructions (install the **LTS** from https://nodejs.org) and stop until
       they've done it, then re-run `./setup.sh`.
     - Always **ask before** installing system software — confirm, then proceed;
       just don't do it silently.

2. **Start the dev server:**
   ```bash
   cd _template
   pnpm dev
   ```

3. **Report the `Local:` URL** it prints (usually `http://localhost:5173`) so they
   can open it in a browser, then stop. The grey dot on the right edge of the page
   is the navigation — mention that.

That's a complete setup. Everything below is optional / for later.

## Optional: AI-powered demos (bring your own Anthropic key)

**Do not bring this up during setup.** It has nothing to do with getting the app
running, and most sketches don't need it. Only walk through it if the user
*explicitly* asks about AI features, the Claude API, or setting up an API key.

When they do ask, here's the whole thing:

1. **Get a key.** Sign in at https://console.anthropic.com → **API keys** (left
   sidebar) → **Create Key** → copy the value (it starts with `sk-ant-`). Notes to
   pass along:
   - This is an **Anthropic API** key tied to the console account and its own
     billing — it is **not** the same as their Claude Code / Claude app login, and
     it requires API credit on that account.
   - This repo ships **no** key; they must use their own.
2. **Add it to the project:**
   ```bash
   cp _template/.env.example _template/.env.local
   # then paste the key after ANTHROPIC_API_KEY= in _template/.env.local
   ```
3. **Verify it:** `cd _template && pnpm test:anthropic` — one tiny live call that
   prints ✅ or ❌.

Never paste in a key from anywhere else or reuse someone else's. The key is read
**server-side only** and `.env.local` is gitignored — it never enters git or the
browser bundle.

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
