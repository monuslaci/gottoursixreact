"use client";

import { useEffect, useState } from "react";

import type { ProfilePayload } from "@/lib/profile";

const FALLBACK_PROFILE: ProfilePayload = {
  user: {
    id: "demo-member",
    name: "Miles Parker",
    email: "miles.parker@six.local",
    image: null,
    givenName: "Miles",
    surname: "Parker",
    jobTitle: null,
    department: null,
    companyName: null,
    officeLocation: null,
    mobilePhone: null,
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

  return {
    user: profile.user,
    subscriptions: profile.subscriptions,
    profile,
    isLoading,
    error,
  };
}
