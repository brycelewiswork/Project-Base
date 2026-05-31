import { useState } from "react"
import { IconRestore } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Squircle, SQUIRCLE_RADIUS } from "@/components/squircle"
import { Slider } from "@/components/ui/slider"
import { PageShell, PageHeader, Section, SectionCard } from "@/components/PageLayout"

const SCALE = [
  { token: "space-1", step: 1, px: 4, rem: "0.25", use: "Icon-to-label, badge padding" },
  { token: "space-2", step: 2, px: 8, rem: "0.5", use: "Button padding, list item gaps" },
  { token: "space-3", step: 3, px: 12, rem: "0.75", use: "Nav padding, card header gaps" },
  { token: "space-4", step: 4, px: 16, rem: "1", use: "Card padding, section inner gaps" },
  { token: "space-5", step: 5, px: 20, rem: "1.25", use: "Comfortable subsection separation" },
  { token: "space-6", step: 6, px: 24, rem: "1.5", use: "Page horizontal padding, nav gaps" },
  { token: "space-8", step: 8, px: 32, rem: "2", use: "Section padding" },
  { token: "space-10", step: 10, px: 40, rem: "2.5", use: "Section dividers" },
  { token: "space-12", step: 12, px: 48, rem: "3", use: "Major section gaps" },
  { token: "space-16", step: 16, px: 64, rem: "4", use: "Page vertical padding" },
] as const

const PAIRINGS = [
  { context: "Page container", horizontal: "6 (24px)", vertical: "16 (64px)" },
  { context: "Section gap", horizontal: "—", vertical: "12 (48px)" },
  { context: "Within section", horizontal: "6 (24px)", vertical: "6 (24px)" },
  { context: "Card padding", horizontal: "4 (16px)", vertical: "4 (16px)" },
  { context: "Card compact", horizontal: "3 (12px)", vertical: "3 (12px)" },
  { context: "Element gap", horizontal: "4 (16px)", vertical: "4 (16px)" },
  { context: "Dense list", horizontal: "2 (8px)", vertical: "2 (8px)" },
  { context: "Tight (icons)", horizontal: "1 (4px)", vertical: "1 (4px)" },
] as const

const RED = "var(--color-red-500)"

