import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "motion/react"
import gsap from "gsap"
import { toast } from "sonner"
import { ArrowRightIcon, HeartIcon, SparklesIcon, ZapIcon } from "lucide-react"

import { DemoSection } from "@/components/DemoSection"
import { Squircle, SQUIRCLE_RADIUS } from "@/components/squircle"
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

export function Demos() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-medium tracking-tight">Installed</h1>
        <p className="text-muted-foreground">
          Every library bundled into <code className="font-mono text-sm">project-base</code> is
          demonstrated below. If it isn't on this page, it shouldn't be in the template.
        </p>
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
      <LucideDemo />
    </main>
  )
}

function MotionPrimitivesDemo() {
  const [num, setNum] = useState(0)
  const [textKey, setTextKey] = useState(0)
  return (
    <DemoSection title="Motion primitives" lib="motion-primitives">
      <p className="text-sm text-muted-foreground">
        32 copy-paste animation components from{" "}
        <a href="https://motion-primitives.com" className="underline" target="_blank" rel="noopener">
          motion-primitives.com
        </a>
        . Built on the same <code>motion</code> package already in the stack. Showing a sample below
        — all 32 are installed and importable from <code>@/components/ui/</code>.
      </p>

      {/* TextEffect */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">TextEffect — blur reveal</span>
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
        <span className="text-xs font-medium text-muted-foreground">TextShimmer</span>
        <TextShimmer className="text-lg font-medium" duration={1.5}>
          Shimmering highlight sweep
        </TextShimmer>
      </div>

      {/* AnimatedNumber */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">AnimatedNumber</span>
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
        <span className="text-xs font-medium text-muted-foreground">InfiniteSlider</span>
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
          <span className="text-xs font-medium text-muted-foreground">Tilt</span>
          <Tilt rotationFactor={8} springOptions={{ stiffness: 300, damping: 20 }}>
            <div className="flex h-28 items-center justify-center rounded-xl bg-foreground/5 text-sm text-muted-foreground">
              Hover and tilt
            </div>
          </Tilt>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">GlowEffect</span>
          <div className="relative flex h-28 items-center justify-center rounded-xl bg-foreground/5 text-sm text-muted-foreground">
            <GlowEffect colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]} mode="colorShift" />
            Animated glow border
          </div>
        </div>
      </div>

      {/* InView */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">InView — scroll to reveal</span>
        <InView
          variants={{
            hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)" },
          }}
          transition={{ duration: 0.5, ease: "easeOut" as const }}
          viewOptions={{ once: true, margin: "0px 0px -40px 0px" }}
        >
          <div className="flex h-20 items-center justify-center rounded-xl bg-foreground/5 text-sm text-muted-foreground">
            I animated in when you scrolled here
          </div>
        </InView>
      </div>

      {/* Full inventory */}
      <details className="text-sm">
        <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
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
    <DemoSection title="Progressive blur" lib="custom">
      <p className="text-sm text-muted-foreground">
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
          <span className="w-20 text-muted-foreground">strength</span>
          <input
            type="range"
            min={0}
            max={128}
            step={1}
            value={strength}
            onChange={(e) => setStrength(parseInt(e.target.value, 10))}
            className="flex-1 accent-foreground"
          />
          <span className="w-12 text-right font-mono text-xs">{strength}px</span>
        </label>
        <label className="flex items-center gap-3 text-sm">
          <span className="w-20 text-muted-foreground">falloff</span>
          <input
            type="range"
            min={10}
            max={100}
            step={1}
            value={falloff}
            onChange={(e) => setFalloff(parseInt(e.target.value, 10))}
            className="flex-1 accent-foreground"
          />
          <span className="w-12 text-right font-mono text-xs">{falloff}%</span>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium text-muted-foreground">
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
      <span className="pointer-events-none absolute bottom-1 left-2 font-mono text-[10px] text-foreground/60 mix-blend-difference">
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
  // User's explicit pick (set when they click a swatch). Cleared on src change
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
    <DemoSection title="Color from image" lib="colorthief">
      <p className="text-sm text-muted-foreground">
        Extract dominant color, palette, and semantic swatches from any image. Pair with
        <code> &lt;LinearBlur tint=&hellip;&gt;</code> for the Apple Music-style blend.
      </p>

      {/* Sample picker */}
      <div className="flex flex-col gap-2">
        <div className="text-xs font-medium text-muted-foreground">Try a sample</div>
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
                    ? "border-foreground ring-2 ring-foreground/30"
                    : "border-border/60 hover:border-foreground/40"
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
        <div className="relative h-56 overflow-hidden rounded-xl bg-foreground/5">
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
        <div className="text-xs font-medium text-muted-foreground">Palette ({palette?.length ?? 0})</div>
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
        <div className="text-xs font-medium text-muted-foreground">Semantic swatches</div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {(["Vibrant", "Muted", "DarkVibrant", "DarkMuted", "LightVibrant", "LightMuted"] as const).map(
            (role) => {
              const sw = swatches?.[role]
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => sw && setUserPickedHex(sw.color.hex())}
                  className="flex flex-col items-center gap-1 rounded-md border border-border/60 p-2 text-[10px] transition-colors hover:bg-muted/40 disabled:opacity-40"
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
        <div className="text-xs font-medium text-muted-foreground">
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
        <span className="text-xs text-muted-foreground">
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
        active ? "border-foreground" : "border-border/60 hover:border-foreground/40"
      }`}
    >
      <span className="size-4 rounded-sm" style={{ backgroundColor: hex }} />
      <span className="font-mono">{hex}</span>
    </button>
  )
}

function HarmonyChip({ label, hex }: { label: string; hex: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border/60 p-2 text-xs">
      <span className="size-6 rounded-sm" style={{ backgroundColor: hex }} />
      <div className="flex flex-col">
        <span className="text-[10px] text-muted-foreground">{label}</span>
        <span className="font-mono">{hex}</span>
      </div>
    </div>
  )
}

function SquircleDemo() {
  const [smoothing, setSmoothing] = useState(0.6)
  return (
    <DemoSection title="Apple-style squircles" lib="corner-smoothing">
      <p className="text-sm text-muted-foreground">
        Continuous-curve corners via SVG <code>clip-path</code>. Every shadcn component in this
        template renders through <code>&lt;Squircle&gt;</code> or <code>useSquircle</code>.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            CSS <code>border-radius</code>
          </span>
          <div className="flex h-32 items-center justify-center rounded-xl bg-foreground/10">
            <span className="text-xs text-muted-foreground">rounded-xl</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Squircle <code>clip-path</code>
          </span>
          <Squircle
            as="div"
            cornerRadius={SQUIRCLE_RADIUS.xl}
            cornerSmoothing={smoothing}
            className="flex h-32 items-center justify-center bg-foreground/10"
          >
            <span className="text-xs text-muted-foreground">
              smoothing {smoothing.toFixed(2)}
            </span>
          </Squircle>
        </div>
      </div>
      <label className="flex items-center gap-3 text-sm">
        <span className="w-24 text-muted-foreground">cornerSmoothing</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={smoothing}
          onChange={(e) => setSmoothing(parseFloat(e.target.value))}
          className="flex-1 accent-foreground"
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
          <div className="h-12 rounded-md bg-foreground/5" />
        </CardContent>
      </Card>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card shadow="sm">
          <CardHeader>
            <CardTitle>shadow=&quot;sm&quot;</CardTitle>
            <CardDescription>Hairline elevation.</CardDescription>
          </CardHeader>
        </Card>
        <Card shadow="md">
          <CardHeader>
            <CardTitle>shadow=&quot;md&quot;</CardTitle>
            <CardDescription>Default lift.</CardDescription>
          </CardHeader>
        </Card>
        <Card shadow="lg">
          <CardHeader>
            <CardTitle>shadow=&quot;lg&quot;</CardTitle>
            <CardDescription>Modal-ish elevation.</CardDescription>
          </CardHeader>
        </Card>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button shadow="md">Button shadow=md</Button>
        <Button shadow="lg" variant="secondary">shadow=lg</Button>
      </div>
    </DemoSection>
  )
}

function MotionDemo() {
  return (
    <DemoSection title="Motion (framer-motion)" lib="motion">
      <p className="text-sm text-muted-foreground">
        React animation primitives — springs, transforms, layout, gesture.
      </p>
      <div className="flex items-center gap-4">
        <motion.div
          className="flex h-16 w-16 items-center justify-center bg-foreground text-background"
          style={{ borderRadius: 14 }}
          animate={{ rotate: [0, 90, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <SparklesIcon className="size-5" />
        </motion.div>
        <span className="text-sm text-muted-foreground">
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
        ease: "back.out(2)",
      },
    )
  }
  useEffect(() => { play() }, [])
  return (
    <DemoSection title="GSAP" lib="gsap">
      <p className="text-sm text-muted-foreground">
        Timeline + stagger for high-fidelity orchestration.
      </p>
      <div className="flex items-end gap-4">
        <div className="flex gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              ref={(el) => { boxes.current[i] = el }}
              className="size-8 rounded-md bg-foreground/30"
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
    <DemoSection title="React Router" lib="react-router-dom">
      <p className="text-sm text-muted-foreground">
        Multi-page sketches with <code>BrowserRouter</code> + <code>Routes</code>.
      </p>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <Link to="/" className="inline-flex items-center gap-1 underline">
          Home <ArrowRightIcon className="size-3" />
        </Link>
        <Link to="/sketch" className="inline-flex items-center gap-1 underline">
          Sketch <ArrowRightIcon className="size-3" />
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
    <DemoSection title="Zustand" lib="zustand">
      <p className="text-sm text-muted-foreground">
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
    <DemoSection title="Sonner" lib="sonner">
      <p className="text-sm text-muted-foreground">
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

function LucideDemo() {
  return (
    <DemoSection title="Lucide" lib="lucide-react">
      <p className="text-sm text-muted-foreground">Icon library used by shadcn defaults.</p>
      <div className="flex items-center gap-4 text-foreground/70">
        <SparklesIcon className="size-5" />
        <HeartIcon className="size-5" />
        <ZapIcon className="size-5" />
        <ArrowRightIcon className="size-5" />
      </div>
    </DemoSection>
  )
}
