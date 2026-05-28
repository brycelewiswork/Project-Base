import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { PageShell, PageHeader, Section } from "@/components/PageHeader"

type ThemeVal = { light: string; dark: string }
type Token = { name: string; cssVar: string; utility: string; oklch: ThemeVal }

const SURFACES: Token[] = [
  { name: "Surface", cssVar: "--surface", utility: "bg-surface", oklch: { light: "0.979 0 0", dark: "0.159 0 0" } },
  { name: "Surface Secondary", cssVar: "--surface-secondary", utility: "bg-surface-secondary", oklch: { light: "1 0 0", dark: "0.205 0 0" } },
  { name: "Surface Tertiary", cssVar: "--surface-tertiary", utility: "bg-surface-tertiary", oklch: { light: "0.973 0 0", dark: "0.256 0 0" } },
]

const LABELS: Token[] = [
  { name: "Label", cssVar: "--label", utility: "text-label", oklch: { light: "0.336 0.005 107", dark: "1 0 0 / 90%" } },
  { name: "Label Secondary", cssVar: "--label-secondary", utility: "text-label-secondary", oklch: { light: "0.359 0.012 286 / 60%", dark: "1 0 0 / 55%" } },
  { name: "Label Tertiary", cssVar: "--label-tertiary", utility: "text-label-tertiary", oklch: { light: "0 0 0 / 25%", dark: "1 0 0 / 25%" } },
]

const STROKES: Token[] = [
  { name: "Stroke Faint", cssVar: "--stroke-faint", utility: "border-stroke-faint", oklch: { light: "0.931 0 0", dark: "1 0 0 / 8%" } },
  { name: "Stroke Strong", cssVar: "--stroke-strong", utility: "border-stroke-strong", oklch: { light: "0.919 0.007 269", dark: "1 0 0 / 12%" } },
]

const FILLS: Token[] = [
  { name: "Fill Primary", cssVar: "--fill-primary", utility: "bg-fill-primary", oklch: { light: "black-10", dark: "white-10" } },
  { name: "Fill Secondary", cssVar: "--fill-secondary", utility: "bg-fill-secondary", oklch: { light: "black-8", dark: "white-8" } },
  { name: "Fill Tertiary", cssVar: "--fill-tertiary", utility: "bg-fill-tertiary", oklch: { light: "black-5", dark: "white-5" } },
  { name: "Fill Quaternary", cssVar: "--fill-quaternary", utility: "bg-fill-quaternary", oklch: { light: "black-3", dark: "white-3" } },
  { name: "Fill Quinary", cssVar: "--fill-quinary", utility: "bg-fill-quinary", oklch: { light: "black-2", dark: "white-2" } },
]

const INTERACTIVE: Token[] = [
  { name: "Primary", cssVar: "--primary", utility: "bg-primary", oklch: { light: "0.205 0 0", dark: "0.922 0 0" } },
  { name: "Primary Foreground", cssVar: "--primary-foreground", utility: "text-primary-foreground", oklch: { light: "0.985 0 0", dark: "0.205 0 0" } },
  { name: "Destructive", cssVar: "--destructive", utility: "bg-destructive", oklch: { light: "0.577 0.245 27.325", dark: "0.704 0.191 22.216" } },
  { name: "Ring", cssVar: "--ring", utility: "ring-ring", oklch: { light: "0.708 0 0", dark: "0.556 0 0" } },
]

