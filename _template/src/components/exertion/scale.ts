import { interpolate, formatHex } from "culori"

// ---------------------------------------------------------------------------
// Perceived-exertion scale (Borg CR10, 0–10)
// ---------------------------------------------------------------------------

export type Level = {
  /** Short label shown under the big number. */
  label: string
  /** One-line description of how that effort feels. */
  description: string
}

/** Index = integer exertion value 0–10. Three entries match the screenshots. */
export const LEVELS: Level[] = [
  { label: "No Exertion",    description: "At rest, no effort at all" },
  { label: "Very Light",     description: "Barely noticeable effort" },
  { label: "Very Light",     description: "Easy activity, like a casual walk" },
  { label: "Light",          description: "Comfortable, breathing easily" },
  { label: "Moderate",       description: "Working, but sustainable for a while" },
  { label: "Somewhat Hard",  description: "Starting to feel challenging, can still talk in sentences" },
  { label: "Hard",           description: "Breathing heavier, talking takes effort" },
  { label: "Very Hard",      description: "Very challenging, can only speak a few words at a time" },
  { label: "Very Hard",      description: "Hard to keep going, speaking is difficult" },
  { label: "Extremely Hard", description: "Near maximal, almost unable to talk" },
  { label: "Maximal",        description: "All-out effort, can't sustain" },
]

export const MAX_VALUE = 10

/** The band of effort that's typical for this user. Hardcoded for the prototype. */
export const USUAL_RANGE: [number, number] = [2, 4]

// ---------------------------------------------------------------------------
// Gradient — a custom, non-monotonic stop list (NOT a hue sweep)
// teal → cyan → lime → yellow → orange → red → fuchsia → purple
// ---------------------------------------------------------------------------

export type Stop = { pos: number; hex: string }

export const GRADIENT_STOPS: Stop[] = [
  { pos: 0.0,  hex: "#2dd4bf" },
  { pos: 0.14, hex: "#22d3ee" },
  { pos: 0.3,  hex: "#a3e635" },
  { pos: 0.43, hex: "#fde047" },
  { pos: 0.57, hex: "#fb923c" },
  { pos: 0.7,  hex: "#ef4444" },
  { pos: 0.85, hex: "#e879f9" },
  { pos: 1.0,  hex: "#a855f7" },
]

// Per-segment interpolators. Interpolate in sRGB so the sampled handle color
// matches the SVG <linearGradient> (which also blends in sRGB) at the same x.
const SEGMENTS = GRADIENT_STOPS.slice(0, -1).map((a, i) => {
  const b = GRADIENT_STOPS[i + 1]
  return { a: a.pos, b: b.pos, mix: interpolate([a.hex, b.hex], "rgb") }
})

/** Sample the gradient color (hex) at a normalized position 0–1. */
export function sampleColor(pos: number): string {
  const p = clamp01(pos)
  for (const seg of SEGMENTS) {
    if (p <= seg.b) {
      const local = seg.b === seg.a ? 0 : (p - seg.a) / (seg.b - seg.a)
      return formatHex(seg.mix(clamp01(local))) ?? GRADIENT_STOPS[0].hex
    }
  }
  return GRADIENT_STOPS[GRADIENT_STOPS.length - 1].hex
}

/** CSS `linear-gradient(...)` string built from the same stops. */
export function gradientCss(angle = "to right"): string {
  const stops = GRADIENT_STOPS.map((s) => `${s.hex} ${Math.round(s.pos * 100)}%`).join(", ")
  return `linear-gradient(${angle}, ${stops})`
}

// ---------------------------------------------------------------------------
// Value mapping
// ---------------------------------------------------------------------------

/** Continuous 0–1 drag position → continuous 0–10 value. */
export function posToValue(pos: number): number {
  return clamp01(pos) * MAX_VALUE
}

/** Continuous 0–10 value → 0–1 drag position. */
export function valueToPos(value: number): number {
  return clamp01(value / MAX_VALUE)
}

/** Nearest integer level (0–10) for a drag position. */
export function posToLevel(pos: number): number {
  return Math.round(clamp01(pos) * MAX_VALUE)
}

export function clamp01(n: number): number {
  return Math.max(0, Math.min(1, n))
}
