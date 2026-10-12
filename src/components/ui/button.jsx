import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-xs font-semibold tracking-wide transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:pointer-events-none disabled:opacity-40 cursor-pointer select-none active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-amber-400 to-amber-500 text-slate-950 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_2px_4px_rgba(0,0,0,0.25)] hover:from-amber-300 hover:to-amber-400 active:from-amber-500 active:to-amber-600 border border-amber-300/40",
        destructive:
          "bg-gradient-to-b from-red-500 to-red-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.25)] hover:from-red-400 hover:to-red-500 border border-red-400/30",
        outline:
          "border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800 hover:text-white text-slate-300 shadow-sm",
        secondary:
          "bg-slate-800/90 text-slate-200 hover:bg-slate-700/90 hover:text-white border border-slate-700/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_1px_3px_rgba(0,0,0,0.3)]",
        ghost:
          "hover:bg-slate-800/60 hover:text-slate-100 text-slate-400 border border-transparent",
        link:
          "text-amber-400 underline-offset-4 hover:underline",
        primary:
          "bg-gradient-to-b from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_4px_rgba(0,0,0,0.25)] border border-blue-400/30",
        success:
          "bg-gradient-to-b from-emerald-500 to-emerald-600 text-white hover:from-emerald-400 hover:to-emerald-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_4px_rgba(0,0,0,0.25)] border border-emerald-400/30",
      },
      size: {
        default: "h-9 px-3.5 py-1.5",
        sm: "h-7 rounded-lg px-2.5 text-[11px]",
        lg: "h-11 rounded-xl px-5 text-sm",
        icon: "h-8 w-8 p-0 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
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
