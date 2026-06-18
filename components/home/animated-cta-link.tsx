"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/client-utils";

type AnimatedCtaVariant =
  | "hero-primary"
  | "hero-secondary"
  | "hero-bronze"
  | "hero-outline";

type AnimatedCtaLinkProps = {
  href: string;
  children: ReactNode;
  icon?: LucideIcon;
  variant?: AnimatedCtaVariant;
  delay?: number;
  className?: string;
  showArrow?: boolean;
};

const variantClasses: Record<AnimatedCtaVariant, string> = {
  "hero-primary":
    "border-0 bg-[linear-gradient(135deg,rgba(var(--heroui-colors-warning),1),rgba(227,162,74,1))] text-white shadow-[0_18px_42px_rgba(197,138,58,0.32)] hover:opacity-100",
  "hero-secondary":
    "border border-white/20 bg-white/10 text-white shadow-[0_16px_36px_rgba(9,18,35,0.24)] backdrop-blur-md hover:bg-white/16",
  "hero-bronze":
    "border-0 bg-[linear-gradient(135deg,rgba(var(--heroui-colors-warning),1),rgba(210,151,69,1))] text-white shadow-[0_18px_42px_rgba(197,138,58,0.26)] hover:opacity-100",
  "hero-outline":
    "border border-white/24 bg-white/8 text-white shadow-[0_16px_36px_rgba(9,18,35,0.2)] backdrop-blur-md hover:bg-white/14",
};

export function AnimatedCtaLink({
  href,
  children,
  icon: Icon,
  variant = "hero-primary",
  delay = 0,
  className,
  showArrow = false,
}: AnimatedCtaLinkProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.24,
        ease: "easeOut",
        delay,
      }}
      className={cn("inline-flex", className)}
    >
      <Link
        href={href}
        className={cn(
          "group inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.15rem] px-5 text-sm font-semibold tracking-[0.01em] transition-transform duration-200",
          variantClasses[variant]
        )}
      >
        {Icon ? (
          <Icon className="h-[18px] w-[18px] transition-transform duration-200 group-hover:-translate-y-0.5" />
        ) : null}
        {children}
        {showArrow ? (
          <ArrowRight className="h-[18px] w-[18px] transition-transform duration-200 group-hover:translate-x-0.5" />
        ) : null}
      </Link>
    </motion.div>
  );
}
