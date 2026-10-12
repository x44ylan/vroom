import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 leading-none",
  {
    variants: {
      variant: {
        default:
          "border-amber-500/30 bg-amber-500/10 text-amber-300",
        secondary:
          "border-slate-700 bg-slate-800 text-slate-300",
        destructive:
          "border-red-500/30 bg-red-500/10 text-red-300",
        outline:
          "border-slate-700 text-slate-400",
        success:
          "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
        info:
          "border-sky-500/30 bg-sky-500/10 text-sky-300",
      },
    },
    defaultVariants: {
      variant: "default",
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
