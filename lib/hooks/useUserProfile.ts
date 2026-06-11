"use client";

import { useMemo } from "react";

type DemoUserProfile = {
  name: string | null;
  email: string | null;
  image: string | null;
};

export function useUserProfile() {
  return useMemo(
    () => ({
      user: null as DemoUserProfile | null,
      isLoading: false,
    }),
    []
  );
}

