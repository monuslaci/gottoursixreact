"use client";

import { useMemo } from "react";

type DemoUserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

export function useUserProfile() {
  return useMemo(
    () => ({
      user: {
        id: "demo-member",
        name: "Miles Parker",
        email: "miles.parker@six.local",
        image: null,
      } as DemoUserProfile,
      isLoading: false,
    }),
    []
  );
}
