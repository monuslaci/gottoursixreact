"use client";

import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/client-utils";

import { LoginButton } from "./auth/login-button";
import { ThemeSwitch } from "./theme-switch";

export function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      className="border-b border-divider bg-background/80 backdrop-blur-xl"
    >
      <NavbarContent justify="start" className="gap-3">
        <NavbarBrand>
          <NextLink href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
              S
            </div>
            <div className="hidden flex-col sm:flex">
              <span className="text-sm font-semibold leading-none">
                {siteConfig.name}
              </span>
              <span className="text-xs text-default-500">
                Base community shell
              </span>
            </div>
          </NextLink>
        </NavbarBrand>

        <div className="hidden md:flex items-center gap-1">
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
        </div>
      </NavbarContent>

      <NavbarContent justify="end" className="gap-2">
        <div className="hidden sm:flex">
          <ThemeSwitch />
        </div>
        <div className="hidden md:flex">
          <LoginButton />
        </div>
        <NavbarMenuToggle className="md:hidden" />
      </NavbarContent>

      <NavbarMenu className="gap-2 border-t border-divider bg-background/95 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-2 sm:hidden"
        >
          <ThemeSwitch />
        </motion.div>

        {siteConfig.navMenuItems.map((item, index) => {
          const active = isActive(item.href);

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavbarMenuItem>
                <NextLink
                  href={item.href}
                  className={cn(
                    "flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-default-100"
                  )}
                >
                  {item.label}
                </NextLink>
              </NavbarMenuItem>
            </motion.div>
          );
        })}

        <div className="px-2 pt-2">
          <NextLink
            href="/demo"
            className="inline-flex w-full items-center justify-center rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Open demo
          </NextLink>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
}

