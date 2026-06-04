#requires -Version 5.1
<#
.SYNOPSIS
  Spawn a new sketch project from _template/.

.DESCRIPTION
  Copies the _template/ scaffold (source only) into a sibling folder under
  Sandbox/, renames the project, runs `pnpm install`, and optionally
  initializes git + opens VS Code.

  node_modules is NOT copied — pnpm rebuilds it in the new project by
  hard-linking from a shared global store, so the install is fast once the
  store is warm and each sketch adds almost no disk instead of ~half a gig.

.PARAMETER Name
  The folder + package name for the new project. Lowercase letters, digits,
  and hyphens only.

.PARAMETER Path
  Parent directory the new project is created in. Defaults to the parent of
  Project-Base (i.e. Sandbox/).

.PARAMETER NoGit
  Skip `git init` in the new project.

.PARAMETER Open
  Open the new project in VS Code after creating it. Off by default — coding
  happens in Claude Code, so the spawn stays quiet unless explicitly asked.

.EXAMPLE
  .\new-project.ps1 my-sketch

.EXAMPLE
  .\new-project.ps1 fancy-thing -Path C:\Projects
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true, Position = 0)]
  [ValidatePattern('^[a-z0-9][a-z0-9-]*$')]
  [string]$Name,

  [string]$Path,

  [switch]$NoGit,
  [switch]$Open
)

$ErrorActionPreference = 'Stop'

$root      = $PSScriptRoot
$template  = Join-Path $root '_template'
$parentDir = if ($Path) { $Path } else { Split-Path $root -Parent }
$target    = Join-Path $parentDir $Name

if (-not (Test-Path $template)) {
  Write-Error "_template not found at: $template"
}
if (Test-Path $target) {
  Write-Error "Target already exists: $target"
}

Write-Host ""
Write-Host "  ◆ new project" -ForegroundColor Cyan
Write-Host "  name:     $Name"
Write-Host "  target:   $target"
Write-Host ""

# Copy with robocopy for speed. Exclude node_modules (pnpm rebuilds it from its
# store) plus build artifacts. robocopy's /XD matches anywhere in the tree if
# given a bare name, so pass ABSOLUTE paths to anchor each exclusion to the
# template root. Robocopy exit codes 0-7 are success; 8+ are failures.
$excludeDirs = @(
  (Join-Path $template 'node_modules'),
  (Join-Path $template 'dist'),
  (Join-Path $template '.turbo'),
  (Join-Path $template '.vite')
)

$roboArgs = @($template, $target, '/E', '/NFL', '/NDL', '/NJH', '/NJS', '/NP', '/MT:16', '/XD') + $excludeDirs

Write-Host "  copying scaffold..."
$null = & robocopy @roboArgs
if ($LASTEXITCODE -ge 8) {
  Write-Error "robocopy failed with exit code $LASTEXITCODE"
}
# robocopy sets non-zero exits even on success; reset for downstream checks.
$global:LASTEXITCODE = 0

# PowerShell 5.1's `Set-Content -Encoding utf8` writes a BOM, which trips
# some tools. Use .NET directly for BOM-free UTF-8.
$utf8NoBom = New-Object System.Text.UTF8Encoding $false

# Rename in package.json
$pkgPath = Join-Path $target 'package.json'
$pkg = Get-Content $pkgPath -Raw | ConvertFrom-Json
$pkg.name = $Name
$pkgJson = ($pkg | ConvertTo-Json -Depth 50)
[System.IO.File]::WriteAllText($pkgPath, $pkgJson, $utf8NoBom)

# Rename in index.html <title>
$indexPath = Join-Path $target 'index.html'
$html = (Get-Content $indexPath -Raw) -replace '<title>.*?</title>', "<title>$Name</title>"
[System.IO.File]::WriteAllText($indexPath, $html, $utf8NoBom)

# Install with pnpm — hard-links from the shared global store, so this is fast
# once the store is warm and adds almost no disk per project.
Write-Host "  pnpm install..."
Push-Location $target
try { pnpm install } finally { Pop-Location }

# Optionally git init. git writes its CRLF normalization notices to stderr; under
# ErrorActionPreference 'Stop' (and especially when this script's output is piped or
# redirected) PowerShell can promote those to a terminating error. Relax the
# preference for this block and swallow git's chatter so a benign notice never
# aborts the spawn or floods the console.
if (-not $NoGit) {
  Write-Host "  git init..."
  Push-Location $target
  $gitEAP = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    git init --initial-branch=main 2>&1 | Out-Null
    git add . 2>&1 | Out-Null
    git commit -m "Initial commit from project-base" 2>&1 | Out-Null
  } finally {
    $ErrorActionPreference = $gitEAP
    Pop-Location
  }
}

# Open in VS Code only when explicitly asked (-Open). Default stays quiet since
# the workflow lives in Claude Code, not an editor window.
if ($Open -and (Get-Command code -ErrorAction SilentlyContinue)) {
  Write-Host "  opening in VS Code..."
  & code $target
}

Write-Host ""
Write-Host "  done." -ForegroundColor Green
Write-Host "  cd `"$target`""
Write-Host "  pnpm dev"
Write-Host ""