function MeasureLine({ size, label, vertical, className }: {
  size: number
  label: string
  vertical?: boolean
  className?: string
}) {
  if (vertical) {
    return (
      <div className={cn("flex flex-col items-center", className)} style={{ height: size }}>
        <div style={{ width: 8, height: 1, backgroundColor: RED }} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div style={{ width: 1, flex: 1, backgroundColor: RED }} />
          <span className="px-1 py-0.5 text-[9px] font-bold leading-none whitespace-nowrap" style={{ color: RED }}>
            {label}
          </span>
          <div style={{ width: 1, flex: 1, backgroundColor: RED }} />
        </div>
        <div style={{ width: 8, height: 1, backgroundColor: RED }} />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-row items-center", className)} style={{ width: size }}>
      <div className="h-full" style={{ width: 1, minHeight: 16, backgroundColor: RED }} />
      <div className="flex-1 flex flex-row items-center justify-center">
        <div style={{ height: 1, flex: 1, backgroundColor: RED }} />
        <span className="px-1.5 py-0.5 text-[9px] font-bold leading-none whitespace-nowrap" style={{ color: RED }}>
          {label}
        </span>
        <div style={{ height: 1, flex: 1, backgroundColor: RED }} />
      </div>
      <div className="h-full" style={{ width: 1, minHeight: 16, backgroundColor: RED }} />
    </div>
  )
}

export function Spacing() {
  const [pagePad, setPagePad] = useState(24)
  const [cardPad, setCardPad] = useState(16)
  const [sectionGap, setSectionGap] = useState(48)
  const [elementGap, setElementGap] = useState(16)

  return (
    <PageShell>
      {/* ── Header ── */}
      <PageHeader title="Spacing" description="Base-4 grid, 8pt major grid — Apple HIG-aligned defaults" />

      {/* ── Scale Reference ── */}
      <Section title="Scale" description="Every spacing token with its pixel value and typical use" className="space-y-2">
          {SCALE.map((s) => (
            <div key={s.token} className="flex items-center gap-4">
              <div className="w-20 shrink-0 text-right">
                <div className="font-mono text-xs font-semibold text-label">{s.token}</div>
                <div className="font-mono text-[10px] text-label-secondary">gap-{s.step} · p-{s.step}</div>
              </div>
              <MeasureLine size={Math.max(s.px, 24)} label={`${s.px}px`} />
              <div className="flex-1 min-w-0">
                <span className="font-mono text-[10px] text-label-secondary">{s.rem}rem</span>
                <span className="text-xs text-label-secondary ml-2">{s.use}</span>
              </div>
            </div>
          ))}
      </Section>

      {/* ── Annotated Layout ── */}
      <Section title="Annotated Layout" description="A realistic card layout with red-line annotations showing spacing tokens in context">

        <Squircle
          as="div"
          cornerRadius={SQUIRCLE_RADIUS["2xl"]}
          shadow="md"
          className="relative rounded-2xl bg-surface p-0 overflow-visible"
        >
          {/* Top page padding */}
          <div className="py-1">
            <MeasureLine size={24} label="24px" vertical />
          </div>

          <div className="flex">
            {/* Left page padding */}
            <div className="flex items-center px-1">
              <MeasureLine size={24} label="24px" />
            </div>

            <div className="flex-1 space-y-2">
              {/* ── Card 1 ── */}
              <Squircle
                as="div"
                cornerRadius={SQUIRCLE_RADIUS.xl}
                shadow="xs"
                className="rounded-xl bg-surface-secondary overflow-visible"
              >
                <div className="flex">
                  {/* Card left padding annotation */}
                  <div className="flex items-center px-0.5 py-4">
                    <MeasureLine size={16} label="16px" />
                  </div>

                  <div className="flex-1 py-4 pr-4">
                    {/* Title placeholder */}
                    <div className="h-5 w-36 rounded-md bg-label/25" />

                    {/* Gap: title → description */}
                    <div className="py-0.5">
                      <MeasureLine size={4} label="4px" vertical />
                    </div>

                    {/* Description placeholder */}
                    <div className="h-3.5 w-56 rounded bg-label/15" />

                    {/* Gap: header → content */}
                    <div className="py-0.5">
                      <MeasureLine size={16} label="16px" vertical />
                    </div>

                    {/* Row 1 */}
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-surface-tertiary border border-stroke-faint" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 w-28 rounded bg-label/20" />
                        <div className="h-3 w-40 rounded bg-label/10" />
                      </div>
                    </div>

                    {/* Gap: row → row */}
                    <div className="py-0.5">
                      <MeasureLine size={8} label="8px" vertical />
                    </div>

                    {/* Row 2 */}
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-surface-tertiary border border-stroke-faint" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 w-32 rounded bg-label/20" />
                        <div className="h-3 w-36 rounded bg-label/10" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card bottom padding */}
                <div className="pb-1">
                  <MeasureLine size={16} label="16px" vertical />
                </div>
              </Squircle>

              {/* Section gap annotation */}
              <MeasureLine size={48} label="48px" vertical />

              {/* ── Card 2 (compact) ── */}
              <Squircle
                as="div"
                cornerRadius={SQUIRCLE_RADIUS.xl}
                shadow="xs"
                className="rounded-xl bg-surface-secondary p-3 overflow-visible"
              >
                <div className="h-4.5 w-28 rounded-md bg-label/25" />
                <div className="h-3 w-44 rounded bg-label/15 mt-1.5" />
                <div className="text-[10px] text-label-secondary font-mono mt-2">compact card — p-3 (12px)</div>
              </Squircle>
            </div>

            {/* Right page padding */}
            <div className="flex items-center px-1">
              <MeasureLine size={24} label="24px" />
            </div>
          </div>

          {/* Bottom page padding */}
          <div className="py-1">
            <MeasureLine size={24} label="24px" vertical />
          </div>
        </Squircle>
      </Section>

      {/* ── Interactive Tuner ── */}
      <section className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-h6 text-label">Tuner</h2>
            <p className="text-body text-label-secondary mt-0.5">Drag sliders to see how spacing values affect a live layout</p>
          </div>
          <button
            onClick={() => { setPagePad(24); setCardPad(16); setSectionGap(48); setElementGap(16) }}
            className="size-7 shrink-0 rounded-md bg-surface-tertiary flex items-center justify-center text-label-secondary hover:text-label hover:bg-fill-primary transition-colors cursor-pointer"
            title="Reset to defaults"
          >
            <IconRestore size={14} stroke={2} />
          </button>
        </div>

        <div className="grid grid-cols-[240px_1fr] gap-6">
          {/* Controls */}
          <div className="space-y-5">
            {[
              { label: "Page padding", value: pagePad, set: setPagePad, min: 8, max: 48 },
              { label: "Card padding", value: cardPad, set: setCardPad, min: 4, max: 32 },
              { label: "Section gap", value: sectionGap, set: setSectionGap, min: 16, max: 80 },
              { label: "Element gap", value: elementGap, set: setElementGap, min: 2, max: 24 },
            ].map((ctrl) => (
              <div key={ctrl.label}>
                <div className="flex items-baseline justify-between mb-1.5">
                  <span className="text-xs font-medium text-label">{ctrl.label}</span>
                  <span className="font-mono text-xs font-semibold text-label tabular-nums">{ctrl.value}px</span>
                </div>
                <Slider
                  min={ctrl.min}
                  max={ctrl.max}
                  step={2}
                  value={[ctrl.value]}
                  onValueChange={(v) => ctrl.set(Array.isArray(v) ? v[0] : v)}
                />
              </div>
            ))}
          </div>

          {/* Live preview */}
          <Squircle
            as="div"
            cornerRadius={SQUIRCLE_RADIUS["2xl"]}
            shadow="md"
            className="rounded-2xl bg-surface overflow-visible"
            style={{ padding: pagePad }}
          >
            <Squircle
              as="div"
              cornerRadius={SQUIRCLE_RADIUS.xl}
              shadow="xs"
              className="rounded-xl bg-surface-secondary"
              style={{ padding: cardPad }}
            >
              <div className="h-4.5 w-32 rounded-md bg-label/25" />
              <div className="h-3 w-48 rounded bg-label/15" style={{ marginTop: elementGap / 2 }} />
              <div style={{ marginTop: elementGap }}>
                <div className="flex" style={{ gap: elementGap / 2 }}>
                  <div className="size-9 rounded-lg bg-surface-tertiary border border-stroke-faint shrink-0" />
                  <div className="flex-1" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div className="h-3.5 w-24 rounded bg-label/20" />
                    <div className="h-3 w-32 rounded bg-label/10" />
                  </div>
                </div>
                <div className="flex" style={{ gap: elementGap / 2, marginTop: elementGap / 2 }}>
                  <div className="size-9 rounded-lg bg-surface-tertiary border border-stroke-faint shrink-0" />
                  <div className="flex-1" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <div className="h-3.5 w-28 rounded bg-label/20" />
                    <div className="h-3 w-36 rounded bg-label/10" />
                  </div>
                </div>
              </div>
            </Squircle>

            <div style={{ height: sectionGap }} />

            <Squircle
              as="div"
              cornerRadius={SQUIRCLE_RADIUS.xl}
              shadow="xs"
              className="rounded-xl bg-surface-secondary"
              style={{ padding: cardPad }}
            >
              <div className="h-4.5 w-36 rounded-md bg-label/25" />
              <div className="h-3 w-40 rounded bg-label/15" style={{ marginTop: elementGap / 2 }} />
            </Squircle>
          </Squircle>
        </div>
      </section>

      {/* ── Recommended Pairings ── */}
      <Section title="Recommended Pairings" description="Which token to use where" noPadding>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-tertiary text-left text-xs text-label-secondary">
                <th className="px-4 py-2.5 font-medium">Context</th>
                <th className="px-4 py-2.5 font-medium">Horizontal</th>
                <th className="px-4 py-2.5 font-medium">Vertical</th>
              </tr>
            </thead>
            <tbody>
              {PAIRINGS.map((p, i) => (
                <tr
                  key={p.context}
                  className={cn(
                    "border-t border-stroke-faint",
                    i % 2 === 0 ? "bg-surface-secondary" : "bg-surface"
                  )}
                >
                  <td className="px-4 py-2.5 text-label font-medium">{p.context}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-label-secondary">{p.horizontal}</td>
                  <td className="px-4 py-2.5 font-mono text-xs text-label-secondary">{p.vertical}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </Section>
    </PageShell>
  )
}
