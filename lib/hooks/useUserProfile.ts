"use client";

import { useCallback, useEffect, useState } from "react";

import { PROFILE_UPDATED_EVENT } from "@/lib/client-events";
import type { ProfilePayload } from "@/lib/profile";

const FALLBACK_PROFILE: ProfilePayload = {
  user: {
    id: "demo-member",
    username: "miles-parker",
    email: "miles.parker@gotyoursix.local",
    image: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: null,
  },
  subscriptions: {
    topics: [],
    subtopics: [],
  },
};

export function useUserProfile() {
  const [profile, setProfile] = useState<ProfilePayload>(FALLBACK_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/me", {
        cache: "no-store",
      });
      const payload = (await response.json()) as ProfilePayload & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to load profile.");
      }

      setProfile(payload);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load profile.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadProfile() {
      try {
        const response = await fetch("/api/me", {
          cache: "no-store",
        });
        const payload = (await response.json()) as ProfilePayload & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load profile.");
        }

        if (isMounted) {
          setProfile(payload);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unable to load profile.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

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
    user: profile.user,
    subscriptions: profile.subscriptions,
    profile,
    isLoading,
    error,
    refresh,
  };
}
