"use client";

import {
  Compass,
  FileText,
  Home,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  MessageSquareMore,
  ShieldCheck,
  UserCircle,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { NavbarIconButton } from "@/components/navbar-icon-button";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/client-utils";
import { useAuthSession, type InitialAuthSession } from "@/lib/hooks/useAuthSession";
import { useUnreadMessageCount } from "@/lib/hooks/useUnreadMessageCount";

type AppNavbarProps = {
  initialAuthSession?: InitialAuthSession;
};

const navIcons: Record<string, LucideIcon> = {
  "/": LayoutDashboard,
  "/topics": Compass,
  "/activity": FileText,
  "/profile": UserCircle,
  "/admin": ShieldCheck,
  "/messages": MessageSquareMore,
};

export function AppNavbar({ initialAuthSession }: AppNavbarProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, refresh } = useAuthSession(initialAuthSession);
  const { unreadCount: unreadMessageCount } = useUnreadMessageCount();

  const isActive = (href: string) => pathname === href;
  const desktopNavItems = siteConfig.navItems.filter((item) => {
    if (isAuthenticated) {
      return true;
    }

    return item.href !== "/admin" && item.href !== "/topics";
  });

  function renderNavItem(
    item: { label: string; href: string },
    options: { mobile?: boolean; badge?: number } = {}
  ) {
    const active = isActive(item.href);
    const Icon = navIcons[item.href] ?? Home;

    return (
      <NextLink
        key={item.href}
        href={item.href}
        onClick={options.mobile ? () => setMenuOpen(false) : undefined}
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        className={cn("nav-item", active && "nav-item--active", options.mobile && "nav-item--mobile")}
      >
        <span className="nav-item__icon" aria-hidden="true">
          <Icon className="h-[18px] w-[18px]" />
          {options.badge && options.badge > 0 ? (
            <span className="nav-item__badge" />
          ) : null}
        </span>
        <span className="nav-item__label">{item.label}</span>
        <span className="nav-item__dot" aria-hidden="true" />
      </NextLink>
    );
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    await refresh();
    window.location.href = "/";
  }

  return (
    <div className="sticky top-0 z-50">
      <header className="border-b border-primary/15 bg-content1/88 shadow-[0_12px_34px_rgb(var(--heroui-colors-primary-500)/0.08)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
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

            <nav className="hidden items-center gap-1 md:flex">
              {desktopNavItems.map((item) => renderNavItem(item))}
            </nav>
          </div>

          <div className="flex items-center justify-end gap-2">
            {isAuthenticated ? (
              <>
                <div className="hidden items-center gap-1 md:flex">
                  {renderNavItem({ label: "Profile", href: "/profile" })}
                  {renderNavItem({ label: "Activity", href: "/activity" })}
                  {renderNavItem(
                    { label: "Messages", href: "/messages" },
                    { badge: unreadMessageCount }
                  )}
                </div>
                <NavbarIconButton
                  ariaLabel="Sign out"
                  onPress={() => void handleLogout()}
                  icon={<LogOut className="h-[18px] w-[18px]" />}
                  className="hidden sm:inline-flex"
                />
              </>
            ) : (
              <>
                <NextLink
                  href="/auth?mode=login"
                  className="nav-auth-link hidden sm:inline-flex"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </NextLink>
                <NextLink
                  href="/auth?mode=register"
                  className="nav-auth-link nav-auth-link--register hidden sm:inline-flex"
                >
                  Register
                </NextLink>
              </>
            )}
            <ThemeSwitch />
            <NavbarIconButton
              ariaLabel={menuOpen ? "Close menu" : "Open menu"}
              onPress={() => setMenuOpen((value) => !value)}
              icon={
                menuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )
              }
              className="md:hidden"
            />
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="border-b border-primary/15 bg-content1/96 px-4 py-4 shadow-lg backdrop-blur-xl sm:px-6 md:hidden lg:px-8">
            <div className="rounded-2xl border border-primary/15 bg-background/90 p-4 shadow-sm">
                <nav className="flex flex-col gap-2">
                  {siteConfig.navMenuItems.map((item) => {
                    if (
                      !isAuthenticated &&
                      (item.href === "/topics" ||
                        item.href === "/activity" ||
                        item.href === "/messages" ||
                        item.href === "/profile" ||
                        item.href === "/admin")
                    ) {
                      return null;
                    }

                    return renderNavItem(item, { mobile: true });
                  })}
                  <div className="mt-2 flex flex-col gap-2 border-t border-divider/70 pt-3">
                    {isAuthenticated ? (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/12 bg-[linear-gradient(135deg,rgba(var(--content1),0.94),rgba(var(--content2),0.9))] px-4 py-2 text-sm font-medium text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-brotherhood-bronze/35 hover:bg-[linear-gradient(135deg,rgba(var(--content1),1),rgba(var(--heroui-colors-primary-50),0.95))] dark:border-white/12 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(var(--content2),0.86))] dark:text-white"
                        onClick={() => void handleLogout()}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    ) : (
                      <>
                        <NextLink
                          href="/auth?mode=login"
                          className="nav-auth-link"
                        >
                          <LogIn className="h-4 w-4" />
                          Sign in
                        </NextLink>
                        <NextLink
                          href="/auth?mode=register"
                          className="nav-auth-link nav-auth-link--register"
                        >
                          Register
                        </NextLink>
                      </>
                    )}
                  </div>
                </nav>
            </div>
        </div>
      ) : null}
    </div>
  );
}
