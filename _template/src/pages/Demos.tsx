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
      <MotionDemo />
      <GsapDemo />
      <RouterDemo />
      <ZustandDemo />
      <SonnerDemo />
      <LucideDemo />
    </main>
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
