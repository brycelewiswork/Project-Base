import { useEffect, useRef, useState } from "react"
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  animate,
} from "motion/react"
import useMeasure from "react-use-measure"
import { SPRING } from "@/lib/motion"
import { AnimatedNumber } from "./AnimatedNumber"
import {
  GRADIENT_STOPS,
  LEVELS,
  MAX_VALUE,
  USUAL_RANGE,
  sampleColor,
  valueToPos,
  posToLevel,
  clamp01,
} from "./scale"

// Geometry (SVG user units == px) ------------------------------------------
const H = 124 // svg height
const CY = H / 2
const BAR_HALF = 6 // half-height of the collapsed rounded bar
const WEDGE_MIN_HALF = 5 // half-height at the thin (left) end when expanded
const WEDGE_MAX_HALF = 40 // half-height at the tall (right) end when expanded
const HATCH_HALF = 50 // half-height of the out-of-range hatch band (sits behind the slider)
const HATCH_GAP = 3 // gap between the hatch and the usual-range band
const PAD_L = 10 // room for the rounded left tip
const PAD_R = 14 // room for the handle at the right (vertical) edge
const RIGHT_CORNER = 9 // corner radius where the slanted edges meet the right edge
const SAMPLES = 40

/** Half-height of the shape at normalized x (0–1), blended by `morph` (0–1). */
function halfAt(xn: number, morph: number): number {
  const wedge = WEDGE_MIN_HALF + (WEDGE_MAX_HALF - WEDGE_MIN_HALF) * xn
  return BAR_HALF + (wedge - BAR_HALF) * morph
}

/** Closed SVG path for the wedge/bar at a given morph + track width. */
function buildWedgePath(morph: number, trackW: number): string {
  const x = (xn: number) => PAD_L + xn * trackW
  const yTop = (xn: number) => CY - halfAt(xn, morph)
  const yBot = (xn: number) => CY + halfAt(xn, morph)
  const h0 = halfAt(0, morph)
  const hW = halfAt(1, morph)
  const capR = Math.min(RIGHT_CORNER, hW)
  const cornerXn = trackW > 0 ? Math.max(0, (trackW - capR) / trackW) : 0

  let d = `M ${x(0).toFixed(2)} ${yTop(0).toFixed(2)}`
  // top edge, left → start of the right corner
  for (let i = 1; i <= SAMPLES; i++) {
    const xn = i / SAMPLES
    if (xn >= cornerXn) break
    d += ` L ${x(xn).toFixed(2)} ${yTop(xn).toFixed(2)}`
  }
  d += ` L ${x(cornerXn).toFixed(2)} ${yTop(cornerXn).toFixed(2)}`
  // rounded top-right corner → flat vertical right edge → rounded bottom-right corner
  d += ` Q ${x(1).toFixed(2)} ${(CY - hW).toFixed(2)} ${x(1).toFixed(2)} ${(CY - hW + capR).toFixed(2)}`
  d += ` L ${x(1).toFixed(2)} ${(CY + hW - capR).toFixed(2)}`
  d += ` Q ${x(1).toFixed(2)} ${(CY + hW).toFixed(2)} ${x(cornerXn).toFixed(2)} ${yBot(cornerXn).toFixed(2)}`
  // bottom edge, right corner → left
  for (let i = SAMPLES; i >= 0; i--) {
    const xn = i / SAMPLES
    if (xn >= cornerXn) continue
    d += ` L ${x(xn).toFixed(2)} ${yBot(xn).toFixed(2)}`
  }
  // round cap on the thin left end (semicircle bulging left)
  d += ` A ${h0.toFixed(2)} ${h0.toFixed(2)} 0 0 1 ${x(0).toFixed(2)} ${yTop(0).toFixed(2)} Z`
  return d
}

export type ExertionState = {
  level: number
  color: string
  aboveRange: boolean
  belowRange: boolean
}

