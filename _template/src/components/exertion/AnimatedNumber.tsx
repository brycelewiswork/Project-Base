import { useRef, useState, useEffect } from "react"

// Apple-style "blur ticker": each digit blurs and slides as it changes, with the
// old glyph exiting in the direction of travel and the new one entering behind it.
// Keyframes live in index.css (digit-up-in / digit-up-out / digit-down-* / digit-fade-in).

const ENTER_UP = "digit-up-in 600ms linear both"
const EXIT_UP = "digit-up-out 600ms linear both"
const ENTER_DOWN = "digit-down-in 600ms linear both"
const EXIT_DOWN = "digit-down-out 600ms linear both"
const FADE_IN = "digit-fade-in 600ms cubic-bezier(0, 0, 0.2, 1) both"
const FADE_OUT = "digit-up-out 600ms linear both"

// Delay per digit position to the right of the leftmost change (ms).
const STAGGER_MS = 20

function isDigit(char: string): boolean {
  return char >= "0" && char <= "9"
}

type ExitSlot = { char: string; animKey: number }

interface AnimatedNumberProps {
  /** Current numeric value. */
  value: number
  /** Format function — converts the number to its display string. */
  format?: (value: number) => string
  /** Font size, weight, color, tracking go here. */
  className?: string
}

export function AnimatedNumber({ value, format = String, className }: AnimatedNumberProps) {
  const formatted = format(value)
  const prevFormattedRef = useRef<string>(formatted)
  const prevValueRef = useRef<number>(value)
  const changeCounterRef = useRef<number>(0)
  const animKeyCounterRef = useRef<number>(0)
  const leftmostChangedRef = useRef<number>(Infinity)

  const [direction, setDirection] = useState<"up" | "down" | "same">("same")
  const [exitSlots, setExitSlots] = useState<Map<number, ExitSlot>>(new Map())

  useEffect(() => {
    if (value === prevValueRef.current) return

    setDirection(value > prevValueRef.current ? "up" : "down")
    changeCounterRef.current += 1

    const prevFormatted = prevFormattedRef.current
    const newFormatted = format(value)
    const maxLen = Math.max(prevFormatted.length, newFormatted.length)

    // Only the leftmost changed position (and everything to its right) animates.
    let leftmostChanged = maxLen
    for (let i = 0; i < maxLen; i++) {
      if ((prevFormatted[i] ?? "") !== (newFormatted[i] ?? "")) {
        leftmostChanged = i
        break
      }
    }
    leftmostChangedRef.current = leftmostChanged

    setExitSlots((prev) => {
      const next = new Map(prev)
      for (let i = leftmostChanged; i < maxLen; i++) {
        const prevChar = prevFormatted[i]
        const newChar = newFormatted[i]
        if (prevChar !== undefined && prevChar !== newChar) {
          next.set(i, { char: prevChar, animKey: ++animKeyCounterRef.current })
        }
      }
      return next
    })

    prevValueRef.current = value
    prevFormattedRef.current = newFormatted
  }, [value, format])

  const changeKey = changeCounterRef.current

  return (
    <span className={`tabular-nums${className ? ` ${className}` : ""}`}>
      {Array.from(formatted).map((char, index) => {
        const shouldAnimate = index >= leftmostChangedRef.current
        const exitSlot = exitSlots.get(index)
        const enterAnim = shouldAnimate
          ? isDigit(char)
            ? direction === "up"
              ? ENTER_UP
              : direction === "down"
                ? ENTER_DOWN
                : FADE_IN
            : FADE_IN
          : undefined
        const exitAnim = exitSlot
          ? isDigit(exitSlot.char)
            ? direction === "up"
              ? EXIT_UP
              : direction === "down"
                ? EXIT_DOWN
                : FADE_OUT
            : FADE_OUT
          : undefined

        const staggerDelay = shouldAnimate
          ? `${(index - leftmostChangedRef.current) * STAGGER_MS}ms`
          : undefined

        return (
          <span
            key={index}
            style={{ position: "relative", display: "inline-block", verticalAlign: "bottom" }}
          >
            {/* Entering glyph — remounts on each change to restart its animation. */}
            <span
              key={`enter-${index}-${changeKey}`}
              style={{ display: "block", animation: enterAnim, animationDelay: staggerDelay }}
            >
              {char}
            </span>

            {/* Exiting glyph — overlaid during the transition, removed on animationend. */}
            {exitSlot && (
              <span
                key={exitSlot.animKey}
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  display: "block",
                  animation: exitAnim,
                  animationDelay: staggerDelay,
                  pointerEvents: "none",
                }}
                onAnimationEnd={() => {
                  setExitSlots((prev) => {
                    if (prev.get(index)?.animKey !== exitSlot.animKey) return prev
                    const next = new Map(prev)
                    next.delete(index)
                    return next
                  })
                }}
              >
                {exitSlot.char}
              </span>
            )}
          </span>
        )
      })}
    </span>
  )
}
