"use client";

import type {
  MyPostActivityPayload,
  RecentConversationItem,
  TopicListItem,
} from "@/lib/community";
import type { PublicSessionUser } from "@/lib/session";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Compass,
  HandHeart,
  HeartPulse,
  MessageCircle,
  MessageCircleQuestion,
  MessageSquareMore,
  Reply,
  Sparkles,
} from "lucide-react";

import { AnimatedCtaLink } from "@/components/home/animated-cta-link";

type DashboardPageContentProps = {
  topics: TopicListItem[];
  recentPosts: RecentConversationItem[];
  postActivity: MyPostActivityPayload;
  unreadMessageCount: number;
  user: PublicSessionUser;
};

const trendingFallback = [
  "How do you handle co-parenting after divorce?",
  "What helped your anxiety the most?",
  "How do you make friends in your 40s?",
  "What is the best career advice you've received?",
];

const checkInOptions = [
  { label: "Good", value: "good" },
  { label: "Hanging in there", value: "steady" },
  { label: "Struggling", value: "hard" },
] as const;

const DASHBOARD_PAGE_SIZE = 10;

function formatConversationDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function trimPreview(body: string, maxLength = 105) {
  const normalized = body.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}...`;
}

function buildPostHref(post: RecentConversationItem) {
  return post.topic ? `/topics/${post.topic.id}` : "/topics";
}

function getPageCount(totalItems: number) {
  return Math.max(1, Math.ceil(totalItems / DASHBOARD_PAGE_SIZE));
}

export function DashboardPageContent({
  topics,
  recentPosts,
  postActivity,
  unreadMessageCount,
  user,
}: DashboardPageContentProps) {
  const [continuePage, setContinuePage] = useState(1);
  const [trendingPage, setTrendingPage] = useState(1);

  const activityItems = [
    ...postActivity.posts.map((post) => ({
      title: post.topic?.title ?? "Your discussion",
      detail:
        post.subtopic?.title ??
        `${formatConversationDate(post.updatedAt)} activity on your discussion`,
      href: post.topic ? `/topics/${post.topic.id}` : "/activity",
      type: "discussion" as const,
      stamp: formatConversationDate(post.updatedAt),
      sortValue: new Date(post.updatedAt).getTime(),
    })),
    ...postActivity.comments.map((comment) => ({
      title: comment.topic?.title ?? "Your comment",
      detail:
        comment.parentPost?.author?.username
          ? `You replied to @${comment.parentPost.author.username}`
          : "A recent comment from your activity",
      href: comment.topic ? `/topics/${comment.topic.id}` : "/activity",
      type: "reply" as const,
      stamp: formatConversationDate(comment.updatedAt),
      sortValue: new Date(comment.updatedAt).getTime(),
    })),
  ].sort((left, right) => right.sortValue - left.sortValue);

  const hasUnreadMessages = unreadMessageCount > 0;
  const continueItems = [
    ...activityItems,
    ...(hasUnreadMessages
      ? [
          {
            title: "Direct Messages",
            detail: `${unreadMessageCount} unread ${
              unreadMessageCount === 1 ? "message" : "messages"
            }`,
            href: "/messages",
            type: "messages" as const,
            stamp: "Inbox",
            sortValue: Number.MAX_SAFE_INTEGER,
          },
        ]
      : []),
  ];

  const trendingItems =
    recentPosts.length > 0
      ? recentPosts.map((post) => ({
          title: trimPreview(post.body, 92),
          meta: [
            post.topic?.title ?? "Community",
            `${post.replyCount} ${post.replyCount === 1 ? "reply" : "replies"}`,
            formatConversationDate(post.createdAt),
          ],
          href: buildPostHref(post),
        }))
      : trendingFallback.map((title) => ({
          title,
          meta: ["Discussion starter", "Browse topics"],
          href: "/topics",
        }));

  const continuePageCount = getPageCount(continueItems.length);
  const trendingPageCount = getPageCount(trendingItems.length);

  const pagedContinueItems = useMemo(() => {
    const page = Math.min(continuePage, continuePageCount);
    const start = (page - 1) * DASHBOARD_PAGE_SIZE;
    return continueItems.slice(start, start + DASHBOARD_PAGE_SIZE);
  }, [continueItems, continuePage, continuePageCount]);

  const pagedTrendingItems = useMemo(() => {
    const page = Math.min(trendingPage, trendingPageCount);
    const start = (page - 1) * DASHBOARD_PAGE_SIZE;
    return trendingItems.slice(start, start + DASHBOARD_PAGE_SIZE);
  }, [trendingItems, trendingPage, trendingPageCount]);

  const suggestedTopics = topics.slice(0, 4);

  return (
    <div className="public-landing">
      <motion.section
        className="public-hero"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36, ease: "easeOut" }}
      >
        <div className="public-hero__copy public-hero__copy--dashboard">
          <div className="public-eyebrows">
            <span className="public-pill public-pill--bronze">Welcome back</span>
            <span className="public-pill public-pill--slate">@{user.username}</span>
          </div>

          <div className="public-heading">
            <p className="public-kicker">Your dashboard</p>
            <h1>Here&apos;s what&apos;s happening today.</h1>
            <p>
              Pick up a conversation, ask for support, or help another member
              with something you have already lived through.
            </p>
          </div>

          <div className="public-actions">
            <AnimatedCtaLink
              href="/topics"
              icon={Compass}
              delay={0.08}
              showArrow
              variant="hero-primary"
            >
              Start a discussion
            </AnimatedCtaLink>
            <AnimatedCtaLink
              href="/messages"
              icon={MessageSquareMore}
              delay={0.14}
              variant="hero-secondary"
            >
              Check messages
            </AnimatedCtaLink>
          </div>
        </div>

        <div className="public-hero__panel">
          <div className="public-panel-top">
            <div className="public-logo-frame public-logo-frame--hero public-logo-frame--dashboard">
              <img src="/logo.png" alt="Got Your Six logo" />
            </div>
            <div className="public-panel-badge">Member home</div>
          </div>

          <p className="public-panel-quote">
            Welcome back. Find what needs your attention, then take the next
            useful step.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="public-section"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.34, ease: "easeOut" }}
      >
        <div className="public-section-head">
          <div>
            <p className="public-kicker">Continue where you left off</p>
            <h2>Your next conversations are one click away.</h2>
          </div>
          <Link href="/activity" className="public-inline-chip">
            View all activity
          </Link>
        </div>

        {continueItems.length > 0 ? (
          <>
            <div className="dashboard-stream-shell">
              {pagedContinueItems.map((item, index) => (
                <Link
                  key={`${item.title}-${index}-${continuePage}`}
                  href={item.href}
                  className="dashboard-stream-row"
                >
                  <div className="dashboard-stream-row__icon">
                    {item.type === "messages" ? (
                      <MessageSquareMore className="h-4 w-4" />
                    ) : item.type === "reply" ? (
                      <Reply className="h-4 w-4" />
                    ) : (
                      <MessageCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="dashboard-stream-row__content">
                    <div className="dashboard-stream-row__topline">
                      <h3>{item.title}</h3>
                      <span>{item.stamp}</span>
                    </div>
                    <p>{item.detail}</p>
                  </div>
                  <ArrowRight className="dashboard-stream-row__arrow h-4 w-4" />
                </Link>
              ))}
            </div>
            {continuePageCount > 1 ? (
              <div className="dashboard-pager" aria-label="Continue activity pagination">
                <button
                  type="button"
                  className="dashboard-pager__button"
                  onClick={() => setContinuePage((page) => Math.max(1, page - 1))}
                  disabled={continuePage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
                <span className="dashboard-pager__status">
                  Page {continuePage} of {continuePageCount}
                </span>
                <button
                  type="button"
                  className="dashboard-pager__button"
                  onClick={() =>
                    setContinuePage((page) => Math.min(continuePageCount, page + 1))
                  }
                  disabled={continuePage === continuePageCount}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="public-card">
            <div className="public-card-number">01</div>
            <h3>No open threads yet</h3>
            <p>
              Join a topic or start a discussion, and your next steps will show
              up here.
            </p>
          </div>
        )}
      </motion.section>

      <motion.section
        className="public-section"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.34, ease: "easeOut" }}
      >
        <div className="public-section-head">
          <div>
            <p className="public-kicker">Trending conversations</p>
            <h2>What&apos;s being discussed today.</h2>
          </div>
          <p>Jump into a live topic, or use one as a starting point for your own question.</p>
        </div>

        <div className="dashboard-trending-shell">
          {pagedTrendingItems.map((item, index) => {
            const absoluteIndex = (trendingPage - 1) * DASHBOARD_PAGE_SIZE + index;

            return (
              <Link
                key={`${item.title}-${absoluteIndex}`}
                href={item.href}
                className="dashboard-trending-row"
              >
                <div className="dashboard-trending-row__rank">
                  {String(absoluteIndex + 1).padStart(2, "0")}
                </div>
                <div className="dashboard-trending-row__content">
                  <h3>{item.title}</h3>
                  <div className="dashboard-trending-row__meta">
                    {item.meta.map((meta) => (
                      <span key={meta}>{meta}</span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="dashboard-trending-row__arrow h-4 w-4" />
              </Link>
            );
          })}
        </div>
        {trendingPageCount > 1 ? (
          <div className="dashboard-pager" aria-label="Trending conversations pagination">
            <button
              type="button"
              className="dashboard-pager__button"
              onClick={() => setTrendingPage((page) => Math.max(1, page - 1))}
              disabled={trendingPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="dashboard-pager__status">
              Page {trendingPage} of {trendingPageCount}
            </span>
            <button
              type="button"
              className="dashboard-pager__button"
              onClick={() =>
                setTrendingPage((page) => Math.min(trendingPageCount, page + 1))
              }
              disabled={trendingPage === trendingPageCount}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        ) : null}
      </motion.section>

      <motion.section
        className="public-split"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.34, ease: "easeOut" }}
      >
        <div className="public-info-card">
          <p className="public-kicker">Need support?</p>
          <h2>Ask a question anonymously and get advice from men who have been there.</h2>
          <p>
            You do not need the perfect words. Start with what is happening and
            what kind of help would make the day easier.
          </p>

          <div className="public-actions public-actions--compact">
            <AnimatedCtaLink
              href="/topics"
              icon={MessageCircleQuestion}
              delay={0.05}
              showArrow
              variant="hero-bronze"
            >
              Start a discussion
            </AnimatedCtaLink>
          </div>
        </div>

        <div className="public-steps-card">
          <p className="public-steps-kicker">Can you help someone else?</p>
          <h2>Your experience could make a difference to another member today.</h2>
          <p className="public-steps-card__quote">
            Browse recent conversations, answer a question, or point someone
            toward a topic that helped you.
          </p>

          <div className="public-actions public-actions--compact">
            <AnimatedCtaLink
              href="/topics"
              icon={HandHeart}
              delay={0.1}
              showArrow
              variant="hero-outline"
            >
              Browse unanswered posts
            </AnimatedCtaLink>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="public-section"
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.34, ease: "easeOut" }}
      >
        <div className="public-section-head">
          <div>
            <p className="public-kicker">Daily check-in</p>
            <h2>How are you doing today?</h2>
          </div>
          <p>You&apos;ve checked in 17 days this month.</p>
        </div>

        <div className="public-topic-grid">
          {checkInOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className="public-card public-card--link text-left"
            >
              <div className="public-card-number">
                <HeartPulse className="h-4 w-4" />
              </div>
              <h3>{option.label}</h3>
              <p>Log today&apos;s check-in.</p>
            </button>
          ))}
        </div>
      </motion.section>

      {suggestedTopics.length > 0 ? (
        <motion.section
          className="public-section"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.34, ease: "easeOut" }}
        >
          <div className="public-section-head">
            <div>
              <p className="public-kicker">Topic rooms</p>
              <h2>Places to start.</h2>
            </div>
            <Link href="/topics" className="public-inline-chip">
              Browse all topics
            </Link>
          </div>

          <div className="public-topic-grid">
            {suggestedTopics.map((topic, index) => (
              <Link
                key={topic.id}
                href={`/topics/${topic.id}`}
                className="public-card public-card--link"
              >
                <div className="public-card-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3>{topic.title}</h3>
                <p>{topic.description ?? "Open the room and see what members are discussing."}</p>
                <p className="public-card-helper">
                  {topic.counts.posts} posts
                </p>
              </Link>
            ))}
          </div>
        </motion.section>
      ) : null}

      <div className="public-inline-links">
        <Link href="/activity" className="public-inline-chip">
          <ClipboardList className="h-4 w-4" />
          Your activity
        </Link>
        <Link href="/topics" className="public-inline-chip">
          <Sparkles className="h-4 w-4" />
          Explore topics
        </Link>
        <Link href="/messages" className="public-inline-chip">
          Messages
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
