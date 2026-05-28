import { motion } from "motion/react"
import { DURATION, EASE } from "@/lib/motion"
import { LetterCloud } from "@/components/letter-cloud"

export function Home() {
  return (
    <main className="relative min-h-svh overflow-hidden">
      <LetterCloud
        text="PROJECT BASE"
        className="absolute inset-0"
      />
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE.apple, delay: 0.2 }}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 mt-20 max-w-md px-6 text-center text-body text-label-secondary"
      >
        A suite of tools and primitives to make launching into high fidelity work easier
      </motion.p>
    </main>
  )
}
