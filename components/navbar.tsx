"use client";

import { Button, Card, CardBody, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Menu, X } from "lucide-react";
import NextLink from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { cn } from "@/lib/client-utils";

export function AppNavbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const unreadMessageCount = 0;

  const isActive = (href: string) => pathname === href;

  return (
    <div className="sticky top-0 z-50">
      <Navbar
        maxWidth="xl"
        className="border-b border-primary/15 bg-content1/88 shadow-[0_12px_34px_rgb(var(--heroui-colors-primary-500)/0.08)] backdrop-blur-xl"
      >
        <NavbarContent justify="start" className="gap-3">
          <NavbarBrand>
            <NextLink href="/" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-primary/15 bg-background shadow-sm sm:h-11 sm:w-11">
                <Image
                  src="/logo.png"
                  alt={`${siteConfig.name} logo`}
                  fill
                  sizes="44px"
                  className="object-contain p-1"
                  priority
                />
              </div>
              <div className="hidden flex-col sm:flex">
                <span className="text-sm font-semibold leading-none">
                  {siteConfig.name}
                </span>
                <span className="text-xs text-secondary">
                  Brotherhood platform
                </span>
              </div>
            </NextLink>
          </NavbarBrand>

          <div className="hidden md:flex items-center gap-1">
            {siteConfig.navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <NavbarItem key={item.href}>
                  <NextLink
                    href={item.href}
                    className={cn(
                      "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-default-700 hover:bg-secondary/12 hover:text-primary"
                    )}
                  >
                    {item.label}
                  </NextLink>
                </NavbarItem>
              );
            })}
          </div>
        </NavbarContent>

        <NavbarContent justify="end" className="gap-2">
          <Button
            as={NextLink}
            href="/messages"
            isIconOnly
            variant="flat"
            className="relative bg-secondary/10 text-primary hover:bg-secondary/16"
            aria-label={
              unreadMessageCount > 0
                ? `Messages, ${unreadMessageCount} unread`
                : "Messages"
            }
          >
            <MessageSquare className="h-5 w-5" />
            {unreadMessageCount > 0 ? (
              <span
                aria-hidden="true"
                className="absolute right-1 top-1 h-2 w-2 rounded-full bg-danger"
              />
            ) : null}
          </Button>
          <ThemeSwitch />
          <Button
            isIconOnly
            variant="flat"
            className="bg-secondary/10 text-primary hover:bg-secondary/16 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onPress={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </NavbarContent>
      </Navbar>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-b border-primary/15 bg-content1/96 px-4 py-4 shadow-lg backdrop-blur-xl sm:px-6 md:hidden lg:px-8"
          >
            <Card className="border border-primary/15 bg-background/90 shadow-sm">
              <CardBody className="gap-3 p-4">
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
                            ? "bg-primary text-primary-foreground"
                            : "text-default-700 hover:bg-secondary/12 hover:text-primary"
                        )}
                      >
                        {item.label}
                      </NextLink>
                    );
                  })}
                </nav>
              </CardBody>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
