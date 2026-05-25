import { useState } from "react"
import { Badge } from "@/components/ui/badge"

const SCALE_RATIOS = [
  { name: "Minor Second", value: 1.067 },
  { name: "Major Second", value: 1.125 },
  { name: "Minor Third", value: 1.200 },
  { name: "Major Third", value: 1.250 },
  { name: "Perfect Fourth", value: 1.333 },
  { name: "Augmented Fourth", value: 1.414 },
  { name: "Perfect Fifth", value: 1.500 },
  { name: "Golden Ratio", value: 1.618 },
] as const

const LEVELS = [
  { label: "H1", n: 6, tag: "h1" },
  { label: "H2", n: 5, tag: "h2" },
  { label: "H3", n: 4, tag: "h3" },
  { label: "H4", n: 3, tag: "h4" },
  { label: "H5", n: 2, tag: "h5" },
  { label: "H6", n: 1, tag: "h6" },
  { label: "Body", n: 0, tag: "p" },
  { label: "Small", n: -1, tag: "small" },
  { label: "XS", n: -2, tag: "small" },
] as const

const WEIGHT_NAMES: Record<number, string> = {
  100: "Thin",
  200: "Extra Light",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "Semi Bold",
  700: "Bold",
  800: "Extra Bold",
  900: "Black",
}

const SAMPLE = "The quick brown fox jumps over the lazy dog"

export function Typography() {
  const [base, setBase] = useState(14)
  const [ratio, setRatio] = useState(1.2)
  const [bodyWeight, setBodyWeight] = useState(400)
  const [headingWeight, setHeadingWeight] = useState(600)
  const [bodyLH, setBodyLH] = useState(1.5)
  const [headingLH, setHeadingLH] = useState(1.2)
  const [bodyLS, setBodyLS] = useState(0)
  const [headingLS, setHeadingLS] = useState(-0.02)

  const computeSize = (n: number) => {
    const px = base * Math.pow(ratio, n)
    const rem = px / 16
    return { px: Math.round(px * 10) / 10, rem: Math.round(rem * 1000) / 1000 }
  }

  return (
    <div className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12">
        <header className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold tracking-tight">Typography</h1>
          <p className="text-muted-foreground">
            Tune your type scale live. Formula: <code className="font-mono text-sm">base × ratio<sup>n</sup></code>
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Controls */}
          <aside className="flex flex-col gap-5 rounded-xl bg-foreground/3 p-4">
            <Slider label="Base size" value={base} min={10} max={24} step={1} unit="px" onChange={setBase} />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-muted-foreground">Scale ratio</label>
              <select
                value={ratio}
                onChange={(e) => setRatio(parseFloat(e.target.value))}
                className="h-8 rounded-md bg-background px-2 text-sm inset-ring-1 inset-ring-border"
              >
                {SCALE_RATIOS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.name} ({r.value})
                  </option>
                ))}
              </select>
            </div>
            <Slider label="Body weight" value={bodyWeight} min={100} max={900} step={100} onChange={setBodyWeight} />
            <Slider label="Heading weight" value={headingWeight} min={100} max={900} step={100} onChange={setHeadingWeight} />
            <Slider label="Body line-height" value={bodyLH} min={1} max={2} step={0.05} onChange={setBodyLH} />
            <Slider label="Heading line-height" value={headingLH} min={1} max={1.6} step={0.05} onChange={setHeadingLH} />
            <Slider label="Body tracking" value={bodyLS} min={-0.05} max={0.1} step={0.005} unit="em" onChange={setBodyLS} />
            <Slider label="Heading tracking" value={headingLS} min={-0.05} max={0.05} step={0.005} unit="em" onChange={setHeadingLS} />
          </aside>

          {/* Preview */}
          <main className="flex flex-col gap-6">
            {/* Scale */}
            <section className="flex flex-col gap-0">
              {LEVELS.map((level) => {
                const { px, rem } = computeSize(level.n)
                const isHeading = level.n > 0
                return (
                  <div
                    key={level.label}
                    className="flex items-baseline gap-4 border-b border-border/40 py-3"
                  >
                    <div className="flex w-28 shrink-0 flex-col gap-0.5 text-right">
                      <span className="font-mono text-xs text-muted-foreground">{level.label}</span>
                      <span className="font-mono text-[10px] text-muted-foreground/60">
                        {px}px / {rem}rem
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: `${rem}rem`,
                        fontWeight: isHeading ? headingWeight : bodyWeight,
                        lineHeight: isHeading ? headingLH : bodyLH,
                        letterSpacing: `${isHeading ? headingLS : bodyLS}em`,
                      }}
                      className="min-w-0 truncate"
                    >
                      {SAMPLE}
                    </span>
                  </div>
                )
              })}
            </section>

            {/* Available weights */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-muted-foreground">Available weights — DM Sans Variable</h2>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => (
                  <div
                    key={w}
                    className="flex flex-col gap-1 rounded-lg bg-foreground/3 p-3"
                  >
                    <span style={{ fontWeight: w }} className="text-lg">
                      Aa
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {w} — {WEIGHT_NAMES[w]}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Paragraph preview */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-muted-foreground">Paragraph preview</h2>
              <div
                className="rounded-xl bg-foreground/3 p-6"
                style={{
                  fontSize: `${computeSize(0).rem}rem`,
                  fontWeight: bodyWeight,
                  lineHeight: bodyLH,
                  letterSpacing: `${bodyLS}em`,
                }}
              >
                <p className="mb-4">
                  Typography is the craft of endowing human language with a durable visual form.
                  Good typography is measured by how well it reinforces the meaning of the text,
                  not by some abstract standard of legibility.
                </p>
                <p>
                  A well-tuned type scale creates visual hierarchy through mathematical
                  relationships between sizes, weights, and spacing — letting the reader's eye
                  navigate content naturally without conscious effort.
                </p>
              </div>
            </section>

            {/* Current values */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-muted-foreground">Current values</h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">base: {base}px</Badge>
                <Badge variant="secondary">ratio: {ratio}</Badge>
                <Badge variant="secondary">body: {bodyWeight}/{bodyLH}/{bodyLS}em</Badge>
                <Badge variant="secondary">heading: {headingWeight}/{headingLH}/{headingLS}em</Badge>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit?: string
  onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        <span className="font-mono text-xs text-muted-foreground">
          {Number.isInteger(value) ? value : value.toFixed(step < 0.01 ? 3 : 2)}
          {unit ?? ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-foreground"
      />
    </div>
  )
}
