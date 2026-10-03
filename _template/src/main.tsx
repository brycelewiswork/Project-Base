import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import { MotionConfig } from "motion/react"
import { Toaster } from "@/components/ui/sonner"
import { DialRoot } from "@/components/dialkit"
import { Agentation } from "agentation"
import { PerfHud } from "@/components/ui/perf-hud"
import App from "./App"
import { initFluidSystem } from "@/lib/fluid"
import { initColorSystem } from "@/lib/colors"
import "./index.css"
import "@/components/dialkit/theme.css"

initFluidSystem()
initColorSystem()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* disableTransitionOnChange: the swap would otherwise fire every color/background
        transition at once and smear the page instead of snapping. */}
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {/* reducedMotion="user": every declarative <motion.*> drops transform and layout
          animation when the OS asks for reduced motion. It does not reach imperative
          animate() calls, opacity/color/background loops, CSS keyframes or timers —
          those components check useReducedMotion() themselves, and index.css carries
          the CSS half. */}
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <App />
          <Toaster position="top-right" />
          <DialRoot position="top-right" />
          {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
          {import.meta.env.DEV && <PerfHud />}
        </BrowserRouter>
      </MotionConfig>
    </ThemeProvider>
  </StrictMode>,
)
