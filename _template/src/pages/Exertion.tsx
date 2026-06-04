import { Squircle } from "@/components/squircle"
import { ExertionSheet } from "@/components/exertion/ExertionSheet"

// The stage (bg-surface) flexes to fill the whole browser window and is
// light/dark-aware. The phone is a fixed-size squircle centered on it; the
// prototype inside is locked to dark regardless of theme.
export function Exertion() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-surface p-8">
      <Squircle
        as="div"
        cornerRadius={56}
        shadow="2xl"
        className="relative h-[844px] w-[390px] shrink-0 overflow-hidden bg-neutral-950"
      >
        <ExertionSheet />
      </Squircle>
    </div>
  )
}
