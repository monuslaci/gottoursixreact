"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Skeleton,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  Building2,
  Mail,
  ArrowUpRight,
  Phone,
  Search,
  Save,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import type {
  ProfilePayload,
  ProfileSubtopicSubscription,
  ProfileTopicSubscription,
} from "@/lib/profile";

const PAGE_SIZE = 5;

type ProfileFormState = {
  name: string;
  image: string;
  givenName: string;
  surname: string;
  jobTitle: string;
  department: string;
  companyName: string;
  officeLocation: string;
  mobilePhone: string;
};

type FloatingFieldProps = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  isRequired?: boolean;
};

const EMPTY_FORM: ProfileFormState = {
  name: "",
  image: "",
  givenName: "",
  surname: "",
  jobTitle: "",
  department: "",
  companyName: "",
  officeLocation: "",
  mobilePhone: "",
};

function buildFormState(profile: ProfilePayload): ProfileFormState {
  return {
    name: profile.user.name ?? "",
    image: profile.user.image ?? "",
    givenName: profile.user.givenName ?? "",
    surname: profile.user.surname ?? "",
    jobTitle: profile.user.jobTitle ?? "",
    department: profile.user.department ?? "",
    companyName: profile.user.companyName ?? "",
    officeLocation: profile.user.officeLocation ?? "",
    mobilePhone: profile.user.mobilePhone ?? "",
  };
}

