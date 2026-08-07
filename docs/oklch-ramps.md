# OKLCH ramps — the 13-step system

`_template/src/lib/oklch.ts` generates color families in the same shape as the
Apple system colors already committed to `index.css`. This is the derivation
behind it, and why generated ramps sit next to the imported ones as peers
rather than approximations.

## The finding

The 12 imported families look hand-picked. They aren't. Every one of them —
and every one of their `-dark-` variants, 24 ramps and 312 swatches in total —
is reproducible from **three numbers plus two shared profiles**.

The three numbers are the lightness, chroma, and hue of the family's **500**
step. The two profiles are shared by all 24 ramps:

| Step | `L_PROFILE` | `C_PROFILE` |
|------|------------|------------|
| 50   | 1.00 | 0.12 |
| 100  | 0.85 | 0.22 |
| 150  | 0.72 | 0.32 |
| 200  | 0.60 | 0.42 |
| 300  | 0.40 | 0.62 |
| 400  | 0.18 | 0.82 |
| **500** | **0** | **1.00** |
| 600  | 0.18 | 0.92 |
| 700  | 0.40 | 0.80 |
| 800  | 0.60 | 0.65 |
| 850  | 0.72 | 0.55 |
| 900  | 0.85 | 0.45 |
| 950  | 1.00 | 0.35 |

Given an anchor `(L₅₀₀, C₅₀₀, H)`:

```
end   = step < 500 ? 0.97 : 0.20
L     = L₅₀₀ + L_PROFILE[step] × (end − L₅₀₀)
C     = C₅₀₀ × C_PROFILE[step]
H     = H                                  // constant, no drift at all
```

Regenerating all 24 committed families this way lands within **ΔL 0.00064 and
ΔC 0.00080** — under one unit in the third decimal, i.e. inside the rounding of
the values as written in the CSS. The residual is rounding, not model error.

### Reading the profiles

`L_PROFILE` is a *position*, not a lightness: 0 means "at the anchor", 1 means
"at the ramp's end". It's perfectly symmetric about 500, so both halves of the
ramp are shaped identically. Both ends are fixed for every family — **L 0.97 at
step 50 and L 0.20 at step 950** — which is why families converge to the same
near-white and near-black no matter how light or dark their 500 is.

`C_PROFILE` is *not* symmetric. The dark half holds chroma much better than the
light half: step 950 keeps 35% of the anchor's chroma while step 50 keeps only
12%. That asymmetry is what stops the tints going muddy and is a large part of
why the Apple ramps read the way they do.

The **anchor lightness varies enormously between families** — indigo's 500 sits
at L 0.559, yellow's at L 0.865. That is the whole point: each family is built
by pinning its real brand color at 500 and interpolating out to shared ends.
Which is exactly the "build a ramp through a color I already have" operation,
so `rampThroughColor()` is the same machine run backwards.

## Gamut: these ramps are not sRGB

**151 of the 312 committed swatches fall outside sRGB.** Only 26 fall outside
Display P3. The palette is authored for P3 and deliberately overshoots sRGB.

This matters for generated ramps: clamping to sRGB by default would make a new
family visibly flatter than the imported ones at the extremes — the opposite of
meshing. So `gamut` defaults to `"none"`, and clamping is opt-in:

```ts
rampFromHue(265)                    // matches the Apple families' behavior
rampFromHue(265, { gamut: "srgb" }) // safe everywhere, flatter at the ends
gamutReport(ramp, "srgb")           // which steps are over, and by how much
```

The 26 P3 offenders are almost all the lightest tints (near white there is
barely any room for chroma) plus yellow's dark end, where the gamut pinches
hard.

## Chroma strategies

All three generators are the same builder with a different chroma rule:

| Strategy | Rule | Use |
|---|---|---|
| `profile` | `C₅₀₀ × C_PROFILE[step]` | Families that sit beside the Apple ones |
| `flat` | one chroma everywhere | Tinted neutrals |
| `max` | `percent% × maxChroma(L, H)` | Tonal's vibrant section |

`max` peaks mid-ramp without being told to, because the OKLCH gamut is widest
at mid lightness.

### Percent, not absolute

`rampFromHue` takes chroma as a **percentage of what that hue can actually
reach**, not an absolute number. Different hues have wildly different ceilings —
at L 0.68 in sRGB, chroma tops out around 0.111 for one hue and 0.279 for
another. Feeding the same absolute chroma to every hue makes some families look
washed out and others gaudy; the same percentage makes them read as equally
vivid. This is the single most useful thing OKLCH gives you over HSL.

## API

