import {
  IconTable,
  IconChartLine,
  IconEye,
  IconPlus,
  IconMinus,
} from "@tabler/icons-react"
import { PageShell, PageHeader, Section, SectionCard } from "@/components/PageLayout"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  useFluidConfig,
  useViewportWidth,
  NumberSlider,
  PageActions,
  FoundationRef,
} from "@/pages/_fluid-controls"
import {
  computeTypeScale,
  resolveClamp,
  exportFluidCss,
  TYPE_ROLES,
  type TypeStep,
  type FluidConfig,
} from "@/lib/fluid"
import { cn } from "@/lib/utils"

const MAX_POSITIVE = 9
const MAX_NEGATIVE = 6

export function Typography() {
  const { cfg, patchType, save, reset } = useFluidConfig()
  const steps = computeTypeScale(cfg)
  const t = cfg.type

  const stepControls = {
    addAbove: () => patchType({ positiveSteps: Math.min(MAX_POSITIVE, t.positiveSteps + 1) }),
    removeAbove: () => patchType({ positiveSteps: Math.max(1, t.positiveSteps - 1) }),
    addBelow: () => patchType({ negativeSteps: Math.min(MAX_NEGATIVE, t.negativeSteps + 1) }),
    removeBelow: () => patchType({ negativeSteps: Math.max(0, t.negativeSteps - 1) }),
  }

  return (
    <PageShell>
      <header className="flex items-start justify-between gap-4">
        <PageHeader
          title="Type"
          description="Fluid modular scale (Utopia clamp). Add or remove steps with ±, watch it in the graph, preview it in the visualiser."
        />
        <PageActions onSave={save} onReset={reset} copyText={() => exportFluidCss(cfg)} />
      </header>

      {/* ── Scale explorer ── */}
      <Tabs defaultValue="table">
        <TabsList>
          <TabsTrigger value="table"><IconTable /> Table</TabsTrigger>
          <TabsTrigger value="graph"><IconChartLine /> Graph</TabsTrigger>
          <TabsTrigger value="visualiser"><IconEye /> Visualiser</TabsTrigger>
        </TabsList>
        <SectionCard noPadding className="overflow-hidden">
          <TabsContent value="table">
            <ScaleTable steps={steps} cfg={cfg} controls={stepControls} />
          </TabsContent>
          <TabsContent value="graph">
            <ScaleGraph steps={steps} cfg={cfg} />
          </TabsContent>
          <TabsContent value="visualiser">
            <ScaleVisualiser steps={steps} cfg={cfg} />
          </TabsContent>
        </SectionCard>
      </Tabs>

      {/* ── Type refinements (not part of the scale itself) ── */}
      <Section
        title="Type refinements"
        description="Weights, line-heights, and tracking. Viewport, font size, and ratio are shared foundation values."
        className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        <NumberSlider label="Body weight" value={t.weightBody} min={100} max={900} step={100}
          onChange={(v) => patchType({ weightBody: v })} />
        <NumberSlider label="Heading weight" value={t.weightHeading} min={100} max={900} step={100}
          onChange={(v) => patchType({ weightHeading: v })} />
        <div className="hidden lg:block" />
        <NumberSlider label="Body line-height" value={t.lhBody} min={1} max={2} step={0.05}
          onChange={(v) => patchType({ lhBody: v })} />
        <NumberSlider label="Heading line-height" value={t.lhHeading} min={1} max={1.6} step={0.05}
          onChange={(v) => patchType({ lhHeading: v })} />
        <div className="hidden lg:block" />
        <NumberSlider label="Body tracking" value={t.lsBody} min={-0.05} max={0.1} step={0.005} unit="em"
          onChange={(v) => patchType({ lsBody: v })} />
        <NumberSlider label="Heading tracking" value={t.lsHeading} min={-0.05} max={0.05} step={0.005} unit="em"
          onChange={(v) => patchType({ lsHeading: v })} />
        <div className="sm:col-span-2 lg:col-span-3">
          <FoundationRef cfg={cfg} />
        </div>
      </Section>

      {/* ── Semantic roles ── */}
      <Section
        title="Semantic roles"
        description="Role utilities alias a primitive step. Use these in components; add/remove steps above and every role follows."
        noPadding
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-tertiary text-left text-caption text-label-secondary">
              <th className="px-inset-s py-inset-2xs font-medium">Role utility</th>
              <th className="px-inset-s py-inset-2xs font-medium">Legacy alias</th>
              <th className="px-inset-s py-inset-2xs font-medium">Primitive</th>
              <th className="px-inset-s py-inset-2xs font-medium">Sample</th>
            </tr>
          </thead>
          <tbody>
            {TYPE_ROLES.map((r, i) => (
              <tr key={r.role} className={i % 2 === 0 ? "bg-surface-secondary" : "bg-surface"}>
                <td className="px-inset-s py-inset-2xs font-mono text-caption text-label">.text-{r.role}</td>
                <td className="px-inset-s py-inset-2xs font-mono text-caption text-label-secondary">
                  {r.legacy ? `.text-${r.legacy}` : "—"}
                </td>
                <td className="px-inset-s py-inset-2xs font-mono text-caption text-label-secondary">
                  step {r.step > 0 ? `+${r.step}` : r.step}
                </td>
                <td className="px-inset-s py-inset-2xs">
                  <span className={`text-${r.role} text-label`}>Ag</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </PageShell>
  )
}

/** Round-icon ± button (Utopia style). */
function StepButton({ kind, onClick, title }: { kind: "add" | "remove"; onClick: () => void; title: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="flex size-6 items-center justify-center rounded-full text-label-secondary inset-ring-1 inset-ring-stroke-strong transition-colors hover:bg-fill-secondary hover:text-label"
    >
      {kind === "add" ? <IconPlus size={13} stroke={2.5} /> : <IconMinus size={13} stroke={2.5} />}
    </button>
  )
}

type StepControls = {
  addAbove: () => void
  removeAbove: () => void
  addBelow: () => void
  removeBelow: () => void
}

function ScaleTable({ steps, cfg, controls }: { steps: TypeStep[]; cfg: FluidConfig; controls: StepControls }) {
  const desc = [...steps].reverse()
  const cell = "px-inset-s py-inset-2xs tabular-nums"
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-stroke-faint text-left text-caption text-label-secondary">
          <th className="w-24 px-inset-s py-inset-2xs font-medium">Scale step</th>
          <th className="px-inset-s py-inset-2xs font-medium" colSpan={2}>Viewport width</th>
        </tr>
      </thead>
      <tbody>
        {/* add-above + the two viewport anchors */}
        <tr className="border-b border-stroke-faint">
          <td className="px-inset-s py-inset-xs">
            <StepButton kind="add" onClick={controls.addAbove} title="Add a step above" />
          </td>
          <td className={cn(cell, "font-semibold text-label")}>{cfg.viewport.min}</td>
          <td className={cn(cell, "font-semibold text-label")}>{cfg.viewport.max}</td>
        </tr>
        {desc.map((s, i) => {
          const isTop = i === 0
          const isBottom = i === desc.length - 1
          const isBase = s.step === 0
          return (
            <tr key={s.step} className={cn("border-b border-stroke-faint/60", isBase && "bg-blue-500/6")}>
              <td className="px-inset-s py-inset-2xs">
                <div className="flex items-center justify-end gap-inline-2xs">
                  {isTop && <StepButton kind="remove" onClick={controls.removeAbove} title="Remove top step" />}
                  {isBottom && !isTop && (
                    <StepButton kind="remove" onClick={controls.removeBelow} title="Remove bottom step" />
                  )}
                  <span className={cn("font-mono font-semibold", isBase ? "text-label" : "text-label-secondary")}>
                    {s.step}
                  </span>
                </div>
              </td>
              <td className={cn(cell, isBase ? "font-semibold text-label" : "text-label")}>{s.minPx.toFixed(2)}</td>
              <td className={cn(cell, isBase ? "font-semibold text-label" : "text-label")}>{s.maxPx.toFixed(2)}</td>
            </tr>
          )
        })}
        {/* add-below */}
        <tr>
          <td className="px-inset-s py-inset-xs">
            <StepButton kind="add" onClick={controls.addBelow} title="Add a step below" />
          </td>
          <td /><td />
        </tr>
      </tbody>
    </table>
  )
}

function ScaleGraph({ steps, cfg }: { steps: TypeStep[]; cfg: FluidConfig }) {
  const W = 720
  const H = 420
  const xMin = 190
  const xMax = 610
  const top = 64
  const bottom = 344

  const vals = steps.flatMap((s) => [s.minPx, s.maxPx])
  const vLo = Math.min(...vals)
  const vHi = Math.max(...vals)
  const range = vHi - vLo || 1
  const lo = vLo - range * 0.08
  const hi = vHi + range * 0.08
  const y = (v: number) => bottom - ((v - lo) / (hi - lo)) * (bottom - top)

  return (
    <div className="overflow-x-auto p-inset-s">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 520 }}>
        {/* guides */}
        {[xMin, xMax].map((gx) => (
          <line key={gx} x1={gx} y1={top - 20} x2={gx} y2={bottom + 20}
            className="stroke-stroke-strong" strokeDasharray="4 4" strokeWidth={1} />
        ))}
        {/* viewport labels */}
        <text x={xMin} y={top - 30} textAnchor="middle" className="fill-label font-mono" fontSize={13} fontWeight={600}>
          {cfg.viewport.min}px
        </text>
        <text x={xMax} y={top - 30} textAnchor="middle" className="fill-label font-mono" fontSize={13} fontWeight={600}>
          {cfg.viewport.max}px
        </text>
        {/* ratio labels */}
        <text x={xMin} y={bottom + 44} textAnchor="middle" className="fill-label-secondary font-mono" fontSize={12}>
          ×{cfg.ratio.min}
        </text>
        <text x={xMax} y={bottom + 44} textAnchor="middle" className="fill-label-secondary font-mono" fontSize={12}>
          ×{cfg.ratio.max}
        </text>

        {/* step lines */}
        {steps.map((s) => {
          const isBase = s.step === 0
          return (
            <line key={`l${s.step}`} x1={xMin} y1={y(s.minPx)} x2={xMax} y2={y(s.maxPx)}
              className={isBase ? "stroke-blue-600" : "stroke-blue-500/45"}
              strokeWidth={isBase ? 2.5 : 1.5} strokeLinecap="round" />
          )
        })}

        {/* base-step px annotations */}
        {steps.filter((s) => s.step === 0).map((s) => (
          <g key="base-labels">
            <text x={xMin - 20} y={y(s.minPx) + 4} textAnchor="end" className="fill-label-secondary font-mono" fontSize={11}>
              {s.minPx.toFixed(0)}px
            </text>
            <text x={xMax + 20} y={y(s.maxPx) + 4} textAnchor="start" className="fill-label-secondary font-mono" fontSize={11}>
              {s.maxPx.toFixed(0)}px
            </text>
          </g>
        ))}

        {/* dots + step numbers at each anchor */}
        {steps.map((s) => (
          <g key={`d${s.step}`}>
            {[[xMin, s.minPx], [xMax, s.maxPx]].map(([cx, v], j) => (
              <g key={j}>
                <circle cx={cx} cy={y(v)} r={11} className="fill-label" />
                <text x={cx} y={y(v) + 4} textAnchor="middle" className="fill-surface-secondary font-mono" fontSize={11} fontWeight={600}>
                  {s.step}
                </text>
              </g>
            ))}
          </g>
        ))}
      </svg>
      <p className="mt-stack-2xs text-center text-caption text-label-secondary">
        Font size of every step between the min and max viewport.
      </p>
    </div>
  )
}

function ScaleVisualiser({ steps, cfg }: { steps: TypeStep[]; cfg: FluidConfig }) {
  const width = useViewportWidth()
  const desc = [...steps].reverse()
  const roleFor = (step: number) => TYPE_ROLES.find((r) => r.step === step)?.role
  return (
    <div className="space-y-5 p-inset-l">
      <p className="text-body text-label">
        Previewing at <span className="font-semibold">{width}px</span>
        <span className="text-caption text-label-secondary"> — your current viewport. Resize the window to see the scale flow.</span>
      </p>
      <div className="space-y-2">
        {desc.map((s) => {
          const role = roleFor(s.step)
          return (
            <div key={s.step} className="flex items-baseline gap-inline-s border-b border-stroke-faint/40 pb-inset-2xs">
              {/* Real clamp → the browser resolves it at the actual viewport. */}
              <span
                className="min-w-0 flex-1 truncate font-semibold text-label"
                style={{ fontSize: s.css, lineHeight: cfg.type.lhHeading }}
              >
                Step {s.step}{role ? <span className="text-label-secondary font-normal"> · {role}</span> : null}
              </span>
              <span className="shrink-0 font-mono text-caption text-label-secondary tabular-nums">
                {resolveClamp(s, width).toFixed(2)}px
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
