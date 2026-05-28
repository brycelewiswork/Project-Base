import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "motion/react"
import gsap from "gsap"
import { toast } from "sonner"
import { IconArrowRight, IconSparkles } from '@tabler/icons-react'

import { PageShell, PageHeader, SectionCard } from "@/components/PageHeader"
import { DemoSection } from "@/components/DemoSection"
import { Squircle, SQUIRCLE_RADIUS, buildShadow, SQUIRCLE_SHADOW } from "@/components/squircle"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LinearBlur, RadialBlur } from "@/components/ui/progressive-blur"
import { TextEffect } from "@/components/ui/text-effect"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { InfiniteSlider } from "@/components/ui/infinite-slider"
import { Tilt } from "@/components/ui/tilt"
import { GlowEffect } from "@/components/ui/glow-effect"
import { TextShimmer } from "@/components/ui/text-shimmer"
import { InView } from "@/components/ui/in-view"
// ScrollProgress available at @/components/ui/scroll-progress — omitted from
// the demo since it requires a fixed-position bar and would overlap the nav.
import {
  useImagePalette,
  harmonies,
  type Color,
} from "@/components/ui/color-thief"
import { useCounterStore } from "@/store/useCounterStore"
import { SPRING, EASE, GSAP_EASE, DURATION } from '@/lib/motion'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Area, AreaChart, Bar, BarChart, RadialBar, RadialBarChart,
  XAxis, YAxis, CartesianGrid, PolarAngleAxis,
} from "recharts"
import { Arc } from "@visx/shape"
import { Group } from "@visx/group"
import { Slider } from "@/components/ui/slider"
import {
  Skeleton,
  SkeletonText,
  SkeletonHeading,
  SkeletonAvatar,
  SkeletonImage,
  SkeletonCard,
} from "@/components/ui/skeleton"
import { TightText } from "@/components/ui/tight-text"
import { Accordion } from "@/components/ui/accordion"
import { pretextStyleFromElement, usePretextHeight } from "@/lib/pretext"
import { PulsingBorder, DotGrid, MeshGradient } from "@paper-design/shaders-react"

