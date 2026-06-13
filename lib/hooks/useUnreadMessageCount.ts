"use client";

import { useEffect, useState } from "react";

import { useAuthSession } from "@/lib/hooks/useAuthSession";

export function useUnreadMessageCount() {
  const { user, isLoading: isLoadingSession } = useAuthSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUnreadCount() {
      const email = user?.email;

      if (!email) {
        if (isMounted) {
          setUnreadCount(0);
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(
          `/api/conversations?userEmail=${encodeURIComponent(email)}`,
          {
            cache: "no-store",
          }
        );

        const payload = (await response.json()) as {
          unreadCount?: number;
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load unread messages.");
        }

        if (isMounted) {
          setUnreadCount(payload.unreadCount ?? 0);
        }
      } catch {
        if (isMounted) {
          setUnreadCount(0);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    function handleMessagesChanged() {
      void loadUnreadCount();
    }

    if (isLoadingSession) {
      return;
    }

    setIsLoading(true);
    void loadUnreadCount();

    window.addEventListener("messages-changed", handleMessagesChanged);

    return () => {
      isMounted = false;
      window.removeEventListener("messages-changed", handleMessagesChanged);
    };
  }, [user?.email, isLoadingSession]);

  return {
    unreadCount,
    isLoading,
  };
}
