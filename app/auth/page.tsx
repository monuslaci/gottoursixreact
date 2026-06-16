import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthPageContent } from "@/components/auth/auth-page-content";
import { buildMetadata } from "@/lib/seo";
import { getCurrentSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";
export const metadata: Metadata = buildMetadata({
  title: "Sign In",
  description: "Sign in or create an account to join the Got Your Six community.",
  path: "/auth",
  noIndex: true,
});

type AuthPageProps = {
  searchParams?: {
    mode?: string;
    next?: string;
  };
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  const user = await getCurrentSessionUser();

  if (user) {
    redirect(searchParams?.next || "/");
  }

  return (
    <AuthPageContent
      initialMode={searchParams?.mode === "register" ? "register" : "login"}
      nextPath={searchParams?.next || "/"}
    />
  );
}
