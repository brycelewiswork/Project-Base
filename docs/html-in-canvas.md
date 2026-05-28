# HTML in Canvas

A new Chromium-experimental web platform API (WICG proposal) that lets you
render real, interactive HTML *into* a `<canvas>` — pixels go through the
canvas (you can scale, rotate, distort, post-process with WebGL/WebGPU
shaders, composite with mix-blend-mode), while the DOM element stays
live, focusable, accessible, form-fillable, and screen-readable.

**This API is new (mid-2025). Most LLM training data predates it. When in
doubt, re-read the spec linked below before generating code.**

## References

- Spec & rationale — <https://github.com/WICG/html-in-canvas/blob/main/README.md>
- Google's modern-web-guidance source — <https://github.com/GoogleChrome/modern-web-guidance-src>
- Chrome team intro video — <https://www.youtube.com/watch?v=TUtKGTeFWjQ>

## Activation

As of May 2026 the API is in an **origin trial** in Chrome 148–150:

- For **end users**: any Chromium browser (Chrome / Edge / Brave 1.89+ /
  Canary) with `chrome://flags/#canvas-draw-element` set to *Enabled* and
  a relaunch. Without the flag the methods are simply missing on the
  context — there's no console warning, just `undefined`.
- For **production sites**: register an origin-trial token via the
  Chrome origin trials console and add the `<meta http-equiv="origin-trial"
  content="…">` to ship flag-free to opt-in Chromium users for the trial
  window.
- **Firefox / Safari**: not implemented.

Always feature-detect — never assume:

```js
const ctx = canvas.getContext('2d')
const supported = typeof ctx.drawElementImage === 'function'
```

```js
const ctx = canvas.getContext('2d')
const supported = typeof ctx.drawElementImage === 'function'
```

## API surface

### Markup

```html
<canvas id="c" layoutsubtree>
  <!-- direct children only; they lay out & hit-test but render invisibly -->
  <form id="f">
    <input id="name" />
    <button>Submit</button>
  </form>
</canvas>
```

The `layoutsubtree` attribute opts canvas descendants into layout +
hit-testing, makes direct children form stacking contexts, and enables
paint containment. Without it `drawElementImage()` is a no-op.

### 2D context

```js
const m = ctx.drawElementImage(el, dx, dy)                 // natural size
const m = ctx.drawElementImage(el, dx, dy, dw, dh)         // resized
const m = ctx.drawElementImage(el, sx, sy, sw, sh, dx, dy) // crop
const m = ctx.drawElementImage(el, sx, sy, sw, sh, dx, dy, dw, dh)
// Returns a DOMMatrix — assign to el.style.transform so the live DOM
// element sits exactly under its painted pixels for hit-testing.
```

### WebGL

```js
gl.texElementImage2D(target, level, internalformat, format, type, el)
```

### WebGPU

```js
queue.copyElementImageToTexture(source, destination)
```

### Paint loop

```js
canvas.onpaint = (e) => {
  // e.changedElements: which descendants need redrawing
  ctx.reset()
  const m = ctx.drawElementImage(form, 100, 0)
  form.style.transform = m.toString()
}
canvas.requestPaint() // force a paint on the next frame
```

### OffscreenCanvas / workers

```js
const snapshot = canvas.captureElementImage(el)
worker.postMessage({ snapshot }, [snapshot])
// in worker:
ctx.drawElementImage(snapshotElementImage, 0, 0)
```

### Helper for 3D

```js
const cssTransform = canvas.getElementTransform(el, drawMatrix)
```

## What this unlocks (UX ideas)

- **Distorted/animated forms** — a real `<input>` that breathes, tilts on
  hover, or rides a sine wave, while still typeable and screen-readable.
- **Shader-composited UI** — WebGL/WebGPU post-effects (blur, displacement,
  RGB split, parallax) applied over real HTML widgets and text.
- **HTML on 3D surfaces** — paint a live UI panel onto a face of a
  three.js mesh; users can still click the buttons.
- **Native-looking transitions** — a card morph that mixes layout
  animation with mix-blend-mode lighting across the entire control.
- **Particle/physics overlays** — anchor canvas particles to live DOM
  controls; preserves a11y unlike a `dom-to-image` snapshot.
- **Interactive screenshot/export** — frame-perfect MediaRecorder /
  `canvas.toBlob()` capture of a moving UI for share cards & video.

## ⚠️ Stability warning (May 2026)

`drawElementImage` is in **origin trial** in Chrome 148–150. The
implementation is fragile when called continuously through `onpaint` on
pages that have significant layout churn (responsive grids reflowing,
ResizeObserver-driven measurement, multiple animated components, etc.).
We hit a reproducible renderer crash (`STATUS_BREAKPOINT`) on a page
where the demo lived next to several other observer-using components,
including:

- Pretext-driven accordion (`useMeasure` → height recompute → motion animation)
- Recharts ResponsiveContainer × 4 charts
- MotionPrimitives (Tilt, GlowEffect with pointer listeners)

The crash is **not** an API-level conflict — Pretext and HTML in Canvas
use the Canvas 2D surface for entirely non-overlapping things (Pretext
reads `measureText` off-screen, HTML in Canvas paints to a visible
canvas). The crash is a Chromium-side bug in the experimental
`drawElementImage` implementation: it can't tolerate being called every
frame while ancestor layout is in flight.

**Safe usage patterns** until the API ships stable:

- **Hover-to-animate** — attach `canvas.onpaint = …` only on
  `pointerenter`, detach on `pointerleave`. The mouse can't be on the
  canvas and on the window resize handle at the same time, so layout is
  guaranteed stable while painting.
- **One-shot** — call `requestPaint()` once on an event (click, focus)
  and let it draw a single frame. No rAF chain.
- **Visible-and-idle gate** — combine `IntersectionObserver` (only when
  in viewport) with a debounced resize-end detection.

**Unsafe pattern (causes crash):**

```js
canvas.onpaint = () => {
  ctx.drawElementImage(form, 24, 24)
  raf = requestAnimationFrame(() => canvas.requestPaint())  // continuous loop
}
canvas.requestPaint()
```

This will crash the renderer if the page reflows heavily (e.g. crossing
a CSS breakpoint). Watch the Chrome issue tracker for fixes as the
origin trial progresses.

## Key constraints / gotchas

- Element must be a **direct child** of the canvas.
- CSS `transform` on the source element is **ignored when drawing** (still
  applies to hit testing) — that's why you mirror the returned
  `DOMMatrix` onto `el.style.transform` for sync.
- Overflow is **clipped to the element's border box**.
- DOM mutations done inside `onpaint` show up on the **next** frame; canvas
  drawing in `onpaint` shows up on the **current** frame.
- Transform changes do **not** auto-fire `paint` — call `requestPaint()`.
- For DPR-correct rendering, observe `device-pixel-content-box` on the
  canvas and set `width`/`height` from `inlineSize`/`blockSize`.

## Excluded content (privacy)

The API will not paint into canvas pixels: cross-origin iframes/images,
visited-link styles, system colors, autofill previews, spelling/grammar
markers, subpixel AA, or user caption preferences.

## When to reach for this in this project base

Any sketch where the design intent is **"a real working UI control, but
treated as a graphic object"** — wavy form fields, a button glowing
through a shader, a card that flips with a real input in it, a 3D scene
with a live HUD. If the user could fake it with a static screenshot,
don't use this — its whole value is that the pixels stay interactive.
