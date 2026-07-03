import {
  IconHome,
  IconBounceRight,
  IconTypography,
  IconPalette,
  IconSpacingVertical,
  IconLayoutGrid,
  IconIcons,
  IconAdjustmentsHorizontal,
  IconClick,
  IconSparkles,
  IconColorSwatch,
  IconTag,
  IconLayoutCards,
  IconBoxMultiple,
  IconDroplet,
  IconAdjustments,
} from "@tabler/icons-react"
import { lazy } from "react"
import { Home } from "@/pages/Home"

// Home stays eager so the landing route paints instantly. Every other page is
// code-split into its own chunk and only fetched when its route is visited —
// this keeps the heaviest deps (three.js in Shaders, recharts/visx in Demos and
// Motion, the motion-primitives + liquid-glass gallery) out of the initial bundle.
const lazyPage = <T extends Record<string, React.ComponentType>>(
  loader: () => Promise<T>,
  name: keyof T,
) => lazy(() => loader().then((m) => ({ default: m[name] })))

const Demos = lazyPage(() => import("@/pages/Demos"), "Demos")
const DialkitGallery = lazyPage(() => import("@/pages/DialkitGallery"), "DialkitGallery")
const Colors = lazyPage(() => import("@/pages/Colors"), "Colors")
const Typography = lazyPage(() => import("@/pages/Typography"), "Typography")
const Motion = lazyPage(() => import("@/pages/Motion"), "Motion")
const Spacing = lazyPage(() => import("@/pages/Spacing"), "Spacing")
const Breakpoints = lazyPage(() => import("@/pages/Breakpoints"), "Breakpoints")
const Icons = lazyPage(() => import("@/pages/Icons"), "Icons")
const SliderPage = lazyPage(() => import("@/pages/components/SliderPage"), "SliderPage")
const ButtonPage = lazyPage(() => import("@/pages/components/ButtonPage"), "ButtonPage")
const BadgePage = lazyPage(() => import("@/pages/components/BadgePage"), "BadgePage")
const CardPage = lazyPage(() => import("@/pages/components/CardPage"), "CardPage")
const AccordionPage = lazyPage(() => import("@/pages/components/AccordionPage"), "AccordionPage")
const ShadersPage = lazyPage(() => import("@/pages/components/ShadersPage"), "ShadersPage")
const LiquidGlassPage = lazyPage(() => import("@/pages/components/LiquidGlassPage"), "LiquidGlassPage")

export type RouteIcon = React.ComponentType<{ size?: number; stroke?: number }>

export type RouteEntry = {
  path: string
  label: string
  icon: RouteIcon
  /** Omit for top-level nav; "components" places it under the Components dropdown. */
  group?: "components"
  Component: React.ComponentType | React.LazyExoticComponent<React.ComponentType>
}

export const ROUTES: RouteEntry[] = [
  { path: "/",            label: "Home",    icon: IconHome,            Component: Home },
  { path: "/demos",       label: "Demos",   icon: IconSparkles,        Component: Demos },
  { path: "/dialkit",     label: "Dialkit", icon: IconAdjustments,     Component: DialkitGallery },
  { path: "/colors",      label: "Color",   icon: IconPalette,         Component: Colors },
  { path: "/typography",  label: "Type",    icon: IconTypography,      Component: Typography },
  { path: "/motion",      label: "Motion",  icon: IconBounceRight,     Component: Motion },
  { path: "/spacing",     label: "Spacing", icon: IconSpacingVertical, Component: Spacing },
  { path: "/breakpoints", label: "Layout",  icon: IconLayoutGrid,      Component: Breakpoints },
  { path: "/icons",       label: "Icons",   icon: IconIcons,           Component: Icons },

  { path: "/components/badge",     label: "Badge",     icon: IconTag,                     group: "components", Component: BadgePage },
  { path: "/components/button",    label: "Button",    icon: IconClick,                   group: "components", Component: ButtonPage },
  { path: "/components/accordion", label: "Accordion", icon: IconBoxMultiple,             group: "components", Component: AccordionPage },
  { path: "/components/card",      label: "Card",      icon: IconLayoutCards,             group: "components", Component: CardPage },
  { path: "/components/slider",    label: "Slider",    icon: IconAdjustmentsHorizontal,   group: "components", Component: SliderPage },
  { path: "/components/shaders",   label: "Shaders",   icon: IconColorSwatch,             group: "components", Component: ShadersPage },
  { path: "/components/liquid-glass", label: "Liquid Glass", icon: IconDroplet,           group: "components", Component: LiquidGlassPage },
]

export const TOP_LEVEL_ROUTES = ROUTES.filter((r) => !r.group)
export const COMPONENT_ROUTES = ROUTES.filter((r) => r.group === "components")
export const COMPONENTS_BASE_PATH = "/components"