```ts
// The three headline generators
rampFromHue(265, { percent: 90 })              // family from a hue angle
rampThroughColor("#3b82f6", { anchor: 500 })   // family through a color you have
rampThroughColor("#e8f0ff", { anchor: "auto" })// let it pick the step

// Tonal sections
neutralRamp()              // C = 0
tintedNeutralRamp(250)     // flat C = 0.01
vibrantRamp(250)           // gamut ceiling at every step

// Inspection
maxChroma(0.68, 265, "p3")
gamutReport(ramp, "srgb")
hueDrift([...])            // >10° is visible; catches HSL-built ramps

// Contrast
apcaLc(fg, bg)             // signed Lc, |60| body / |75| comfortable / |45| large
wcagRatio(fg, bg)          // for formal conformance claims
readableOn(bg)             // "black" | "white"
stepsPassing(ramp, bg, 60)

// Output
rampToTokenBlocks("brand", light, dark)  // @theme / :root / .dark paste
rampToHex(ramp)
```

`rampThroughColor` pins your input to a step and solves the profiles backwards
to recover the 500 anchor, so the color you supplied survives into the output
**exactly** rather than being approximated by the nearest generated swatch. If
the requested step is impossible for that color — pinning something near-white
to step 900 — it clamps and says so in `ramp.notes` instead of silently
returning something wrong.

Anchoring at 50 or 950 is a special case: those steps *are* the ramp's ends, so
the input redefines the end rather than solving for an anchor.

## Adding a family to `index.css`

Tailwind v4 needs the tokens in two places. `rampToTokenBlocks` emits all three
blocks in the existing format:

```ts
const { theme, root, dark } = rampToTokenBlocks(
  "brand",
  rampFromHue(265),
  rampFromHue(263),  // optional dark variant
)
```

- `theme` → the `@theme inline` block (mints `bg-brand-500` etc.)
- `root` → `:root`, the literal values
- `dark` → the `.dark` block, remapping `--color-brand-*` to `--color-brand-dark-*`

The dark variants of the Apple families are **separately sampled**, not derived
— their hue shifts up to 4.6° and their chroma ratio ranges from 0.84 to 1.07
against the light ramp. There's no formula to copy, so generate a second ramp
from the dark anchor rather than trying to transform the light one.

## The Ramp Studio (`/colors`)

The whole engine is driven from a **Ramp Studio** section on `/colors`, sitting
directly above the Apple reference swatches so the two can be compared by eye.
Five modes — through a color, from a hue, vibrant, tinted neutral, neutral —
with live preview, per-step hex and L·C, and a readout of the anchor, the
out-of-gamut steps, and which steps carry body text on white.

When a request is impossible (pinning a near-white to step 900) it says so in a
note rather than silently returning something wrong.

## Getting a ramp into Figma

Figma has no OKLCH — its fills and variables are sRGB. Both exports therefore
carry **gamut-mapped hex**, with the OKLCH original preserved as metadata.
`rampToHex` maps properly (chroma reduced, L and H held) rather than clipping
RGB channels independently, which would shift hue and can collapse distinct
steps onto the same value.

**SVG — no plugin.** `rampsToSvg()` writes a swatch sheet you drag straight onto
a canvas. Every rect carries `id="<name>-<step>"`, which Figma reads as the
layer name, and each ramp is wrapped in a `<g id="<name>">` so it arrives as a
named group. Select the swatches and turn them into styles or variables from
there.

**DTCG JSON — for real variables.** `rampsToDtcg()` emits W3C Design Tokens
format (`$type` / `$value`), which Tokens Studio and the Figma variable-import
plugins read. Each token keeps the exact OKLCH under `$description` and
`$extensions`, including an `outsideSrgb` flag so you can see which values Figma
cannot represent faithfully:

```json
"50": {
  "$type": "color",
  "$value": "#f1f4ff",
  "$description": "oklch(0.970 0.022 278.28)",
  "$extensions": {
    "work.brycelewis.oklch": { "l": 0.97, "c": 0.0221, "h": 278.28, "outsideSrgb": true }
  }
}
```

Not offered: `.ase`. Figma cannot import it natively, so it would need a plugin
anyway — at which point DTCG is the better payload.

## Notes

- `--color-neutral-*` in `index.css` is a **different** scale — Tailwind's own
  11 steps spanning L 0.985 → 0.145. `neutralRamp()` uses the 13 stops and the
  accent ladder's 0.97 → 0.20 bounds so it lines up with the color families
  instead. They are not interchangeable.
- APCA is implemented from the APCA-W3 0.1.9 formula and verified bit-exact
  against the reference package across 4000 random color pairs. It's the better
  perceptual measure and the natural partner to OKLCH; WCAG 2 is still what you
  cite for legal conformance.
- `maxChroma` binary-searches the gamut boundary (there's no closed form) and
  memoizes on a quantized key, so it's cheap enough to drive from a slider.
