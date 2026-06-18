#!/usr/bin/env bash
#
# new-project.sh — Spawn a new sketch project from _template/ (macOS / Linux).
#
# Copies the _template/ scaffold (source only) into a sibling folder under
# Sandbox/, renames the project, runs `pnpm install`, and optionally git-inits.
#
# node_modules is NOT copied — pnpm rebuilds it in the new project by
# hard-linking from a shared global store, so the install is fast once the
# store is warm and each sketch adds almost no disk instead of ~half a gig.
#
# Usage:
#   ./new-project.sh <name> [--path <dir>] [--no-git]
#
#   <name>        Folder + package name. Lowercase letters, digits, hyphens only.
#   --path <dir>  Parent directory the new project is created in. Defaults to
#                 the parent of Project-Base (i.e. Sandbox/).
#   --no-git      Skip `git init` in the new project.
#
# Examples:
#   ./new-project.sh my-sketch
#   ./new-project.sh fancy-thing --path ~/Projects

set -euo pipefail

# Colors only when writing to a terminal.
if [ -t 1 ]; then
  CYAN=$'\033[36m'; GREEN=$'\033[32m'; DIM=$'\033[2m'; RESET=$'\033[0m'
else
  CYAN=''; GREEN=''; DIM=''; RESET=''
fi

die() { printf 'error: %s\n' "$*" >&2; exit 1; }

usage() {
  sed -n '3,24p' "$0" | sed 's/^#\s\{0,1\}//'
}

# --- parse arguments -------------------------------------------------------
NAME=""
PARENT=""
NO_GIT=0
while [ $# -gt 0 ]; do
  case "$1" in
    --path)    shift; [ $# -gt 0 ] || die "--path requires a directory"; PARENT="$1" ;;
    --path=*)  PARENT="${1#*=}" ;;
    --no-git)  NO_GIT=1 ;;
    -h|--help) usage; exit 0 ;;
    -*)        die "unknown option: $1" ;;
    *)         [ -z "$NAME" ] || die "unexpected argument: $1"; NAME="$1" ;;
  esac
  shift
done

[ -n "$NAME" ] || die "project name required. Usage: ./new-project.sh <name> [--path <dir>] [--no-git]"
[[ "$NAME" =~ ^[a-z0-9][a-z0-9-]*$ ]] || die "invalid name '$NAME' — use lowercase letters, digits, and hyphens only"

# --- resolve paths ---------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TEMPLATE="$SCRIPT_DIR/_template"
PARENT="${PARENT:-$(dirname "$SCRIPT_DIR")}"
PARENT="${PARENT/#\~/$HOME}"   # expand a leading ~ in --path
TARGET="$PARENT/$NAME"

[ -d "$TEMPLATE" ] || die "_template not found at: $TEMPLATE"
[ ! -e "$TARGET" ] || die "target already exists: $TARGET"

printf '\n  %s◆ new project%s\n' "$CYAN" "$RESET"
printf '  name:    %s\n' "$NAME"
printf '  target:  %s\n\n' "$TARGET"

# --- copy scaffold ---------------------------------------------------------
# Exclude node_modules (pnpm rebuilds it from its store) plus build artifacts.
# Leading-slash excludes anchor each pattern to the template root.
printf '  copying scaffold...\n'
mkdir -p "$TARGET"
rsync -a \
  --exclude '/node_modules' \
  --exclude '/dist' \
  --exclude '/.turbo' \
  --exclude '/.vite' \
  --exclude '/vite-cache' \
  --exclude '/.git' \
  "$TEMPLATE/" "$TARGET/"

# --- rename in package.json (BOM-free) -------------------------------------
node -e '
  const fs = require("fs");
  const [file, name] = process.argv.slice(1);
  const pkg = JSON.parse(fs.readFileSync(file, "utf8"));
  pkg.name = name;
  fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + "\n");
' "$TARGET/package.json" "$NAME"

# --- rename in index.html <title> ------------------------------------------
perl -0777 -pi -e "s|<title>.*?</title>|<title>$NAME</title>|s" "$TARGET/index.html"

# --- install with pnpm -----------------------------------------------------
# Hard-links from the shared global store, so this is fast once the store is
# warm and adds almost no disk per project.
printf '  pnpm install...\n'
( cd "$TARGET" && pnpm install )

# --- optional git init -----------------------------------------------------
if [ "$NO_GIT" -eq 0 ]; then
  printf '  git init...\n'
  (
    cd "$TARGET"
    git init --initial-branch=main >/dev/null 2>&1
    git add . >/dev/null 2>&1
    git commit -m "Initial commit from project-base" >/dev/null 2>&1
  )
fi

printf '\n  %sdone.%s\n' "$GREEN" "$RESET"
printf '  %scd "%s"%s\n' "$DIM" "$TARGET" "$RESET"
printf '  %spnpm dev%s\n\n' "$DIM" "$RESET"
