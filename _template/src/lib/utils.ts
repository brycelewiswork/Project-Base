import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// tailwind-merge only knows Tailwind's stock font sizes. Any other `text-*` it
// files under text *color* — so `cn("text-body text-label-secondary")` used to
// return just `text-label-secondary`, silently dropping the size, and a size
// merged after a color dropped the color instead. Register the template's own
// type utilities (index.css @layer utilities + the @theme tokens) as font sizes
// so they merge against each other and never against colors.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            // fluid scale (index.css @layer utilities)
            "display", "heading", "title", "body", "caption", "eyebrow",
            "h1", "h2", "h3", "h4", "h5", "h6",
            // fixed tokens (index.css @theme)
            "control", "control-sm", "control-xs", "micro",
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
