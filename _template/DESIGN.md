# Design intent

This is the **taste document** for project-base sketches. It captures the
*why* and the *feel* — the personality CLAUDE.md's choices are pointed at.
For the *what* (stack, tokens, conventions) read [CLAUDE.md](CLAUDE.md). For
the live, browsable token catalog, run `npm run dev` and visit `/colors`,
`/typography`, `/motion`, `/spacing`, and `/breakpoints`.

Treat this file as **inheritable taste**: every sketch spawned from the
template starts here. Override per-sketch only when the experiment demands it.

## What this design feels like

Apple-system. Optical-grade typography on DM Sans with subtle weight contrast.
Continuous-curve corners — squircles, never plain circles. Subtle springs over
bouncy ones; the motion is always purposeful, never decorative. Generous
whitespace; never crowded. No element earns its place by being pretty — only
by being *useful or clarifying*. Restraint reads as quality.

The default emotional register is **calm and confident**, not flashy. A sketch
should feel like something Apple, Linear, or Arc could ship — not like a
landing-page template.

## References

Anchor screens that define the target feel. Each is on this list for a
specific reason — when the inspiration drifts, the screen comes off the list.

- **iOS Control Center / Settings** — surface hierarchy, label tiers, group
  rhythm, the role of system blur.
- **macOS Sonoma+ Settings** — sidebar density, section dividers, mono
  for values.
- **Apple Music (macOS / iOS)** — image-to-color blends, glass over media,
  the way color extracted from artwork tints chrome without overwhelming it.
- **Linear** — keyboard-first ergonomics, prose density, restraint with
  motion, the way state changes feel *settled* rather than animated.
- **Arc / The Browser Company** — playful but disciplined; permission to
  break form sparingly when the moment earns it.
- **Stripe Docs** — code blocks, mono usage, prose typography, the way
  technical content can still feel editorial.
- **Vercel dashboard** — dark surfaces, dense data, restraint with shadows.
- **Raycast** — command palettes, dense lists, mono for keyboard hints.

## Composition principles

Rules that live above the token layer.

- **Vertical rhythm beats horizontal density.** Stack first. Only break into
  columns when content genuinely benefits — never to fill width.
- **Page width caps at `max-w-4xl`** for prose-heavy pages; visualizations
  can extend wider but always with intentional bleed, not because they grew
  there by accident.
- **Cards earn their use.** A `<Section bare>` is the default; a `<SectionCard>`
  is for content that benefits from grouping or elevation. Don't wrap every
  block in a card.
- **One source of attention per screen.** If two things compete for the eye,
  one is wrong. Demote with `text-label-secondary`, smaller weight, or remove.
- **Motion belongs at state boundaries.** Reveals, transitions, confirmations.
  Not on page entry, not on idle, not as decoration.
- **The header is the page.** A confident `PageHeader` (title + one-line
  description) does more than a hero image ever will.
- **Mono is structural.** Numbers, code, tokens, values, dimensions — they
  get the mono face. Mono on prose is a smell.

## Typography rationale

- **DM Sans Variable (100–900)** is the body face because it reads like a
  system UI font without being one — neutral, sturdy, optical-sized. It does
  not impose a personality, which is exactly what a sketch baseline needs.
- **DM Mono** is the mono face for visual continuity (same designer, same
  proportions) — mono blocks don't fight the body.
- **Display vs. body weights:** `font-medium` (500) is the *default* for
  labels and headings; `font-semibold` (600) for hierarchy emphasis;
  `font-bold` (700+) is rare and reserved for display moments.
- **Mono is mandatory for:** numbers in tables, code snippets, CSS values
  (`var(--surface)`), tokens, dimensions (`24px`, `1.5rem`), keyboard hints.
- The live scale lives at `/typography`. Don't restate it here.

## Color rationale

- **Semantic over named.** Components use `bg-surface`, `text-label`,
  `border-stroke-faint` — never `bg-gray-100`. The point is that the same
  component reads correctly in light *and* dark mode without conditional
  logic. Named colors (`red-500`, `blue-500`) are for accents and visualization
  only.
- **Three tiers of label** map intent, not just opacity: `label` = primary
  text (must be readable on first glance), `label-secondary` = supporting
  detail (skimmable), `label-tertiary` = decorative / inert (timestamps,
  metadata). If you reach for a fourth tier, the layout is wrong.
- **Three surfaces** give layered depth without shadows: `surface` (page),
  `surface-secondary` (cards), `surface-tertiary` (nested rows). Don't invent
  a fourth surface — find the existing tier that fits.
- **OKLCH for storage** because perceptual lightness lets `400` actually
  *feel* like `400` across hues, and lets the color editor produce
  predictable ramps.
- The live catalog lives at `/colors`. Edits made there persist locally and
  export as JSON / CSS.

## Motion rationale

Two spring families exist for a reason.

- **`SPRING_FAST`** is the professional default. Near-critically damped,
  minimal overshoot. Use it for state changes in real UI: panels opening,
  toggles flipping, popovers settling. The motion is *felt* but not *seen*.
- **`SPRING`** is the playful family. More overshoot, more character.
  Reserved for sketches whose subject *is* motion — when the bounce is
  the point.
- **When motion is wrong:** on initial page load (just paint), on idle
  decoration (no infinite loops without a reason), on every hover (subtle
  color shifts are enough).
- **Duration tokens** in `DURATION.*` are seconds, not arbitrary numbers.
  Reach for `instant` (0.1s) when in doubt; `slow` (0.5s) needs justification.
- The live curves and presets live at `/motion`.

## Anti-patterns

Explicit list of looks to avoid, with the half-line reason.

- **Material Design shadows** — too heavy, too uniform, wrong elevation
  language. Use the squircle drop-shadow presets (`shadow="sm"…"2xl"`)
  or `buildShadow({...})`.
- **Bootstrap-y 1px gray borders without intent** — if a separator can be
  removed and the layout still reads, remove it. Borders are noise unless
  they're carrying weight.
- **Gradient-on-everything** — gradients should appear once per screen at
  most, as a visual anchor (album-art blend, hero accent). Never on buttons,
  cards, or backgrounds by default.
- **Decorative emoji** — emoji are content, not decoration. If they're
  not meaningful, they're noise.
- **Generic centered hero sections** — the "huge title centered over a
  faded gradient" pattern is the universal AI-design smell. Avoid.
- **Neumorphism / heavy drop-shadow stacks** — the squircle elevation system
  already does soft, layered shadows correctly; piling more on top reads as
  amateur.
- **Skeuomorphic textures** (felt, paper, leather) — wrong era, wrong
  medium.
- **Animating into existence on scroll** for content that should just *be*
  there — InView is for reveals that earn the attention, not for "make the
  page feel alive."
- **Tooltips as primary affordances** — if a thing needs a tooltip to be
  usable, label it.

## When in doubt

Strip a layer. If it still reads, leave it stripped. The default is restraint.
