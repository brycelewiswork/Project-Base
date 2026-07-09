#!/usr/bin/env bash
#
# setup.sh — One-command bootstrap for Project-Base (macOS / Linux).
#
# Takes a fresh `git clone` from zero to a runnable template:
#   1. Checks Node.js is installed and new enough.
#   2. Makes `pnpm` available (via Corepack, which ships with Node).
#   3. Installs the template's dependencies.
#
# It changes nothing outside this repo and is safe to re-run.
#
# Usage:
#   ./setup.sh
#
# If you get "permission denied", run:  bash setup.sh

set -euo pipefail

# --- pretty output ---------------------------------------------------------
if [ -t 1 ]; then
  CYAN=$'\033[36m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RED=$'\033[31m'; DIM=$'\033[2m'; BOLD=$'\033[1m'; RESET=$'\033[0m'
else
  CYAN=''; GREEN=''; YELLOW=''; RED=''; DIM=''; BOLD=''; RESET=''
fi

step() { printf '\n%s◆ %s%s\n' "$CYAN" "$1" "$RESET"; }
ok()   { printf '  %s✓%s %s\n' "$GREEN" "$RESET" "$1"; }
info() { printf '  %s\n' "$1"; }
die()  { printf '\n%s✗ %s%s\n' "$RED" "$1" "$RESET" >&2; shift; for l in "$@"; do printf '  %s\n' "$l" >&2; done; exit 1; }

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE="$SCRIPT_DIR/_template"
MIN_NODE_MAJOR=20
MIN_NODE_MINOR=19

printf '\n%s%sProject-Base setup%s\n' "$BOLD" "$CYAN" "$RESET"
printf '%sGets you from a fresh clone to a running app.%s\n' "$DIM" "$RESET"

# --- 1. Node.js ------------------------------------------------------------
step "Checking Node.js"
if ! command -v node >/dev/null 2>&1; then
  die "Node.js isn't installed." \
      "This project needs Node.js ${MIN_NODE_MAJOR}.${MIN_NODE_MINOR} or newer." \
      "" \
      "Easiest way on a Mac (installs Homebrew first if needed):" \
      "  1. Open the Terminal app." \
      "  2. Install Homebrew:  https://brew.sh" \
      "  3. Run:  brew install node" \
      "" \
      "Or download the installer directly:  https://nodejs.org (pick the LTS button)" \
      "" \
      "Then re-run:  ./setup.sh"
fi

NODE_VER="$(node -v)"                 # e.g. v24.17.0
NODE_NUM="${NODE_VER#v}"
NODE_MAJOR="${NODE_NUM%%.*}"
NODE_REST="${NODE_NUM#*.}"
NODE_MINOR="${NODE_REST%%.*}"

if [ "$NODE_MAJOR" -lt "$MIN_NODE_MAJOR" ] || { [ "$NODE_MAJOR" -eq "$MIN_NODE_MAJOR" ] && [ "$NODE_MINOR" -lt "$MIN_NODE_MINOR" ]; }; then
  die "Node.js ${NODE_VER} is too old (need ${MIN_NODE_MAJOR}.${MIN_NODE_MINOR}+)." \
      "Update it with:  brew upgrade node    (or reinstall the LTS from https://nodejs.org)" \
      "Then re-run:  ./setup.sh"
fi
ok "Node.js ${NODE_VER}"

# --- 2. pnpm ---------------------------------------------------------------
# pnpm is this project's package manager. It normally comes for free via
# Corepack (bundled with Node) — we just have to switch it on. The
# `packageManager` field in _template/package.json pins the exact pnpm version.
step "Checking pnpm"
if command -v pnpm >/dev/null 2>&1; then
  ok "pnpm $(pnpm -v) already installed"
else
  info "pnpm not found — enabling it via Corepack..."
  if corepack enable >/dev/null 2>&1; then
    ok "Corepack enabled (pnpm will self-install on first use)"
  elif sudo corepack enable >/dev/null 2>&1; then
    ok "Corepack enabled (needed one admin password)"
  else
    die "Couldn't enable pnpm automatically." \
        "Install it once by hand, then re-run this script:" \
        "  brew install pnpm        (recommended on a Mac)" \
        "  — or —" \
        "  sudo corepack enable"
  fi
fi

# --- 3. install dependencies ----------------------------------------------
step "Installing template dependencies"
[ -d "$TEMPLATE" ] || die "Can't find the _template folder next to this script." \
                          "Run setup.sh from inside the Project-Base folder."
info "Running pnpm install in _template/ (first run downloads packages; later runs are fast)..."
( cd "$TEMPLATE" && pnpm install )
ok "Dependencies installed"

# --- done ------------------------------------------------------------------
printf '\n%s%s✓ All set!%s\n\n' "$BOLD" "$GREEN" "$RESET"
printf '%sStart the app:%s\n' "$BOLD" "$RESET"
printf '  %scd _template%s\n' "$DIM" "$RESET"
printf '  %spnpm dev%s\n' "$DIM" "$RESET"
printf '  then open the %sLocal:%s URL it prints (usually http://localhost:5173)\n\n' "$BOLD" "$RESET"
printf '%sMake your own sketch later (from this folder):%s\n' "$BOLD" "$RESET"
printf '  %s./new-project.sh my-first-sketch%s\n\n' "$DIM" "$RESET"
