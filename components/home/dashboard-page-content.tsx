"use client";

import type {
  RecentConversationItem,
  TopicListItem,
} from "@/lib/community";
import Link from "next/link";
import { motion } from "framer-motion";
import { Compass, MessageSquareMore, Scale, Users } from "lucide-react";

import { AnimatedCtaLink } from "@/components/home/animated-cta-link";

const supportAreas = [
  {
    title: "Career",
    description:
      "Interviews, promotions, leadership, workplace problems, job loss, and career changes.",
  },
  {
    title: "Relationships",
    description:
      "Dating, marriage, communication, trust, boundaries, and rebuilding connection.",
  },
  {
    title: "Divorce & Separation",
    description:
      "Custody, co-parenting, legal challenges, and rebuilding your life.",
  },
  {
    title: "Fatherhood",
    description:
      "Parenting advice, family challenges, and raising strong and healthy children.",
  },
  {
    title: "Mental Fitness",
    description:
      "Stress, anxiety, burnout, confidence, motivation, and purpose.",
  },
  {
    title: "Health & Fitness",
    description:
      "Exercise, nutrition, sleep, recovery, and building healthy habits.",
  },
];

const successStories = [
  "Men rebuilding confidence after layoffs and difficult career transitions.",
  "Fathers finding steadier footing through co-parenting and family change.",
  "Members repairing relationships, setting boundaries, and starting over stronger.",
];

const communityValues = [
  "Respect first",
  "Honest conversation",
  "Practical advice",
  "No judgment",
  "No personal attacks",
  "Men helping men",
];

type DashboardPageContentProps = {
  topics: TopicListItem[];
  recentPosts: RecentConversationItem[];
};

function formatConversationDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function trimPreview(body: string, maxLength = 150) {
  const normalized = body.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function DashboardPageContent({
  topics,
  recentPosts,
}: DashboardPageContentProps) {
  const topTopics = topics.slice(0, 3);

  return (
    <div className="public-landing">
      <motion.section
        className="public-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="public-hero__copy public-hero__copy--dashboard">
          <div className="public-eyebrows">
            <span className="public-pill public-pill--bronze">Got Your Six</span>
            <span className="public-pill public-pill--slate">Welcome back</span>
          </div>

          <div className="public-heading">
            <p className="public-kicker">You&apos;ve got backup</p>
            <h1>Most men are taught to carry everything themselves.</h1>
            <p>
              The stress. The uncertainty. The pressure to provide. The
              relationship problems. The fear that nobody really understands
              what you&apos;re going through.
            </p>
            <p>
              You don&apos;t have to carry it alone. Got Your Six is a community
              of men helping men navigate life&apos;s challenges through honest
              conversations, practical advice, and shared experience.
            </p>
            <p>
              Whether you&apos;re dealing with career setbacks, divorce,
              fatherhood, loneliness, health concerns, or simply trying to
              become a better man, you&apos;ll find people here who have walked
              similar paths.
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
              Find support
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
            <div className="public-panel-badge">Community first</div>
          </div>

          <p className="public-panel-quote">
            Because sometimes the strongest thing a man can do is ask for help.
          </p>
        </div>
      </motion.section>

      <motion.section
        className="public-section"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="public-section-head">
          <div>
            <p className="public-kicker">What do you need help with today?</p>
            <h2>Start with the pressure point that feels heaviest right now.</h2>
          </div>
          <p>
            Every topic area is built around honest discussion, lived
            experience, and advice you can actually use in real life.
          </p>
        </div>

        <div className="public-topic-grid">
          {supportAreas.map((item, index) => (
            <Link key={item.title} href="/topics" className="public-card public-card--link">
              <div className="public-card-number">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </Link>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="public-section"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="public-section-head">
          <div>
            <p className="public-kicker">Recent conversations</p>
            <h2>Real men talking through real situations.</h2>
          </div>
          <p>
            These previews come from the latest discussion starters in the
            community, so the page stays grounded in what members are actually
            facing now.
          </p>
        </div>

        {recentPosts.length > 0 ? (
          <div className="public-topic-grid">
            {recentPosts.map((post, index) => (
              <Link
                key={post.id}
                href={post.topic ? `/topics/${post.topic.id}` : "/topics"}
                className="public-card public-card--conversation"
              >
                <div className="public-card-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="public-card-meta">
                  <span>{post.topic?.title ?? "Community"}</span>
                  {post.subtopic ? <span>{post.subtopic.title}</span> : null}
                  <span>{formatConversationDate(post.createdAt)}</span>
                </div>
                <p>
                  {trimPreview(post.body)}
                </p>
                <h3>
                  {post.author?.name || post.author?.username || "A member"}{" "}
                  started this conversation
                </h3>
                <p className="public-card-helper">
                  {post.replyCount} {post.replyCount === 1 ? "reply" : "replies"}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <div className="public-card">
            <div className="public-card-number">01</div>
            <h3>No conversations yet</h3>
            <p>The first honest post can set the tone for someone else to speak up.</p>
          </div>
        )}

        {topTopics.length > 0 ? (
          <div className="public-inline-links">
            {topTopics.map((topic) => (
              <Link key={topic.id} href={`/topics/${topic.id}`} className="public-inline-chip">
                {topic.title}
              </Link>
            ))}
          </div>
        ) : null}
      </motion.section>

      <motion.section
        className="public-split"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="public-info-card">
          <p className="public-kicker">Success stories</p>
          <h2>Proof that men can rebuild, recover, and move forward.</h2>

          <div className="public-story-list">
            {successStories.map((story, index) => (
              <div key={story} className="public-story-item">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{story}</p>
              </div>
            ))}
          </div>

          <p>
            Some men come here looking for answers. Others stay long enough to
            become the answer for someone else.
          </p>
        </div>

        <div className="public-steps-card">
          <p className="public-steps-kicker">Community values</p>
          <h2>The standard here is simple: respect, honesty, and real help.</h2>

          <div className="public-values-grid">
            {communityValues.map((value) => (
              <div key={value} className="public-value-pill">
                {value}
              </div>
            ))}
          </div>

          <p className="public-steps-card__quote">
            And sometimes the best thing another man can say is: &quot;I&apos;ve got
            your six.&quot;
          </p>

          <div className="public-actions public-actions--compact">
            <AnimatedCtaLink
              href="/rules"
              icon={Scale}
              delay={0.05}
              variant="hero-bronze"
            >
              Community values
            </AnimatedCtaLink>
            <AnimatedCtaLink
              href="/topics"
              icon={Users}
              delay={0.1}
              showArrow
              variant="hero-outline"
            >
              Join a conversation
            </AnimatedCtaLink>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
