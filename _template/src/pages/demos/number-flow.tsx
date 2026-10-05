import * as React from "react"
import NumberFlow from "@number-flow/react"
import { DemoSection } from "@/components/DemoSection"
import { Button } from "@/components/ui/button"
import type { DemoEntry } from "./types"

function NumberFlowDemo() {
  const [value, setValue] = React.useState(1280)

  return (
    <DemoSection title="NumberFlow" lib="@number-flow/react" docsUrl="https://number-flow.barvian.me/">
      <p className="text-body text-label-secondary">
        Animated number transitions — digits roll individually, widths ease, and formatting
        (currency, percent, compact) comes from <code>Intl.NumberFormat</code>. Honours
        reduced-motion on its own.
      </p>
      <div className="flex flex-wrap items-baseline gap-x-inline-l gap-y-stack-xs">
        <NumberFlow
          value={value}
          format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }}
          className="text-display font-medium tabular-nums"
        />
        <NumberFlow
          value={value / 10000}
          format={{ style: "percent", maximumFractionDigits: 1 }}
          className="text-title text-label-secondary tabular-nums"
        />
      </div>
      <div className="flex flex-wrap gap-gutter-2xs">
        <Button size="sm" onClick={() => setValue((v) => v + 100)}>+100</Button>
        <Button size="sm" variant="outline" onClick={() => setValue((v) => Math.max(0, v - 100))}>−100</Button>
        <Button size="sm" variant="outline" onClick={() => setValue(Math.round(Math.random() * 9_999))}>Random</Button>
      </div>
    </DemoSection>
  )
}

const entry: DemoEntry = {
  lib: "NumberFlow",
  role: "animated numbers",
  docsUrl: "https://number-flow.barvian.me/",
  Component: NumberFlowDemo,
}
export default entry
