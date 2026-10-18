import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-(--accent) disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default: "bg-(--text) text-(--bg) font-semibold hover:opacity-90",
        primary: "bg-(--text) text-(--bg) font-semibold hover:opacity-90",
        success: "bg-(--text) text-(--bg) font-semibold hover:opacity-90",
        secondary: "bg-(--surface-2) text-(--text) hover:bg-(--surface-3)",
        outline: "border border-(--line-strong) text-(--muted) hover:text-(--text)",
        ghost: "text-(--muted) hover:text-(--text) hover:bg-(--surface-2)",
        destructive: "border border-red-400/40 text-red-300 hover:bg-red-500/10",
        link: "text-(--accent) underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 px-3 py-1.5",
        sm: "h-7 px-2 text-[11px]",
        lg: "h-9 px-4 text-xs",
        icon: "h-7 w-7 p-0",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "default",
    },
  }
)

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      aria-label={props["aria-label"] || (size === "icon" ? props.title : undefined)}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
