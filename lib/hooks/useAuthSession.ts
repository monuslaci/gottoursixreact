"use client";

import { useCallback, useEffect, useState } from "react";

type AuthSessionUser = {
  id: string;
  name: string | null;
  username: string;
  email: string | null;
  image: string | null;
  givenName: string | null;
  surname: string | null;
  jobTitle: string | null;
  department: string | null;
  companyName: string | null;
  officeLocation: string | null;
  mobilePhone: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

type AuthSessionPayload = {
  authenticated: boolean;
  user: AuthSessionUser | null;
};

export function useAuthSession() {
  const [session, setSession] = useState<AuthSessionPayload>({
    authenticated: false,
    user: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/session", {
        cache: "no-store",
      });

      const payload = (await response.json()) as AuthSessionPayload & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load session.");
      }

      setSession({
        authenticated: Boolean(payload.authenticated),
        user: payload.user ?? null,
      });
    } catch {
      setSession({
        authenticated: false,
        user: null,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    user: session.user,
    isAuthenticated: session.authenticated,
    isLoading,
    refresh,
  };
}
