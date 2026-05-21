import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { toast } from "sonner"
import { useCounterStore } from "@/store/useCounterStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function Home() {
  const count = useCounterStore((s) => s.count)
  const inc = useCounterStore((s) => s.inc)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-100, 100], [10, -10]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-100, 100], [-10, 10]), { stiffness: 200, damping: 20 })

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-16">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col gap-3"
      >
        <Badge variant="secondary" className="w-fit">project-base</Badge>
        <h1 className="text-5xl font-medium tracking-tight">Start fast. Finish polished.</h1>
        <p className="max-w-xl text-muted-foreground">
          Vite + React + Tailwind v4 + shadcn/ui, with motion, GSAP, React Router, Zustand, and Sonner
          already wired up.
        </p>
      </motion.section>

      <section className="grid gap-6 sm:grid-cols-2">
        <motion.div
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect()
            x.set(e.clientX - r.left - r.width / 2)
            y.set(e.clientY - r.top - r.height / 2)
          }}
          onPointerLeave={() => { x.set(0); y.set(0) }}
          style={{ rotateX, rotateY, transformPerspective: 800 }}
          className="rounded-xl"
        >
          <Card className="bg-gradient-to-br from-muted/40 to-background">
            <CardHeader>
              <CardTitle>Tilt me</CardTitle>
              <CardDescription>Spring-damped 3D tilt via motion's useSpring + useTransform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video rounded-md bg-foreground/5" />
            </CardContent>
          </Card>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>State + toasts</CardTitle>
            <CardDescription>Zustand for state, Sonner for feedback.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-3">
            <motion.div
              key={count}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-medium tabular-nums"
            >
              {count}
            </motion.div>
            <div className="flex gap-2">
              <Button onClick={() => { inc(); toast.success("Incremented") }}>Increment</Button>
              <Button variant="outline" onClick={() => toast("Hello, sketcher")}>Toast</Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
