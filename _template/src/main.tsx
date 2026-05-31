import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { DialRoot } from "dialkit"
import { Agentation } from "agentation"
import App from "./App"
import { initTypeSystem } from "@/lib/typography"
import { initColorSystem } from "@/lib/colors"
import "./index.css"
import "dialkit/styles.css"

initTypeSystem()
initColorSystem()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" />
        <DialRoot position="top-right" />
        {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
