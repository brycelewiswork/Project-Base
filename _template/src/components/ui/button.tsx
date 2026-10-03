import type * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import {
  Squircle,
  SquircleShadow,
  radiusForButtonSize,
  type SquircleShadowKey,
} from "@/components/squircle"

const buttonVariants = cva(
  // NOTE: Outlines and the focus ring are `inset-ring-*`, never `border-*` or an
  // outset `ring-*`: corner-smoothing sets clip-path on this element, which removes
  // everything painted outside it — an outset focus ring disappears entirely. An inset
  // ring renders inside the box and follows the squircle. See _template/CLAUDE.md.
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg inset-ring-1 inset-ring-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:inset-ring-2 focus-visible:inset-ring-ring active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:inset-ring-destructive dark:aria-invalid:inset-ring-destructive/50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        outline:
          "inset-ring-stroke-faint bg-surface hover:bg-surface-tertiary hover:text-label aria-expanded:bg-surface-tertiary aria-expanded:text-label dark:inset-ring-stroke-strong dark:bg-stroke-strong/30 dark:hover:bg-stroke-strong/50",
        secondary:
          "bg-surface-tertiary text-label hover:bg-surface-tertiary/80 aria-expanded:bg-surface-tertiary aria-expanded:text-label",
        ghost:
          "hover:bg-surface-tertiary hover:text-label aria-expanded:bg-surface-tertiary aria-expanded:text-label dark:hover:bg-surface-tertiary/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:inset-ring-destructive dark:bg-destructive/20 dark:hover:bg-destructive/30",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  shadow,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    shadow?: boolean | SquircleShadowKey | string
  }) {
  const button = (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      render={(htmlProps) => (
        <Squircle
          as="button"
          cornerRadius={radiusForButtonSize(size)}
          {...(htmlProps as React.ComponentProps<"button">)}
        />
      )}
      {...props}
    />
  )
  if (!shadow) return button
  return <SquircleShadow shadow={shadow}>{button}</SquircleShadow>
}

export { Button, buttonVariants }
