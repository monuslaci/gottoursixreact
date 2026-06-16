"use client";

export const PROFILE_UPDATED_EVENT = "profile-updated";

export function dispatchProfileUpdatedEvent() {
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
}
