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
} from "@tabler/icons-react"
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

export type RouteIcon = React.ComponentType<{ size?: number; stroke?: number }>

export type RouteEntry = {
  path: string
  label: string
  icon: RouteIcon
  /** Omit for top-level nav; "components" places it under the Components dropdown. */
  group?: "components"
  Component: React.ComponentType
}

export const ROUTES: RouteEntry[] = [
  { path: "/",            label: "Home",    icon: IconHome,            Component: Home },
  { path: "/demos",       label: "Demos",   icon: IconSparkles,        Component: Demos },
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
]

export const TOP_LEVEL_ROUTES = ROUTES.filter((r) => !r.group)
export const COMPONENT_ROUTES = ROUTES.filter((r) => r.group === "components")
export const COMPONENTS_BASE_PATH = "/components"
