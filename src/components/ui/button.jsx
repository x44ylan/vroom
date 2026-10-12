import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-100 text-zinc-950 hover:bg-white font-semibold",
        destructive:
          "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
        outline:
          "border border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-white",
        secondary:
          "bg-zinc-800/80 text-zinc-200 hover:bg-zinc-700/80 hover:text-white",
        ghost:
          "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50",
        link:
          "text-zinc-300 underline-offset-4 hover:underline",
        primary:
          "bg-zinc-100 text-zinc-950 hover:bg-white font-semibold",
        success:
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20",
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
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
