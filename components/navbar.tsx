"use client";

import {
  Button,
  Card,
  CardBody,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Tooltip,
} from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { LogIn, LogOut, MessageSquare, Menu, UserRound, X } from "lucide-react";
import NextLink from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { cn } from "@/lib/client-utils";
import { useAuthSession, type InitialAuthSession } from "@/lib/hooks/useAuthSession";
import { useUnreadMessageCount } from "@/lib/hooks/useUnreadMessageCount";

type AppNavbarProps = {
  initialAuthSession?: InitialAuthSession;
};

export function AppNavbar({ initialAuthSession }: AppNavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, refresh } = useAuthSession(initialAuthSession);
  const { unreadCount: unreadMessageCount } = useUnreadMessageCount();

  const isActive = (href: string) => pathname === href;
  const isProfileActive = isActive("/profile");
  const desktopNavItems = siteConfig.navItems.filter((item) => {
    if (isAuthenticated) {
      return true;
    }

    return item.href !== "/admin" && item.href !== "/topics";
  });

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    await refresh();
    window.location.href = "/";
  }

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
            {desktopNavItems.map((item) => {
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
          {isAuthenticated ? (
            <>
              <Tooltip content="Profile" showArrow>
                <Button
                  as={NextLink}
                  href="/profile"
                  isIconOnly
                  variant="flat"
                  className={cn(
                    isProfileActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary/10 text-primary hover:bg-secondary/16"
                  )}
                  aria-label={user ? `Profile for @${user.username}` : "Profile"}
                >
                  <UserRound className="h-5 w-5" />
                </Button>
              </Tooltip>
              <Tooltip
                content={
                  unreadMessageCount > 0
                    ? `Messages, ${unreadMessageCount} unread`
                    : "Messages"
                }
                showArrow
              >
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
              </Tooltip>
              <Tooltip content="Sign out" showArrow>
                <Button
                  isIconOnly
                  variant="flat"
                  className="hidden bg-secondary/10 text-primary hover:bg-secondary/16 sm:inline-flex"
                  aria-label="Sign out"
                  onPress={() => void handleLogout()}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </Tooltip>
            </>
          ) : (
            <>
              <Button
                as={NextLink}
                href="/auth?mode=login"
                variant="flat"
                className="hidden bg-secondary/10 text-primary hover:bg-secondary/16 sm:inline-flex"
                startContent={<LogIn className="h-4 w-4" />}
              >
                Sign in
              </Button>
              <Button
                as={NextLink}
                href="/auth?mode=register"
                color="primary"
                className="hidden sm:inline-flex"
              >
                Register
              </Button>
            </>
          )}
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

                    if (
                      !isAuthenticated &&
                      (item.href === "/topics" ||
                        item.href === "/messages" ||
                        item.href === "/profile" ||
                        item.href === "/admin")
                    ) {
                      return null;
                    }

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
                  <div className="mt-2 flex flex-col gap-2 border-t border-divider/70 pt-3">
                    {isAuthenticated ? (
                      <Button
                        variant="flat"
                        startContent={<LogOut className="h-4 w-4" />}
                        onPress={() => void handleLogout()}
                      >
                        Sign out
                      </Button>
                    ) : (
                      <>
                        <Button
                          as={NextLink}
                          href="/auth?mode=login"
                          variant="flat"
                          startContent={<LogIn className="h-4 w-4" />}
                        >
                          Sign in
                        </Button>
                        <Button as={NextLink} href="/auth?mode=register" color="primary">
                          Register
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </CardBody>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