const SIDEBAR: Token[] = [
  { name: "Sidebar", cssVar: "--sidebar", utility: "bg-sidebar", oklch: { light: "0.985 0 0", dark: "0.205 0 0" } },
  { name: "Sidebar Foreground", cssVar: "--sidebar-foreground", utility: "text-sidebar-foreground", oklch: { light: "0.336 0.005 107", dark: "1 0 0 / 90%" } },
  { name: "Sidebar Primary", cssVar: "--sidebar-primary", utility: "bg-sidebar-primary", oklch: { light: "0.205 0 0", dark: "0.488 0.243 264.376" } },
  { name: "Sidebar Primary FG", cssVar: "--sidebar-primary-foreground", utility: "text-sidebar-primary-foreground", oklch: { light: "0.985 0 0", dark: "0.985 0 0" } },
  { name: "Sidebar Accent", cssVar: "--sidebar-accent", utility: "bg-sidebar-accent", oklch: { light: "0.973 0 0", dark: "0.256 0 0" } },
  { name: "Sidebar Accent FG", cssVar: "--sidebar-accent-foreground", utility: "text-sidebar-accent-foreground", oklch: { light: "0.336 0.005 107", dark: "1 0 0 / 90%" } },
  { name: "Sidebar Border", cssVar: "--sidebar-border", utility: "border-sidebar-border", oklch: { light: "0.931 0 0", dark: "0.205 0 0" } },
  { name: "Sidebar Ring", cssVar: "--sidebar-ring", utility: "ring-sidebar-ring", oklch: { light: "0.708 0 0", dark: "0.556 0 0" } },
]

const NEUTRAL_STEPS = [
  { step: "50", l: "0.985" },
  { step: "100", l: "0.970" },
  { step: "200", l: "0.932" },
  { step: "300", l: "0.870" },
  { step: "400", l: "0.710" },
  { step: "500", l: "0.555" },
  { step: "600", l: "0.440" },
  { step: "700", l: "0.355" },
  { step: "800", l: "0.270" },
  { step: "900", l: "0.205" },
  { step: "950", l: "0.145" },
] as const

const ACCENT_HUES = [
  "red", "orange", "yellow", "green", "mint", "teal",
  "cyan", "blue", "indigo", "purple", "pink", "brown",
] as const

const ACCENT_STEPS = [50, 100, 150, 200, 300, 400, 500, 600, 700, 800, 850, 900, 950] as const

const OPACITY_STEPS = [1,2,3,4,5,6,7,8,9,10,11,12,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100] as const

function Tag({ children }: { children: string }) {
  return (
    <span className="inline-block font-mono text-[10px] text-label-secondary px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/5">
      {children}
    </span>
  )
}

function Swatch({ token, isDark, cols = 3 }: { token: Token; isDark: boolean; cols?: number }) {
  const isText = token.utility.startsWith("text-")
  const isBorder = token.utility.startsWith("border-") || token.utility.startsWith("ring-")
  const oklch = isDark ? token.oklch.dark : token.oklch.light

  return (
    <div>
      {isText ? (
        <div className="h-16 rounded-xl border border-stroke-faint bg-surface flex items-center justify-center">
          <span className="text-h5" style={{ color: `var(${token.cssVar})` }}>Aa</span>
        </div>
      ) : isBorder ? (
        <div
          className="h-16 rounded-xl bg-surface-secondary"
          style={{ border: `2px solid var(${token.cssVar})` }}
        />
      ) : (
        <div
          className="h-16 rounded-xl border border-stroke-faint"
          style={{ backgroundColor: `var(${token.cssVar})` }}
        />
      )}
      <div className="mt-2 space-y-0.5">
        <div className="font-mono text-[11px] text-label">{token.cssVar.slice(2)}</div>
        <div className={cn("font-mono text-[11px] text-label-secondary", cols <= 3 && "hidden sm:block")}>
          {token.utility}
        </div>
        <div className="font-mono text-[11px] text-label-secondary">oklch({oklch})</div>
      </div>
    </div>
  )
}

