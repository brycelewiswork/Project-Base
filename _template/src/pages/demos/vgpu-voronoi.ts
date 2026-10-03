import { clock, effect, frameLoop, init, surface } from "vgpu"
import type { FrameLoopHandle } from "vgpu"
import voronoiShader from "./vgpu.wgsl"

/** Live-tunable shader params. Read every frame, so a slider needs no restart. */
export type VoronoiParams = { scale: number; edge: number }

/**
 * Starts the Voronoi render loop on `canvas`; call the returned function to tear
 * it down. Kept as a plain function (not a hook) per vgpu's guide: the GPU work
 * is the part worth testing, and the React component only owns the canvas.
 *
 * `read` is called each frame instead of closing over values, so the component
 * can drive params from a ref without restarting the device.
 */
export function startVoronoi(
  canvas: HTMLCanvasElement,
  read: () => VoronoiParams,
  onError: (message: string) => void,
): () => void {
  let disposed = false
  let loop: FrameLoopHandle | undefined
  let gpu: Awaited<ReturnType<typeof init>> | undefined

  void (async () => {
    try {
      gpu = await init()
      // Strict mode mounts effects twice: without this the first device leaks.
      if (disposed) return gpu.dispose()

      const canvasSurface = surface(gpu, canvas, { dpr: [1, 2] })
      const initial = read()
      const voronoi = effect(gpu, voronoiShader, {
        label: "voronoi",
        set: {
          params: {
            texel: canvasSurface.texelSize,
            time: 0,
            scale: initial.scale,
            edge: initial.edge,
          },
        },
      })

      // Size-class values belong in the resize handler, not the frame loop.
      canvasSurface.onResize(() => {
        voronoi.set({ params: { texel: canvasSurface.texelSize } })
      })

      const time = clock(gpu)
      loop = frameLoop(gpu, (frame) => {
        const { scale, edge } = read()
        voronoi.set({ params: { time: time.time, scale, edge } })
        frame.pass(canvasSurface, voronoi)
      })
    } catch (err) {
      onError(err instanceof Error ? err.message : String(err))
      gpu?.dispose()
    }
  })()

  return () => {
    disposed = true
    loop?.stop()
    gpu?.dispose()
  }
}
