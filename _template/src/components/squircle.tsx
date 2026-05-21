import * as React from "react"
import { Squircle as RawSquircle, squircleObserver } from "corner-smoothing"

// `Options` isn't exported from corner-smoothing's barrel, so we mirror it.
export type SquircleOptions = {
  cornerRadius: number
  topLeftCornerRadius?: number
  topRightCornerRadius?: number
  bottomRightCornerRadius?: number
  bottomLeftCornerRadius?: number
  cornerSmoothing?: number
  preserveSmoothing?: boolean
  borderWidth?: number
}

const DEFAULT_SMOOTHING = 0.6

// Layered drop-shadows by elevation tier. Applied via `filter:` on the
// wrapper so the shadow follows the squircled child's silhouette.
//
// Why a wrapper? Chrome doesn't paint `filter: drop-shadow()` outside the
// `clip-path: path()` region on the same element — the shadow vanishes. The
// fix is to put the clip on the child and the filter on the parent. The
// parent then renders a drop-shadow from the clipped child's alpha mask,
// which follows the squircle outline exactly.
export const SQUIRCLE_SHADOW = {
  sm: "drop-shadow(0 1px 1px rgba(0, 0, 0, 0.06)) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08))",
  md: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.08)) drop-shadow(0 8px 24px rgba(0, 0, 0, 0.14))",
  lg: "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.10)) drop-shadow(0 16px 32px rgba(0, 0, 0, 0.18))",
} as const

export type SquircleShadowKey = keyof typeof SQUIRCLE_SHADOW

export const SQUIRCLE_RADIUS = {
  sm: 6,
  md: 8,
  lg: 10,
  xl: 14,
  "2xl": 18,
  "3xl": 22,
  "4xl": 26,
} as const

export type SquircleRadiusKey = keyof typeof SQUIRCLE_RADIUS

type SquircleShadowProp = boolean | SquircleShadowKey | string

type SquircleProps = SquircleOptions & {
  as?: React.ElementType
  children?: React.ReactNode
  className?: string
  /**
   * Elevation. `true` uses `md`. Pass a key for a preset, or any custom
   * `filter` value (e.g. `"drop-shadow(0 4px 8px ...)"`).
   *
   * When set, the wrapper component switches from a single clip-path'd
   * element to a parent (filter) + child (clip-path) pair, since the two
   * don't visibly coexist on the same element.
   */
  shadow?: SquircleShadowProp
  /** Class applied to the outer shadow wrapper (only used when `shadow`). */
  shadowClassName?: string
  // Allow any additional HTML/data attributes through.
  [key: string]: unknown
}

function resolveShadow(shadow: SquircleShadowProp | undefined): string | undefined {
  if (!shadow) return undefined
  if (shadow === true) return SQUIRCLE_SHADOW.md
  if (typeof shadow === "string" && shadow in SQUIRCLE_SHADOW) {
    return SQUIRCLE_SHADOW[shadow as SquircleShadowKey]
  }
  return shadow as string
}

export const Squircle = React.forwardRef<HTMLElement, SquircleProps>(
  function Squircle(props, ref) {
    const {
      cornerSmoothing = DEFAULT_SMOOTHING,
      shadow,
      shadowClassName,
      ...rest
    } = props
    const filterValue = resolveShadow(shadow as SquircleShadowProp | undefined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Cmp = RawSquircle as any
    const inner = (
      <Cmp ref={ref} cornerSmoothing={cornerSmoothing} {...rest} />
    )
    if (!filterValue) return inner
    // `filter` doesn't apply to `display: contents` elements, so the wrapper
    // has to take up box. Default to `inline-block` so it doesn't force
    // block layout around inline use; pass `shadowClassName` (e.g. "block w-full")
    // to override for block-level surfaces like Card.
    return (
      <div
        data-squircle-shadow=""
        className={shadowClassName as string | undefined}
        style={{ filter: filterValue, display: "inline-block" }}
      >
        {inner}
      </div>
    )
  },
)

export function useSquircle<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  options: SquircleOptions,
) {
  const optsRef = React.useRef(options)
  optsRef.current = options

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = squircleObserver(el, {
      cornerSmoothing: DEFAULT_SMOOTHING,
      ...optsRef.current,
    })
    return () => observer.disconnect()
  }, [
    ref,
    options.cornerRadius,
    options.cornerSmoothing,
    options.preserveSmoothing,
    options.borderWidth,
    options.topLeftCornerRadius,
    options.topRightCornerRadius,
    options.bottomLeftCornerRadius,
    options.bottomRightCornerRadius,
  ])
}

type ButtonSize =
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg"

export function radiusForButtonSize(size: ButtonSize | null | undefined): number {
  switch (size) {
    case "xs":
    case "sm":
    case "icon-xs":
    case "icon-sm":
      return SQUIRCLE_RADIUS.md
    default:
      return SQUIRCLE_RADIUS.lg
  }
}

/**
 * Standalone wrapper that adds an elevation shadow around any squircled
 * (or non-squircled) child. Use when you can't pass `shadow` directly to
 * `<Squircle>` — e.g. when the child is rendered by a third-party
 * component like base-ui's render prop.
 *
 * The wrapper is `inline-block` by default so it doesn't break inline
 * layouts (Button, Badge). Pass `block` via `className` for full-width
 * surfaces.
 */
export function SquircleShadow({
  shadow,
  className,
  style,
  children,
  as: As = "div",
  ...rest
}: {
  shadow: boolean | SquircleShadowKey | string
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
  as?: React.ElementType
} & Record<string, unknown>) {
  const filterValue = resolveShadow(shadow)
  if (!filterValue) return <>{children}</>
  return (
    <As
      data-squircle-shadow=""
      className={className}
      style={{ filter: filterValue, display: "inline-block", ...style }}
      {...rest}
    >
      {children}
    </As>
  )
}

export { squircleObserver }
