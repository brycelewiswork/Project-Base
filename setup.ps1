<#
  setup.ps1 — One-command bootstrap for Project-Base (Windows / PowerShell).

  Takes a fresh `git clone` from zero to a runnable template:
    1. Checks Node.js is installed and new enough.
    2. Makes `pnpm` available (via Corepack, which ships with Node).
    3. Installs the template's dependencies.

  It changes nothing outside this repo and is safe to re-run.

  Usage (from inside the Project-Base folder):
    .\setup.ps1

  If PowerShell blocks the script, run this once, then try again:
    Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
#>

$ErrorActionPreference = 'Stop'

function Step($m) { Write-Host "`n> $m" -ForegroundColor Cyan }
function Ok($m)   { Write-Host "  [ok] $m" -ForegroundColor Green }
function Info($m) { Write-Host "  $m" }
function Die($title, [string[]]$lines) {
  Write-Host "`n[x] $title" -ForegroundColor Red
  foreach ($l in $lines) { Write-Host "  $l" }
  exit 1
}

$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$Template    = Join-Path $ScriptDir '_template'
$MinMajor    = 20
$MinMinor    = 19

Write-Host "`nProject-Base setup" -ForegroundColor Cyan
Write-Host "Gets you from a fresh clone to a running app." -ForegroundColor DarkGray

# --- 1. Node.js ------------------------------------------------------------
Step "Checking Node.js"
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  Die "Node.js isn't installed." @(
    "This project needs Node.js $MinMajor.$MinMinor or newer.",
    "",
    "Easiest way on Windows:",
    "  1. Open PowerShell.",
    "  2. Run:  winget install OpenJS.NodeJS.LTS",
    "",
    "Or download the installer:  https://nodejs.org (pick the LTS button)",
    "",
    "Close and reopen PowerShell, then re-run:  .\setup.ps1"
  )
}

$nodeVer = (node -v).TrimStart('v')          # e.g. 24.17.0
$parts   = $nodeVer.Split('.')
$major   = [int]$parts[0]
$minor   = [int]$parts[1]
if ($major -lt $MinMajor -or ($major -eq $MinMajor -and $minor -lt $MinMinor)) {
  Die "Node.js v$nodeVer is too old (need $MinMajor.$MinMinor+)." @(
    "Update with:  winget upgrade OpenJS.NodeJS.LTS   (or reinstall from https://nodejs.org)",
    "Then re-run:  .\setup.ps1"
  )
}
Ok "Node.js v$nodeVer"

# --- 2. pnpm ---------------------------------------------------------------
Step "Checking pnpm"
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
  Ok "pnpm $(pnpm -v) already installed"
} else {
  Info "pnpm not found - enabling it via Corepack..."
  try {
    corepack enable | Out-Null
    Ok "Corepack enabled (pnpm will self-install on first use)"
  } catch {
    Die "Couldn't enable pnpm automatically." @(
      "Install it once by hand, then re-run this script:",
      "  npm install -g pnpm",
      "  - or -",
      "  corepack enable   (in an Administrator PowerShell)"
    )
  }
}

# --- 3. install dependencies ----------------------------------------------
Step "Installing template dependencies"
if (-not (Test-Path $Template)) {
  Die "Can't find the _template folder next to this script." @(
    "Run setup.ps1 from inside the Project-Base folder."
  )
}
Info "Running pnpm install in _template\ (first run downloads packages; later runs are fast)..."
Push-Location $Template
try { pnpm install } finally { Pop-Location }
Ok "Dependencies installed"

# --- done ------------------------------------------------------------------
Write-Host "`n[ok] All set!" -ForegroundColor Green
Write-Host "`nStart the app:"
Write-Host "  cd _template"      -ForegroundColor DarkGray
Write-Host "  pnpm dev"          -ForegroundColor DarkGray
Write-Host "  then open the Local: URL it prints (usually http://localhost:5173)"
Write-Host "`nMake your own sketch later (from this folder):"
Write-Host "  .\new-project.ps1 my-first-sketch" -ForegroundColor DarkGray
Write-Host ""
