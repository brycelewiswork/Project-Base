import { BlossomCarousel, BlossomPrev, BlossomNext, BlossomDots } from "@blossom-carousel/react"
import "@blossom-carousel/react/style.css"
import { DemoSection } from "@/components/DemoSection"
import type { DemoEntry } from "./types"

const SLIDES = Array.from({ length: 8 }, (_, i) => i + 1)

function BlossomDemo() {
  return (
    <DemoSection title="Blossom Carousel" lib="@blossom-carousel/react" docsUrl="https://www.blossom-carousel.com/">
      <p className="text-body text-label-secondary">
        Native scroll-snap first — touch, trackpad and keyboard scrolling are the browser's own —
        with mouse drag layered on top. Prev/next/dots live outside the track and link by{" "}
        <code>id</code>.
      </p>
      <BlossomCarousel
        id="demo-carousel"
        className="gap-gutter-xs"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {SLIDES.map((n) => (
          <div
            key={n}
            data-blossom-slide
            className="flex aspect-[4/3] w-64 shrink-0 snap-start items-center justify-center rounded-xl bg-surface-secondary text-title font-medium inset-ring-1 inset-ring-stroke-faint"
          >
            {n}
          </div>
        ))}
      </BlossomCarousel>
      <div className="flex items-center gap-inline-s">
        <BlossomPrev for="demo-carousel" />
        <BlossomDots for="demo-carousel" />
        <BlossomNext for="demo-carousel" />
      </div>
    </DemoSection>
  )
}

const entry: DemoEntry = {
  lib: "Blossom Carousel",
  role: "native-scroll carousel",
  docsUrl: "https://www.blossom-carousel.com/",
  Component: BlossomDemo,
}
export default entry