function initialsFromName(name: string | null, email: string | null) {
  if (name) {
    const parts = name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    return name.slice(0, 1).toUpperCase();
  }

  if (email) {
    return email.slice(0, 1).toUpperCase();
  }

  return "U";
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-divider/70 bg-background/80 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-default-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function FloatingInput({
  label,
  value,
  onValueChange,
  isRequired,
}: FloatingFieldProps) {
  return (
    <label className="group relative block w-full">
      <input
        required={isRequired}
        className="peer h-14 w-full rounded-xl border border-divider/70 bg-content1/90 px-4 pb-2 pt-6 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-transparent focus:border-primary/40 focus:shadow-[0_0_0_4px_rgb(var(--heroui-colors-primary-500)/0.08)]"
        placeholder=" "
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <span className="pointer-events-none absolute left-4 top-2 text-xs font-medium text-default-600 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:text-default-500 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:font-medium peer-focus:text-default-700">
        {label}
      </span>
    </label>
  );
}

function SearchInput({
  label,
  value,
  onValueChange,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
}) {
  return (
    <label className="group relative block w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-default-400" />
      <input
        aria-label={label}
        className="h-12 w-full rounded-xl border border-divider/70 bg-content1/90 pl-11 pr-4 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-transparent focus:border-primary/40"
        placeholder=" "
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <span className="pointer-events-none absolute left-11 top-2 text-xs font-medium text-default-600 transition-all">
        {label}
      </span>
    </label>
  );
}

function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-divider/70 pt-3">
      <p className="text-xs text-default-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <Button
          isIconOnly
          aria-label="Previous page"
          isDisabled={page <= 1}
          variant="flat"
          onPress={() => onPageChange(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          isIconOnly
          aria-label="Next page"
          isDisabled={page >= totalPages}
          variant="flat"
          onPress={() => onPageChange(page + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

type SubscriptionListSectionProps<T extends { id: string }> = {
  title: string;
  activeCountLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  search: string;
  onSearchChange: (value: string) => void;
  items: T[];
  totalItemsLabel: string;
  renderItem: (item: T) => ReactNode;
};

function SubscriptionListSection<T extends { id: string }>({
  title,
  activeCountLabel,
  emptyTitle,
  emptyDescription,
  search,
  onSearchChange,
  items,
  totalItemsLabel,
  renderItem,
}: SubscriptionListSectionProps<T>) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = items.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-default-500">
          {title}
        </h2>
        <Chip variant="flat">{activeCountLabel}</Chip>
      </div>

      <SearchInput label={`Search ${title.toLowerCase()}`} value={search} onValueChange={onSearchChange} />

      <Card className="border border-divider/70 bg-background/80 shadow-sm">
        <CardBody className="gap-0 p-0">
          {pageItems.length > 0 ? (
            <div className="divide-y divide-divider/70">
              {pageItems.map((item) => (
                <div key={item.id}>{renderItem(item)}</div>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
              <p className="mt-1 text-sm text-default-500">{emptyDescription}</p>
            </div>
          )}
        </CardBody>
      </Card>

      <PaginationControls
        page={safePage}
        totalPages={totalPages}
        onPageChange={setPage}
      />
      <p className="text-xs text-default-500">{totalItemsLabel}</p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
        <CardBody className="gap-5 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Skeleton className="h-20 w-20 rounded-2xl" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-56 rounded-lg" />
              <Skeleton className="h-4 w-72 rounded-lg" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-24 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
                <Skeleton className="h-7 w-28 rounded-full" />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
          <CardBody className="gap-4 p-5 sm:p-6">
            <Skeleton className="h-5 w-40 rounded-lg" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-14 rounded-xl" />
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
          <CardBody className="gap-4 p-5 sm:p-6">
            <Skeleton className="h-5 w-44 rounded-lg" />
            <div className="grid gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-xl" />
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export function ProfilePageContent() {
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [form, setForm] = useState<ProfileFormState>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [unsubscribingId, setUnsubscribingId] = useState<string | null>(null);
  const [topicSearch, setTopicSearch] = useState("");
  const [subtopicSearch, setSubtopicSearch] = useState("");

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
          setForm(buildFormState(payload));
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

  const subscriptionCounts = useMemo(
    () => ({
      topics: profile?.subscriptions.topics.length ?? 0,
      subtopics: profile?.subscriptions.subtopics.length ?? 0,
    }),
    [profile]
  );

  const filteredTopicSubscriptions = useMemo(() => {
    const query = topicSearch.trim().toLowerCase();

    if (!profile) {
      return [];
    }

    return profile.subscriptions.topics.filter((subscription) => {
      if (!query) {
        return true;
      }

      const searchable = [
        subscription.topic.title,
        subscription.topic.slug,
        subscription.topic.description ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [profile, topicSearch]);

  const filteredSubtopicSubscriptions = useMemo(() => {
    const query = subtopicSearch.trim().toLowerCase();

    if (!profile) {
      return [];
    }

    return profile.subscriptions.subtopics.filter((subscription) => {
      if (!query) {
        return true;
      }

      const searchable = [
        subscription.subtopic.title,
        subscription.subtopic.slug,
        subscription.subtopic.description ?? "",
        subscription.topic.title,
        subscription.topic.slug,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [profile, subtopicSearch]);

  function updateField<K extends keyof ProfileFormState>(field: K, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSaveProfile() {
    if (!profile) {
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.user.id,
          ...form,
        }),
      });

      const payload = (await response.json()) as ProfilePayload & {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to save profile.");
      }

      setProfile(payload);
      setForm(buildFormState(payload));
      setStatusMessage("Profile updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save profile.");
    } finally {
      setIsSaving(false);
    }
  }

  async function removeTopicSubscription(subscription: ProfileTopicSubscription) {
    if (!profile) {
      return;
    }

    setUnsubscribingId(subscription.id);
    setStatusMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/topics/${subscription.topic.id}/subscribe`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: profile.user.id,
        }),
      });

      const payload = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update topic subscription.");
      }

      setProfile((current) =>
        current
          ? {
              ...current,
              subscriptions: {
                ...current.subscriptions,
                topics: current.subscriptions.topics.filter(
                  (item) => item.id !== subscription.id
                ),
              },
            }
          : current
      );
      setStatusMessage(`Unsubscribed from ${subscription.topic.title}.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update topic subscription."
      );
    } finally {
      setUnsubscribingId(null);
    }
  }

  async function removeSubtopicSubscription(
    subscription: ProfileSubtopicSubscription
  ) {
    if (!profile) {
      return;
    }

    setUnsubscribingId(subscription.id);
    setStatusMessage(null);
    setError(null);

    try {
      const response = await fetch(
        `/api/subtopics/${subscription.subtopic.id}/subscribe`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: profile.user.id,
          }),
        }
      );

      const payload = (await response.json()) as {
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update subtopic subscription.");
      }

      setProfile((current) =>
        current
          ? {
              ...current,
              subscriptions: {
                ...current.subscriptions,
                subtopics: current.subscriptions.subtopics.filter(
                  (item) => item.id !== subscription.id
                ),
              },
            }
          : current
      );
      setStatusMessage(`Unsubscribed from ${subscription.subtopic.title}.`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update subtopic subscription."
      );
    } finally {
      setUnsubscribingId(null);
    }
  }

  if (isLoading && !profile) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <Card className="border border-dashed border-divider bg-content1">
        <CardBody className="gap-3 p-5">
          <p className="text-sm font-medium text-foreground">Profile unavailable.</p>
          <p className="text-sm text-default-500">
            We could not load the current profile right now.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
      >
        <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
          <CardBody className="gap-5 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar
                size="lg"
                src={profile.user.image || undefined}
                name={initialsFromName(profile.user.name, profile.user.email)}
                showFallback
                className="h-20 w-20 rounded-2xl"
              />

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip color="primary" variant="flat">
                    Profile
                  </Chip>
                  <Chip color="secondary" variant="flat">
                    Subscriptions
                  </Chip>
                  <Chip variant="flat">
                    Updated {new Date(profile.user.updatedAt).toLocaleDateString()}
                  </Chip>
                </div>

                <div className="space-y-1">
                  <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {profile.user.name || "Member profile"}
                  </h1>
                  <p className="max-w-2xl text-sm leading-6 text-default-600 sm:text-base">
                    Edit your basic information and keep track of the topics and
                    subtopics you follow.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard label="Topic subscriptions" value={`${subscriptionCounts.topics}`} />
              <StatCard
                label="Subtopic subscriptions"
                value={`${subscriptionCounts.subtopics}`}
              />
              <StatCard
                label="Identity"
                value={profile.user.email || "No email on file"}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="flex items-center gap-3 rounded-xl border border-divider/70 bg-background/80 p-3">
                <Mail className="h-4 w-4 text-secondary" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-default-500">
                    Email
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {profile.user.email || "No email set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-divider/70 bg-background/80 p-3">
                <UserRound className="h-4 w-4 text-secondary" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-default-500">
                    Name
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {profile.user.givenName || profile.user.surname
                      ? `${profile.user.givenName ?? ""} ${profile.user.surname ?? ""}`.trim()
                      : profile.user.name || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-divider/70 bg-background/80 p-3">
                <Building2 className="h-4 w-4 text-secondary" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-default-500">
                    Company
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {profile.user.companyName || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-divider/70 bg-background/80 p-3">
                <Phone className="h-4 w-4 text-secondary" />
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-default-500">
                    Mobile
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {profile.user.mobilePhone || "Not set"}
                  </p>
                </div>
              </div>
            </div>

            {statusMessage ? (
              <p className="text-sm text-emerald-600">{statusMessage}</p>
            ) : null}
            {error ? <p className="text-sm text-danger-500">{error}</p> : null}
          </CardBody>
        </Card>
      </motion.section>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.05 }}
        >
          <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
            <CardBody className="gap-5 p-5 sm:p-6">
              <div className="space-y-1">
                <Chip color="primary" variant="flat">
                  Basic data
                </Chip>
                <p className="text-sm text-default-600">
                  Update the public-facing profile details that help people
                  recognise you.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FloatingInput
                  label="Display name"
                  value={form.name}
                  onValueChange={(value) => updateField("name", value)}
                />
                <FloatingInput
                  label="Image URL"
                  value={form.image}
                  onValueChange={(value) => updateField("image", value)}
                />
                <FloatingInput
                  label="Given name"
                  value={form.givenName}
                  onValueChange={(value) => updateField("givenName", value)}
                />
                <FloatingInput
                  label="Surname"
                  value={form.surname}
                  onValueChange={(value) => updateField("surname", value)}
                />
                <FloatingInput
                  label="Job title"
                  value={form.jobTitle}
                  onValueChange={(value) => updateField("jobTitle", value)}
                />
                <FloatingInput
                  label="Department"
                  value={form.department}
                  onValueChange={(value) => updateField("department", value)}
                />
                <FloatingInput
                  label="Company"
                  value={form.companyName}
                  onValueChange={(value) => updateField("companyName", value)}
                />
                <FloatingInput
                  label="Office location"
                  value={form.officeLocation}
                  onValueChange={(value) => updateField("officeLocation", value)}
                />
                <FloatingInput
                  label="Mobile phone"
                  value={form.mobilePhone}
                  onValueChange={(value) => updateField("mobilePhone", value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-divider/70 pt-2">
                <Button
                  color="primary"
                  isLoading={isSaving}
                  startContent={<Save className="h-4 w-4" />}
                  onPress={() => void handleSaveProfile()}
                >
                  Save profile
                </Button>
                <Chip variant="flat">
                  {profile.user.email || "Demo profile"}
                </Chip>
              </div>
            </CardBody>
          </Card>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.1 }}
        >
          <Card className="border border-primary/12 bg-content1 shadow-[0_18px_48px_rgb(var(--heroui-colors-primary-500)/0.08)]">
            <CardBody className="gap-5 p-5 sm:p-6">
              <div className="space-y-1">
                <Chip color="secondary" variant="flat">
                  Subscriptions
                </Chip>
                <p className="text-sm text-default-600">
                  Search and manage the topics and subtopics you follow.
                </p>
              </div>

              <SubscriptionListSection
                title="Topics"
                activeCountLabel={`${filteredTopicSubscriptions.length} active`}
                emptyTitle="No topic subscriptions yet."
                emptyDescription="Explore topics to start following conversations that matter to you."
                search={topicSearch}
                onSearchChange={setTopicSearch}
                items={filteredTopicSubscriptions}
                totalItemsLabel={`${subscriptionCounts.topics} total topic subscriptions`}
                renderItem={(subscription) => (
                  <div
                    key={subscription.id}
                    className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-end"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {subscription.topic.title}
                        </p>
                        <Chip size="sm" variant="flat">
                          Topic
                        </Chip>
                      </div>
                      <p className="truncate text-xs text-default-500">
                        /{subscription.topic.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <Button
                        as={Link}
                        aria-label={`Open ${subscription.topic.title}`}
                        href={`/topics/${subscription.topic.id}`}
                        isIconOnly
                        variant="flat"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                      <Button
                        aria-label={`Unsubscribe from ${subscription.topic.title}`}
                        color="danger"
                        isIconOnly
                        isLoading={unsubscribingId === subscription.id}
                        variant="flat"
                        onPress={() => void removeTopicSubscription(subscription)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              />

              <Divider />

              <SubscriptionListSection
                title="Subtopics"
                activeCountLabel={`${filteredSubtopicSubscriptions.length} active`}
                emptyTitle="No subtopic subscriptions yet."
                emptyDescription="Pick subtopics from a topic page to narrow the conversations you see."
                search={subtopicSearch}
                onSearchChange={setSubtopicSearch}
                items={filteredSubtopicSubscriptions}
                totalItemsLabel={`${subscriptionCounts.subtopics} total subtopic subscriptions`}
                renderItem={(subscription) => (
                  <div
                    key={subscription.id}
                    className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-end"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {subscription.subtopic.title}
                        </p>
                        <Chip size="sm" variant="flat">
                          {subscription.topic.title}
                        </Chip>
                      </div>
                      <p className="truncate text-xs text-default-500">
                        /{subscription.subtopic.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <Button
                        as={Link}
                        aria-label={`Open ${subscription.subtopic.title}`}
                        href={`/topics/${subscription.topic.id}`}
                        isIconOnly
                        variant="flat"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Button>
                      <Button
                        aria-label={`Unsubscribe from ${subscription.subtopic.title}`}
                        color="danger"
                        isIconOnly
                        isLoading={unsubscribingId === subscription.id}
                        variant="flat"
                        onPress={() => void removeSubtopicSubscription(subscription)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              />
            </CardBody>
          </Card>
        </motion.section>
      </div>
    </div>
  );
}
