import { Link, Route, Routes } from "react-router-dom"
import { Home } from "@/pages/Home"
import { Sketch } from "@/pages/Sketch"

export default function App() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <nav className="border-border/60 sticky top-0 z-10 flex items-center gap-6 border-b bg-background/70 px-6 py-3 backdrop-blur">
        <Link to="/" className="text-sm font-medium tracking-tight">
          ◆ sketch
        </Link>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/sketch" className="hover:text-foreground">GSAP</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sketch" element={<Sketch />} />
      </Routes>
    </div>
  )
}
