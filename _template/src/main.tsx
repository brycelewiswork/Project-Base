import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import App from "./App"
import { initTypeSystem } from "@/lib/typography"
import { initColorSystem } from "@/lib/colors"
import "./index.css"

initTypeSystem()
initColorSystem()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
)
