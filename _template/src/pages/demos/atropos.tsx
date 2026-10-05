import Atropos from "atropos/react"
import "atropos/atropos.css"
import { DemoSection } from "@/components/DemoSection"
import type { DemoEntry } from "./types"

function AtroposDemo() {
  return (
    <DemoSection title="Atropos" lib="atropos" docsUrl="https://atroposjs.com/">
      <p className="text-body text-label-secondary">
        Touch-friendly 3D parallax tilt. Children with <code>data-atropos-offset</code> sit at
        different depths, so layers shift against each other as the pointer moves. It tracks
        the pointer, not scroll — a still pointer means a still card.
      </p>
      <Atropos className="mx-auto w-full max-w-sm" activeOffset={30} shadow={false} highlight>
        <div className="aspect-[4/3] rounded-xl bg-surface-secondary inset-ring-1 inset-ring-stroke-faint">
          <div
            data-atropos-offset="-4"
            className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30"
          />
          <div data-atropos-offset="6" className="absolute inset-0 flex items-center justify-center text-display font-medium">
            Tilt
          </div>
          <div data-atropos-offset="10" className="absolute bottom-4 left-4 text-caption text-label-secondary">
            data-atropos-offset
          </div>
        </div>
      </Atropos>
    </DemoSection>
  )
}

const entry: DemoEntry = {
  lib: "Atropos",
  role: "3D tilt",
  docsUrl: "https://atroposjs.com/",
  Component: AtroposDemo,
}
export default entry
