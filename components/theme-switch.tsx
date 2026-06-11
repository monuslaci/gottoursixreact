"use client";

import { useEffect, useState, type ButtonHTMLAttributes } from "react";
import { useTheme } from "next-themes";

import { MoonFilledIcon, SunFilledIcon } from "@/components/icons";
import { cn } from "@/lib/client-utils";

export interface ThemeSwitchProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function ThemeSwitch({ className, ...props }: ThemeSwitchProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-divider bg-background text-default-700 transition hover:bg-default-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        className
      )}
      {...props}
    >
      {isDark ? <SunFilledIcon size={20} /> : <MoonFilledIcon size={20} />}
      <span className="sr-only">Toggle color theme</span>
    </button>
  );
}
