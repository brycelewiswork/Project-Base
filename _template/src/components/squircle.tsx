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

// The underlying component requires children + div attrs. Loosen both so
// we can wrap shadcn components that may or may not have children.
type SquircleProps = SquircleOptions & {
  as?: React.ElementType
  children?: React.ReactNode
  className?: string
} & Record<string, unknown>

export const Squircle = React.forwardRef<HTMLElement, SquircleProps>(
  function Squircle({ cornerSmoothing = DEFAULT_SMOOTHING, ...props }, ref) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Cmp = RawSquircle as any
    return <Cmp ref={ref} cornerSmoothing={cornerSmoothing} {...props} />
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

export { squircleObserver }
