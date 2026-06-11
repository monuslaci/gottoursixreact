import type { ButtonHTMLAttributes } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/client-utils";

interface InteractiveHoverButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  animationOrigin?: "left" | "center" | "right";
}

export function InteractiveHoverButton({
  children,
  className,
  animationOrigin = "left",
  type = "button",
  ...props
}: InteractiveHoverButtonProps) {
  const getOriginClass = () => {
    switch (animationOrigin) {
      case "left":
        return "origin-left";
      case "right":
        return "origin-right";
      case "center":
      default:
        return "origin-center";
    }
  };

  return (
    <button
      type={type}
      className={cn(
        "group relative inline-flex min-h-11 min-w-44 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:border-brotherhood-bronze/50 active:scale-[0.99]",
        className
      )}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2 transition-transform duration-300 group-hover:-translate-x-1">
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </span>
      <span
        className={cn(
          "absolute inset-0 z-0 scale-x-0 rounded-xl bg-primary/10 transition-transform duration-300 ease-out group-hover:scale-x-100",
          "bg-brotherhood-bronze",
          getOriginClass()
        )}
      />
    </button>
  );
}
