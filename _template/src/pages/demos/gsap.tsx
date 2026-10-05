import { useEffect, useRef } from "react"
import gsap from "gsap"
import { DemoSection } from "@/components/DemoSection"
import { Button } from "@/components/ui/button"
import { GSAP_EASE } from "@/lib/motion"
import type { DemoEntry } from "./types"

function GsapDemo() {
  const boxes = useRef<Array<HTMLDivElement | null>>([])
  const mm = useRef<gsap.MatchMedia | null>(null)
  // GSAP reads neither <MotionConfig reducedMotion> nor the CSS media query, so every
  // GSAP animation needs its own check. gsap.matchMedia() is the canonical one: it
  // picks a branch per preference and reverts cleanly. Revert the previous context
  // before each replay so listeners don't pile up.
  const play = () => {
    mm.current?.revert()
    mm.current = gsap.matchMedia()
    mm.current.add(
      {
        full: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        if (ctx.conditions?.reduced) {
          // Opacity only — no scale, no overshoot.
          gsap.fromTo(boxes.current, { opacity: 0.2 }, { opacity: 1, duration: 0.2 })
          return
        }
        gsap.fromTo(
          boxes.current,
          { scale: 0.6, opacity: 0.2 },
          { scale: 1, opacity: 1, duration: 0.6, stagger: 0.05, ease: GSAP_EASE.bounce },
        )
      },
    )
  }
  useEffect(() => {
    play()
    return () => mm.current?.revert()
  }, [])
  return (
    <DemoSection title="GSAP" lib="gsap" docsUrl="https://gsap.com/docs/v3/">
      <p className="text-body text-label-secondary">
        Timeline + stagger for high-fidelity orchestration.
      </p>
      <div className="flex flex-wrap items-end gap-inline-s">
        <div className="flex flex-wrap gap-inline-2xs">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              ref={(el) => { boxes.current[i] = el }}
              className="size-8 rounded-md bg-label/30"
            />
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={play}>Replay</Button>
      </div>
    </DemoSection>
  )
}

const entry: DemoEntry = {
  lib: "GSAP",
  role: "timelines",
  docsUrl: "https://gsap.com/docs/v3/",
  Component: GsapDemo,
}
export default entry
