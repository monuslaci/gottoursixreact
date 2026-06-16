"use client";

import { Button, Card, CardBody, Chip, Skeleton } from "@heroui/react";
import { motion } from "framer-motion";
import { FileText, MessageSquareText, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import type { MyPostActivityItem, MyPostActivityPayload } from "@/lib/community";
import { useUserProfile } from "@/lib/hooks/useUserProfile";

const ACTIVITY_PAGE_SIZE = 10;

function formatDateTime(value: string) {
  return new Date(value).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function truncateWords(value: string, limit: number) {
  const words = value.trim().split(/\s+/);

  if (words.length <= limit) {
    return value;
  }

  return `${words.slice(0, limit).join(" ")}...`;
}

function buildPostActivityHref(item: MyPostActivityItem) {
  if (!item.topic?.id) {
    return "/activity";
  }

  return `/topics/${item.topic.id}#post-${item.id}`;
}

export function ActivityPageContent() {
  const router = useRouter();
  const { user, isLoading: isLoadingProfile } = useUserProfile();
  const [activity, setActivity] = useState<MyPostActivityPayload>({
    posts: [],
    comments: [],
  });
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [activitySearch, setActivitySearch] = useState("");
  const [postsPage, setPostsPage] = useState(1);
  const [commentsPage, setCommentsPage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const filteredActivity = useMemo(() => {
    const query = activitySearch.trim().toLowerCase();

    if (!query) {
      return activity;
    }

    function matches(item: MyPostActivityItem) {
      const searchable = [
        item.body,
        item.topic?.title ?? "",
        item.topic?.slug ?? "",
        item.subtopic?.title ?? "",
        item.subtopic?.slug ?? "",
        item.parentPost?.body ?? "",
        item.parentPost?.author?.username ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    }

    return {
      posts: activity.posts.filter(matches),
      comments: activity.comments.filter(matches),
    };
  }, [activity, activitySearch]);

  const totalPostsPages = Math.max(
    1,
    Math.ceil(filteredActivity.posts.length / ACTIVITY_PAGE_SIZE)
  );
  const totalCommentsPages = Math.max(
    1,
    Math.ceil(filteredActivity.comments.length / ACTIVITY_PAGE_SIZE)
  );
  const safePostsPage = Math.min(postsPage, totalPostsPages);
  const safeCommentsPage = Math.min(commentsPage, totalCommentsPages);
  const visiblePosts = filteredActivity.posts.slice(
    (safePostsPage - 1) * ACTIVITY_PAGE_SIZE,
    safePostsPage * ACTIVITY_PAGE_SIZE
  );
  const visibleComments = filteredActivity.comments.slice(
    (safeCommentsPage - 1) * ACTIVITY_PAGE_SIZE,
    safeCommentsPage * ACTIVITY_PAGE_SIZE
  );

  useEffect(() => {
    setPostsPage(1);
    setCommentsPage(1);
  }, [activitySearch]);

  useEffect(() => {
    let isMounted = true;

    async function loadActivity() {
      if (!user?.id) {
        if (isMounted) {
          setActivity({
            posts: [],
            comments: [],
          });
          setIsLoadingActivity(false);
        }
        return;
      }

      try {
        setIsLoadingActivity(true);
        setError(null);

        const response = await fetch("/api/me/post-activity", {
          cache: "no-store",
        });

        const payload = (await response.json()) as MyPostActivityPayload & {
          error?: string;
        };

        if (!response.ok) {
          throw new Error(payload.error || "Unable to load your post activity.");
        }

        if (isMounted) {
          setActivity({
            posts: payload.posts ?? [],
            comments: payload.comments ?? [],
          });
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Unable to load your post activity."
          );
        }
      } finally {
        if (isMounted) {
          setIsLoadingActivity(false);
        }
      }
    }

    if (!isLoadingProfile) {
      void loadActivity();
    }

    return () => {
      isMounted = false;
    };
  }, [isLoadingProfile, user?.id]);

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24 }}
      >
        <Card className="internal-card internal-card--strong">
          <CardBody className="gap-5 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Chip color="primary" variant="flat">
                Activity
              </Chip>
              <Chip
                variant="flat"
                className="bg-brotherhood-bronze/12 text-brotherhood-bronze"
              >
                Newest first
              </Chip>
            </div>

            <div className="space-y-3">
              <h1 className="text-2xl font-semibold sm:text-3xl">Your post activity.</h1>
              <p className="max-w-2xl text-sm leading-6 text-default-600 sm:text-base">
                Review your latest posts and your comments on other members&apos; posts,
                then jump straight back into the thread you want.
              </p>
            </div>

            <label className="group relative block w-full">
              <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-default-400" />
              <input
                aria-label="Search your post activity"
                className="internal-field h-12 w-full pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-transparent focus:border-primary/40"
                placeholder=" "
                value={activitySearch}
                onChange={(event) => setActivitySearch(event.target.value)}
              />
              <span className="pointer-events-none absolute left-11 top-2 text-xs font-medium text-default-600 transition-all">
                Search your posts and comments
              </span>
            </label>
          </CardBody>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, delay: 0.05 }}
      >
        <div className="grid gap-4 xl:grid-cols-2">
          <Card className="internal-card">
            <CardBody className="gap-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-secondary" />
                  <h2 className="text-lg font-semibold">My posts</h2>
                </div>
                <Chip variant="flat">{filteredActivity.posts.length}</Chip>
              </div>

              <div className="grid gap-3">
                {isLoadingActivity ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-28 rounded-2xl" />
                  ))
                ) : visiblePosts.length > 0 ? (
                  visiblePosts.map((post) => (
                    <button
                      key={post.id}
                      type="button"
                      className="rounded-2xl border border-divider/70 bg-content1/80 p-4 text-left transition hover:border-primary/30 hover:bg-primary/5"
                      onClick={() => router.push(buildPostActivityHref(post))}
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs text-default-500">
                        {post.topic ? (
                          <span className="font-medium text-foreground">{post.topic.title}</span>
                        ) : null}
                        {post.subtopic ? (
                          <Chip size="sm" variant="flat">
                            {post.subtopic.title}
                          </Chip>
                        ) : null}
                        <span>{formatDateTime(post.createdAt)}</span>
                        {post.isEdited ? <span>Edited</span> : null}
                      </div>
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-default-700">
                        {truncateWords(post.body, 40)}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="internal-empty p-4">
                    <p className="text-sm font-medium text-foreground">No posts yet.</p>
                    <p className="mt-1 text-sm text-default-500">
                      Your topic posts will appear here.
                    </p>
                  </div>
                )}
              </div>

              {!isLoadingActivity && filteredActivity.posts.length > ACTIVITY_PAGE_SIZE ? (
                <div className="flex items-center justify-between gap-3 border-t border-divider/70 pt-3">
                  <p className="text-xs text-default-500">
                    Page {safePostsPage} of {totalPostsPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      isDisabled={safePostsPage <= 1}
                      variant="flat"
                      onPress={() => setPostsPage((current) => Math.max(1, current - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      isDisabled={safePostsPage >= totalPostsPages}
                      variant="flat"
                      onPress={() =>
                        setPostsPage((current) => Math.min(totalPostsPages, current + 1))
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardBody>
          </Card>

          <Card className="internal-card">
            <CardBody className="gap-4 p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="h-5 w-5 text-secondary" />
                  <h2 className="text-lg font-semibold">My comments</h2>
                </div>
                <Chip variant="flat">{filteredActivity.comments.length}</Chip>
              </div>

              <div className="grid gap-3">
                {isLoadingActivity ? (
                  Array.from({ length: 3 }).map((_, index) => (
                    <Skeleton key={index} className="h-32 rounded-2xl" />
                  ))
                ) : visibleComments.length > 0 ? (
                  visibleComments.map((comment) => (
                    <button
                      key={comment.id}
                      type="button"
                      className="rounded-2xl border border-divider/70 bg-content1/80 p-4 text-left transition hover:border-primary/30 hover:bg-primary/5"
                      onClick={() => router.push(buildPostActivityHref(comment))}
                    >
                      <div className="flex flex-wrap items-center gap-2 text-xs text-default-500">
                        {comment.topic ? (
                          <span className="font-medium text-foreground">
                            {comment.topic.title}
                          </span>
                        ) : null}
                        {comment.subtopic ? (
                          <Chip size="sm" variant="flat">
                            {comment.subtopic.title}
                          </Chip>
                        ) : null}
                        <span>{formatDateTime(comment.createdAt)}</span>
                        {comment.isEdited ? <span>Edited</span> : null}
                      </div>
                      {comment.parentPost ? (
                        <p className="mt-2 text-xs leading-5 text-default-500">
                          In reply to {comment.parentPost.author?.username ?? "member"}:{" "}
                          {truncateWords(comment.parentPost.body, 18)}
                        </p>
                      ) : null}
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-default-700">
                        {truncateWords(comment.body, 40)}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="internal-empty p-4">
                    <p className="text-sm font-medium text-foreground">
                      No comments yet.
                    </p>
                    <p className="mt-1 text-sm text-default-500">
                      Your replies will appear here.
                    </p>
                  </div>
                )}
              </div>

              {!isLoadingActivity &&
              filteredActivity.comments.length > ACTIVITY_PAGE_SIZE ? (
                <div className="flex items-center justify-between gap-3 border-t border-divider/70 pt-3">
                  <p className="text-xs text-default-500">
                    Page {safeCommentsPage} of {totalCommentsPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      isDisabled={safeCommentsPage <= 1}
                      variant="flat"
                      onPress={() =>
                        setCommentsPage((current) => Math.max(1, current - 1))
                      }
                    >
                      Previous
                    </Button>
                    <Button
                      isDisabled={safeCommentsPage >= totalCommentsPages}
                      variant="flat"
                      onPress={() =>
                        setCommentsPage((current) =>
                          Math.min(totalCommentsPages, current + 1)
                        )
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </CardBody>
          </Card>
        </div>
      </motion.section>

      {error ? <p className="text-sm text-danger-500">{error}</p> : null}
    </div>
  );
}
