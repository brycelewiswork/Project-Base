import * as React from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { IconCircleCheck, IconInfoCircle, IconAlertTriangle, IconAlertOctagon, IconLoader2 } from '@tabler/icons-react'

import {
  squircleObserver,
  SQUIRCLE_RADIUS,
  SQUIRCLE_SHADOW,
} from "@/components/squircle"

// Sonner renders <li data-sonner-toast> elements into the <ol data-sonner-toaster>
// portal. We can't add a wrapper around each toast without breaking Sonner's
// internals (positioning, swipe gestures, stack offsets), so we apply the
// parent/child shadow pattern at the toaster level:
//
//   - filter: drop-shadow(...) goes on the toaster (parent, no clip)
//   - clip-path squircle goes on each toast (child)
//
// The toaster's drop-shadow generates from the alpha mask of its visible
// children — i.e. the squircled toasts — so the shadow follows the squircle
// outline. Sonner's own box-shadow is removed since it would just be clipped.
function useSquircledToasts() {
  React.useEffect(() => {
    const cleanups = new Map<Element, () => void>()

    const ensureToasterFilter = () => {
      const toaster = document.querySelector(
        "[data-sonner-toaster]",
      ) as HTMLElement | null
      if (!toaster) return
      if (!toaster.style.filter.includes("drop-shadow")) {
        toaster.style.setProperty("filter", SQUIRCLE_SHADOW.lg, "important")
        // Filter creates a stacking context; explicit overflow:visible keeps
        // the shadow from being clipped by the toaster's own box.
        toaster.style.setProperty("overflow", "visible", "important")
      }
    }

    const attach = (el: Element) => {
      if (cleanups.has(el)) return
      const htmlEl = el as HTMLElement
      // Sonner sets box-shadow on each toast; clip-path would clip it. Strip
      // it — elevation comes from the toaster's drop-shadow above.
      htmlEl.style.setProperty("box-shadow", "none", "important")
      ensureToasterFilter()
      const observer = squircleObserver(htmlEl, {
        cornerRadius: SQUIRCLE_RADIUS.lg,
      })
      cleanups.set(el, () => observer.disconnect())
    }

    const scan = (root: ParentNode) => {
      root.querySelectorAll("[data-sonner-toast]").forEach(attach)
    }

    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          if (node.matches("[data-sonner-toast]")) attach(node)
          scan(node)
        })
        m.removedNodes.forEach((node) => {
          if (!(node instanceof Element)) return
          const cleanup = cleanups.get(node)
          if (cleanup) {
            cleanup()
            cleanups.delete(node)
          }
        })
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
    scan(document.body)

    return () => {
      observer.disconnect()
      cleanups.forEach((fn) => fn())
      cleanups.clear()
    }
  }, [])
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  useSquircledToasts()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <IconCircleCheck className="size-4" />
        ),
        info: (
          <IconInfoCircle className="size-4" />
        ),
        warning: (
          <IconAlertTriangle className="size-4" />
        ),
        error: (
          <IconAlertOctagon className="size-4" />
        ),
        loading: (
          <IconLoader2 className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--surface-secondary)",
          "--normal-text": "var(--label)",
          "--normal-border": "var(--stroke-faint)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
