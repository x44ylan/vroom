import * as React from "react"
import { cn } from "../../lib/utils"

function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "rounded-2xl surface-card text-slate-100 overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "flex flex-col gap-1.5 p-4 sm:p-5 border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-bold tracking-tight text-white text-sm sm:text-base leading-snug", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-[11px] sm:text-xs text-slate-400 leading-relaxed font-normal", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn("p-4 sm:p-6", className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center p-4 sm:p-5 pt-0 border-t border-slate-800/60 bg-slate-950/30", className)}
      {...props}
    />
  )
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
