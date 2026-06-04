import { motion, type Transition } from "motion/react"
import { useDialKit } from "dialkit"
import { DemoSection } from "@/components/DemoSection"
import { SQUIRCLE_RADIUS } from "@/components/squircle"
import type { DemoEntry } from "./types"

function DialkitDemo() {
  const v = useDialKit("Dialkit demo", {
    size: [64, 32, 160] as [number, number, number],
    rotate: { type: "spring", stiffness: 200, damping: 18 },
    color: { type: "color", default: "#7c3aed" },
    spinning: true,
  })

  return (
    <DemoSection title="Dialkit" lib="dialkit" docsUrl="https://joshpuckett.me/dialkit">
      <p className="text-body text-label-secondary">
        Floating control panel (bottom-right) wired to the swatch below. Auto-detects
        sliders, color pickers, spring editors, toggles. Pairs with our{" "}
        <code>SPRING.*</code> / <code>EASE.*</code> tokens — tune here, then bake the
        resulting values into <code>src/lib/motion.ts</code>.
      </p>
      <div className="flex items-center gap-6">
        <motion.div
          style={{
            width: v.size,
            height: v.size,
            background: v.color,
            borderRadius: SQUIRCLE_RADIUS.xl,
          }}
          animate={{ rotate: v.spinning ? 360 : 0 }}
          transition={(v.spinning ? { ...v.rotate, repeat: Infinity } : v.rotate) as Transition}
        />
        <div className="font-mono text-xs text-label-secondary">
          <div>size: {v.size}px</div>
          <div>color: {v.color}</div>
          <div>spinning: {String(v.spinning)}</div>
        </div>
      </div>
    </DemoSection>
  )
}

const entry: DemoEntry = {
  lib: "dialkit",
  role: "live tweaks",
  docsUrl: "https://joshpuckett.me/dialkit",
  Component: DialkitDemo,
}
export default entry
