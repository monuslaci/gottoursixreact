"use client";

import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Spacer,
} from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  LockKeyhole,
  MessageSquareText,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/lib/client-utils";

type AuthMode = "login" | "register";

type AuthPageContentProps = {
  initialMode: AuthMode;
  nextPath: string;
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
    <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
        {icon}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-sm leading-6 text-white/80">{description}</p>
      </div>
    </div>
  );
}

export function AuthPageContent({ initialMode, nextPath }: AuthPageContentProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRegister = mode === "register";
  const primaryLabel = useMemo(
    () => (isRegister ? "Create account" : "Open app"),
    [isRegister]
  );

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
                  name,
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

      router.replace(nextPath || "/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to complete authentication.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(22,160,133,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.16),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.65),rgba(255,255,255,0.95))] dark:bg-[radial-gradient(circle_at_top_left,rgba(22,160,133,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.16),transparent_36%),linear-gradient(180deg,rgba(2,6,23,0.85),rgba(2,6,23,0.96))]" />

      <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="flex min-h-[calc(100vh-8rem)] items-center"
        >
          <div className="space-y-6 py-4 lg:max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Chip color="primary" variant="flat">
                Private by design
              </Chip>
              <Chip variant="flat">Password login</Chip>
              <Chip color="secondary" variant="flat">
                Public username only
              </Chip>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                A calmer place to talk, connect, and keep things real.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-default-600 sm:text-lg">
                Got Your Six gives men a structured community for honest conversation,
                topic-based discussion, and private messaging. Your email stays
                private, your public username stays simple, and your conversations stay
                easy to manage.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
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
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border border-primary/12 bg-content1/85 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)] backdrop-blur">
                <CardBody className="gap-2 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-default-500">
                    Why it works
                  </p>
                  <p className="text-sm leading-6 text-default-600">
                    One username, one profile, and one place for support. You get the
                    structure of a community without exposing personal details.
                  </p>
                </CardBody>
              </Card>
              <Card className="border border-primary/12 bg-content1/85 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)] backdrop-blur">
                <CardBody className="gap-2 p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-default-500">
                    Built for momentum
                  </p>
                  <p className="text-sm leading-6 text-default-600">
                    Keep reading, posting, and messaging in one place with a simple
                    dashboard instead of scattered tools.
                  </p>
                </CardBody>
              </Card>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                as={Link}
                href={`/auth?mode=register&next=${encodeURIComponent(nextPath || "/")}`}
                color="primary"
                endContent={<ArrowRight className="h-4 w-4" />}
              >
                Join now
              </Button>
              <Button
                as={Link}
                href={`/auth?mode=login&next=${encodeURIComponent(nextPath || "/")}`}
                variant="flat"
              >
                Open account
              </Button>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, delay: 0.05 }}
          className="flex items-center justify-center py-4"
        >
          <Card className="w-full max-w-xl border border-primary/12 bg-content1/92 shadow-[0_20px_70px_rgb(var(--heroui-colors-primary-500)/0.14)] backdrop-blur-xl">
            <CardBody className="gap-5 p-6 sm:p-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-default-500">
                    Account access
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {isRegister ? "Create your account" : "Sign in"}
                  </h2>
                </div>
                <Chip color="primary" variant="flat">
                  <LockKeyhole className="mr-1 h-3.5 w-3.5" />
                  Secure login
                </Chip>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-divider/70 bg-content2/60 p-1">
                <button
                  type="button"
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    !isRegister
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-default-600 hover:bg-default-100"
                  )}
                  onClick={() => setMode("login")}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                    isRegister
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-default-600 hover:bg-default-100"
                  )}
                  onClick={() => setMode("register")}
                >
                  Register
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-4"
                >
                  {isRegister ? (
                    <>
                      <FloatingField
                        autoComplete="name"
                        label="Display name"
                        value={name}
                        onValueChange={setName}
                      />
                      <FloatingField
                        autoComplete="username"
                        label="Username"
                        value={username}
                        onValueChange={setUsername}
                      />
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
                </motion.div>
              </AnimatePresence>

              <div className="space-y-3">
                <Button
                  color="primary"
                  isLoading={isSubmitting}
                  fullWidth
                  onPress={() => void handleSubmit()}
                >
                  {primaryLabel}
                </Button>
                <p className="text-center text-xs leading-5 text-default-500">
                  By continuing, you agree to keep conversations respectful and private.
                </p>
              </div>

              {error ? <p className="text-sm text-danger-500">{error}</p> : null}

              <Divider />

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <p className="text-default-500">Need a better look before joining?</p>
                <Button as={Link} href="/" variant="light" endContent={<Sparkles className="h-4 w-4" />}>
                  View the landing page
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.section>
      </div>

      <Spacer y={4} />
    </div>
  );
}