export function ExertionSlider({
  initialValue = 5,
  onChange,
}: {
  initialValue?: number
  onChange?: (state: ExertionState) => void
}) {
  const [trackRef, bounds] = useMeasure()
  const w = bounds.width
  const trackW = Math.max(0, w - PAD_L - PAD_R)

  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const pos = useMotionValue(valueToPos(initialValue))
  const morph = useMotionValue(0)

  // Normalized x positions of the usual-range band edges.
  const lowPos = USUAL_RANGE[0] / MAX_VALUE
  const highPos = USUAL_RANGE[1] / MAX_VALUE

  const [level, setLevel] = useState(() => posToLevel(valueToPos(initialValue)))
  const [aboveRange, setAboveRange] = useState(() => valueToPos(initialValue) > highPos)
  const [belowRange, setBelowRange] = useState(() => valueToPos(initialValue) < lowPos)
  const [held, setHeld] = useState(false)
  const levelRef = useRef(level)
  const aboveRef = useRef(aboveRange)
  const belowRef = useRef(belowRange)
  useMotionValueEvent(pos, "change", (p) => {
    const l = posToLevel(p)
    if (l !== levelRef.current) {
      levelRef.current = l
      setLevel(l)
    }
    const above = p > highPos
    if (above !== aboveRef.current) {
      aboveRef.current = above
      setAboveRange(above)
    }
    const below = p < lowPos
    if (below !== belowRef.current) {
      belowRef.current = below
      setBelowRange(below)
    }
  })

  // Report level/color/range to a parent (e.g. the sheet's Save button) on mount
  // and whenever the integer level or range membership changes.
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  useEffect(() => {
    onChangeRef.current?.({
      level,
      color: sampleColor(level / MAX_VALUE),
      aboveRange,
      belowRange,
    })
  }, [level, aboveRange, belowRange])

  // Animated, render-free derived values
  const dPath = useTransform(morph, (m) => (w > 0 ? buildWedgePath(m, trackW) : ""))
  // CSS clip-path for the frosted backdrop div — same silhouette as the SVG path.
  const wedgeClipCss = useTransform(dPath, (d) => (d ? `path('${d}')` : "none"))
  const handleX = useTransform(pos, (p) => PAD_L + p * trackW)
  const handleColor = useTransform(pos, (p) => sampleColor(p))

  // Out-of-range hatch geometry. The boxes are fixed; the "active" span runs
  // from the nearest usual-range edge to the handle and lights up via `morph`.
  const lowX = PAD_L + lowPos * trackW
  const highX = PAD_L + highPos * trackW
  const activeX = useTransform(pos, (p) =>
    p > highPos ? highX : p < lowPos ? PAD_L + p * trackW : 0,
  )
  const activeW = useTransform(pos, (p) => {
    const hx = PAD_L + p * trackW
    if (p > highPos) return Math.max(0, hx - highX)
    if (p < lowPos) return Math.max(0, lowX - hx)
    return 0
  })

  // Rest-state emphasis: the span between the usual-range start and the handle is
  // full opacity; the rest of the slider is 50%, lerping back to full via `morph`.
  const dimBaseOpacity = useTransform(morph, (m) => 0.5 + 0.5 * m)
  const emphX = useTransform(pos, (p) => Math.min(lowX, PAD_L + p * trackW))
  const emphW = useTransform(pos, (p) => Math.abs(PAD_L + p * trackW - lowX))

  // Handle divider: a thin line spanning the wedge's full height at the handle.
  const handleHalf = useTransform([pos, morph], ([p, m]: number[]) => halfAt(p, m))
  const dividerX = useTransform(pos, (p) => PAD_L + p * trackW - 1)
  const dividerY = useTransform(handleHalf, (h) => CY - h)
  const dividerH = useTransform(handleHalf, (h) => 2 * h)

  // Integer tick x-positions (0–10) across the track.
  const tickXs = Array.from({ length: MAX_VALUE + 1 }, (_, i) => PAD_L + (i / MAX_VALUE) * trackW)

  function moveTo(clientX: number) {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const t = clamp01((clientX - rect.left - PAD_L) / trackW)
    pos.set(t)
  }

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true
    setHeld(true)
    ;(e.currentTarget as Element).setPointerCapture?.(e.pointerId)
    animate(morph, 1, SPRING.bouncy)
    moveTo(e.clientX)
  }
  function onPointerMove(e: React.PointerEvent) {
    if (dragging.current) moveTo(e.clientX)
  }
  function endDrag(e: React.PointerEvent) {
    if (!dragging.current) return
    dragging.current = false
    setHeld(false)
    ;(e.currentTarget as Element).releasePointerCapture?.(e.pointerId)
    animate(morph, 0, SPRING.bouncy)
  }

  const current = LEVELS[level]

  return (
    <div className="flex w-full flex-col items-center gap-10 select-none">
      {/* Big number + label */}
      <div className="flex flex-col items-center gap-2 text-center">
        <AnimatedNumber
          value={level}
          className="text-[120px] leading-none font-semibold tracking-tight text-white"
        />
        <span className="text-2xl font-semibold text-white">{current.label}</span>
        <div className="flex h-12 max-w-[18rem] items-start justify-center">
          <span className="text-balance text-base text-white/55">{current.description}</span>
        </div>
      </div>

      {/* Wedge track */}
      <div
        ref={containerRef}
        className="relative w-full max-w-md touch-none cursor-pointer"
        style={{ height: H }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={trackRef} className="absolute inset-0">
          {w > 0 && (
            <>
              {/* BACK layer — the diagonal hatch that sits behind the slider. */}
              <svg
                width={w}
                height={H}
                viewBox={`0 0 ${w} ${H}`}
                className="absolute inset-0 overflow-visible"
              >
                <defs>
                  {/* Diagonal hatch — white lines, reused both as a faded fill and as a mask. */}
                  <pattern
                    id="exertion-hatch"
                    patternUnits="userSpaceOnUse"
                    width={9}
                    height={9}
                    patternTransform="rotate(45)"
                  >
                    <line x1={0} y1={0} x2={0} y2={9} stroke="#fff" strokeWidth={4} />
                  </pattern>
                  <mask id="exertion-hatch-mask">
                    <rect x={0} y={0} width={w} height={H} fill="url(#exertion-hatch)" />
                  </mask>
                  {/* Default-state fade: each out-of-range side fades to 0 at the outer extreme. */}
                  <linearGradient
                    id="exertion-fade-left"
                    gradientUnits="userSpaceOnUse"
                    x1={0}
                    y1={0}
                    x2={lowX - HATCH_GAP}
                    y2={0}
                  >
                    <stop offset="0" stopColor="#000" />
                    <stop offset="1" stopColor="#fff" />
                  </linearGradient>
                  <linearGradient
                    id="exertion-fade-right"
                    gradientUnits="userSpaceOnUse"
                    x1={highX + HATCH_GAP}
                    y1={0}
                    x2={w}
                    y2={0}
                  >
                    <stop offset="0" stopColor="#fff" />
                    <stop offset="1" stopColor="#000" />
                  </linearGradient>
                  <mask id="exertion-fade">
                    <rect
                      x={0}
                      y={CY - HATCH_HALF}
                      width={Math.max(0, lowX - HATCH_GAP)}
                      height={2 * HATCH_HALF}
                      fill="url(#exertion-fade-left)"
                    />
                    <rect
                      x={highX + HATCH_GAP}
                      y={CY - HATCH_HALF}
                      width={Math.max(0, w - (highX + HATCH_GAP))}
                      height={2 * HATCH_HALF}
                      fill="url(#exertion-fade-right)"
                    />
                  </mask>
                </defs>

                {/* Faded hatch — always visible, fading to 0 at the outer extremes and
                    absent across the usual band. */}
                <g mask="url(#exertion-fade)">
                  <rect
                    x={0}
                    y={CY - HATCH_HALF}
                    width={w}
                    height={2 * HATCH_HALF}
                    fill="url(#exertion-hatch)"
                    opacity={0.16}
                  />
                </g>

                {/* Active hatch — the span from the usual band to the handle, tinted by the
                    current color and faded in via `morph`. */}
                <motion.rect
                  x={activeX}
                  width={activeW}
                  y={CY - HATCH_HALF}
                  height={2 * HATCH_HALF}
                  fill={handleColor}
                  mask="url(#exertion-hatch-mask)"
                  style={{ opacity: morph }}
                />
              </svg>

              {/* Frosted backdrop — blurs the hatch behind the slider so the diagonal
                  lines never read through the bar. Clipped to the live wedge silhouette. */}
              <motion.div
                className="pointer-events-none absolute inset-0"
                style={{
                  clipPath: wedgeClipCss,
                  WebkitClipPath: wedgeClipCss,
                  backdropFilter: "blur(7px)",
                  WebkitBackdropFilter: "blur(7px)",
                }}
              />

              {/* FRONT layer — the slider itself, ticks, and the handle divider. */}
              <svg
                width={w}
                height={H}
                viewBox={`0 0 ${w} ${H}`}
                className="absolute inset-0 overflow-visible"
              >
                <defs>
                  <linearGradient
                    id="exertion-gradient"
                    gradientUnits="userSpaceOnUse"
                    x1={PAD_L}
                    y1={0}
                    x2={PAD_L + trackW}
                    y2={0}
                  >
                    {GRADIENT_STOPS.map((s) => (
                      <stop key={s.pos} offset={s.pos} stopColor={s.hex} />
                    ))}
                  </linearGradient>
                  {/* Wedge silhouette — clips the integer ticks to the slider shape. */}
                  <clipPath id="exertion-wedge-clip">
                    <motion.path d={dPath} />
                  </clipPath>
                  {/* Rest-state emphasis: 100% from the usual-range start to the handle, 50% elsewhere. */}
                  <mask id="exertion-emph">
                    <motion.rect
                      x={0}
                      y={0}
                      width={w}
                      height={H}
                      fill="#fff"
                      style={{ opacity: dimBaseOpacity }}
                    />
                    <motion.rect x={emphX} y={0} width={emphW} height={H} fill="#fff" />
                  </mask>
                </defs>

                {/* The slider itself, painted over the frosted hatch. The emphasis mask dims
                    it to 50% except the usual-range-start → handle span (rest state only). */}
                <motion.path d={dPath} fill="url(#exertion-gradient)" mask="url(#exertion-emph)" />

                {/* Integer markers — only in the active (expanded) state. The endpoints
                    (0 and 10) are omitted; 1–4 are dots, 5–9 are vertical ticks. */}
                <motion.g clipPath="url(#exertion-wedge-clip)" style={{ opacity: morph }}>
                  {tickXs.map((tx, i) => {
                    if (i === 0 || i === MAX_VALUE) return null
                    if (i <= 4) {
                      return <circle key={i} cx={tx} cy={CY} r={3} fill="#fff" opacity={0.45} />
                    }
                    return (
                      <rect
                        key={i}
                        x={tx - 2}
                        y={CY - 9}
                        width={4}
                        height={18}
                        rx={2}
                        fill="#fff"
                        opacity={0.45}
                      />
                    )
                  })}
                </motion.g>

                {/* Handle divider — thin line through the handle, spanning the wedge height. */}
                <motion.rect
                  x={dividerX}
                  y={dividerY}
                  width={2}
                  height={dividerH}
                  rx={1}
                  fill="#fff"
                  style={{ opacity: morph }}
                />
              </svg>
            </>
          )}
        </div>

        {/* Out-of-range badge — follows the handle, shows only while held past the band */}
        <motion.div
          className={`pointer-events-none absolute -top-2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide text-white uppercase shadow-lg ${
            belowRange ? "bg-sky-500" : "bg-red-500"
          }`}
          style={{ left: handleX }}
          initial={false}
          animate={{
            opacity: held && (aboveRange || belowRange) ? 1 : 0,
            y: held && (aboveRange || belowRange) ? 0 : 6,
          }}
          transition={SPRING.snappy}
        >
          {belowRange ? "Below Usual Range" : "Above Usual Range"}
        </motion.div>

        {/* Handle */}
        <motion.div
          className="pointer-events-none absolute top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            left: handleX,
            backgroundColor: handleColor,
            boxShadow: "0 0 0 3px white, 0 2px 8px rgba(0,0,0,0.45)",
          }}
        />

        {/* "USUAL RANGE" caption — centered under the un-hatched band */}
        <span
          className="pointer-events-none absolute -translate-x-1/2 text-[11px] font-medium tracking-wider text-white/40 uppercase"
          style={{
            left: PAD_L + ((lowPos + highPos) / 2) * trackW,
            top: CY + HATCH_HALF + 6,
          }}
        >
          Usual Range
        </span>
      </div>
    </div>
  )
}
