const STORAGE_KEY = "type-settings"
const MIN_SIZE_PX = 12

export type TypeSettings = {
  base: number
  ratio: number
  weightHeading: number
  weightBody: number
  lhHeading: number
  lhBody: number
  lsHeading: number
  lsBody: number
}

export const TYPE_DEFAULTS: TypeSettings = {
  base: 14,
  ratio: 1.2,
  weightHeading: 600,
  weightBody: 400,
  lhHeading: 1.2,
  lhBody: 1.5,
  lsHeading: -0.02,
  lsBody: 0,
}

export function computeScale(base: number, ratio: number) {
  const sizes = [
    { key: "h1", n: 6 },
    { key: "h2", n: 5 },
    { key: "h3", n: 4 },
    { key: "h4", n: 3 },
    { key: "h5", n: 2 },
    { key: "h6", n: 1 },
    { key: "body", n: 0 },
    { key: "sm", n: -1 },
    { key: "xs", n: -2 },
  ]

  return sizes.map(({ key, n }) => {
    let px: number
    if (n >= 0) {
      px = base * Math.pow(ratio, n)
    } else {
      const step = Math.min(2, (base - MIN_SIZE_PX) / 2)
      px = Math.max(MIN_SIZE_PX, base + n * step)
    }
    const rem = Math.round((px / 16) * 1000) / 1000
    return { key, n, px: Math.round(px * 10) / 10, rem }
  })
}

export function applyTypeSettings(s: TypeSettings) {
  const root = document.documentElement
  const scale = computeScale(s.base, s.ratio)

  for (const { key, rem } of scale) {
    root.style.setProperty(`--type-${key}`, `${rem}rem`)
  }

  root.style.setProperty("--type-base", String(s.base))
  root.style.setProperty("--type-ratio", String(s.ratio))
  root.style.setProperty("--type-weight-heading", String(s.weightHeading))
  root.style.setProperty("--type-weight-body", String(s.weightBody))
  root.style.setProperty("--type-lh-heading", String(s.lhHeading))
  root.style.setProperty("--type-lh-body", String(s.lhBody))
  root.style.setProperty("--type-ls-heading", `${s.lsHeading}em`)
  root.style.setProperty("--type-ls-body", `${s.lsBody}em`)
}

export function saveTypeSettings(s: TypeSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  applyTypeSettings(s)
}

export function loadTypeSettings(): TypeSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...TYPE_DEFAULTS, ...parsed }
    }
  } catch {
    // Ignore corrupt or unavailable localStorage; fall back to defaults.
  }
  return TYPE_DEFAULTS
}

export function initTypeSystem() {
  const settings = loadTypeSettings()
  applyTypeSettings(settings)
}
