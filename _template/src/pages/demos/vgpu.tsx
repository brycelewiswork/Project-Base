import { useEffect, useRef, useState } from "react"
import { DemoSection } from "@/components/DemoSection"
import { Slider } from "@/components/ui/slider"
import { startVoronoi, type VoronoiParams } from "./vgpu-voronoi"
import type { DemoEntry } from "./types"

function VgpuDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scale, setScale] = useState(6)
  const [edge, setEdge] = useState(0.08)
  const [error, setError] = useState<string | null>(null)
  const supported = typeof navigator !== "undefined" && "gpu" in navigator

  // The loop reads params through this ref, so dragging a slider writes the
  // uniform on the next frame instead of tearing down the device.
  const paramsRef = useRef<VoronoiParams>({ scale, edge })
  paramsRef.current = { scale, edge }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !supported) return
    return startVoronoi(canvas, () => paramsRef.current, setError)
  }, [supported])

  return (
    <DemoSection title="WebGPU shaders" lib="vgpu" version="0.5" docsUrl="https://vgpu.sh">
      <p className="text-body text-label-secondary">
        One small WebGPU API that runs the same shader in the browser, in headless Node, and in a
        test. The canvas below is a fullscreen <code>effect()</code> whose WGSL{" "}
        <code>import</code>s <code>voronoi3d</code> from <code>@vgpu/wgsl-std/noise</code> — the
        Vite plugin resolves that module graph at build time. Time comes from the frame clock and
        resolution from the surface; there are no global uniforms.
      </p>

      {!supported ? (
        <div className="rounded-xl border border-stroke-faint bg-surface-secondary p-inset-s text-sm">
          <div className="font-medium text-label">WebGPU not available in this browser.</div>
          <div className="mt-stack-3xs text-label-secondary">
            <code className="font-mono">navigator.gpu</code> is missing. Chrome, Edge and Safari 26+
            ship WebGPU; in Firefox it is still behind{" "}
            <code className="font-mono">dom.webgpu.enabled</code>. The shader itself is
            browser-independent — <code className="font-mono">pnpm check:shaders</code> validates it
            against a real device from Node.
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-stroke-faint bg-surface-secondary p-inset-s text-sm">
          <div className="font-medium text-label">Device init failed.</div>
          <div className="mt-stack-3xs font-mono text-xs text-label-secondary">{error}</div>
        </div>
      ) : null}

      <div className="relative h-80 overflow-hidden rounded-xl border border-stroke-faint bg-surface-secondary">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>

      <div className="flex flex-col gap-stack-xs">
        <label className="flex items-center gap-inline-xs text-sm">
          <span className="w-20 text-label-secondary">scale</span>
          <Slider
            min={2}
            max={20}
            step={0.5}
            value={[scale]}
            onValueChange={(v) => setScale(Array.isArray(v) ? v[0] : v)}
            className="flex-1"
          />
          <span className="w-12 text-right font-mono text-xs">{scale.toFixed(1)}</span>
        </label>
        <label className="flex items-center gap-inline-xs text-sm">
          <span className="w-20 text-label-secondary">edge</span>
          <Slider
            min={0.01}
            max={0.3}
            step={0.01}
            value={[edge]}
            onValueChange={(v) => setEdge(Array.isArray(v) ? v[0] : v)}
            className="flex-1"
          />
          <span className="w-12 text-right font-mono text-xs">{edge.toFixed(2)}</span>
        </label>
      </div>
    </DemoSection>
  )
}

const entry: DemoEntry = {
  lib: "vgpu",
  role: "WebGPU / WGSL",
  version: "0.5",
  docsUrl: "https://vgpu.sh",
  Component: VgpuDemo,
}
export default entry
