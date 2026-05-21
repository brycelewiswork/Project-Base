import * as React from "react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

import { squircleObserver, SQUIRCLE_RADIUS } from "@/components/squircle"

function useToastSquircles() {
  React.useEffect(() => {
    const cleanups = new Map<Element, () => void>()

    const attach = (el: Element) => {
      if (cleanups.has(el)) return
      const observer = squircleObserver(el as HTMLElement, {
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
          if (cleanups.has(node)) {
            cleanups.get(node)!()
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
  useToastSquircles()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
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
