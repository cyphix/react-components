import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  CircleAlert,
  CircleCheck,
  Info,
  TriangleAlert,
} from "lucide-react"

import { cn } from "@/lib/utils"

const calloutVariants = cva(
  "relative flex w-full items-start gap-3 rounded-lg border p-4 text-sm [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:translate-y-0.5",
  {
    variants: {
      variant: {
        info: "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100 [&_svg]:text-blue-600 dark:[&_svg]:text-blue-400",
        success:
          "border-green-200 bg-green-50 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-100 [&_svg]:text-green-600 dark:[&_svg]:text-green-400",
        warning:
          "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100 [&_svg]:text-amber-600 dark:[&_svg]:text-amber-400",
        destructive:
          "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100 [&_svg]:text-red-600 dark:[&_svg]:text-red-400",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
)

const variantIcons: Record<
  NonNullable<VariantProps<typeof calloutVariants>["variant"]>,
  React.ComponentType<{ className?: string }>
> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  destructive: CircleAlert,
}

function Callout({
  className,
  variant = "info",
  icon,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof calloutVariants> & {
    icon?: React.ReactNode
  }) {
  const DefaultIcon = variantIcons[variant ?? "info"]

  return (
    <div
      data-slot="callout"
      role="note"
      className={cn(calloutVariants({ variant }), className)}
      {...props}
    >
      {icon ?? <DefaultIcon />}
      <div className="flex-1 space-y-1">{children}</div>
    </div>
  )
}

function CalloutTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="callout-title"
      className={cn("leading-none font-medium", className)}
      {...props}
    />
  )
}

function CalloutDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="callout-description"
      className={cn("opacity-90", className)}
      {...props}
    />
  )
}

export { Callout, CalloutTitle, CalloutDescription, calloutVariants }
