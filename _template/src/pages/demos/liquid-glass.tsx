import { useState } from "react"
import { DemoSection } from "@/components/DemoSection"
import { LiquidGlass } from "@/components/ui/liquid-glass"
import { Slider } from "@/components/ui/slider"
import type { DemoEntry } from "./types"

function LiquidGlassDemo() {
  const [strength, setStrength] = useState(60)
  const [blur, setBlur] = useState(2)
  const [bevel, setBevel] = useState(0.45)

  return (
    <DemoSection
      title="Liquid glass"
      lib="custom"
      bare
      docsUrl="https://kube.io/blog/liquid-glass-css-svg/"
    >
      <p className="text-body text-label-secondary">
        Hand-rolled in <code>@/components/ui/liquid-glass</code>. A canvas-generated
        displacement map drives an SVG <code>feDisplacementMap</code> inside{" "}
        <code>backdrop-filter</code>, refracting the backdrop near the bevel like Apple's
        Liquid Glass. Chromium-only; falls back to a frosted blur elsewhere.
      </p>

      <div
        className="relative grid h-64 place-items-center overflow-hidden rounded-xl p-6"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, oklch(0.72 0.2 25) 0 22px, oklch(0.7 0.2 250) 22px 44px, oklch(0.82 0.19 140) 44px 66px, oklch(0.85 0.2 90) 66px 88px)",
        }}
      >
        <LiquidGlass
          strength={strength}
          blur={blur}
          bevel={bevel}
          radius={28}
          className="grid h-32 w-56 place-items-center"
        >
          <span className="text-lg font-semibold text-white drop-shadow">Liquid Glass</span>
        </LiquidGlass>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex items-center gap-3 text-sm">
          <span className="w-16 text-label-secondary">strength</span>
          <Slider
            min={0}
            max={150}
            step={1}
            value={[strength]}
            onValueChange={(v) => setStrength(Array.isArray(v) ? v[0] : v)}
            className="flex-1"
          />
          <span className="w-12 text-right font-mono text-xs">{strength}</span>
        </label>
        <label className="flex items-center gap-3 text-sm">
          <span className="w-16 text-label-secondary">blur</span>
          <Slider
            min={0}
            max={12}
            step={0.5}
            value={[blur]}
            onValueChange={(v) => setBlur(Array.isArray(v) ? v[0] : v)}
            className="flex-1"
          />
          <span className="w-12 text-right font-mono text-xs">{blur}px</span>
        </label>
        <label className="flex items-center gap-3 text-sm">
          <span className="w-16 text-label-secondary">bevel</span>
          <Slider
            min={0.1}
            max={1}
            step={0.05}
            value={[bevel]}
            onValueChange={(v) => setBevel(Array.isArray(v) ? v[0] : v)}
            className="flex-1"
          />
          <span className="w-12 text-right font-mono text-xs">{bevel.toFixed(2)}</span>
        </label>
      </div>
    </DemoSection>
  )
}

const entry: DemoEntry = {
  lib: "liquid-glass",
  role: "glass fx",
  docsUrl: "https://kube.io/blog/liquid-glass-css-svg/",
  Component: LiquidGlassDemo,
}
export default entry
