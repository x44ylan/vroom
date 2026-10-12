import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-mono tracking-tight transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-800 text-zinc-300 border border-zinc-700/60",
        secondary:
          "bg-zinc-800/60 text-zinc-400 border border-zinc-700/40",
        destructive:
          "bg-red-500/10 text-red-400 border border-red-500/20",
        outline:
          "border border-zinc-800 text-zinc-400 bg-transparent",
        success:
          "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        info:
          "bg-sky-500/10 text-sky-400 border border-sky-500/20",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
