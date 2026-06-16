"use client";

import type { ReactNode } from "react";

import { Button } from "@heroui/react";
import { motion } from "framer-motion";
import NextLink from "next/link";

import { cn } from "@/lib/client-utils";

type NavbarIconButtonProps = {
  ariaLabel: string;
  icon: ReactNode;
  href?: string;
  onPress?: () => void;
  badge?: ReactNode;
  isActive?: boolean;
  className?: string;
};

export function NavbarIconButton({
  ariaLabel,
  icon,
  href,
  onPress,
  badge,
  isActive = false,
  className,
}: NavbarIconButtonProps) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="inline-flex"
    >
      <Button
        as={href ? NextLink : undefined}
        href={href}
        isIconOnly
        radius="full"
        variant="flat"
        aria-label={ariaLabel}
        onPress={onPress}
        className={cn(
          "group relative h-11 w-11 overflow-hidden border shadow-[0_12px_28px_rgba(27,54,93,0.12)] transition-all duration-200",
          isActive
            ? "border-brotherhood-bronze/40 bg-[linear-gradient(135deg,rgba(205,154,96,0.22),rgba(160,112,58,0.34))] text-brotherhood-bronze"
            : "border-primary/12 bg-[linear-gradient(135deg,rgba(var(--content1),0.94),rgba(var(--content2),0.9))] text-foreground hover:border-brotherhood-bronze/35 hover:bg-[linear-gradient(135deg,rgba(var(--content1),1),rgba(var(--heroui-colors-primary-50),0.95))]",
          "dark:border-white/12 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(var(--content2),0.86))] dark:text-default-100 dark:hover:border-white/20 dark:hover:bg-[linear-gradient(135deg,rgba(255,255,255,0.12),rgba(var(--content2),0.92))] dark:data-[active=true]:text-brotherhood-bronze",
          className
        )}
        data-active={isActive ? "true" : "false"}
      >
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_58%)] opacity-60 transition-opacity duration-200 group-hover:opacity-90" />
        <span className="relative z-10 transition-transform duration-200 group-hover:scale-110">
          {icon}
        </span>
        {badge ? <span className="absolute right-1.5 top-1.5 z-20">{badge}</span> : null}
      </Button>
    </motion.div>
  );
}
