"use client";

import {
  Dices,
  ExternalLink,
  LockKeyhole,
  MessageSquareText,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type AuthMode = "login" | "register";

type AuthPageContentProps = {
  initialMode: AuthMode;
  nextPath: string;
  initialError?: string | null;
};

function FloatingField({
  label,
  type = "text",
  value,
  onValueChange,
  autoComplete,
}: {
  label: string;
  type?: string;
  value: string;
  onValueChange: (value: string) => void;
  autoComplete?: string;
}) {
  return (
    <label className="group relative block w-full">
      <input
        autoComplete={autoComplete}
        className="peer h-14 w-full rounded-xl border border-divider/70 bg-content1/90 px-4 pb-2 pt-6 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-transparent focus:border-primary/40 focus:shadow-[0_0_0_4px_rgb(var(--heroui-colors-primary-500)/0.08)]"
        placeholder=" "
        type={type}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <span className="pointer-events-none absolute left-4 top-2 text-xs font-medium text-default-600 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-default-500 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-default-700">
        {label}
      </span>
    </label>
  );
}

function FeaturePill({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="auth-feature-pill">
      <div className="auth-feature-icon">
        {icon}
      </div>
      <div>
        <p className="auth-feature-title">{title}</p>
        <p className="auth-feature-copy">{description}</p>
      </div>
    </div>
  );
}

export function AuthPageContent({
  initialMode,
  nextPath,
  initialError = null,
}: AuthPageContentProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingUsername, setIsGeneratingUsername] = useState(false);
  const [error, setError] = useState<string | null>(initialError);

  const isRegister = mode === "register";
  const primaryLabel = useMemo(
    () => (isRegister ? "Create account" : "Open app"),
    [isRegister]
  );
  const googleAuthHref = useMemo(
    () => `/api/auth/google?next=${encodeURIComponent(nextPath || "/")}`,
    [nextPath]
  );

  async function handleGenerateUsername() {
    setIsGeneratingUsername(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/username", {
        method: "GET",
        cache: "no-store",
      });

      const payload = (await response.json()) as {
        username?: string;
        error?: string;
      };

      if (!response.ok || !payload.username) {
        throw new Error(payload.error || "Unable to generate a username.");
      }

      setUsername(payload.username);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate a username.");
    } finally {
      setIsGeneratingUsername(false);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        isRegister ? "/api/auth/register" : "/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            isRegister
              ? {
                  username,
                  email,
                  password,
                  confirmPassword,
                }
              : {
                  identifier: username || email,
                  password,
                }
          ),
        }
      );

      const payload = (await response.json()) as {
        authenticated?: boolean;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to complete authentication.");
      }

      window.location.href = nextPath || "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete authentication.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page relative overflow-hidden">
      <div className="auth-page-bg pointer-events-none absolute inset-0 -z-10" />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-4">
        <section>
          <div className="w-full rounded-[1.5rem] border border-primary/12 bg-content1/92 shadow-[0_20px_70px_rgb(var(--heroui-colors-primary-500)/0.14)] backdrop-blur-xl">
            <div className="flex flex-col gap-5 p-6 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-default-500">
                    Account access
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {isRegister ? "Create your account" : "Sign in"}
                  </h2>
                </div>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  <LockKeyhole className="mr-1 h-3.5 w-3.5" />
                  Secure login
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-divider/70 bg-content2/60 p-1">
                <button
                  type="button"
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    !isRegister
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-default-600 hover:bg-default-100"
                  }`}
                  onClick={() => setMode("login")}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isRegister
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-default-600 hover:bg-default-100"
                  }`}
                  onClick={() => setMode("register")}
                >
                  Register
                </button>
              </div>

              <div className="space-y-4">
                  {isRegister ? (
                    <>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <div className="flex-1">
                          <FloatingField
                            autoComplete="username"
                            label="Username"
                            value={username}
                            onValueChange={setUsername}
                          />
                        </div>
                        <button
                          type="button"
                          disabled={isGeneratingUsername || isSubmitting}
                          className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl border border-divider/70 bg-content2/70 px-4 text-sm font-semibold text-foreground transition-colors hover:bg-content2 disabled:cursor-not-allowed disabled:opacity-70"
                          onClick={() => void handleGenerateUsername()}
                        >
                          <Dices className="h-4 w-4" />
                          {isGeneratingUsername ? "Generating..." : "Generate"}
                        </button>
                      </div>
                      <FloatingField
                        autoComplete="email"
                        label="Email"
                        type="email"
                        value={email}
                        onValueChange={setEmail}
                      />
                      <FloatingField
                        autoComplete="new-password"
                        label="Password"
                        type="password"
                        value={password}
                        onValueChange={setPassword}
                      />
                      <FloatingField
                        autoComplete="new-password"
                        label="Confirm password"
                        type="password"
                        value={confirmPassword}
                        onValueChange={setConfirmPassword}
                      />
                    </>
                  ) : (
                    <>
                      <FloatingField
                        autoComplete="username"
                        label="Username or email"
                        value={username || email}
                        onValueChange={(value) => {
                          setUsername(value);
                          setEmail(value);
                        }}
                      />
                      <FloatingField
                        autoComplete="current-password"
                        label="Password"
                        type="password"
                        value={password}
                        onValueChange={setPassword}
                      />
                    </>
                  )}
              </div>

              <div className="space-y-3">
                <a
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-divider/70 bg-content1 px-4 text-sm font-semibold text-foreground transition-colors hover:bg-content2"
                  href={googleAuthHref}
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-foreground text-[0.7rem] font-bold text-background">
                    G
                  </span>
                  {isRegister ? "Register with Google" : "Continue with Google"}
                  <ExternalLink className="h-3.5 w-3.5 text-default-500" />
                </a>

                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-divider" />
                  <span className="text-xs font-medium uppercase tracking-[0.16em] text-default-400">
                    or
                  </span>
                  <div className="h-px flex-1 bg-divider" />
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                  onClick={() => void handleSubmit()}
                >
                  {isSubmitting ? "Please wait..." : primaryLabel}
                </button>
                <p className="text-center text-xs leading-5 text-default-500">
                  By continuing, you agree to keep conversations respectful and private.
                </p>
              </div>

              {error ? <p className="text-sm text-danger-500">{error}</p> : null}

              <div className="h-px bg-divider" />

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <p className="text-default-500">Need a better look before joining?</p>
                <Link
                  href="/"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  View the landing page
                  <Sparkles className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="auth-intro-panel">
            <div className="auth-intro-heading">
              <h1>
                A calmer place to talk, connect, and keep things real.
              </h1>
              <p>
                Got Your Six gives men a structured community for honest conversation,
                topic-based discussion, and private messaging. Your email stays
                private, your public username stays simple, and your conversations stay
                easy to manage.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-3">
          <FeaturePill
            icon={<Users className="h-5 w-5" />}
            title="Community spaces"
            description="Browse topic rooms and follow what matters."
          />
          <FeaturePill
            icon={<MessageSquareText className="h-5 w-5" />}
            title="Private messages"
            description="Start a direct conversation with any member."
          />
          <FeaturePill
            icon={<Shield className="h-5 w-5" />}
            title="Safer defaults"
            description="Members only see usernames and public posts."
          />
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="auth-note-card">
            <p>
              Why it works
            </p>
            <p>
              One username, one profile, and one place for support. You get the
              structure of a community without exposing personal details.
            </p>
          </div>
          <div className="auth-note-card">
            <p>
              Built for momentum
            </p>
            <p>
              Keep reading, posting, and messaging in one place with a simple
              dashboard instead of scattered tools.
            </p>
          </div>
        </section>
      </div>

      <div className="h-4" />
    </div>
  );
}
