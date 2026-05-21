import * as React from "react"
import { Badge } from "@/components/ui/badge"

type DemoSectionProps = {
  title: string
  lib: string
  version?: string
  children: React.ReactNode
}

export function DemoSection({ title, lib, version, children }: DemoSectionProps) {
  return (
    <section className="border-border/60 flex flex-col gap-4 border-b pb-10 last:border-b-0 last:pb-0">
      <header className="flex flex-wrap items-baseline gap-3">
        <h2 className="text-2xl font-medium tracking-tight">{title}</h2>
        <Badge variant="secondary" className="font-mono">
          {lib}
          {version ? `@${version}` : null}
        </Badge>
      </header>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}
