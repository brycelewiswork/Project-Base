import * as React from "react"
import { useReducedMotion } from "motion/react"
import "slot-text/style.css"
import { chromatic } from "slot-text"
import { SlotText } from "slot-text/react"
import { DemoSection } from "@/components/DemoSection"
import { Button } from "@/components/ui/button"
import type { DemoEntry } from "./types"

function SlotTextDemo() {
  const reduced = useReducedMotion()
  const [copied, setCopied] = React.useState(false)
  const timer = React.useRef<number>(undefined)

  const copy = () => {
    setCopied(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1400)
  }
  React.useEffect(() => () => window.clearTimeout(timer.current), [])

  const label = copied ? "Copied" : "Copy"

  return (
    <DemoSection title="slot-text" lib="slot-text" docsUrl="https://github.com/search?q=slot-text&type=repositories">
      <p className="text-body text-label-secondary">
        Tiny slot-machine text roll for button labels — the classic Copy → Copied → Copy.
        Zero dependencies. It has no reduced-motion handling of its own, so this demo renders
        plain text when <code>useReducedMotion()</code> is true; do the same in a sketch.
      </p>
      <div>
        <Button size="sm" onClick={copy}>
          {reduced ? (
            label
          ) : (
            <SlotText
              text={label}
              options={{ direction: copied ? "up" : "down", color: copied ? chromatic() : undefined }}
            />
          )}
        </Button>
      </div>
    </DemoSection>
  )
}

const entry: DemoEntry = {
  lib: "slot-text",
  role: "text roll",
  Component: SlotTextDemo,
}
export default entry
