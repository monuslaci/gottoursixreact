"use client";

import { Menu, X } from "lucide-react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/client-utils";

export function AppNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <div className="sticky top-0 z-50 border-b border-divider bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <NextLink href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
            S
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-sm font-semibold leading-none">
              {siteConfig.name}
            </span>
            <span className="text-xs text-default-500">Base community shell</span>
          </div>
        </NextLink>

        <nav className="hidden items-center gap-1 md:flex">
          {siteConfig.navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <NextLink
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-default-100 hover:text-primary"
                )}
              >
                {item.label}
              </NextLink>
            );
          })}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-divider bg-background text-foreground transition hover:bg-default-100 md:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((value) => !value)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-divider bg-background px-4 py-4 sm:px-6 md:hidden lg:px-8">
          <nav className="flex flex-col gap-2">
            {siteConfig.navMenuItems.map((item) => {
              const active = isActive(item.href);

              return (
                <NextLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-default-100"
                  )}
                >
                  {item.label}
                </NextLink>
              );
            })}
          </nav>
        </div>
      ) : null}
    </div>
  );
}

