"use client";

import { useCallback, useEffect, useState } from "react";

import { PROFILE_UPDATED_EVENT } from "@/lib/client-events";

type AuthSessionUser = {
  id: string;
  username: string;
  email: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
};

type AuthSessionPayload = {
  authenticated: boolean;
  user: AuthSessionUser | null;
};

export type InitialAuthSession = {
  authenticated: boolean;
  user: AuthSessionUser | null;
};

export function useAuthSession(initialSession?: InitialAuthSession) {
  const [session, setSession] = useState<AuthSessionPayload>(
    initialSession ?? {
      authenticated: false,
      user: null,
    }
  );
  const [isLoading, setIsLoading] = useState(!initialSession);

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

  useEffect(() => {
    function handleProfileUpdated() {
      void refresh();
    }

    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);

    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdated);
    };
  }, [refresh]);

  return {
    user: session.user,
    isAuthenticated: session.authenticated,
    isLoading,
    refresh,
  };
}
