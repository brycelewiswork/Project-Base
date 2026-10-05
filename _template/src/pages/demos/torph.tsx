import * as React from "react"
import { TextMorph } from "torph/react"
import { DemoSection } from "@/components/DemoSection"
import { Button } from "@/components/ui/button"
import type { DemoEntry } from "./types"

const PHRASES = ["Sketch it", "Make it real", "Ship the prototype", "Tune it by feel"]

function TorphDemo() {
  const [i, setI] = React.useState(0)

  return (
    <DemoSection title="Torph" lib="torph" docsUrl="https://torph.lochie.me/">
      <p className="text-body text-label-secondary">
        Text morphing — shared characters glide to their new positions while the rest fade in
        and out, so a label change reads as one continuous move. Dependency-free; skips the
        animation under reduced-motion.
      </p>
      <TextMorph as="div" className="text-heading font-medium" respectReducedMotion>
        {PHRASES[i]}
      </TextMorph>
      <div>
        <Button size="sm" onClick={() => setI((n) => (n + 1) % PHRASES.length)}>Next phrase</Button>
      </div>
    </DemoSection>
  )
}

const entry: DemoEntry = {
  lib: "Torph",
  role: "text morphing",
  docsUrl: "https://torph.lochie.me/",
  Component: TorphDemo,
}
export default entry