export function Colors() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isDark = mounted && resolvedTheme === "dark"

  return (
    <PageShell>
      {/* ── Header ── */}
      <PageHeader title="Color" description="Every color defined in the system" />

      {/* ── Surfaces ── */}
      <Section title="Surfaces" description="Layered backgrounds for depth and hierarchy">
        <div className="bg-surface rounded-2xl p-8 border border-stroke-faint">
          <Tag>surface</Tag>
          <div className="mt-4 bg-surface-secondary rounded-xl p-6 border border-stroke-faint">
            <Tag>surface-secondary</Tag>
            <div className="mt-4 bg-surface-tertiary rounded-lg p-5">
              <Tag>surface-tertiary</Tag>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {SURFACES.map((t) => <Swatch key={t.cssVar} token={t} isDark={isDark} />)}
        </div>
      </Section>

      {/* ── Labels ── */}
      <Section title="Labels" description="Text hierarchy with tinted neutrals and opacity">
        <div className="bg-surface rounded-2xl border border-stroke-faint p-8 space-y-6">
          {LABELS.map((l) => (
            <div key={l.cssVar} className="flex items-start justify-between gap-8">
              <p className="text-h5 flex-1" style={{ color: `var(${l.cssVar})` }}>
                {l.name} — {l.cssVar.slice(2)}
              </p>
              <div className="shrink-0 text-right space-y-0.5">
                <div className="font-mono text-[11px] text-label">{l.utility}</div>
                <div className="font-mono text-[11px] text-label-secondary">
                  oklch({isDark ? l.oklch.dark : l.oklch.light})
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Strokes ── */}
      <Section title="Strokes" description="Border tokens for separators and containers">
        <div className="grid grid-cols-2 gap-6">
          {STROKES.map((t) => <Swatch key={t.cssVar} token={t} isDark={isDark} />)}
        </div>
      </Section>

      {/* ── Fills ── */}
      <Section title="Fills" description="Translucent overlays — black in light mode, white in dark, referencing opacity primitives">
        <div className="grid grid-cols-5 gap-4">
          {FILLS.map((t) => (
            <div key={t.cssVar}>
              <div
                className="h-16 rounded-xl border border-stroke-faint"
                style={{ backgroundColor: `var(${t.cssVar})` }}
              />
              <div className="mt-2 space-y-0.5">
                <div className="font-mono text-[11px] text-label">{t.cssVar.slice(2)}</div>
                <div className="font-mono text-[11px] text-label-secondary">{t.utility}</div>
                <div className="font-mono text-[11px] text-label-secondary">
                  {isDark ? t.oklch.dark : t.oklch.light}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Interactive ── */}
      <Section title="Interactive" description="Action colors for buttons, focus rings, and status">
        <div className="grid grid-cols-4 gap-4">
          {INTERACTIVE.map((t) => <Swatch key={t.cssVar} token={t} isDark={isDark} cols={4} />)}
        </div>

        <div className="flex gap-3 mt-2">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Primary button
          </button>
          <button className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white-100">
            Destructive
          </button>
          <button className="rounded-lg bg-surface-secondary px-4 py-2 text-sm font-medium text-label border border-stroke-strong ring-2 ring-ring ring-offset-2 ring-offset-surface">
            Focus ring
          </button>
        </div>
      </Section>

      {/* ── Sidebar ── */}
      <Section title="Sidebar" description="Navigation chrome — scoped to sidebar components">
        <div className="grid grid-cols-4 gap-4">
          {SIDEBAR.map((t) => <Swatch key={t.cssVar} token={t} isDark={isDark} cols={4} />)}
        </div>
      </Section>

      {/* ── Neutral Scale ── */}
      <Section title="Neutral Scale" description="11-step achromatic ramp — static, does not change with theme">
        <div className="flex gap-2">
          {NEUTRAL_STEPS.map(({ step, l }) => (
            <div key={step} className="flex-1 text-center">
              <div
                className="aspect-square rounded-lg border border-stroke-faint"
                style={{ backgroundColor: `oklch(${l} 0 0)` }}
              />
              <div className="mt-1.5 font-mono text-[10px] text-label-secondary">{step}</div>
              <div className="font-mono text-[10px] text-label-secondary">{l}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Black & White Opacity ── */}
      <Section title="Black & White Opacity" description="Pure black and white at 30 opacity stops — fine grain 1-12%, then 5% jumps">
        <div>
          <div className="font-mono text-[11px] text-label mb-1.5">Black</div>
          <div className="flex gap-px rounded-lg overflow-hidden border border-stroke-faint">
            {OPACITY_STEPS.map((p) => (
              <div
                key={p}
                className="flex-1 h-10"
                style={{ backgroundColor: `var(--color-black-${p})` }}
                title={`black-${p} (${p}%)`}
              />
            ))}
          </div>
          <div className="flex gap-px mt-1">
            {OPACITY_STEPS.map((p) => (
              <div key={p} className="flex-1 text-center font-mono text-[7px] text-label-secondary">
                {p}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <div className="font-mono text-[11px] text-label mb-1.5">White</div>
          <div className="flex gap-px rounded-lg overflow-hidden border border-stroke-faint">
            {OPACITY_STEPS.map((p) => (
              <div
                key={p}
                className="flex-1 h-10"
                style={{ backgroundColor: `var(--color-white-${p})` }}
                title={`white-${p} (${p}%)`}
              />
            ))}
          </div>
          <div className="flex gap-px mt-1">
            {OPACITY_STEPS.map((p) => (
              <div key={p} className="flex-1 text-center font-mono text-[7px] text-label-secondary">
                {p}
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Accent Colors ── */}
      <Section title="Accent Colors" description="Apple system colors — 12 hues × 13 steps, light and dark scales">
        <div className="space-y-6">
          {ACCENT_HUES.map((hue) => (
            <div key={hue}>
              <div className="font-mono text-[11px] text-label mb-1.5 capitalize">{hue}</div>
              <div className="flex gap-px">
                {ACCENT_STEPS.map((step) => (
                  <div
                    key={step}
                    className="flex-1 h-8 first:rounded-l-md last:rounded-r-md"
                    style={{ backgroundColor: `var(--color-${hue}-${step})` }}
                    title={`${hue}-${step}`}
                  />
                ))}
              </div>
              <div className="flex gap-px mt-px">
                {ACCENT_STEPS.map((step) => (
                  <div
                    key={step}
                    className="flex-1 h-8 first:rounded-l-md last:rounded-r-md"
                    style={{ backgroundColor: `var(--color-${hue}-dark-${step})` }}
                    title={`${hue}-dark-${step}`}
                  />
                ))}
              </div>
              <div className="flex gap-px mt-1">
                {ACCENT_STEPS.map((step) => (
                  <div key={step} className="flex-1 text-center font-mono text-[8px] text-label-secondary">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── In Context ── */}
      <Section title="In Context" description="All tokens working together">
        <div className="bg-surface rounded-2xl p-6">
          <div className="bg-surface-secondary rounded-xl border border-stroke-strong overflow-hidden">
            <div className="p-5 pb-4">
              <h3 className="text-label font-medium">Notification preferences</h3>
              <p className="text-label-secondary text-sm mt-1">
                Choose how and when you'd like to be notified.
              </p>
            </div>
            <div className="border-t border-stroke-faint">
              {([
                { title: "Email notifications", desc: "Important updates and alerts", on: true },
                { title: "Push notifications", desc: "Real-time alerts on your device", on: false },
                { title: "Weekly digest", desc: "Summary of activity every Monday", on: true },
              ] as const).map((item, i, arr) => (
                <div
                  key={item.title}
                  className={cn(
                    "flex items-center justify-between gap-4 px-5 py-3.5 bg-surface-tertiary",
                    i < arr.length - 1 && "border-b border-stroke-faint"
                  )}
                >
                  <div>
                    <div className="text-label text-sm font-medium">{item.title}</div>
                    <div className="text-label-tertiary text-xs mt-0.5">{item.desc}</div>
                  </div>
                  <div
                    className={cn(
                      "h-6 w-10 shrink-0 rounded-full flex items-center px-0.5",
                      item.on
                        ? "bg-label justify-end"
                        : "bg-neutral-400 justify-start"
                    )}
                  >
                    <div className="h-5 w-5 rounded-full bg-surface shadow-xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </PageShell>
  )
}
