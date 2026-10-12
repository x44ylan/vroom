import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 hover:bg-amber-400 active:bg-amber-600 font-bold",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-500",
        outline:
          "border border-slate-800 bg-slate-900/60 hover:bg-slate-800 hover:text-white text-slate-300",
        secondary:
          "bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white",
        ghost: "hover:bg-slate-800 hover:text-slate-100 text-slate-400",
        link: "text-amber-400 underline-offset-4 hover:underline",
        primary: "bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20",
        success: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-500/20",
      },
      size: {
        default: "h-9 px-4 py-2 text-xs sm:text-sm",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-11 rounded-xl px-6 text-sm sm:text-base",
        icon: "h-9 w-9 p-0",
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
