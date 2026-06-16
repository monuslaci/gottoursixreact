"use client";

import { Avatar, Button, Card, CardBody, Chip } from "@heroui/react";
import {
  ArrowLeft,
  ChevronRight,
  Pencil,
  Hash,
  Heart,
  MessageSquareText,
  Reply,
  Search,
  Send,
  Users,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { EmojiComposer } from "@/components/common/emoji-composer";
import { SuggestionModal } from "@/components/topics/suggestion-modal";
import type { TopicDetailItem, TopicPostItem } from "@/lib/community";
import { useUserProfile } from "@/lib/hooks/useUserProfile";

type TopicDetailPageContentProps = {
  topic: TopicDetailItem;
  posts: TopicPostItem[];
};

type SubtopicCountMap = Record<string, number>;
type ReplyDraftMap = Record<string, string>;
type LoadingMap = Record<string, boolean>;
type EditDraftMap = Record<string, string>;

function countPostsForSubtopic(posts: TopicPostItem[], subtopicId: string): number {
  return posts.reduce((count, post) => {
    const matchesSubtopic = post.subtopic?.id === subtopicId ? 1 : 0;

    return count + matchesSubtopic + countPostsForSubtopic(post.replies, subtopicId);
  }, 0);
}

function updatePostsForAuthor(
  posts: TopicPostItem[],
  user: {
    id: string;
    username: string;
    image: string | null;
  }
): TopicPostItem[] {
  return posts.map((post) => ({
    ...post,
    author:
      post.author?.id === user.id
        ? {
            ...post.author,
            username: user.username,
            image: user.image,
          }
        : post.author,
    replies: updatePostsForAuthor(post.replies, user),
  }));
}

function insertReplyIntoPosts(
  posts: TopicPostItem[],
  parentPostId: string,
  reply: TopicPostItem
): TopicPostItem[] {
  return posts.map((post) => {
    if (post.id === parentPostId) {
      return {
        ...post,
        replyCount: post.replyCount + 1,
        replies: [reply, ...post.replies],
      };
    }

    return {
      ...post,
      replies: insertReplyIntoPosts(post.replies, parentPostId, reply),
    };
  });
}

function updatePostInTree(
  posts: TopicPostItem[],
  postId: string,
  updater: (post: TopicPostItem) => TopicPostItem
): TopicPostItem[] {
  return posts.map((post) => {
    if (post.id === postId) {
      return updater(post);
    }

    return {
      ...post,
      replies: updatePostInTree(post.replies, postId, updater),
    };
  });
}

function filterPostsBySubtopic(
  posts: TopicPostItem[],
  subtopicId: string
): TopicPostItem[] {
  return posts
    .filter((post) => post.subtopic?.id === subtopicId)
    .map((post) => ({
      ...post,
      replies: filterPostsBySubtopic(post.replies, subtopicId),
    }));
}

export function TopicDetailPageContent({
  topic,
  posts,
}: TopicDetailPageContentProps) {
  const { user } = useUserProfile();
  const [postsState, setPostsState] = useState(posts);
  const [subtopicQuery, setSubtopicQuery] = useState("");
  const [activeSubtopicId, setActiveSubtopicId] = useState<string>("all");
  const [postBody, setPostBody] = useState("");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [activeEditPostId, setActiveEditPostId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<ReplyDraftMap>({});
  const [editDrafts, setEditDrafts] = useState<EditDraftMap>({});
  const [replyLoadingByPostId, setReplyLoadingByPostId] = useState<LoadingMap>({});
  const [editLoadingByPostId, setEditLoadingByPostId] = useState<LoadingMap>({});
  const [likeLoadingByPostId, setLikeLoadingByPostId] = useState<LoadingMap>({});
  const [topicSubscriptionState, setTopicSubscriptionState] = useState({
    isSubscribed: false,
    isLoading: true,
  });
  const [subtopicSubscriptionState, setSubtopicSubscriptionState] = useState<
    Record<string, boolean>
  >({});
  const [subtopicSubscriptionLoading, setSubtopicSubscriptionLoading] = useState<
    Record<string, boolean>
  >({});
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [postError, setPostError] = useState<string | null>(null);

  const subtopicCounts = useMemo(() => {
    return topic.subtopics.reduce<SubtopicCountMap>((accumulator, subtopic) => {
      accumulator[subtopic.id] = countPostsForSubtopic(postsState, subtopic.id);
      return accumulator;
    }, {});
  }, [postsState, topic.subtopics]);

  useEffect(() => {
    setPostsState(posts);
  }, [posts]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    setPostsState((current) =>
      updatePostsForAuthor(current, {
        id: user.id,
        username: user.username,
        image: user.image,
      })
    );
  }, [user?.id, user?.image, user?.username]);

  const filteredSubtopics = topic.subtopics.filter((subtopic) => {
    if (!subtopicQuery.trim()) {
      return true;
    }

    const searchable = [
      subtopic.title,
      subtopic.slug,
      subtopic.description ?? "",
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(subtopicQuery.trim().toLowerCase());
  });

  const activeSubtopic =
    activeSubtopicId === "all"
      ? null
      : topic.subtopics.find((subtopic) => subtopic.id === activeSubtopicId) ?? null;

  const visiblePosts =
    activeSubtopicId === "all"
      ? postsState
      : filterPostsBySubtopic(postsState, activeSubtopicId);

  useEffect(() => {
    setPostBody("");
    setPostError(null);
    setActiveReplyPostId(null);
    setActiveEditPostId(null);
  }, [activeSubtopicId]);

  useEffect(() => {
    let isMounted = true;

    async function loadSubscriptionState() {
      const email = user?.email;

      if (!email) {
        if (isMounted) {
          setTopicSubscriptionState({
            isSubscribed: false,
            isLoading: false,
          });
          setSubtopicSubscriptionState({});
          setSubtopicSubscriptionLoading({});
        }
        return;
      }

      try {
        setSubscriptionError(null);

        const [topicResponse, ...subtopicResponses] = await Promise.all([
          fetch(`/api/topics/${topic.id}/subscribe?userEmail=${encodeURIComponent(email)}`, {
            cache: "no-store",
          }),
          ...topic.subtopics.map((subtopic) =>
            fetch(
              `/api/subtopics/${subtopic.id}/subscribe?userEmail=${encodeURIComponent(
                email
              )}`,
              {
                cache: "no-store",
              }
            )
          ),
        ]);

        const topicPayload = (await topicResponse.json()) as {
          isSubscribed?: boolean;
          error?: string;
        };

        if (!topicResponse.ok) {
          throw new Error(topicPayload.error || "Unable to load topic subscription.");
        }

        const nextSubtopicState: Record<string, boolean> = {};

        for (let index = 0; index < subtopicResponses.length; index += 1) {
          const response = subtopicResponses[index];
          const subtopic = topic.subtopics[index];
          const payload = (await response.json()) as {
            isSubscribed?: boolean;
            error?: string;
          };

          if (!response.ok) {
            throw new Error(payload.error || "Unable to load subtopic subscription.");
          }

          nextSubtopicState[subtopic.id] = Boolean(payload.isSubscribed);
        }

        if (isMounted) {
          setTopicSubscriptionState({
            isSubscribed: Boolean(topicPayload.isSubscribed),
            isLoading: false,
          });
          setSubtopicSubscriptionState(nextSubtopicState);
        }
      } catch (error) {
        if (isMounted) {
          setSubscriptionError(
            error instanceof Error
              ? error.message
              : "Unable to load subscription state."
          );
          setTopicSubscriptionState((current) => ({
            ...current,
            isLoading: false,
          }));
        }
      }
    }

    void loadSubscriptionState();

    return () => {
      isMounted = false;
    };
  }, [topic.id, topic.subtopics, user?.email]);

  async function toggleTopicSubscription() {
    const email = user?.email;

    if (!email) {
      setSubscriptionError("A member profile is required to subscribe.");
      return;
    }

    setSubscriptionError(null);

    try {
      const method = topicSubscriptionState.isSubscribed ? "DELETE" : "POST";
      const response = await fetch(`/api/topics/${topic.id}/subscribe`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: email,
        }),
      });

      const payload = (await response.json()) as {
        isSubscribed?: boolean;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update topic subscription.");
      }

      setTopicSubscriptionState({
        isSubscribed:
          typeof payload.isSubscribed === "boolean"
            ? payload.isSubscribed
            : !topicSubscriptionState.isSubscribed,
        isLoading: false,
      });
    } catch (error) {
      setSubscriptionError(
        error instanceof Error
          ? error.message
          : "Unable to update topic subscription."
      );
    }
  }

  async function toggleSubtopicSubscription(subtopicId: string) {
    const email = user?.email;

    if (!email) {
      setSubscriptionError("A member profile is required to subscribe.");
      return;
    }

    setSubscriptionError(null);
    setSubtopicSubscriptionLoading((current) => ({
      ...current,
      [subtopicId]: true,
    }));

    try {
      const method = subtopicSubscriptionState[subtopicId] ? "DELETE" : "POST";
      const response = await fetch(`/api/subtopics/${subtopicId}/subscribe`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: email,
        }),
      });

      const payload = (await response.json()) as {
        isSubscribed?: boolean;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update subtopic subscription.");
      }

      setSubtopicSubscriptionState((current) => ({
        ...current,
        [subtopicId]:
          typeof payload.isSubscribed === "boolean"
            ? payload.isSubscribed
            : !current[subtopicId],
      }));
    } catch (error) {
      setSubscriptionError(
        error instanceof Error
          ? error.message
          : "Unable to update subtopic subscription."
      );
    } finally {
      setSubtopicSubscriptionLoading((current) => ({
        ...current,
        [subtopicId]: false,
      }));
    }
  }

  async function createPost() {
    if (!activeSubtopic) {
      setPostError("Select a subtopic before posting.");
      return;
    }

    if (!user?.id) {
      setPostError("A member profile is required to create a post.");
      return;
    }

    const trimmedBody = postBody.trim();

    if (!trimmedBody) {
      setPostError("Write something before posting.");
      return;
    }

    setIsCreatingPost(true);
    setPostError(null);

    try {
      const response = await fetch(`/api/subtopics/${activeSubtopic.id}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: trimmedBody,
          authorId: user.id,
        }),
      });

      const payload = (await response.json()) as {
        post?: TopicPostItem;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to create post.");
      }

      if (payload.post) {
        setPostsState((current) => [payload.post!, ...current]);
      }

      setPostBody("");
    } catch (error) {
      setPostError(error instanceof Error ? error.message : "Unable to create post.");
    } finally {
      setIsCreatingPost(false);
    }
  }

  async function togglePostLike(post: TopicPostItem) {
    if (!user?.id) {
      setPostError("A member profile is required to like a post.");
      return;
    }

    setPostError(null);
    setLikeLoadingByPostId((current) => ({
      ...current,
      [post.id]: true,
    }));

    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: post.likedByMe ? "DELETE" : "POST",
      });

      const payload = (await response.json()) as {
        liked?: boolean;
        likeCount?: number;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update post like.");
      }

      setPostsState((current) =>
        updatePostInTree(current, post.id, (currentPost) => ({
          ...currentPost,
          likedByMe:
            typeof payload.liked === "boolean" ? payload.liked : !currentPost.likedByMe,
          likeCount:
            typeof payload.likeCount === "number"
              ? payload.likeCount
              : currentPost.likeCount,
        }))
      );
    } catch (error) {
      setPostError(
        error instanceof Error ? error.message : "Unable to update post like."
      );
    } finally {
      setLikeLoadingByPostId((current) => ({
        ...current,
        [post.id]: false,
      }));
    }
  }

  function toggleReplyEditor(postId: string) {
    setPostError(null);
    setActiveEditPostId(null);
    setActiveReplyPostId((current) => (current === postId ? null : postId));
  }

  function toggleEditEditor(post: TopicPostItem) {
    setPostError(null);
    setActiveReplyPostId(null);
    setEditDrafts((current) => ({
      ...current,
      [post.id]: current[post.id] ?? post.body,
    }));
    setActiveEditPostId((current) => (current === post.id ? null : post.id));
  }

  async function createReply(post: TopicPostItem) {
    if (!user?.id) {
      setPostError("A member profile is required to reply.");
      return;
    }

    const draft = replyDrafts[post.id] ?? "";
    const trimmedBody = draft.trim();

    if (!trimmedBody) {
      setPostError("Write something before replying.");
      return;
    }

    setPostError(null);
    setReplyLoadingByPostId((current) => ({
      ...current,
      [post.id]: true,
    }));

    try {
      const endpoint = post.subtopic
        ? `/api/subtopics/${post.subtopic.id}/posts`
        : `/api/topics/${topic.id}/posts`;

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: trimmedBody,
          authorId: user.id,
          parentPostId: post.id,
        }),
      });

      const payload = (await response.json()) as {
        post?: TopicPostItem;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to create reply.");
      }

      if (payload.post) {
        setPostsState((current) => insertReplyIntoPosts(current, post.id, payload.post!));
      }

      setReplyDrafts((current) => ({
        ...current,
        [post.id]: "",
      }));
      setActiveReplyPostId(null);
    } catch (error) {
      setPostError(error instanceof Error ? error.message : "Unable to create reply.");
    } finally {
      setReplyLoadingByPostId((current) => ({
        ...current,
        [post.id]: false,
      }));
    }
  }

  async function savePostEdit(post: TopicPostItem) {
    if (!user?.id) {
      setPostError("A member profile is required to edit a post.");
      return;
    }

    const draft = editDrafts[post.id] ?? post.body;
    const trimmedBody = draft.trim();

    if (!trimmedBody) {
      setPostError("Write something before saving.");
      return;
    }

    if (trimmedBody === post.body.trim()) {
      setActiveEditPostId(null);
      return;
    }

    setPostError(null);
    setEditLoadingByPostId((current) => ({
      ...current,
      [post.id]: true,
    }));

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: trimmedBody,
        }),
      });

      const payload = (await response.json()) as {
        post?: TopicPostItem;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(payload.error || "Unable to update post.");
      }

      if (payload.post) {
        setPostsState((current) =>
          updatePostInTree(current, post.id, (currentPost) => ({
            ...payload.post!,
            replies: currentPost.replies,
          }))
        );
      }

      setEditDrafts((current) => ({
        ...current,
        [post.id]: trimmedBody,
      }));
      setActiveEditPostId(null);
    } catch (error) {
      setPostError(error instanceof Error ? error.message : "Unable to update post.");
    } finally {
      setEditLoadingByPostId((current) => ({
        ...current,
        [post.id]: false,
      }));
    }
  }

  function renderPostThread(post: TopicPostItem, depth = 0): ReactNode {
    const isReplyEditorOpen = activeReplyPostId === post.id;
    const isEditEditorOpen = activeEditPostId === post.id;
    const replyDraft = replyDrafts[post.id] ?? "";
    const editDraft = editDrafts[post.id] ?? post.body;
    const isLikeLoading = likeLoadingByPostId[post.id] ?? false;
    const isReplyLoading = replyLoadingByPostId[post.id] ?? false;
    const isEditLoading = editLoadingByPostId[post.id] ?? false;
    const canEditPost = post.author?.id === user?.id;

    return (
      <div
        key={post.id}
        id={`post-${post.id}`}
        className={depth > 0 ? "scroll-mt-24 border-l border-divider/70 pl-4 sm:pl-5" : "scroll-mt-24"}
      >
        <Card className="internal-card">
          <CardBody className="gap-4 p-4">
            <div className="flex items-start gap-3">
              {post.author?.username ? (
                <Link href={`/members/${encodeURIComponent(post.author.username)}`}>
                  <Avatar
                    size="sm"
                    src={post.author.image || undefined}
                    name={post.author.username.slice(0, 1).toUpperCase()}
                    showFallback
                    className="mt-0.5 shrink-0"
                  />
                </Link>
              ) : (
                <Avatar
                  size="sm"
                  src={post.author?.image || undefined}
                  name={post.author?.username?.slice(0, 1).toUpperCase() || "U"}
                  showFallback
                  className="mt-0.5 shrink-0"
                />
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-default-500">
                  {post.author?.username ? (
                    <Link
                      className="font-medium text-foreground transition hover:text-primary hover:underline"
                      href={`/members/${encodeURIComponent(
                        post.author.username
                      )}`}
                    >
                      {post.author.username}
                    </Link>
                  ) : (
                    <span className="font-medium text-foreground">Unknown member</span>
                  )}
                  {post.subtopic ? (
                    <Chip size="sm" variant="flat">
                      {post.subtopic.title}
                    </Chip>
                  ) : null}
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  {post.isEdited ? <span>Edited</span> : null}
                </div>

                {isEditEditorOpen ? (
                  <div className="mt-4">
                    <EmojiComposer
                      actionLabel="Save edit"
                      actionIcon={<Pencil className="h-4 w-4" />}
                      value={editDraft}
                      onValueChange={(value) =>
                        setEditDrafts((current) => ({
                          ...current,
                          [post.id]: value,
                        }))
                      }
                      onAction={() => savePostEdit(post)}
                      isActionLoading={isEditLoading}
                      label="Edit your post"
                      minRows={4}
                      helperText="Once saved, the thread will show that this post was edited."
                      footerNote="Keep the conversation clear and supportive."
                    />
                  </div>
                ) : (
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-default-700">
                    {post.body}
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    variant={post.likedByMe ? "solid" : "flat"}
                    color={post.likedByMe ? "danger" : "default"}
                    isLoading={isLikeLoading}
                    startContent={
                      <Heart
                        className={`h-4 w-4 ${
                          post.likedByMe ? "fill-current" : ""
                        }`}
                      />
                    }
                    onPress={() => void togglePostLike(post)}
                  >
                    {post.likedByMe ? "Liked" : "Like"} {post.likeCount}
                  </Button>

                  <Button
                    size="sm"
                    variant={isReplyEditorOpen ? "solid" : "flat"}
                    color={isReplyEditorOpen ? "secondary" : "default"}
                    startContent={<Reply className="h-4 w-4" />}
                    onPress={() => toggleReplyEditor(post.id)}
                  >
                    {isReplyEditorOpen ? "Close reply" : "Reply"}
                  </Button>

                  {canEditPost ? (
                    <Button
                      size="sm"
                      variant={isEditEditorOpen ? "solid" : "flat"}
                      color={isEditEditorOpen ? "secondary" : "default"}
                      startContent={<Pencil className="h-4 w-4" />}
                      onPress={() => toggleEditEditor(post)}
                    >
                      {isEditEditorOpen ? "Close edit" : "Edit"}
                    </Button>
                  ) : null}

                  <div className="flex items-center gap-2 text-xs text-default-500">
                    <MessageSquareText className="h-4 w-4" />
                    <span>{post.replyCount} replies</span>
                  </div>
                </div>

                {isReplyEditorOpen && !isEditEditorOpen ? (
                  <div className="mt-4">
                    <EmojiComposer
                      actionLabel="Send reply"
                      actionIcon={<Send className="h-4 w-4" />}
                      value={replyDraft}
                      onValueChange={(value) =>
                        setReplyDrafts((current) => ({
                          ...current,
                          [post.id]: value,
                        }))
                      }
                      onAction={() => createReply(post)}
                      isActionLoading={isReplyLoading}
                      label={`Reply to ${post.author?.username ?? "member"}`}
                      minRows={4}
                      helperText="Your reply stays right inside this thread."
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </CardBody>
        </Card>

        {post.replies.length > 0 ? (
          <div className="mt-3 space-y-3">
            {post.replies.map((reply) => renderPostThread(reply, depth + 1))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          as={Link}
          href="/topics"
          variant="flat"
          startContent={<ArrowLeft size={16} />}
        >
          Back to topics
        </Button>
        <Chip color="primary" variant="flat">
          Topic detail
        </Chip>
      </div>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="internal-card internal-card--strong">
          <CardBody className="gap-3 p-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-secondary/12 p-3 text-secondary">
                <Hash className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.16em] text-secondary">
                  /{topic.slug}
                </p>
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {topic.title}
                </h1>
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-default-600 sm:text-base">
              {topic.description || "A discussion space ready for the next conversation."}
            </p>

            <div className="flex flex-wrap gap-2">
              {topic.tags.length > 0 ? (
                topic.tags.map((tag) => (
                  <Chip key={`${topic.id}-${tag}`} size="sm" variant="flat">
                    {tag}
                  </Chip>
                ))
              ) : (
                <Chip size="sm" variant="flat">
                  No tags yet
                </Chip>
              )}
            </div>

            <div className="grid gap-2.5 sm:grid-cols-3">
              {[
                ["Subtopics", `${topic.counts.subtopics}`],
                ["Posts", `${topic.counts.posts}`],
                ["Subscribers", `${topic.counts.subscriptions}`],
              ].map(([label, value]) => (
                <div key={label} className="internal-stat p-3.5">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-secondary">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-divider/70 pt-2">
              <Button
                color={topicSubscriptionState.isSubscribed ? "secondary" : "primary"}
                isLoading={topicSubscriptionState.isLoading}
                onPress={() => void toggleTopicSubscription()}
              >
                {topicSubscriptionState.isSubscribed
                  ? "Subscribed to topic"
                  : "Subscribe to topic"}
              </Button>
              <Chip variant="flat">
                {topicSubscriptionState.isSubscribed
                  ? "You will follow topic updates"
                  : "Follow this topic for updates"}
              </Chip>
            </div>
          </CardBody>
        </Card>

        <Card className="internal-card internal-card--strong">
          <CardBody className="gap-3 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                <h2 className="text-lg font-semibold">Subtopics</h2>
              </div>
              <Button
                size="sm"
                variant={activeSubtopicId === "all" ? "solid" : "flat"}
                onPress={() => setActiveSubtopicId("all")}
              >
                All
              </Button>
            </div>

            <label className="group relative block w-full">
              <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-default-400" />
              <input
                aria-label="Search subtopics"
                className="internal-field h-12 w-full pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-default-400 focus:border-primary/40"
                placeholder="Search subtopics"
                value={subtopicQuery}
                onChange={(event) => setSubtopicQuery(event.target.value)}
              />
            </label>

            <div className="grid gap-2">
              {filteredSubtopics.length > 0 ? (
                filteredSubtopics.map((subtopic) => {
                  const isActive = activeSubtopicId === subtopic.id;
                  const postCount = subtopicCounts[subtopic.id] ?? 0;
                  const isSubscribed = subtopicSubscriptionState[subtopic.id] ?? false;
                  const isLoadingSubscription =
                    subtopicSubscriptionLoading[subtopic.id] ?? false;

                  return (
                    <Card
                      key={subtopic.id}
                      className={`internal-card transition ${
                        isActive
                          ? "border-primary/30 bg-primary/5"
                          : "border-divider bg-content1/80"
                      }`}
                    >
                      <CardBody className="gap-3 p-3">
                        <button
                          className="flex items-start justify-between gap-2 text-left"
                          type="button"
                          onClick={() => setActiveSubtopicId(subtopic.id)}
                        >
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-foreground">
                                {subtopic.title}
                              </p>
                              <Chip size="sm" variant="flat">
                                {postCount} posts
                              </Chip>
                            </div>
                            <p className="truncate text-xs text-default-500">
                              /{subtopic.slug}
                            </p>
                            <p className="line-clamp-2 text-sm text-default-600">
                              {subtopic.description || "No description provided."}
                            </p>
                          </div>
                          <ChevronRight
                            className={`mt-1 h-4 w-4 shrink-0 ${
                              isActive ? "text-primary" : "text-default-400"
                            }`}
                          />
                        </button>

                        <div className="flex items-center justify-between gap-3 border-t border-divider/60 pt-2">
                          <Chip size="sm" variant="flat">
                            {isSubscribed ? "Subscribed" : "Not subscribed"}
                          </Chip>
                          <Button
                            size="sm"
                            color={isSubscribed ? "secondary" : "primary"}
                            isLoading={isLoadingSubscription}
                            onPress={() => void toggleSubtopicSubscription(subtopic.id)}
                          >
                            {isSubscribed ? "Subscribed" : "Subscribe"}
                          </Button>
                        </div>
                      </CardBody>
                    </Card>
                  );
                })
              ) : (
                <p className="text-sm text-default-600">No subtopics match that search.</p>
              )}
            </div>
          </CardBody>
        </Card>
      </section>

      {subscriptionError ? <p className="text-sm text-danger-500">{subscriptionError}</p> : null}

      <div className="flex flex-wrap justify-end">
        <SuggestionModal
          kind="SUBTOPIC"
          topicId={topic.id}
          topicTitle={topic.title}
          buttonLabel="Suggest a subtopic"
          title="Suggest a subtopic"
          description="Send a subtopic idea for this topic to the admins."
        />
      </div>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold">
              {activeSubtopic ? `Posts in ${activeSubtopic.title}` : "Recent posts"}
            </h2>
            <p className="text-sm text-default-500">
              Like what helps, and reply directly under any post to keep the thread easy to
              follow.
            </p>
          </div>

          {activeSubtopic ? (
            <Button variant="flat" onPress={() => setActiveSubtopicId("all")}>
              Show all posts
            </Button>
          ) : (
            <p className="text-sm text-default-500">{visiblePosts.length} posts</p>
          )}
        </div>

        {activeSubtopic ? (
          <Card className="internal-card internal-card--strong">
            <CardBody className="gap-4 p-4 sm:p-5">
              <EmojiComposer
                actionLabel="Post in subtopic"
                actionIcon={<Send className="h-4 w-4" />}
                value={postBody}
                onValueChange={setPostBody}
                onAction={createPost}
                isActionLoading={isCreatingPost}
                label="Write your post"
                minRows={6}
                helperText="Your post will appear under this subtopic and be visible in the topic feed."
                topSlot={
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-[0.16em] text-secondary">
                        New post
                      </p>
                      <h3 className="text-base font-semibold text-foreground">
                        Post in {activeSubtopic.title}
                      </h3>
                    </div>
                    <Chip variant="flat">Subtopic post</Chip>
                  </div>
                }
              />
            </CardBody>
          </Card>
        ) : null}

        {postError ? <p className="text-sm text-danger-500">{postError}</p> : null}

        <div className="grid gap-3">
          {visiblePosts.length > 0 ? (
            visiblePosts.map((post) => renderPostThread(post))
          ) : (
            <Card className="internal-empty">
              <CardBody className="p-4">
                <p className="text-sm text-default-600">No posts yet for this subtopic.</p>
              </CardBody>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
