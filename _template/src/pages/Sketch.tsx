import { useEffect, useRef } from "react"
import gsap from "gsap"
import { Button } from "@/components/ui/button"

export function Sketch() {
  const boxRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(boxRefs.current, {
        y: 40,
        opacity: 0,
        scale: 0.9,
        stagger: 0.06,
        duration: 0.7,
        ease: "power3.out",
      })
    })
    return () => ctx.revert()
  }, [])

  const play = () => {
    gsap.to(boxRefs.current, {
      rotate: "+=360",
      duration: 1.2,
      stagger: 0.04,
      ease: "power2.inOut",
    })
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-16">
      <header className="flex items-end justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-medium tracking-tight">GSAP playground</h1>
          <p className="text-muted-foreground">A simple timeline + stagger to confirm GSAP is wired up.</p>
        </div>
        <Button onClick={play}>Replay</Button>
      </header>

      <div className="grid grid-cols-6 gap-3 sm:grid-cols-10">
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { boxRefs.current[i] = el }}
            className="aspect-square rounded-md bg-foreground/10"
          />
        ))}
      </div>
    </main>
  )
}
