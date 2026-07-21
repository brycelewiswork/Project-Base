import { useDialKit, gradientToCss } from "@/components/dialkit"
import { fontStyle } from "@/components/dialkit/components/FontPickerControl"
import { paletteHex } from "@/components/dialkit/components/PaletteControl"
import { SQUIRCLE_RADIUS } from "@/components/squircle"

/**
 * DialkitGallery — one panel wired with **every** control type (and both the
 * shorthand and object/help forms), so the whole set can be eyeballed at once for
 * visual bugs and consistency. The panel floats top-right (global <DialRoot>).
 */
export function DialkitGallery() {
  const v = useDialKit(
    "All Controls",
    {
      // ── Primitives — single-line controls, grouped in a section ──────────
      primitives: {
        _help: "The simple single-line controls",
        opacity: [50, 0, 100] as [number, number, number],
        steps: { type: "slider", default: 4, min: 0, max: 10, step: 2, help: "Stepped 0–10 by 2" },
        enabled: true,
        mono: { type: "toggle", default: false, help: "Object form → carries help" },
        quality: {
          type: "select",
          options: [
            { value: "low", label: "Low" },
            { value: "med", label: "Medium" },
            { value: "high", label: "High" },
          ],
          default: "med",
          help: "A finite named choice",
        },
        caption: { type: "text", default: "Hello", placeholder: "Type a label…", help: "Short name / token" },
        tint: { type: "color", default: "#7C3AEDCC", help: "Opacity lives in the hex (#RRGGBBAA) → split chip" },
      },

      // ── Motion editors ───────────────────────────────────────────────────
      motion: {
        _help: "Spring & easing editors",
        spring: { type: "spring", stiffness: 200, damping: 18 },
        ease: { type: "easing", duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
      },

      // ── Rich / compound controls — each is its own collapsible section ────
      direction: { type: "vector", default: { x: 0.3, y: -0.4 }, help: "Authored X/Y, normalized [-1,1]" },
      fill: {
        type: "gradient",
        help: "The 40% middle stop shows the split chip",
        default: {
          gradientType: "linear",
          angle: 90,
          stops: [
            { id: "a", pos: 0, color: "#FF0080", opacity: 100 },
            { id: "b", pos: 50, color: "#7C3AED", opacity: 40 },
            { id: "c", pos: 100, color: "#00E0FF", opacity: 100 },
          ],
        },
      },
      range: { type: "rangeInput", default: { start: 0.5, end: 8 }, help: "Typed lower/upper bound" },
      swatches: { type: "colorCollection", default: ["#FF0080", "#7C3AED", "#00E0FF80", "#00FF88"] },
      token: { type: "palette", default: { family: 3, shade: 5 }, help: "Family (hue) + shade" },
      heading: {
        type: "fontPicker",
        default: { fontId: "dm-sans", fontWeight: 500, fontSize: 22, textCase: "none", color: "#00E0FF", opacity: 70 },
        help: "Whole text style; 70% opacity → split chip",
      },
      grade: {
        type: "curves",
        default: {
          variant: "rgb",
          rgb: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
          r: [{ x: 0, y: 0 }, { x: 0.4, y: 0.62 }, { x: 1, y: 1 }],
          g: [{ x: 0, y: 0 }, { x: 1, y: 1 }],
          b: [{ x: 0, y: 0 }, { x: 0.6, y: 0.38 }, { x: 1, y: 1 }],
        },
        help: "Tone / color-grade curves (RGB tabs)",
      },
      images: { type: "imagePicker", default: [] as string[] },
      apply: { type: "action", label: "Apply", variant: "primary" },
      randomize: { type: "action", label: "Run action ↩" },
    },
    { onAction: (a) => console.log("dialkit action:", a) },
  )

  return (
    <div className="mx-auto max-w-2xl px-inset-m py-inset-xl">
      <h1 className="text-title-2 font-semibold text-label">Dialkit — every control</h1>
      <p className="mt-stack-2xs text-body text-label-secondary">
        The panel floats <strong className="text-label">top-right</strong>. It's wired with every control type
        (both the tuple/boolean shorthands and the object forms), a couple of help <code>?</code> dots, folder
        sections, and translucent fills that should render the split chip. Scan it for visual bugs and consistency;
        the previews below confirm the values resolve correctly.
      </p>

      {/* Live previews driven by the panel */}
      <div className="mt-stack-l grid grid-cols-2 gap-gutter-s">
        <Preview label="fill (gradient)">
          <div className="h-24 w-full" style={{ borderRadius: SQUIRCLE_RADIUS.lg, background: gradientToCss(v.fill) }} />
        </Preview>
        <Preview label="tint (color)">
          <div className="h-24 w-full" style={{ borderRadius: SQUIRCLE_RADIUS.lg, background: v.primitives.tint }} />
        </Preview>
        <Preview label="token (palette)">
          <div className="flex h-24 items-center justify-center" style={{ borderRadius: SQUIRCLE_RADIUS.lg, background: paletteHex(v.token) }}>
            <span className="font-mono text-xs text-white/90">{paletteHex(v.token)}</span>
          </div>
        </Preview>
        <Preview label="heading (fontPicker)">
          <div className="flex h-24 items-center justify-center rounded-lg bg-surface-secondary" style={{ borderRadius: SQUIRCLE_RADIUS.lg }}>
            <span style={fontStyle(v.heading)}>{v.primitives.caption || "Aa"}</span>
          </div>
        </Preview>
      </div>

      {/* Resolved values — should never show a raw config object */}
      <div className="mt-stack-l">
        <div className="mb-stack-2xs text-caption font-medium uppercase tracking-wide text-label-tertiary">Resolved values</div>
        <pre className="overflow-auto rounded-lg bg-surface-secondary p-inset-s text-caption leading-relaxed text-label-secondary">
          {JSON.stringify(v, null, 2)}
        </pre>
      </div>
    </div>
  )
}

function Preview({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 font-mono text-caption text-label-tertiary">{label}</div>
      {children}
    </div>
  )
}
