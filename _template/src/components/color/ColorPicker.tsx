import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { IconCheck, IconChevronDown, IconColorPicker } from "@tabler/icons-react"
import { Select } from "@base-ui/react/select"
import { Button } from "@/components/ui/button"
import { Squircle, SQUIRCLE_RADIUS } from "@/components/squircle"
import { converter, formatHex, type Hsl, type Hsv, type Rgb } from "culori"
import {
  hsvToHex,
  hsvToOklch,
  oklchCss,
  oklchToHsv,
  parseToOklch,
  type PickerMode,
} from "@/lib/color-convert"


const toRgb = converter("rgb")
const toHsl = converter("hsl")
const toHsv = converter("hsv")

type Props = {
  /** Any CSS color string. Picker parses to oklch internally. */
  value: string
  /** Called only when the user clicks Confirm. Emits an `oklch(...)` CSS string. */
  onConfirm: (oklchCssValue: string) => void
  /** Called when the user cancels or dismisses without confirming. */
  onCancel?: () => void
}

const MODES: PickerMode[] = ["hex", "rgb", "css", "hsl", "hsb"]

export function ColorPicker({ value, onConfirm, onCancel }: Props) {
  // Internal HSV state — kept independent of the value prop so that dragging
  // S=0 (greyscale) doesn't snap the hue back to 0 on every emit.
  const [h, setH] = useState(0)
  const [s, setS] = useState(0)
  const [v, setV] = useState(0)
  const [a, setA] = useState(1)
  const [mode, setMode] = useState<PickerMode>("hsl")

  // Seed draft HSV from the incoming value on every mount/value-change. Picker
  // stages edits locally and only emits via onConfirm — so the page beneath
  // stays stable while the user adjusts.
  useEffect(() => {
    const parsed = parseToOklch(value)
    if (!parsed) return
    const hsv = oklchToHsv(parsed)
    setH(hsv.h || 0)
    setS(hsv.s)
    setV(hsv.v)
    setA(hsv.a)
  }, [value])

  // Set to true while the user is mid-typing in hex/css text inputs, so the
  // box doesn't overwrite their in-progress text from the prop-driven sync.
  const typingRef = useRef(false)

  const handleConfirm = useCallback(() => {
    onConfirm(oklchCss(hsvToOklch(h, s, v, a)))
  }, [h, s, v, a, onConfirm])

  // ─── 2D canvas (saturation × value OR saturation × lightness) ────────────
  // Canvas projection follows the active picker mode so HSL/HSB scales agree
  // with what the user sees in the inputs. HEX/RGB/CSS fall back to HSV.
  const canvasMode: "hsv" | "hsl" = mode === "hsl" ? "hsl" : "hsv"

  // Project current HSV → (x, y) thumb position in the active canvas space.
  const thumb = useMemo(() => {
    if (canvasMode === "hsv") return { x: s, y: 1 - v }
    const hsl = toHsl({ mode: "hsv", h, s, v }) as Hsl | undefined
    return { x: hsl?.s ?? 0, y: 1 - (hsl?.l ?? 0) }
  }, [canvasMode, h, s, v])

  const svRef = useRef<HTMLDivElement>(null)
  const draggingSV = useRef(false)
  const handleSVPointer = (e: React.PointerEvent) => {
    const el = svRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = clamp01((e.clientX - rect.left) / rect.width)
    const y = 1 - clamp01((e.clientY - rect.top) / rect.height)
    if (canvasMode === "hsv") {
      setS(x); setV(y)
      return
    }
    // HSL canvas — convert (h, x as s_hsl, y as l) back to HSV for storage.
    const next = toHsv({ mode: "hsl", h, s: x, l: y }) as Hsv | undefined
    if (!next) return
    setS(next.s ?? 0); setV(next.v ?? 0)
  }
  const onSVDown = (e: React.PointerEvent) => {
    draggingSV.current = true
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    handleSVPointer(e)
  }
  const onSVMove = (e: React.PointerEvent) => { if (draggingSV.current) handleSVPointer(e) }
  const onSVUp = (e: React.PointerEvent) => {
    draggingSV.current = false
    ;(e.target as Element).releasePointerCapture?.(e.pointerId)
  }

  // ─── Eyedropper ───────────────────────────────────────────────────────────
  const hasEyedropper = typeof window !== "undefined" && "EyeDropper" in window
  const pickWithDropper = async () => {
    if (!hasEyedropper) return
    try {
      // @ts-expect-error EyeDropper not in lib.dom yet
      const dropper = new window.EyeDropper()
      const result = await dropper.open()
      const parsed = parseToOklch(result.sRGBHex)
      if (!parsed) return
      const hsv = oklchToHsv(parsed)
      setH(hsv.h || 0); setS(hsv.s); setV(hsv.v); setA(hsv.a)
    } catch {
      // user dismissed
    }
  }

  // ─── Text input ───────────────────────────────────────────────────────────
  const commitText = (raw: string) => {
    const parsed = parseToOklch(raw)
    if (!parsed) return false
    const hsv = oklchToHsv(parsed)
    setH(hsv.h || 0); setS(hsv.s); setV(hsv.v); setA(hsv.a)
    return true
  }

  // ─── Backgrounds ──────────────────────────────────────────────────────────
  const pureHueHex = useMemo(() => hsvToHex(h, 1, 1, 1), [h])
  const currentHex = useMemo(() => hsvToHex(h, s, v, 1), [h, s, v])

  return (
    <div className="flex flex-col gap-3 w-[260px] p-3 select-none">
      {/* 2D canvas — HSV (S×V) by default, HSL (S×L) when picker is in HSL mode */}
      <div
        ref={svRef}
        className="relative h-[180px] w-full rounded-md overflow-hidden cursor-crosshair touch-none"
        style={canvasMode === "hsv"
          ? { backgroundColor: pureHueHex }
          : { background: `linear-gradient(to right, hsl(${h} 0% 50%), hsl(${h} 100% 50%))` }}
        onPointerDown={onSVDown}
        onPointerMove={onSVMove}
        onPointerUp={onSVUp}
        onPointerCancel={onSVUp}
      >
        {canvasMode === "hsv" ? (
          <>
            {/* HSV: white→transparent (x) + transparent→black (y) */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, #fff, rgba(255,255,255,0))" }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0), #000)" }} />
          </>
        ) : (
          /* HSL: white→transparent→black (y), saturation already baked into base */
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to bottom, #fff, rgba(255,255,255,0) 50%, rgba(0,0,0,0) 50%, #000)" }} />
        )}
        {/* thumb */}
        <div
          className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            left: `${thumb.x * 100}%`,
            top: `${thumb.y * 100}%`,
            backgroundColor: currentHex,
            boxShadow: "0 0 0 1.5px white, 0 0 0 2.5px rgba(0,0,0,0.4)",
          }}
        />
      </div>

      {/* Hue + alpha sliders */}
      <div className="flex items-center gap-2">
        {hasEyedropper && (
          <button
            onClick={pickWithDropper}
            className="shrink-0 h-7 w-7 rounded-md flex items-center justify-center text-label-secondary hover:text-label hover:bg-fill-quaternary cursor-pointer"
            aria-label="Pick color from screen"
          >
            <IconColorPicker size={16} stroke={1.75} />
          </button>
        )}
        <div className="flex-1 flex flex-col gap-2">
          <RangeSlider
            value={h}
            min={0}
            max={360}
            onChange={setH}
            trackStyle={{
              background: "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
            }}
            thumbStyle={{ backgroundColor: hsvToHex(h, 1, 1, 1) }}
          />
          <RangeSlider
            value={a * 100}
            min={0}
            max={100}
            onChange={(na) => setA(na / 100)}
            trackStyle={{
              backgroundImage: `linear-gradient(to right, transparent, ${currentHex}), conic-gradient(at 4px 4px, #ddd 25%, #fff 0 50%, #ddd 0 75%, #fff 0)`,
              backgroundSize: "100% 100%, 8px 8px",
            }}
            thumbStyle={{ backgroundColor: currentHex }}
          />
        </div>
      </div>

      {/* Mode + value inputs (component boxes for rgb/hsl/hsb, single box for hex/css) */}
      {/* Mode dropdown — its own button. Then a small gap. Then the unified
          segmented values pill (components + alpha) sharing one outline. */}
      <div className="flex items-center gap-1.5">
        <Select.Root value={mode} onValueChange={(v) => setMode(v as PickerMode)}>
          <Select.Trigger
            className="h-7 shrink-0 inline-flex items-center gap-1 rounded-md bg-fill-tertiary text-xs pl-2 pr-1.5 cursor-pointer inset-ring-1 inset-ring-stroke-faint focus:outline-none text-label"
          >
            <Select.Value>{(v) => String(v).toUpperCase()}</Select.Value>
            <Select.Icon>
              <IconChevronDown size={12} stroke={2} className="text-label-secondary" />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner sideOffset={4} className="z-popover">
              <Select.Popup
                render={(props) => (
                  <Squircle
                    as="div"
                    cornerRadius={SQUIRCLE_RADIUS.md}
                    shadow="md"
                    {...props}
                    className="rounded-md bg-surface-secondary inset-ring-1 inset-ring-stroke-faint py-1 min-w-[68px]"
                  />
                )}
              >
                {MODES.map((m) => (
                  <Select.Item
                    key={m}
                    value={m}
                    className="flex items-center justify-between gap-2 px-2 py-1 text-xs text-label cursor-pointer outline-none data-highlighted:bg-fill-quaternary"
                  >
                    <Select.ItemText>{m.toUpperCase()}</Select.ItemText>
                    <Select.ItemIndicator>
                      <IconCheck size={12} stroke={2} className="text-label-secondary" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
        <div className="flex flex-1 items-center h-7 rounded-md bg-fill-quaternary inset-ring-1 inset-ring-stroke-faint overflow-hidden divide-x divide-stroke-faint/60 focus-within:inset-ring-stroke-strong transition-shadow">
          <ComponentInputs
            mode={mode}
            h={h} s={s} v={v} a={a}
            onComponents={(nh, ns, nv) => { setH(nh); setS(ns); setV(nv) }}
            onTextChange={(raw) => commitText(raw)}
            onConfirm={handleConfirm}
            onCancel={() => onCancel?.()}
            typingRef={typingRef}
          />
          <AlphaInput value={a} onChange={setA} />
        </div>
      </div>

      {/* Confirm / Cancel */}
      <div className="flex gap-2 pt-1">
        <Button variant="ghost" size="sm" className="flex-1" onClick={() => onCancel?.()}>
          Cancel
        </Button>
        <Button size="sm" className="flex-1" onClick={handleConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function RangeSlider({
  value, min, max, onChange, trackStyle, thumbStyle,
}: {
  value: number
  min: number
  max: number
  onChange: (n: number) => void
  trackStyle?: React.CSSProperties
  thumbStyle?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const move = (clientX: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const t = clamp01((clientX - rect.left) / rect.width)
    onChange(min + t * (max - min))
  }
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div
      ref={ref}
      className="relative h-3 rounded-full cursor-pointer touch-none"
      style={trackStyle}
      onPointerDown={(e) => {
        dragging.current = true
        ;(e.target as Element).setPointerCapture?.(e.pointerId)
        move(e.clientX)
      }}
      onPointerMove={(e) => { if (dragging.current) move(e.clientX) }}
      onPointerUp={(e) => {
        dragging.current = false
        ;(e.target as Element).releasePointerCapture?.(e.pointerId)
      }}
      onPointerCancel={() => { dragging.current = false }}
    >
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full pointer-events-none"
        style={{
          left: `${pct}%`,
          ...thumbStyle,
          boxShadow: "0 0 0 1.5px white, 0 0 0 2.5px rgba(0,0,0,0.35)",
        }}
      />
    </div>
  )
}

function clamp01(n: number) { return Math.max(0, Math.min(1, n)) }
function clampRange(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

// ─── Component inputs (per-mode boxes) ─────────────────────────────────────

type ComponentInputsProps = {
  mode: PickerMode
  h: number
  s: number
  v: number
  a: number
  onComponents: (h: number, s: number, v: number) => void
  onTextChange: (raw: string) => boolean
  onConfirm: () => void
  onCancel: () => void
  typingRef: React.MutableRefObject<boolean>
}

function ComponentInputs({ mode, h, s, v, a, onComponents, onTextChange, onConfirm, onCancel, typingRef }: ComponentInputsProps) {
  // Single text box — hex / css
  if (mode === "hex" || mode === "css") {
    const o = hsvToOklch(h, s, v, a)
    const initial = mode === "hex"
      ? (formatHex({ mode: "oklch", l: o.l, c: o.c, h: o.h, alpha: o.alpha }) ?? "#000000")
      : oklchCss(o)
    return (
      <NumericText
        initial={initial}
        flex
        commit={(raw) => onTextChange(raw)}
        onEnterConfirm={onConfirm}
        onEscape={onCancel}
        typingRef={typingRef}
      />
    )
  }

  // Per-mode component triples
  const hsvObj: Hsv = { mode: "hsv", h, s, v, alpha: a }
  if (mode === "rgb") {
    const rgb = toRgb(hsvObj) as Rgb | undefined
    const r = Math.round((rgb?.r ?? 0) * 255)
    const g = Math.round((rgb?.g ?? 0) * 255)
    const b = Math.round((rgb?.b ?? 0) * 255)
    const apply = (nr: number, ng: number, nb: number) => {
      const next = toHsv({ mode: "rgb", r: clampRange(nr, 0, 255) / 255, g: clampRange(ng, 0, 255) / 255, b: clampRange(nb, 0, 255) / 255 }) as Hsv | undefined
      if (!next) return
      onComponents(next.h ?? h, next.s ?? 0, next.v ?? 0)
    }
    return (
      <NumberTriple
        a={{ value: r, min: 0, max: 255 }}
        b={{ value: g, min: 0, max: 255 }}
        c={{ value: b, min: 0, max: 255 }}
        onChange={apply}
        onEnterConfirm={onConfirm}
        onEscape={onCancel}
      />
    )
  }

  if (mode === "hsl") {
    const hsl = toHsl(hsvObj) as Hsl | undefined
    const H = Math.round(hsl?.h ?? h ?? 0)
    const S = Math.round((hsl?.s ?? 0) * 100)
    const L = Math.round((hsl?.l ?? 0) * 100)
    const apply = (nh: number, ns: number, nl: number) => {
      const next = toHsv({ mode: "hsl", h: ((nh % 360) + 360) % 360, s: clampRange(ns, 0, 100) / 100, l: clampRange(nl, 0, 100) / 100 }) as Hsv | undefined
      if (!next) return
      onComponents(next.h ?? nh, next.s ?? 0, next.v ?? 0)
    }
    return (
      <NumberTriple
        a={{ value: H, min: 0, max: 360 }}
        b={{ value: S, min: 0, max: 100 }}
        c={{ value: L, min: 0, max: 100 }}
        onChange={apply}
        onEnterConfirm={onConfirm}
        onEscape={onCancel}
      />
    )
  }

  // hsb — HSV directly
  const H = Math.round(h)
  const S = Math.round(s * 100)
  const V = Math.round(v * 100)
  return (
    <NumberTriple
      a={{ value: H, min: 0, max: 360 }}
      b={{ value: S, min: 0, max: 100 }}
      c={{ value: V, min: 0, max: 100 }}
      onChange={(nh, ns, nv) => onComponents(((nh % 360) + 360) % 360, clampRange(ns, 0, 100) / 100, clampRange(nv, 0, 100) / 100)}
      onEnterConfirm={onConfirm}
      onEscape={onCancel}
    />
  )
}

type NumberSpec = { value: number; min: number; max: number; suffix?: string }

function NumberTriple({
  a, b, c, onChange, onEnterConfirm, onEscape,
}: {
  a: NumberSpec; b: NumberSpec; c: NumberSpec
  onChange: (a: number, b: number, c: number) => void
  onEnterConfirm: () => void
  onEscape: () => void
}) {
  return (
    <div className="flex flex-1 min-w-0 divide-x divide-stroke-faint/60 h-full">
      <NumberBox spec={a} onChange={(n) => onChange(n, b.value, c.value)} onEnterConfirm={onEnterConfirm} onEscape={onEscape} />
      <NumberBox spec={b} onChange={(n) => onChange(a.value, n, c.value)} onEnterConfirm={onEnterConfirm} onEscape={onEscape} />
      <NumberBox spec={c} onChange={(n) => onChange(a.value, b.value, n)} onEnterConfirm={onEnterConfirm} onEscape={onEscape} />
    </div>
  )
}

function NumberBox({
  spec, onChange, onEnterConfirm, onEscape,
}: {
  spec: NumberSpec
  onChange: (n: number) => void
  onEnterConfirm: () => void
  onEscape: () => void
}) {
  const [text, setText] = useState(String(spec.value))
  const focused = useRef(false)
  useEffect(() => {
    if (!focused.current) setText(String(spec.value))
  }, [spec.value])
  const commit = (raw: string) => {
    const n = parseFloat(raw)
    if (!Number.isNaN(n)) onChange(n)
  }
  return (
    <div className="relative flex-1 min-w-0 h-full focus-within:bg-fill-tertiary transition-colors">
      <input
        value={text}
        inputMode="numeric"
        onFocus={(e) => { focused.current = true; e.currentTarget.select() }}
        onChange={(e) => setText(e.target.value)}
        onBlur={(e) => { focused.current = false; commit(e.target.value); setText(String(spec.value)) }}
        onKeyDown={(e) => {
          if (e.key === "Enter") { commit((e.target as HTMLInputElement).value); onEnterConfirm() }
          else if (e.key === "Escape") { onEscape() }
          else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            e.preventDefault()
            const delta = e.key === "ArrowUp" ? 1 : -1
            const step = e.shiftKey ? 10 : 1
            const next = clampRange(spec.value + delta * step, spec.min, spec.max)
            onChange(next)
            setText(String(next))
          }
        }}
        className={`w-full h-full bg-transparent text-xs px-1.5 font-mono focus:outline-none tabular-nums text-center ${spec.suffix ? "pr-3.5" : ""}`}
        spellCheck={false}
      />
      {spec.suffix && (
        <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-label-secondary">{spec.suffix}</span>
      )}
    </div>
  )
}

function NumericText({
  initial, flex, commit, onEnterConfirm, onEscape, typingRef,
}: {
  initial: string
  flex?: boolean
  commit: (raw: string) => boolean
  onEnterConfirm: () => void
  onEscape: () => void
  typingRef: React.MutableRefObject<boolean>
}) {
  const [text, setText] = useState(initial)
  const focused = useRef(false)
  useEffect(() => {
    if (!focused.current) setText(initial)
  }, [initial])
  return (
    <input
      value={text}
      onFocus={() => { focused.current = true; typingRef.current = true }}
      onChange={(e) => setText(e.target.value)}
      onBlur={(e) => { focused.current = false; typingRef.current = false; commit(e.target.value); setText(initial) }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          const ok = commit((e.target as HTMLInputElement).value)
          if (ok) onEnterConfirm()
        } else if (e.key === "Escape") {
          onEscape()
        }
      }}
      className={`h-full bg-transparent text-xs px-2 font-mono focus:outline-none focus-within:bg-fill-tertiary ${flex ? "flex-1 min-w-0" : ""}`}
      spellCheck={false}
    />
  )
}

function AlphaInput({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="shrink-0 w-[48px] h-full">
      <NumberBox
        spec={{ value: Math.round(value * 100), min: 0, max: 100, suffix: "%" }}
        onChange={(n) => onChange(clampRange(n, 0, 100) / 100)}
        onEnterConfirm={() => {}}
        onEscape={() => {}}
      />
    </div>
  )
}
