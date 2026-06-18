"use client";

import {
  FileText,
  LogIn,
  LogOut,
  Menu,
  MessageSquareMore,
  X,
} from "lucide-react";
import Image from "next/image";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { NavbarIconButton } from "@/components/navbar-icon-button";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";
import { resolveAvatarPath } from "@/lib/avatars";
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
  const profileAvatarSrc = resolveAvatarPath(
    user?.image,
    user?.username,
    user?.email,
    user?.id
  );

  const isActive = (href: string) => pathname === href;
  const isActivityActive = isActive("/activity");
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
              {desktopNavItems.map((item) => {
                const active = isActive(item.href);

                return (
                  <NextLink
                    key={item.href}
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
                );
              })}
            </nav>
          </div>

          <div className="flex items-center justify-end gap-2">
            {isAuthenticated ? (
              <>
                <NavbarIconButton
                  href="/profile"
                  ariaLabel={user ? `Profile for @${user.username}` : "Profile"}
                  isActive={isProfileActive}
                  icon={
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/20 bg-content2/80">
                      <Image
                        src={profileAvatarSrc}
                        alt={user?.username ? `Avatar for @${user.username}` : "Profile"}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                  }
                />
                <NavbarIconButton
                  href="/activity"
                  ariaLabel="Activity"
                  isActive={isActivityActive}
                  icon={<FileText className="h-5 w-5" />}
                />
                <NavbarIconButton
                  href="/messages"
                  ariaLabel={
                    unreadMessageCount > 0
                      ? `Messages, ${unreadMessageCount} unread`
                      : "Messages"
                  }
                  isActive={isActive("/messages")}
                  icon={<MessageSquareMore className="h-5 w-5" />}
                  badge={
                    unreadMessageCount > 0 ? (
                      <span
                        aria-hidden="true"
                        className="flex h-2.5 w-2.5 rounded-full bg-danger shadow-[0_0_0_4px_rgba(255,255,255,0.7)] dark:shadow-[0_0_0_4px_rgba(17,24,39,0.8)]"
                      />
                    ) : null
                  }
                />
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
                  className="hidden items-center gap-2 rounded-full border border-primary/12 bg-[linear-gradient(135deg,rgba(var(--content1),0.94),rgba(var(--content2),0.9))] px-4 py-2 text-sm font-medium text-primary shadow-[0_12px_28px_rgba(27,54,93,0.1)] transition-all duration-200 hover:-translate-y-0.5 hover:border-brotherhood-bronze/35 hover:bg-[linear-gradient(135deg,rgba(var(--content1),1),rgba(var(--heroui-colors-primary-50),0.95))] sm:inline-flex dark:border-white/12 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(var(--content2),0.86))] dark:text-white"
                >
                  <LogIn className="h-4 w-4" />
                  Sign in
                </NextLink>
                <NextLink
                  href="/auth?mode=register"
                  className="hidden items-center rounded-full border border-brotherhood-bronze/35 bg-[linear-gradient(135deg,rgba(var(--heroui-colors-warning),0.96),rgba(227,162,74,0.96))] px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_16px_34px_rgba(197,138,58,0.24)] transition-all duration-200 hover:-translate-y-0.5 sm:inline-flex dark:text-slate-950"
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
                    const active = isActive(item.href);

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
                          className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/12 bg-[linear-gradient(135deg,rgba(var(--content1),0.94),rgba(var(--content2),0.9))] px-4 py-2 text-sm font-medium text-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-brotherhood-bronze/35 hover:bg-[linear-gradient(135deg,rgba(var(--content1),1),rgba(var(--heroui-colors-primary-50),0.95))] dark:border-white/12 dark:bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(var(--content2),0.86))] dark:text-white"
                        >
                          <LogIn className="h-4 w-4" />
                          Sign in
                        </NextLink>
                        <NextLink
                          href="/auth?mode=register"
                          className="inline-flex items-center justify-center rounded-full border border-brotherhood-bronze/35 bg-[linear-gradient(135deg,rgba(var(--heroui-colors-warning),0.96),rgba(227,162,74,0.96))] px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_16px_34px_rgba(197,138,58,0.2)] transition-all duration-200 hover:-translate-y-0.5 dark:text-slate-950"
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
