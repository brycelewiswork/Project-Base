import { useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageShell, PageHeader, SectionCard } from "@/components/PageLayout"
import { Slider as SliderInput } from "@/components/ui/slider"
import { IconDeviceFloppy, IconRefresh } from "@tabler/icons-react"
import { loadTypeSettings, saveTypeSettings, applyTypeSettings, TYPE_DEFAULTS, type TypeSettings } from "@/lib/typography"

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
  { label: "Paragraph", n: 0, tag: "p" },
  { label: "Paragraph Small", n: -1, tag: "small" },
  { label: "XS", n: -2, tag: "small" },
] as const

const MIN_SIZE_PX = 12

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
  const [saved] = useState(() => loadTypeSettings())
  const [base, setBase] = useState(saved.base)
  const [ratio, setRatio] = useState(saved.ratio)
  const [bodyWeight, setBodyWeight] = useState(saved.weightBody)
  const [headingWeight, setHeadingWeight] = useState(saved.weightHeading)
  const [bodyLH, setBodyLH] = useState(saved.lhBody)
  const [headingLH, setHeadingLH] = useState(saved.lhHeading)
  const [bodyLS, setBodyLS] = useState(saved.lsBody)
  const [headingLS, setHeadingLS] = useState(saved.lsHeading)
  const [opticalSizing, setOpticalSizing] = useState(true)
  const [fluid, setFluid] = useState(false)
  const [minVw, setMinVw] = useState(320)
  const [maxVw, setMaxVw] = useState(1200)
  const [fluidScale, setFluidScale] = useState(0.75)

  const currentSettings = useCallback((): TypeSettings => ({
    base, ratio,
    weightHeading: headingWeight, weightBody: bodyWeight,
    lhHeading: headingLH, lhBody: bodyLH,
    lsHeading: headingLS, lsBody: bodyLS,
  }), [base, ratio, headingWeight, bodyWeight, headingLH, bodyLH, headingLS, bodyLS])

  useEffect(() => {
    applyTypeSettings(currentSettings())
  }, [currentSettings])

  const handleSave = () => {
    saveTypeSettings(currentSettings())
    toast.success("Type scale saved")
  }

  const handleReset = () => {
    setBase(TYPE_DEFAULTS.base)
    setRatio(TYPE_DEFAULTS.ratio)
    setBodyWeight(TYPE_DEFAULTS.weightBody)
    setHeadingWeight(TYPE_DEFAULTS.weightHeading)
    setBodyLH(TYPE_DEFAULTS.lhBody)
    setHeadingLH(TYPE_DEFAULTS.lhHeading)
    setBodyLS(TYPE_DEFAULTS.lsBody)
    setHeadingLS(TYPE_DEFAULTS.lsHeading)
  }

  const computeSize = (n: number) => {
    let px: number
    if (n >= 0) {
      px = base * Math.pow(ratio, n)
    } else {
      const step = Math.min(2, (base - MIN_SIZE_PX) / 2)
      px = Math.max(MIN_SIZE_PX, base + n * step)
    }
    const rem = px / 16
    return { px: Math.round(px * 10) / 10, rem: Math.round(rem * 1000) / 1000 }
  }

  const computeClamp = (n: number) => {
    const { rem: maxRem } = computeSize(n)
    const minRem = Math.max(MIN_SIZE_PX / 16, Math.round(maxRem * fluidScale * 1000) / 1000)
    const slope = (maxRem - minRem) / ((maxVw - minVw) / 16)
    const intercept = Math.round((minRem - slope * (minVw / 16)) * 1000) / 1000
    const slopeVw = Math.round(slope * 100 * 100) / 100
    return {
      minRem,
      maxRem,
      css: `clamp(${minRem}rem, ${intercept}rem + ${slopeVw}vw, ${maxRem}rem)`,
    }
  }

  return (
    <div className="min-h-svh bg-surface text-label">
      <PageShell className="space-y-0! flex flex-col gap-8">
        <header className="flex items-start justify-between">
          <PageHeader
            title="Type"
            description="Tune your type scale live. Changes preview instantly — Save to persist across the system."
          />
          <div className="flex gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <IconDeviceFloppy size={14} stroke={2} /> Save
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <IconRefresh size={14} stroke={2} /> Reset
            </Button>
          </div>
        </header>

        <div className="flex flex-col gap-8">
          {/* Preview */}
          <main className="flex flex-col gap-6">
            {/* Scale */}
            <section className="flex flex-col gap-0">
              {LEVELS.map((level) => {
                const { px, rem } = computeSize(level.n)
                const clamp = fluid ? computeClamp(level.n) : null
                const isHeading = level.n > 0
                return (
                  <div
                    key={level.label}
                    className="flex items-baseline gap-4 border-b border-stroke-faint/40 py-3"
                  >
                    <div className="flex w-32 shrink-0 flex-col gap-0.5 text-right">
                      <span className="font-mono text-xs text-label-secondary">{level.label}</span>
                      <span className="font-mono text-[10px] text-label-secondary/60">
                        {px}px / {rem}rem
                      </span>
                      {clamp && (
                        <span className="font-mono text-[9px] text-label-secondary/40 break-all">
                          {clamp.css}
                        </span>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: clamp ? clamp.css : `${rem}rem`,
                        fontWeight: isHeading ? headingWeight : bodyWeight,
                        lineHeight: isHeading ? headingLH : bodyLH,
                        letterSpacing: `${isHeading ? headingLS : bodyLS}em`,
                        fontOpticalSizing: opticalSizing ? "auto" : "none",
                      }}
                      className="min-w-0 truncate"
                    >
                      {SAMPLE}
                    </span>
                  </div>
                )
              })}
            </section>

            {/* Controls */}
            <SectionCard className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <Slider label="Base size" value={base} min={10} max={24} step={1} unit="px" onChange={setBase} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-label-secondary">Scale ratio</label>
                <select
                  value={ratio}
                  onChange={(e) => setRatio(parseFloat(e.target.value))}
                  className="h-8 rounded-md bg-surface px-2 text-sm inset-ring-1 inset-ring-stroke-faint"
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
              <label className="flex items-center gap-2 text-xs self-end pb-2">
                <input
                  type="checkbox"
                  checked={opticalSizing}
                  onChange={(e) => setOpticalSizing(e.target.checked)}
                  className="accent-blue-500"
                />
                <span className="text-label-secondary">
                  Optical sizing <span className="font-mono">(opsz 9–40)</span>
                </span>
              </label>
              <label className="flex items-center gap-2 text-xs self-end pb-2 sm:col-span-2 lg:col-span-1 border-t border-stroke-faint/40 pt-4 sm:border-t-0 sm:pt-0">
                <input
                  type="checkbox"
                  checked={fluid}
                  onChange={(e) => setFluid(e.target.checked)}
                  className="accent-blue-500"
                />
                <span className="font-medium text-label-secondary">Fluid type (clamp)</span>
              </label>
              {fluid && (
                <>
                  <Slider label="Mobile scale" value={fluidScale} min={0.6} max={0.95} step={0.05} onChange={setFluidScale} />
                  <Slider label="Min viewport" value={minVw} min={280} max={480} step={10} unit="px" onChange={setMinVw} />
                  <Slider label="Max viewport" value={maxVw} min={900} max={1600} step={50} unit="px" onChange={setMaxVw} />
                </>
              )}
            </SectionCard>

            {/* Available weights */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-label-secondary">Available weights — DM Sans Variable</h2>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => (
                  <div
                    key={w}
                    className="flex flex-col gap-1 rounded-lg bg-label/3 p-3"
                  >
                    <span style={{ fontWeight: w }} className="text-lg">
                      Aa
                    </span>
                    <span className="font-mono text-[10px] text-label-secondary">
                      {w} — {WEIGHT_NAMES[w]}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Prose preview */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-label-secondary">Prose preview</h2>
              <ProsePreview
                base={base}
                ratio={ratio}
                bodyWeight={bodyWeight}
                headingWeight={headingWeight}
                bodyLH={bodyLH}
                headingLH={headingLH}
                bodyLS={bodyLS}
                headingLS={headingLS}
                opticalSizing={opticalSizing}
                fluid={fluid}
                computeSize={computeSize}
                computeClamp={fluid ? computeClamp : undefined}
              />
            </section>

            {/* Current values */}
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-medium text-label-secondary">Current values</h2>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">base: {base}px</Badge>
                <Badge variant="secondary">ratio: {ratio}</Badge>
                <Badge variant="secondary">body: {bodyWeight}/{bodyLH}/{bodyLS}em</Badge>
                <Badge variant="secondary">heading: {headingWeight}/{headingLH}/{headingLS}em</Badge>
              </div>
            </section>
          </main>
        </div>
      </PageShell>
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
        <label className="text-xs font-medium text-label-secondary">{label}</label>
        <span className="font-mono text-xs text-label-secondary">
          {Number.isInteger(value) ? value : value.toFixed(step < 0.01 ? 3 : 2)}
          {unit ?? ""}
        </span>
      </div>
      <SliderInput
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : v)}
      />
    </div>
  )
}

