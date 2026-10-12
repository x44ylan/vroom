import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase leading-none transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "border-amber-500/40 bg-amber-500/10 text-amber-300 shadow-[inset_0_1px_0_rgba(251,191,36,0.1)]",
        secondary:
          "border-slate-700/80 bg-slate-800/80 text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        destructive:
          "border-red-500/40 bg-red-500/10 text-red-300 shadow-[inset_0_1px_0_rgba(239,68,68,0.1)]",
        outline:
          "border-slate-700/80 text-slate-400 bg-transparent",
        success:
          "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 shadow-[inset_0_1px_0_rgba(16,185,129,0.1)]",
        info:
          "border-cyan-500/40 bg-cyan-500/10 text-cyan-300 shadow-[inset_0_1px_0_rgba(6,182,212,0.1)]",
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