export function Demos() {
  return (
    <PageShell className="space-y-0! flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <PageHeader
          title="Demos"
          description="Every library bundled into project-base is demonstrated below. If it isn't on this page, it shouldn't be in the template."
        />

        <SectionCard className="space-y-3">
          <div className="text-xs font-medium text-label-secondary">Stack at a glance</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-3">
            {[
              ["Vite 8", "bundler"],
              ["React 19", "ui"],
              ["TypeScript", "types"],
              ["Tailwind v4", "css"],
              ["shadcn/ui", "components"],
              ["motion", "animation"],
              ["GSAP", "timelines"],
              ["corner-smoothing", "squircles"],
              ["progressive-blur", "blur fx"],
              ["colorthief", "color extraction"],
              ["motion-primitives", "32 effects"],
              ["pretext", "text measure"],
              ["React Router", "routing"],
              ["Zustand", "state"],
              ["Sonner", "toasts"],
              ["Base UI", "headless primitives"],
              ["next-themes", "light/dark"],
              ["react-use-measure", "size hook"],
              ["Recharts", "charts"],
              ["visx", "SVG primitives"],
              ["Skeleton", "loading states"],
              ["HTML in Canvas", "experimental API"],
              ["paper-shaders", "WebGL catalog"],
              ["three", "3D / WebGL"],
              ["react-three-fiber", "R3F renderer"],
              ["drei", "R3F helpers"],
              ["react-three-postprocessing", "post FX"],
              ["use-shader-fx", "FX hooks"],
            ].map(([lib, role]) => (
              <div key={lib} className="flex items-baseline gap-2">
                <span className="font-medium">{lib}</span>
                <span className="text-xs text-label-secondary">{role}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </header>

      <SquircleDemo />
      <ProgressiveBlurDemo />
      <ColorFromImageDemo />
      <MotionPrimitivesDemo />
      <MotionDemo />
      <GsapDemo />
      <RouterDemo />
      <ZustandDemo />
      <SonnerDemo />
      <RechartsDemo />
      <VisxDemo />
      <SkeletonDemo />
      <PretextDemo />
      <HtmlInCanvasDemo />
      <ShadersDemo />
      <ColorEditorDemo />
    </PageShell>
  )
}

function MotionPrimitivesDemo() {
  const [num, setNum] = useState(0)
  const [textKey, setTextKey] = useState(0)
  return (
    <DemoSection title="Motion primitives" lib="motion-primitives" docsUrl="https://motion-primitives.com">
      <p className="text-body text-label-secondary">
        32 copy-paste animation components from{" "}
        <a href="https://motion-primitives.com" className="underline" target="_blank" rel="noopener">
          motion-primitives.com
        </a>
        . Built on the same <code>motion</code> package already in the stack. Showing a sample below
        — all 32 are installed and importable from <code>@/components/ui/</code>.
      </p>

      {/* TextEffect */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-label-secondary">TextEffect — blur reveal</span>
        <div className="flex items-center gap-3">
          <TextEffect
            key={textKey}
            per="word"
            as="p"
            preset="blur"
            className="text-lg font-medium"
          >
            Every detail is an opportunity for polish.
          </TextEffect>
          <Button size="sm" variant="outline" onClick={() => setTextKey((k) => k + 1)}>
            Replay
          </Button>
        </div>
      </div>

      {/* TextShimmer */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-label-secondary">TextShimmer</span>
        <TextShimmer className="text-lg font-medium" duration={1.5}>
          Shimmering highlight sweep
        </TextShimmer>
      </div>

      {/* AnimatedNumber */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-label-secondary">AnimatedNumber</span>
        <div className="flex items-center gap-3">
          <AnimatedNumber
            value={num}
            className="text-4xl font-medium tabular-nums"
            springOptions={{ bounce: 0, duration: 1200 }}
          />
          <Button size="sm" onClick={() => setNum((n) => n + Math.floor(Math.random() * 500 + 100))}>
            Add
          </Button>
          <Button size="sm" variant="outline" onClick={() => setNum(0)}>
            Reset
          </Button>
        </div>
      </div>

      {/* InfiniteSlider */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-label-secondary">InfiniteSlider</span>
        <InfiniteSlider gap={12} speed={20}>
          {["motion", "gsap", "zustand", "sonner", "colorthief", "squircle", "tailwind", "shadcn", "vite", "react"].map(
            (lib) => (
              <Badge key={lib} variant="secondary">{lib}</Badge>
            ),
          )}
        </InfiniteSlider>
      </div>

      {/* Tilt + GlowEffect */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-label-secondary">Tilt</span>
          <Tilt rotationFactor={8} springOptions={SPRING.snappy}>
            <div className="flex h-28 items-center justify-center rounded-xl bg-label/5 text-sm text-label-secondary">
              Hover and tilt
            </div>
          </Tilt>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-label-secondary">GlowEffect</span>
          <div className="relative flex h-28 items-center justify-center rounded-xl bg-label/5 text-sm text-label-secondary">
            <GlowEffect colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]} mode="colorShift" />
            Animated glow border
          </div>
        </div>
      </div>

      {/* InView */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-label-secondary">InView — scroll to reveal</span>
        <InView
          variants={{
            hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: DURATION.slow, ease: EASE.easeOut }}
          viewOptions={{ once: true, margin: "0px 0px -40px 0px" }}
        >
          <div className="flex h-20 items-center justify-center rounded-xl bg-label/5 text-sm text-label-secondary">
            I animated in when you scrolled here
          </div>
        </InView>
      </div>

      {/* Full inventory */}
      <details className="text-sm">
        <summary className="cursor-pointer text-label-secondary hover:text-label">
          All 32 installed components
        </summary>
        <div className="mt-2 flex flex-wrap gap-1">
          {[
            "accordion", "animated-background", "animated-group", "animated-number",
            "border-trail", "carousel", "cursor", "dialog", "disclosure", "dock",
            "glow-effect", "image-comparison", "in-view", "infinite-slider",
            "magnetic", "morphing-dialog", "morphing-popover", "scroll-progress",
            "sliding-number", "spinning-text", "spotlight", "text-effect",
            "text-loop", "text-morph", "text-roll", "text-scramble",
            "text-shimmer", "text-shimmer-wave", "tilt", "toolbar-dynamic",
            "toolbar-expandable", "transition-panel",
          ].map((name) => (
            <Badge key={name} variant="outline" className="font-mono text-[10px]">
              {name}
            </Badge>
          ))}
        </div>
      </details>
    </DemoSection>
  )
}

function ProgressiveBlurDemo() {
  const [strength, setStrength] = useState(48)
  const [falloff, setFalloff] = useState(100)
  return (
    <DemoSection title="Progressive blur" lib="custom" bare docsUrl="https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter">
      <p className="text-body text-label-secondary">
        Hand-rolled in <code>@/components/ui/progressive-blur</code>. Stacks{" "}
        <code>backdrop-filter: blur()</code> layers with mask gradients for a smooth ramp. Pass
        <code> blurLevels</code> as an array for explicit multi-stop control, or{" "}
        <code>strength</code> + <code>steps</code> for a computed geometric ramp.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <BlurStage label='<LinearBlur side="top" />'>
          <LinearBlur side="top" strength={strength} falloffPercentage={falloff} />
        </BlurStage>
        <BlurStage label='<LinearBlur side="bottom" />'>
          <LinearBlur side="bottom" strength={strength} falloffPercentage={falloff} />
        </BlurStage>
        <BlurStage label='<LinearBlur side="left" />'>
          <LinearBlur side="left" strength={strength} falloffPercentage={falloff} />
        </BlurStage>
        <BlurStage label='<LinearBlur side="right" />'>
          <LinearBlur side="right" strength={strength} falloffPercentage={falloff} />
        </BlurStage>
        <BlurStage label='<RadialBlur origin="edge" />'>
          <RadialBlur origin="edge" strength={strength} falloffPercentage={falloff} />
        </BlurStage>
        <BlurStage label='<RadialBlur origin="center" />'>
          <RadialBlur origin="center" strength={strength} falloffPercentage={falloff} />
        </BlurStage>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-3 text-sm">
          <span className="w-20 text-label-secondary">strength</span>
          <Slider
            min={0}
            max={128}
            step={1}
            value={[strength]}
            onValueChange={(v) => setStrength(Array.isArray(v) ? v[0] : v)}
            className="flex-1"
          />
          <span className="w-12 text-right font-mono text-xs">{strength}px</span>
        </label>
        <label className="flex items-center gap-3 text-sm">
          <span className="w-20 text-label-secondary">falloff</span>
          <Slider
            min={10}
            max={100}
            step={1}
            value={[falloff]}
            onValueChange={(v) => setFalloff(Array.isArray(v) ? v[0] : v)}
            className="flex-1"
          />
          <span className="w-12 text-right font-mono text-xs">{falloff}%</span>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-label-secondary">
          Explicit multi-stop via <code>blurLevels=[1, 2, 4, 32]</code>
        </span>
        <BlurStage label="four explicit layers" tall>
          <LinearBlur side="top" blurLevels={[1, 2, 4, 32]} falloffPercentage={80} />
        </BlurStage>
      </div>
    </DemoSection>
  )
}

function BlurStage({
  label,
  children,
  tall,
}: {
  label: string
  children: React.ReactNode
  tall?: boolean
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg ${tall ? "h-44" : "h-32"}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(45deg, oklch(0.85 0.18 30) 0 14px, oklch(0.7 0.2 250) 14px 28px, oklch(0.85 0.18 130) 28px 42px)",
      }}
    >
      {children}
      <span className="pointer-events-none absolute bottom-1 left-2 font-mono text-[10px] text-label/60 mix-blend-difference">
        {label}
      </span>
    </div>
  )
}

const ALBUM_SAMPLES = [
  { label: "Charli XCX — BRAT", src: "/images/album-art/12_charli-xcx_brat.jpg" },
  { label: "Lana Del Rey — NFR", src: "/images/album-art/06_lana-del-rey_norman-fucking-rockwell.jpg" },
  { label: "SZA — Ctrl", src: "/images/album-art/08_sza_ctrl.jpg" },
  { label: "Tyler — Call Me If You Get Lost", src: "/images/album-art/21_tyler-the-creator_call-me-if-you-get-lost.jpg" },
  { label: "Rosalía — Motomami", src: "/images/album-art/17_rosalia_motomami.jpg" },
  { label: "Weyes Blood — Titanic Rising", src: "/images/album-art/41_weyes-blood_titanic-rising.jpg" },
] as const

function ColorFromImageDemo() {
  const imgRef = useRef<HTMLImageElement>(null)
  const [src, setSrc] = useState<string>(ALBUM_SAMPLES[0].src)
  // IconUser's explicit pick (set when they click a swatch). Cleared on src change
  // so the active color falls back to the new image's dominant.
  const [userPickedHex, setUserPickedHex] = useState<string | null>(null)
  const { dominant, palette, swatches, loading, error } = useImagePalette(imgRef, {
    colorCount: 6,
    colorSpace: "oklch",
  })

  useEffect(() => {
    setUserPickedHex(null)
  }, [src])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSrc(URL.createObjectURL(file))
  }

  const activeHex = userPickedHex ?? dominant?.hex() ?? "#222222"
  const harmoniesOfActive = harmonies(activeHex)
  const textOn = (hex: string): string => {
    // Quick relative-luminance test, mirrors colorthief's textColor heuristic.
    const m = hex.replace("#", "").match(/.{1,2}/g)
    if (!m) return "#fff"
    const [r, g, b] = m.slice(0, 3).map((p) => parseInt(p, 16) / 255)
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
    return lum > 0.55 ? "#000" : "#fff"
  }

  return (
    <DemoSection title="Color from image" lib="colorthief" docsUrl="https://github.com/lokesh/color-thief">
      <p className="text-body text-label-secondary">
        Extract dominant color, palette, and semantic swatches from any image. Pair with
        <code> &lt;LinearBlur tint=&hellip;&gt;</code> for the Apple Music-style blend.
      </p>

      {/* Sample picker */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-label-secondary">Try a sample</div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ALBUM_SAMPLES.map((sample) => {
            const active = src === sample.src
            return (
              <button
                key={sample.src}
                type="button"
                onClick={() => setSrc(sample.src)}
                title={sample.label}
                className={`relative aspect-square overflow-hidden rounded-md border transition-all ${
                  active
                    ? "border-label ring-2 ring-label/30"
                    : "border-stroke-faint/60 hover:border-label/40"
                }`}
              >
                <img
                  src={sample.src}
                  alt={sample.label}
                  className="h-full w-full object-cover"
                />
              </button>
            )
          })}
        </div>
      </div>

      {/* Sample + Apple Music-style blended card */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative h-56 overflow-hidden rounded-xl bg-label/5">
          <img
            ref={imgRef}
            src={src}
            alt="Source"
            crossOrigin="anonymous"
            className="h-full w-full object-cover"
          />
          {dominant ? (
            <LinearBlur
              side="bottom"
              strength={28}
              falloffPercentage={70}
              tint={dominant.hex()}
            />
          ) : null}
        </div>
        <div
          className="relative flex flex-col gap-2 overflow-hidden rounded-xl p-4 transition-colors duration-300"
          style={{
            backgroundColor: activeHex,
            color: textOn(activeHex),
          }}
        >
          <div className="font-mono text-xs opacity-70">selected color</div>
          <div className="font-mono text-2xl">{activeHex.toUpperCase()}</div>
          <div className="mt-auto flex flex-col gap-1 text-xs">
            <div>
              dominant: <span className="font-mono">{dominant?.hex() ?? "—"}</span>
            </div>
            <div>
              isDark: <span className="font-mono">{String(dominant?.isDark ?? "—")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Palette */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-label-secondary">Palette ({palette?.length ?? 0})</div>
        <div className="flex flex-wrap gap-2">
          {(palette ?? []).map((c) => (
            <Swatch
              key={c.hex()}
              color={c}
              active={activeHex === c.hex()}
              onClick={() => setUserPickedHex(c.hex())}
            />
          ))}
        </div>
      </div>

      {/* Semantic swatches */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-label-secondary">Semantic swatches</div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {(["Vibrant", "Muted", "DarkVibrant", "DarkMuted", "LightVibrant", "LightMuted"] as const).map(
            (role) => {
              const sw = swatches?.[role]
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => sw && setUserPickedHex(sw.color.hex())}
                  className="flex flex-col items-center gap-1 rounded-md border border-stroke-faint/60 p-2 text-[10px] transition-colors hover:bg-surface-tertiary/40 disabled:opacity-40"
                  disabled={!sw}
                >
                  <div
                    className="size-10 rounded-md"
                    style={{ backgroundColor: sw?.color.hex() ?? "transparent" }}
                  />
                  <span className="font-mono">{role}</span>
                </button>
              )
            },
          )}
        </div>
      </div>

      {/* Harmonies */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-label-secondary">
          Harmonies from <span className="font-mono">{activeHex}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-4">
          <HarmonyChip label="complementary" hex={harmoniesOfActive.complementary} />
          <HarmonyChip label="analogous" hex={harmoniesOfActive.analogous[0]} />
          <HarmonyChip label="analogous" hex={harmoniesOfActive.analogous[1]} />
          <HarmonyChip label="triadic" hex={harmoniesOfActive.triadic[0]} />
        </div>
      </div>

      {/* File picker */}
      <div className="flex items-center gap-3 text-sm">
        <label className="cursor-pointer underline">
          Drop your own image
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
        </label>
        <span className="text-xs text-label-secondary">
          {loading ? "extracting…" : error ? `error: ${error.message}` : "ready"}
        </span>
      </div>
    </DemoSection>
  )
}

function Swatch({
  color,
  active,
  onClick,
}: {
  color: Color
  active: boolean
  onClick: () => void
}) {
  const hex = color.hex()
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md border px-2 py-1 text-xs transition-colors ${
        active ? "border-label" : "border-stroke-faint/60 hover:border-label/40"
      }`}
    >
      <span className="size-4 rounded-sm" style={{ backgroundColor: hex }} />
      <span className="font-mono">{hex}</span>
    </button>
  )
}

function HarmonyChip({ label, hex }: { label: string; hex: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-stroke-faint/60 p-2 text-xs">
      <span className="size-6 rounded-sm" style={{ backgroundColor: hex }} />
      <div className="flex flex-col">
        <span className="text-[10px] text-label-secondary">{label}</span>
        <span className="font-mono">{hex}</span>
      </div>
    </div>
  )
}

function SquircleDemo() {
  const [smoothing, setSmoothing] = useState(0.6)
  return (
    <DemoSection title="Apple-style squircles" lib="corner-smoothing" docsUrl="https://www.npmjs.com/package/corner-smoothing">
      <p className="text-body text-label-secondary">
        Continuous-curve corners via SVG <code>clip-path</code>. Every shadcn component in this
        template renders through <code>&lt;Squircle&gt;</code> or <code>useSquircle</code>.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-label-secondary">
            CSS <code>border-radius</code>
          </span>
          <div className="flex h-32 items-center justify-center rounded-xl bg-label/10">
            <span className="text-xs text-label-secondary">rounded-xl</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-label-secondary">
            Squircle <code>clip-path</code>
          </span>
          <Squircle
            as="div"
            cornerRadius={SQUIRCLE_RADIUS.xl}
            cornerSmoothing={smoothing}
            className="flex h-32 items-center justify-center bg-label/10"
          >
            <span className="text-xs text-label-secondary">
              smoothing {smoothing.toFixed(2)}
            </span>
          </Squircle>
        </div>
      </div>
      <label className="flex items-center gap-3 text-sm">
        <span className="w-24 text-label-secondary">cornerSmoothing</span>
        <Slider
          min={0}
          max={1}
          step={0.05}
          value={[smoothing]}
          onValueChange={(v) => setSmoothing(Array.isArray(v) ? v[0] : v)}
          className="flex-1"
        />
        <span className="w-10 text-right font-mono text-xs">{smoothing.toFixed(2)}</span>
      </label>
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button>Squircled button</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline" size="sm">Small</Button>
        <Badge>Pill badge</Badge>
        <Badge variant="secondary">Secondary</Badge>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Card root is squircled</CardTitle>
          <CardDescription>
            Look closely — the corners taper continuously instead of meeting the straight edge as a
            circular arc.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-12 rounded-md bg-label/5" />
        </CardContent>
      </Card>
      <ShadowPresets />
      <ShadowDirectional />
    </DemoSection>
  )
}

function ShadowPresets() {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-label-secondary">
        7-tier presets (aligned with Tailwind v4's shadow-2xs → shadow-2xl)
      </span>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {(Object.keys(SQUIRCLE_SHADOW) as Array<keyof typeof SQUIRCLE_SHADOW>).map((key) => (
          <Card key={key} shadow={key}>
            <CardHeader>
              <CardTitle className="font-mono text-sm">{key}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ShadowDirectional() {
  const [elevation, setElevation] = useState(3)
  const [direction, setDirection] = useState(0)
  const [tinted, setTinted] = useState(false)
  const shadow = buildShadow({
    elevation,
    direction,
    color: tinted ? "rgba(59, 130, 246, 0.4)" : undefined,
  })

  return (
    <div className="flex flex-col gap-3">
      <span className="text-xs font-medium text-label-secondary">
        Directional via <code>buildShadow({"{}"})</code>
      </span>
      <div className="flex items-center gap-6">
        <Card shadow={shadow} className="w-48">
          <CardHeader>
            <CardTitle className="font-mono text-sm">{direction}°</CardTitle>
            <CardDescription className="text-xs">elev {elevation}</CardDescription>
          </CardHeader>
        </Card>
        <div className="flex flex-1 flex-col gap-2">
          <label className="flex items-center gap-3 text-sm">
            <span className="w-16 text-label-secondary">direction</span>
            <Slider
              min={0}
              max={360}
              step={5}
              value={[direction]}
              onValueChange={(v) => setDirection(Array.isArray(v) ? v[0] : v)}
              className="flex-1"
            />
            <span className="w-10 text-right font-mono text-xs">{direction}°</span>
          </label>
          <label className="flex items-center gap-3 text-sm">
            <span className="w-16 text-label-secondary">elevation</span>
            <Slider
              min={0.5}
              max={5}
              step={0.5}
              value={[elevation]}
              onValueChange={(v) => setElevation(Array.isArray(v) ? v[0] : v)}
              className="flex-1"
            />
            <span className="w-10 text-right font-mono text-xs">{elevation}</span>
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={tinted}
              onChange={(e) => setTinted(e.target.checked)}
              className="accent-blue-500"
            />
            <span className="text-label-secondary">Blue tint</span>
          </label>
        </div>
      </div>
    </div>
  )
}

function MotionDemo() {
  return (
    <DemoSection title="Motion (framer-motion)" lib="motion" docsUrl="https://motion.dev/docs">
      <p className="text-body text-label-secondary">
        React animation primitives — springs, transforms, layout, gesture.
      </p>
      <div className="flex items-center gap-4">
        <motion.div
          className="flex h-16 w-16 items-center justify-center bg-label text-surface"
          style={{ borderRadius: SQUIRCLE_RADIUS.xl }}
          animate={{ rotate: [0, 90, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: EASE.easeInOut }}
        >
          <IconSparkles className="size-5" />
        </motion.div>
        <span className="text-body text-label-secondary">
          Looping rotate + scale via <code>motion.div</code>.
        </span>
      </div>
    </DemoSection>
  )
}

function GsapDemo() {
  const boxes = useRef<Array<HTMLDivElement | null>>([])
  const play = () => {
    gsap.fromTo(
      boxes.current,
      { scale: 0.6, opacity: 0.2 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.05,
        ease: GSAP_EASE.bounce,
      },
    )
  }
  useEffect(() => { play() }, [])
  return (
    <DemoSection title="GSAP" lib="gsap" docsUrl="https://gsap.com/docs/v3/">
      <p className="text-body text-label-secondary">
        Timeline + stagger for high-fidelity orchestration.
      </p>
      <div className="flex items-end gap-4">
        <div className="flex gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              ref={(el) => { boxes.current[i] = el }}
              className="size-8 rounded-md bg-label/30"
            />
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={play}>Replay</Button>
      </div>
    </DemoSection>
  )
}

function RouterDemo() {
  return (
    <DemoSection title="React Router" lib="react-router-dom" docsUrl="https://reactrouter.com/">
      <p className="text-body text-label-secondary">
        Multi-page sketches with <code>BrowserRouter</code> + <code>Routes</code>.
      </p>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link to="/" className="inline-flex items-center gap-1 underline">
          Home <IconArrowRight className="size-3" />
        </Link>
        <Link to="/motion" className="inline-flex items-center gap-1 underline">
          Motion <IconArrowRight className="size-3" />
        </Link>
      </div>
    </DemoSection>
  )
}

function ZustandDemo() {
  const count = useCounterStore((s) => s.count)
  const inc = useCounterStore((s) => s.inc)
  const reset = useCounterStore((s) => s.reset)
  return (
    <DemoSection title="Zustand" lib="zustand" docsUrl="https://zustand.docs.pmnd.rs/">
      <p className="text-body text-label-secondary">
        Tiny global store at <code className="font-mono">src/store/useCounterStore.ts</code>.
      </p>
      <div className="flex items-center gap-3">
        <span className="font-mono text-3xl tabular-nums">{count}</span>
        <Button onClick={inc}>Increment</Button>
        <Button variant="outline" onClick={reset}>Reset</Button>
      </div>
    </DemoSection>
  )
}

function SonnerDemo() {
  return (
    <DemoSection title="Sonner" lib="sonner" docsUrl="https://sonner.emilkowal.ski/">
      <p className="text-body text-label-secondary">
        Stacked toasts mounted in <code>main.tsx</code>. Toast corners are squircled; elevation
        is restored by applying <code>filter: drop-shadow</code> to the toaster parent so the
        shadow renders from each toast&apos;s clipped silhouette. Same pattern is available on
        Card &amp; Button via the <code>shadow</code> prop.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => toast("Hello, sketcher")}>Toast</Button>
        <Button size="sm" variant="outline" onClick={() => toast.success("Saved")}>Success</Button>
        <Button size="sm" variant="outline" onClick={() => toast.error("Something broke")}>
          Error
        </Button>
      </div>
    </DemoSection>
  )
}

/* ------------------------------------------------------------------ */
/*  Recharts                                                          */
/* ------------------------------------------------------------------ */

const areaData = [
  { month: "Jan", value: 186 }, { month: "Feb", value: 305 },
  { month: "Mar", value: 237 }, { month: "Apr", value: 173 },
  { month: "May", value: 409 }, { month: "Jun", value: 214 },
]

const barData = [
  { day: "Mon", a: 120, b: 80 }, { day: "Tue", a: 200, b: 130 },
  { day: "Wed", a: 150, b: 100 }, { day: "Thu", a: 280, b: 190 },
  { day: "Fri", a: 220, b: 160 }, { day: "Sat", a: 310, b: 210 },
]

const gaugeData = [{ name: "score", value: 72, fill: "var(--color-green-500)" }]

const sparkData = Array.from({ length: 20 }, (_, i) => ({
  v: 40 + Math.sin(i * 0.6) * 30 + Math.random() * 10,
}))

const areaConfig = { value: { label: "Visitors", color: "var(--color-blue-500)" } } satisfies ChartConfig
const barConfig = {
  a: { label: "Series A", color: "var(--color-cyan-500)" },
  b: { label: "Series B", color: "var(--color-purple-500)" },
} satisfies ChartConfig
const gaugeConfig = { score: { label: "Score", color: "var(--color-green-500)" } } satisfies ChartConfig
const sparkConfig = { v: { label: "Value", color: "var(--color-orange-500)" } } satisfies ChartConfig

function RechartsDemo() {
  return (
    <DemoSection title="Recharts" lib="recharts" version="3.5.1" docsUrl="https://recharts.org/en-US/api">
      <p className="text-body text-label-secondary">
        Declarative charts via shadcn/ui's ChartContainer. SVG output, CSS variable theming, dark mode for free.
      </p>

      <div className="grid grid-cols-2 gap-6">
        {/* Area chart */}
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-medium text-label">Area chart</h3>
            <p className="text-xs text-label-secondary">Gradient fill with tooltip</p>
          </div>
          <ChartContainer config={areaConfig} className="aspect-[2/1] w-full">
            <AreaChart data={areaData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-value)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area dataKey="value" type="monotone" stroke="var(--color-value)" fill="url(#areaGrad)" strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        </div>

        {/* Bar chart */}
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-medium text-label">Grouped bars</h3>
            <p className="text-xs text-label-secondary">Two series, auto-legend via config</p>
          </div>
          <ChartContainer config={barConfig} className="aspect-[2/1] w-full">
            <BarChart data={barData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
              <YAxis tickLine={false} axisLine={false} fontSize={11} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="a" fill="var(--color-a)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="b" fill="var(--color-b)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Radial gauge */}
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-medium text-label">Radial gauge</h3>
            <p className="text-xs text-label-secondary">Score out of 100</p>
          </div>
          <div className="flex items-center justify-center">
            <ChartContainer config={gaugeConfig} className="aspect-square w-full max-w-[180px]">
              <RadialBarChart
                data={gaugeData}
                startAngle={180}
                endAngle={180 - (gaugeData[0].value / 100) * 360}
                innerRadius="70%"
                outerRadius="100%"
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "var(--surface-tertiary)" }} />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-label text-2xl font-semibold">
                  {gaugeData[0].value}
                </text>
              </RadialBarChart>
            </ChartContainer>
          </div>
        </div>

        {/* Sparkline */}
        <div className="space-y-2">
          <div>
            <h3 className="text-sm font-medium text-label">Sparkline</h3>
            <p className="text-xs text-label-secondary">Compact inline chart, no axes</p>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-semibold text-label tabular-nums">247</span>
            <ChartContainer config={sparkConfig} className="h-12 flex-1">
              <AreaChart data={sparkData} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-v)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--color-v)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area dataKey="v" type="monotone" stroke="var(--color-v)" fill="url(#sparkGrad)" strokeWidth={1.5} />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </DemoSection>
  )
}

/* ------------------------------------------------------------------ */
/*  visx                                                              */
/* ------------------------------------------------------------------ */

function VisxDemo() {
  const size = 180, thickness = 18, gap = 4
  const rings = [
    { value: 0.82, color: "var(--color-red-500)" },
    { value: 0.65, color: "var(--color-green-500)" },
    { value: 0.45, color: "var(--color-cyan-500)" },
  ]

  return (
    <DemoSection title="visx" lib="@visx/shape + @visx/scale + @visx/group" docsUrl="https://visx.airbnb.tech/docs">
      <p className="text-body text-label-secondary">
        Low-level SVG primitives for custom visuals Recharts can't express — radial arcs, bespoke gauges, data-art.
      </p>
      <div className="flex items-center gap-6">
        <svg width={size} height={size} className="overflow-visible">
          <Group top={size / 2} left={size / 2}>
            {rings.map((ring, i) => {
              const outer = size / 2 - i * (thickness + gap)
              const inner = outer - thickness
              return (
                <g key={i}>
                  <Arc
                    startAngle={0}
                    endAngle={2 * Math.PI}
                    innerRadius={inner}
                    outerRadius={outer}
                    fill="var(--surface-tertiary)"
                  />
                  <Arc
                    startAngle={0}
                    endAngle={ring.value * 2 * Math.PI}
                    innerRadius={inner}
                    outerRadius={outer}
                    fill={ring.color}
                    cornerRadius={thickness / 2}
                  />
                </g>
              )
            })}
          </Group>
        </svg>
        <div className="space-y-2 text-sm">
          {[
            { label: "Move", pct: 82, color: "text-red-500" },
            { label: "Exercise", pct: 65, color: "text-green-500" },
            { label: "Stand", pct: 45, color: "text-cyan-500" },
          ].map((r) => (
            <div key={r.label} className="flex items-baseline gap-2">
              <span className={`font-semibold tabular-nums ${r.color}`}>{r.pct}%</span>
              <span className="text-label-secondary">{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    </DemoSection>
  )
}

/* ------------------------------------------------------------------ */
/*  Skeleton                                                          */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Pretext — pure-JS text measurement (Cheng Lou)                    */
/* ------------------------------------------------------------------ */

const CHAT_MESSAGES: Array<{ from: "them" | "me"; text: string }> = [
  { from: "them", text: "hey, you around for the review at 3?" },
  { from: "me", text: "yes — give me ten to wrap this PR" },
  { from: "them", text: "no rush. I'll bring the figma file too, we can riff on the spacing tokens together." },
  { from: "me", text: "perfect" },
  { from: "them", text: "btw your typography page is gorgeous, I screenshot the optical-sizing section for the team chat" },
  { from: "me", text: "<3" },
]

function PretextDemo() {
  return (
    <DemoSection
      title="Pretext"
      lib="@chenglou/pretext"
      docsUrl="https://chenglou.me/pretext/"
    >
      <p className="text-body text-label-secondary">
        Cheng Lou's pure-JS multiline text measurement engine. No DOM reflow, no{" "}
        <code>getBoundingClientRect</code>, no measure-then-paint double render. Reach for it when
        you need to know a paragraph's <em>height</em> or <em>tight width</em> before the browser
        paints — masonry, virtualized chat, predicted accordion heights, ragless chat bubbles.
        Surfaced in this template as <code>@/lib/pretext</code> hooks, the{" "}
        <code>&lt;TightText&gt;</code> primitive, and the <code>&lt;Accordion&gt;</code>{" "}
        component (
        <Link to="/components/accordion" className="underline">
          docs
        </Link>
        ).
      </p>

      <PretextChatDemo />
      <PretextAccordionDemo />
      <PretextHeightProbeDemo />
    </DemoSection>
  )
}

const PRETEXT_ACCORDION_ITEMS = [
  {
    value: "what",
    title: "What is Pretext?",
    body: "A pure-JavaScript multiline text layout engine. It uses canvas font metrics to compute how text wraps at any width, with zero DOM reflow. The output is plain numbers — heights, line counts, line widths — that you can use for layout decisions before the browser paints.",
  },
  {
    value: "why",
    title: "Why predict height instead of using height: auto?",
    body: "Spring physics can't truly animate to `auto` — motion has to freeze the auto-resolved value at the start of the transition, which means no real overshoot and visible glitches if content reflows mid-animation. Animating to a Pretext-predicted pixel height gives proper spring behavior with overshoot.",
  },
  {
    value: "when",
    title: "When should I reach for it?",
    body: "Whenever measurement timing matters: masonry packing in one paint, chat bubbles that hug content, accordions with true spring overshoot, layouts that branch on whether a paragraph overflows N lines.",
  },
]

function PretextAccordionDemo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-body font-medium text-label-secondary">Springy accordion</span>
        <span className="text-body text-label-tertiary">
          <Link to="/components/accordion" className="underline">
            full component docs →
          </Link>
        </span>
      </div>
      <Accordion items={PRETEXT_ACCORDION_ITEMS} variant="flat" defaultExpanded="what" />
    </div>
  )
}

function PretextChatDemo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-body font-medium text-label-secondary">Tight chat bubbles</span>
        <span className="text-body text-label-tertiary">
          left = vanilla <code>max-width</code> &nbsp;·&nbsp; right = <code>&lt;TightText&gt;</code>
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {(["vanilla", "tight"] as const).map((mode) => (
          <div key={mode} className="flex flex-col gap-2 rounded-xl bg-fill-secondary p-3">
            {CHAT_MESSAGES.map((m, i) => {
              const mine = m.from === "me"
              const inner =
                mode === "tight" ? (
                  <TightText maxWidth={260} minWidth={40}>{m.text}</TightText>
                ) : (
                  <span style={{ maxWidth: 260, display: "inline-block" }}>{m.text}</span>
                )
              return (
                <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`rounded-2xl px-3 py-1.5 text-body leading-snug inset-ring-1 ${
                      mine
                        ? "bg-blue-500 text-white-100 inset-ring-transparent"
                        : "bg-surface text-label inset-ring-stroke-faint"
                    }`}
                  >
                    {inner}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
      <p className="text-body text-label-secondary">
        Same line count on both sides — but the right column shrinks each bubble to the narrowest
        width that still fits the text in that count. No two-word last lines, no orphan widows.
      </p>
    </div>
  )
}

function PretextHeightProbeDemo() {
  const [text, setText] = useState(
    "Type here to watch Pretext re-measure on every keystroke without a layout reflow.",
  )
  const [width, setWidth] = useState(280)
  const probeRef = useRef<HTMLTextAreaElement>(null)
  const [style, setStyle] = useState<ReturnType<typeof pretextStyleFromElement> | null>(null)
  useLayoutEffect(() => {
    setStyle(pretextStyleFromElement(probeRef.current))
  }, [])
  const measured = usePretextHeight(
    text,
    style?.font ?? "",
    width,
    style?.lineHeight ?? 0,
    { whiteSpace: "pre-wrap" },
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-body font-medium text-label-secondary">Live height probe</span>
        <span className="text-body font-mono text-label-tertiary">
          {measured ? `${measured.lineCount} lines · ${measured.height}px` : "…"}
        </span>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <textarea
          ref={probeRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="h-32 flex-1 resize-none rounded-md bg-fill-secondary px-3 py-2 text-body text-label outline-none inset-ring-1 inset-ring-stroke-faint focus:inset-ring-stroke-strong"
        />
        <div className="flex flex-col gap-2">
          <div
            className="rounded-md bg-surface p-3 text-body text-label inset-ring-1 inset-ring-stroke-faint"
            style={{ width, whiteSpace: "pre-wrap" }}
          >
            {text}
          </div>
          <label className="flex items-center gap-2 text-body">
            <span className="text-label-secondary">width</span>
            <Slider
              min={120}
              max={420}
              step={1}
              value={[width]}
              onValueChange={(v) => setWidth(Array.isArray(v) ? v[0] : v)}
              className="w-40"
            />
            <span className="w-12 text-right font-mono text-label-secondary">{width}px</span>
          </label>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  HTML in Canvas (experimental — Chromium flag)                     */
/* ------------------------------------------------------------------ */

type CanvasWithPaint = HTMLCanvasElement & {
  onpaint: ((e: { changedElements?: Element[] }) => void) | null
  requestPaint?: () => void
}
type Ctx2DWithElementImage = CanvasRenderingContext2D & {
  drawElementImage: (el: Element, dx: number, dy: number, dw?: number, dh?: number) => DOMMatrix
}

function HtmlInCanvasDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const [supported, setSupported] = useState<boolean | null>(null)
  const [amplitude, setAmplitude] = useState(0.08)
  const amplitudeRef = useRef(amplitude)
  useEffect(() => { amplitudeRef.current = amplitude }, [amplitude])

  useEffect(() => {
    const canvas = canvasRef.current as CanvasWithPaint | null
    const form = formRef.current
    const stage = stageRef.current
    if (!canvas || !form || !stage) return

    const ctx = canvas.getContext("2d") as Ctx2DWithElementImage | null
    const isSupported = !!ctx && typeof ctx.drawElementImage === "function"
    setSupported(isSupported)
    if (!ctx || !isSupported) return

    // The experimental drawElementImage API can crash Chromium with
    // STATUS_BREAKPOINT when called continuously through onpaint while
    // ancestor layout is in flux (e.g. mid-resize at a Tailwind
    // breakpoint). The defensive design here: only attach `onpaint` and
    // run the wave while the user is hovering the stage. Layout doesn't
    // change while the mouse is parked inside an element, so the API is
    // only called against stable layouts. When the pointer leaves we
    // detach onpaint entirely so even Chromium's own paint events skip
    // the API call.

    let raf = 0
    let hovered = false

    const sync = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      const w = Math.round(rect.width * dpr)
      const h = Math.round(rect.height * dpr)
      if (canvas.width !== w) canvas.width = w
      if (canvas.height !== h) canvas.height = h
    }

    const paintOnce = () => {
      sync()
      ctx.reset()
      const t = performance.now() / 1000
      const a = hovered ? amplitudeRef.current : 0
      const rot = Math.sin(t * 1.2) * a
      const scale = 1 + Math.sin(t * 1.8) * (a * 0.4)
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate(rot)
      ctx.scale(scale, scale)
      ctx.translate(-canvas.width / 2, -canvas.height / 2)
      const m = ctx.drawElementImage(form, 24, 24)
      form.style.transform = m.toString()
      form.style.transformOrigin = "0 0"
    }

    const onPaintFrame = () => {
      paintOnce()
      if (hovered) raf = requestAnimationFrame(onPaintFrame)
    }

    const start = () => {
      if (hovered) return
      hovered = true
      // Attach onpaint only while hovering so Chromium's automatic paint
      // events don't fire drawElementImage outside the safe window.
      canvas.onpaint = paintOnce
      raf = requestAnimationFrame(onPaintFrame)
    }
    const stop = () => {
      hovered = false
      cancelAnimationFrame(raf)
      canvas.onpaint = null
      // Settle the form back to its rest transform after a beat so the
      // wave doesn't leave it visibly skewed.
      requestAnimationFrame(() => {
        if (!hovered && canvas.requestPaint) {
          canvas.onpaint = () => {
            paintOnce()
            canvas.onpaint = null
          }
          canvas.requestPaint()
        }
      })
    }

    stage.addEventListener("pointerenter", start)
    stage.addEventListener("pointerleave", stop)

    // Single initial paint at rest so the form is positioned correctly
    // in canvas pixels before any interaction.
    canvas.onpaint = () => {
      paintOnce()
      canvas.onpaint = null
    }
    canvas.requestPaint?.()

    return () => {
      cancelAnimationFrame(raf)
      canvas.onpaint = null
      stage.removeEventListener("pointerenter", start)
      stage.removeEventListener("pointerleave", stop)
    }
  }, [])

  return (
    <DemoSection title="HTML in Canvas" lib="WICG/html-in-canvas" version="experimental" docsUrl="https://github.com/WICG/html-in-canvas/blob/main/README.md">
      <p className="text-body text-label-secondary">
        Chromium-only proposal that lets a <code>&lt;canvas layoutsubtree&gt;</code> paint real,
        interactive HTML children via <code>ctx.drawElementImage(el)</code>. The pixels go through
        the canvas (transforms, shaders, blends), while the underlying DOM element stays focusable,
        accessible, and form-fillable. <strong>Hover the stage below</strong> to start the wave —
        the form stays interactive while it warps. See{" "}
        <a className="underline" href="https://github.com/WICG/html-in-canvas/blob/main/README.md" target="_blank" rel="noopener">
          the WICG proposal
        </a>
        ,{" "}
        <a className="underline" href="https://www.youtube.com/watch?v=TUtKGTeFWjQ" target="_blank" rel="noopener">
          Chrome's intro video
        </a>
        , and{" "}
        <a className="underline" href="https://github.com/GoogleChrome/modern-web-guidance-src" target="_blank" rel="noopener">
          modern-web-guidance
        </a>
        .
      </p>

      {supported === false ? (
        <div className="rounded-xl border border-stroke-faint bg-surface-secondary p-4 text-sm">
          <div className="font-medium text-label">API not available in this browser.</div>
          <div className="mt-1 text-label-secondary">
            In origin trial as of Chrome 148–150 (May 2026) — for localhost you still need the
            flag. In any Chromium browser (Chrome / Edge / Brave 1.89+ / Canary), open{" "}
            <code className="font-mono">chrome://flags/#canvas-draw-element</code>, set it to{" "}
            <em>Enabled</em>, relaunch, and reload this page. Firefox and Safari have not
            implemented it yet. The static card below is what the demo would render through canvas.
          </div>
        </div>
      ) : null}

      <div
        ref={stageRef}
        className="relative h-80 overflow-hidden rounded-xl border border-stroke-faint bg-surface-secondary"
      >
        {/* The canvas. layoutsubtree opts descendants into layout + hit-testing. */}
        <canvas
          // @ts-expect-error layoutsubtree is a proposed HTML attribute
          layoutsubtree=""
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
        >
          {/* Direct child of canvas — required by the spec. */}
          <div ref={formRef} className="w-72">
            <Card shadow="md">
              <CardHeader>
                <CardTitle>Live form, warped pixels</CardTitle>
                <CardDescription>
                  Typing still works while the canvas distorts the rendering.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded-md bg-fill-secondary px-3 py-2 text-sm text-label outline-none inset-ring-1 inset-ring-stroke-faint focus:inset-ring-stroke-strong"
                />
                <Button size="sm" onClick={() => toast.success("Form is real DOM!")}>
                  Submit
                </Button>
              </CardContent>
            </Card>
          </div>
        </canvas>
      </div>

      <label className="flex items-center gap-3 text-sm">
        <span className="w-20 text-label-secondary">amplitude</span>
        <Slider
          min={0}
          max={0.25}
          step={0.01}
          value={[amplitude]}
          onValueChange={(v) => setAmplitude(Array.isArray(v) ? v[0] : v)}
          className="flex-1"
        />
        <span className="w-12 text-right font-mono text-xs">{amplitude.toFixed(2)}</span>
      </label>
    </DemoSection>
  )
}

function SkeletonDemo() {
  const [loaded, setLoaded] = useState(false)

  return (
    <DemoSection title="Skeleton loading" lib="@/components/ui/skeleton" docsUrl="https://ui.shadcn.com/docs/components/skeleton">
      <p className="text-body text-label-secondary">
        Composable loading primitives with a gentle pulse animation. Use <code>bg-fill-secondary</code> for
        the skeleton fill — adapts to light and dark mode automatically.
      </p>

      <div className="flex items-center gap-3 mb-2">
        <Button size="sm" variant="outline" onClick={() => setLoaded((v) => !v)}>
          {loaded ? "Show skeleton" : "Show loaded"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Card: skeleton vs loaded */}
        <div>
          <div className="text-[10px] text-label-secondary font-mono mb-2">
            {loaded ? "Loaded" : "SkeletonCard"}
          </div>
          {loaded ? (
            <Card shadow="sm">
              <CardHeader>
                <CardTitle>Notification settings</CardTitle>
                <CardDescription>Manage alerts and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-blue-500 flex items-center justify-center text-white-100 text-xs font-bold">JD</div>
                  <div>
                    <div className="text-sm font-medium text-label">Jane Doe</div>
                    <div className="text-xs text-label-secondary">jane@example.com</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-full bg-green-500 flex items-center justify-center text-white-100 text-xs font-bold">AS</div>
                  <div>
                    <div className="text-sm font-medium text-label">Alex Smith</div>
                    <div className="text-xs text-label-secondary">alex@example.com</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <SkeletonCard />
          )}
        </div>

        {/* Individual primitives */}
        <div className="space-y-4">
          <div>
            <div className="text-[10px] text-label-secondary font-mono mb-2">Primitives</div>
            <div className="rounded-xl border border-stroke-faint bg-surface-secondary p-4 space-y-4">
              <div className="space-y-1">
                <div className="text-[9px] text-label-secondary font-mono">SkeletonHeading</div>
                <SkeletonHeading />
              </div>
              <div className="space-y-1">
                <div className="text-[9px] text-label-secondary font-mono">SkeletonText lines=3</div>
                <SkeletonText lines={3} />
              </div>
              <div className="space-y-1">
                <div className="text-[9px] text-label-secondary font-mono">SkeletonAvatar sm / md / lg</div>
                <div className="flex items-center gap-3">
                  <SkeletonAvatar size="sm" />
                  <SkeletonAvatar size="md" />
                  <SkeletonAvatar size="lg" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[9px] text-label-secondary font-mono">SkeletonImage</div>
                <SkeletonImage />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DemoSection>
  )
}

function ShadersDemo() {
  return (
    <DemoSection
      title="Shaders"
      lib="@paper-design/shaders-react · @react-three/fiber + drei + postprocessing"
      version="five-tier toolkit"
      docsUrl="https://shaders.paper.design/"
    >
      <p className="text-sm text-label-secondary">
        A tiered WebGL toolkit shipped in the template. The two tiles below recreate the reference effects; the full catalog with live controls for every shader lives on the{" "}
        <Link to="/components/shaders" className="text-label underline underline-offset-2 hover:text-blue-500">
          Shaders page
        </Link>.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Reference 1 — Aurora pill */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-label">Aurora pill</div>
          <div className="text-[11px] text-label-secondary">PulsingBorder + DotGrid backdrop + glass pill</div>
          <Squircle
            as="div"
            cornerRadius={SQUIRCLE_RADIUS.xl}
            className="relative h-[260px] overflow-hidden rounded-xl bg-black inset-ring-1 inset-ring-stroke-faint"
          >
            <DotGrid
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              colorBack="#06061a"
              colorFill="#1c1c3a"
              size={2}
              gapX={18}
              gapY={18}
              shape="circle"
            />
            <PulsingBorder
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              colorBack="#06061a00"
              colors={["#ff36c5", "#a52bff", "#ff8be4"]}
              thickness={0.18}
              softness={0.7}
              bloom={0.95}
              spots={5}
              pulse={0.35}
              smoke={0.7}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Squircle
                as="div"
                cornerRadius={999}
                className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md inset-ring-1 inset-ring-white/20"
              >
                <IconSparkles size={16} stroke={2} className="text-white/90" />
                Ask Anything
              </Squircle>
            </div>
          </Squircle>
        </div>

        {/* Reference 2 — Dot grid bloom */}
        <div className="space-y-2">
          <div className="text-xs font-medium text-label">Dot-grid bloom</div>
          <div className="text-[11px] text-label-secondary">MeshGradient bloom over DotGrid</div>
          <Squircle
            as="div"
            cornerRadius={SQUIRCLE_RADIUS.xl}
            className="relative h-[260px] overflow-hidden rounded-xl bg-black inset-ring-1 inset-ring-stroke-faint"
          >
            <DotGrid
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
              colorBack="#02020a"
              colorFill="#1c1c3a"
              size={2}
              gapX={16}
              gapY={16}
              shape="circle"
            />
            <MeshGradient
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "screen", opacity: 0.85 }}
              colors={["#c8a8ff", "#5b6bff", "#06061a"]}
              distortion={0.6}
              swirl={0.3}
              speed={0.3}
              offsetY={0.35}
              scale={1.2}
            />
          </Squircle>
        </div>
      </div>
    </DemoSection>
  )
}

// ── Color editor + culori ───────────────────────────────────────────────────
function ColorEditorDemo() {
  return (
    <DemoSection
      title="Color editor"
      lib="culori"
      docsUrl="https://culorijs.org/"
    >
      <p className="text-body text-label-secondary">
        Every semantic token on <Link to="/colors" className="underline">/colors</Link> is
        click-to-edit with a Figma-style picker (SV square, hue + alpha sliders,
        hex / RGB / CSS / HSL / HSB modes, native EyeDropper in Chromium).
        Conversions go through <code>culori</code>; storage stays OKLCH to
        preserve the system. Overrides persist to localStorage as a sparse
        per-mode diff, so saved palettes survive future token additions.
        Export as JSON or paste-ready CSS, import to restore.
      </p>
      <Link
        to="/colors"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-label hover:text-label/80"
      >
        Open the editor <IconArrowRight size={14} stroke={2} />
      </Link>
    </DemoSection>
  )
}
