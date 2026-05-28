import { motion } from "motion/react"
import { DURATION, EASE } from "@/lib/motion"

export function Home() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE.apple }}
        className="text-center max-w-lg"
      >
        <h1 className="text-h3 text-label">
          Modern project template
        </h1>
        <p className="text-body text-label-secondary mt-3">
          A suite of tools and primitives to make launching into high fidelity work easier
        </p>
      </motion.div>
    </main>
  )
}
