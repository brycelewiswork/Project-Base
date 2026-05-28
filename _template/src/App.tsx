import { useState } from "react"
import { Link, Route, Routes, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { Home } from "@/pages/Home"
import { Motion } from "@/pages/Motion"
import { Demos } from "@/pages/Demos"
import { Typography } from "@/pages/Typography"
import { Colors } from "@/pages/Colors"
import { Spacing } from "@/pages/Spacing"
import { Breakpoints } from "@/pages/Breakpoints"
import { Icons } from "@/pages/Icons"
import { SliderPage } from "@/pages/components/SliderPage"
import { ButtonPage } from "@/pages/components/ButtonPage"
import { BadgePage } from "@/pages/components/BadgePage"
import { CardPage } from "@/pages/components/CardPage"
import { AccordionPage } from "@/pages/components/AccordionPage"
import { ShadersPage } from "@/pages/components/ShadersPage"
import { useTheme } from "next-themes"
import { SPRING_FAST } from "@/lib/motion"
import { Squircle, SQUIRCLE_RADIUS } from "@/components/squircle"
import {
  IconHome,
  IconBounceRight,
  IconComponents,
  IconTypography,
  IconPalette,
  IconSpacingVertical,
  IconLayoutGrid,
  IconIcons,
  IconChevronRight,
  IconAdjustmentsHorizontal,
  IconClick,
  IconSparkles,
  IconColorSwatch,
  IconTag,
  IconLayoutCards,
  IconBoxMultiple,
  IconSun,
  IconMoon,
  IconDeviceLaptop,
} from "@tabler/icons-react"

type NavItem = { to: string; label: string; icon: React.ComponentType<{ size?: number; stroke?: number }> }
type NavGroup = { label: string; icon: React.ComponentType<{ size?: number; stroke?: number }>; children: NavItem[] }

const PAGES: NavItem[] = [
  { to: "/", label: "Home", icon: IconHome },
  { to: "/demos", label: "Demos", icon: IconSparkles },
  { to: "/colors", label: "Color", icon: IconPalette },
  { to: "/typography", label: "Type", icon: IconTypography },
  { to: "/motion", label: "Motion", icon: IconBounceRight },
  { to: "/spacing", label: "Spacing", icon: IconSpacingVertical },
  { to: "/breakpoints", label: "Layout", icon: IconLayoutGrid },
  { to: "/icons", label: "Icons", icon: IconIcons },
]

const COMPONENTS: NavGroup = {
  label: "Components",
  icon: IconComponents,
  children: [
    { to: "/components/badge", label: "Badge", icon: IconTag },
    { to: "/components/button", label: "Button", icon: IconClick },
    { to: "/components/accordion", label: "Accordion", icon: IconBoxMultiple },
    { to: "/components/card", label: "Card", icon: IconLayoutCards },
    { to: "/components/slider", label: "Slider", icon: IconAdjustmentsHorizontal },
    { to: "/components/shaders", label: "Shaders", icon: IconColorSwatch },
  ],
}

function NavLink({ to, label, icon: Icon, indent }: NavItem & { indent?: boolean }) {
  const location = useLocation()
  const active = location.pathname === to
  return (
    <Link
      to={to}
      onClick={() => window.scrollTo(0, 0)}
      className={`flex items-center gap-2.5 text-sm rounded-xl transition-colors ${
        indent ? "pl-9 pr-4 py-2" : "px-4 py-2.5"
      } ${
        active
          ? "text-label font-medium bg-fill-primary"
          : "text-label-secondary hover:text-label hover:bg-fill-quaternary"
      }`}
    >
      <Icon size={indent ? 14 : 16} stroke={1.75} />
      {label}
    </Link>
  )
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useState(() => { setMounted(true) })
  if (!mounted) return null

  const modes = [
    { val: "light" as const, Icon: IconSun },
    { val: "dark" as const, Icon: IconMoon },
    { val: "system" as const, Icon: IconDeviceLaptop },
  ]

  return (
    <div className="flex items-center gap-0.5 mx-2 mt-1 rounded-lg bg-fill-quaternary p-0.5">
      {modes.map(({ val, Icon }) => (
        <button
          key={val}
          onClick={() => {
            document.documentElement.style.transition = "opacity 0.15s ease"
            document.documentElement.style.opacity = "0"
            setTimeout(() => {
              setTheme(val)
              requestAnimationFrame(() => {
                document.documentElement.style.opacity = "1"
                setTimeout(() => {
                  document.documentElement.style.transition = ""
                  document.documentElement.style.opacity = ""
                }, 150)
              })
            }, 150)
          }}
          aria-label={val}
          className={`flex-1 flex items-center justify-center rounded-md py-1.5 transition-colors cursor-pointer ${
            theme === val
              ? "bg-surface-secondary text-label shadow-xs"
              : "text-label-secondary hover:text-label"
          }`}
        >
          <Icon size={13} stroke={2} />
        </button>
      ))}
    </div>
  )
}

function SideNav() {
  const location = useLocation()
  const componentsActive = location.pathname.startsWith("/components")
  const [open, setOpen] = useState(false)
  const [componentsOpen, setComponentsOpen] = useState(componentsActive)

  return (
    <div
      className="fixed right-4 top-1/2 -translate-y-1/2 z-nav"
      onMouseEnter={() => { setOpen(true); if (componentsActive) setComponentsOpen(true) }}
      onMouseLeave={() => { setOpen(false); setComponentsOpen(componentsActive) }}
    >
      <motion.div
        layout
        transition={{ type: "spring", ...SPRING_FAST.snappy }}
        className="cursor-pointer overflow-hidden backdrop-blur-lg"
        animate={{
          backgroundColor: open ? "var(--surface-secondary)" : "oklch(0.710 0 0 / 40%)",
          borderRadius: open ? 18 : 999,
          width: open ? "auto" : 32,
          height: open ? "auto" : 32,
          boxShadow: open
            ? "0 8px 16px oklch(0 0 0 / 8%), 0 4px 8px oklch(0 0 0 / 4%), 0 0 0 1px var(--stroke-faint)"
            : "0 0 0 0 transparent, 0 0 0 0 transparent, 0 0 0 0 transparent",
        }}
      >
        <AnimatePresence>
          {open && (
            <Squircle
              as={motion.nav}
              cornerRadius={SQUIRCLE_RADIUS["2xl"]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, delay: 0.05 }}
              className="flex flex-col py-2 px-2 min-w-[160px] rounded-2xl"
            >
              {PAGES.map((item) => (
                <NavLink key={item.to} {...item} />
              ))}

              {/* Components dropdown */}
              <button
                onClick={() => setComponentsOpen((v) => !v)}
                className={`flex items-center gap-2.5 px-4 py-2.5 text-sm rounded-xl transition-colors w-full text-left cursor-pointer ${
                  componentsActive && !componentsOpen
                    ? "text-label font-medium bg-fill-primary"
                    : "text-label-secondary hover:text-label hover:bg-fill-quaternary"
                }`}
              >
                <COMPONENTS.icon size={16} stroke={1.75} />
                <span className="flex-1">{COMPONENTS.label}</span>
                <motion.span
                  animate={{ rotate: componentsOpen ? 90 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <IconChevronRight size={12} stroke={2} />
                </motion.span>
              </button>

              <AnimatePresence>
                {componentsOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", ...SPRING_FAST.snappy }}
                    className="overflow-hidden"
                  >
                    {COMPONENTS.children.map((item) => (
                      <NavLink key={item.to} {...item} indent />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-4" />
              <ThemeToggle />
            </Squircle>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-svh bg-surface text-label">
      <SideNav />

      <main className="relative z-base">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/motion" element={<Motion />} />
        <Route path="/demos" element={<Demos />} />
        <Route path="/typography" element={<Typography />} />
        <Route path="/colors" element={<Colors />} />
        <Route path="/spacing" element={<Spacing />} />
        <Route path="/breakpoints" element={<Breakpoints />} />
        <Route path="/icons" element={<Icons />} />
        <Route path="/components/badge" element={<BadgePage />} />
        <Route path="/components/button" element={<ButtonPage />} />
        <Route path="/components/card" element={<CardPage />} />
        <Route path="/components/slider" element={<SliderPage />} />
        <Route path="/components/accordion" element={<AccordionPage />} />
        <Route path="/components/shaders" element={<ShadersPage />} />
        <Route path="*" element={<div className="mx-auto max-w-4xl px-6 py-16 text-center"><h1 className="text-h3 text-label">404</h1><p className="text-label-secondary mt-2">Page not found</p></div>} />
      </Routes>
      </main>
    </div>
  )
}
