"use client"

import * as React from "react"
import { cn } from "@/lib/client-utils"

const TooltipProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

interface TooltipContextType {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const TooltipContext = React.createContext<TooltipContextType | undefined>(undefined)

const Tooltip = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false)
 
  return (
    <TooltipContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative">{children}</div>
    </TooltipContext.Provider>
  )
}

const TooltipTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean }
>(({ className, children, asChild, ...props }, ref) => {
  const context = React.useContext(TooltipContext)
 
  return (
    <div
      ref={ref}
      className={className}
      onMouseEnter={() => context?.setIsOpen(true)}
      onMouseLeave={() => context?.setIsOpen(false)}
      {...props}
    >
      {children}
    </div>
  )
})
TooltipTrigger.displayName = "TooltipTrigger"

const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(TooltipContext)
 
  if (!context?.isOpen) return null
 
  return (
    <div
      ref={ref}
      className={cn(
        "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
TooltipContent.displayName = "TooltipContent"

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }