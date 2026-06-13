import { redirect } from "next/navigation";

import { AuthPageContent } from "@/components/auth/auth-page-content";
import { getCurrentSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

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