function ProsePreview({
  base,
  ratio,
  bodyWeight,
  headingWeight,
  bodyLH,
  headingLH,
  bodyLS,
  headingLS,
  opticalSizing,
  fluid,
  computeSize,
  computeClamp,
}: {
  base: number
  ratio: number
  bodyWeight: number
  headingWeight: number
  bodyLH: number
  headingLH: number
  bodyLS: number
  headingLS: number
  opticalSizing: boolean
  fluid: boolean
  computeSize: (n: number) => { px: number; rem: number }
  computeClamp?: (n: number) => { css: string }
}) {
  const hs = (n: number): React.CSSProperties => ({
    fontSize: computeClamp ? computeClamp(n).css : `${computeSize(n).rem}rem`,
    fontWeight: headingWeight,
    lineHeight: headingLH,
    letterSpacing: `${headingLS}em`,
    fontOpticalSizing: opticalSizing ? "auto" : "none",
    textWrap: "balance",
    marginTop: "1.5em",
    marginBottom: "0.5em",
  })

  const ps: React.CSSProperties = {
    fontSize: computeClamp ? computeClamp(0).css : `${computeSize(0).rem}rem`,
    fontWeight: bodyWeight,
    lineHeight: bodyLH,
    letterSpacing: `${bodyLS}em`,
    fontOpticalSizing: opticalSizing ? "auto" : "none",
    textWrap: "pretty",
    marginBottom: "1em",
  }

  const smps: React.CSSProperties = {
    ...ps,
    fontSize: computeClamp ? computeClamp(-1).css : `${computeSize(-1).rem}rem`,
    color: "var(--label-secondary)",
  }

  return (
    <SectionCard className="max-w-[65ch] px-8 py-6">
      <h1 style={hs(6)}>The Foundations of Good Typography</h1>
      <p style={ps}>
        Typography is the craft of endowing human language with a durable visual
        form. Good typography is measured by how well it reinforces the meaning
        of the text, not by some abstract standard of legibility.
      </p>

      <h2 style={hs(5)}>Why Type Scale Matters</h2>
      <p style={ps}>
        A well-tuned type scale creates visual hierarchy through mathematical
        relationships between sizes, weights, and spacing — letting the
        reader's eye navigate content naturally without conscious effort.
      </p>
      <p style={ps}>
        The ratio between adjacent sizes determines the feel: a tight ratio
        like 1.125 creates subtle, professional hierarchy; a wide ratio like
        1.333 creates dramatic contrast that commands attention.
      </p>

      <h3 style={hs(4)}>Choosing the Right Scale</h3>
      <p style={ps}>
        For long-form reading, a Minor Third (1.2) or Major Second (1.125)
        provides enough differentiation without overwhelming the page. For
        marketing and hero sections, a Perfect Fourth (1.333) or higher gives
        headings the visual weight they need.
      </p>

      <h4 style={hs(3)}>Line Height and Measure</h4>
      <p style={ps}>
        Line height should generally be between 1.4 and 1.6 for body text.
        Shorter lines need less leading; longer lines need more. The ideal
        measure (line length) is 45–75 characters — wide enough for
        comfortable reading, narrow enough to track back to the next line.
      </p>

      <h5 style={hs(2)}>Letter Spacing Adjustments</h5>
      <p style={ps}>
        Large headings often benefit from negative letter-spacing (tighter
        tracking) to maintain visual density. Small text may need slightly
        positive tracking to stay legible. Variable fonts with an optical
        size axis handle some of this automatically.
      </p>

      <h6 style={hs(1)}>A Note on Optical Sizing</h6>
      <p style={ps}>
        Fonts designed with an optical size axis adjust their letterforms
        based on rendered size — wider counters and heavier strokes at small
        sizes, finer details at display sizes. DM Sans supports this from
        9pt to 40pt.
      </p>

      <blockquote
        className="border-l-2 border-label/20 pl-4 italic"
        style={ps}
      >
        "The details are not the details. They make the design."
        <span className="block not-italic" style={smps}>— Charles Eames</span>
      </blockquote>

      <p style={ps}>
        The best typography is invisible — the reader absorbs the content
        without noticing the medium. Every decision in a type system, from
        scale ratio to letter spacing, serves that goal.
      </p>

      <ul className="list-disc pl-6" style={ps}>
        <li>Consistent scale creates predictable hierarchy</li>
        <li>Fluid sizing adapts gracefully across viewports</li>
        <li>Optical sizing preserves legibility at every size</li>
        <li>Balanced wrapping eliminates orphans in headings</li>
      </ul>

      <p style={smps}>
        Last updated — base {base}px, ratio {ratio}, {fluid ? "fluid" : "fixed"}
      </p>
    </SectionCard>
  )
}
