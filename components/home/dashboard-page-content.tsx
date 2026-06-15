"use client";

import type { TopicListItem } from "@/lib/community";

type DashboardPageContentProps = {
  topics: TopicListItem[];
};

export function DashboardPageContent({ topics }: DashboardPageContentProps) {
  const topTopics = topics.slice(0, 6);

  const totals = topics.reduce(
    (accumulator, topic) => ({
      topics: accumulator.topics + 1,
      subtopics: accumulator.subtopics + topic.counts.subtopics,
      posts: accumulator.posts + topic.counts.posts,
      members: accumulator.members + topic.counts.subscriptions,
    }),
    {
      topics: 0,
      subtopics: 0,
      posts: 0,
      members: 0,
    }
  );

  const dashboardStats = [
    {
      label: "Topics",
      value: `${totals.topics}`,
      helper: "Core spaces available now",
    },
    {
      label: "Subtopics",
      value: `${totals.subtopics}`,
      helper: "Focused areas for discussion",
    },
    {
      label: "Posts",
      value: `${totals.posts}`,
      helper: "Threads already in motion",
    },
    {
      label: "Members",
      value: `${totals.members}`,
      helper: "Subscriptions and active reach",
    },
  ];

  return (
    <div className="public-landing">
      <section className="public-hero">
        <div className="public-hero__copy">
          <div className="public-eyebrows">
            <span className="public-pill public-pill--bronze">Got Your Six</span>
            <span className="public-pill public-pill--slate">Welcome back</span>
          </div>

          <div className="public-heading">
            <p className="public-kicker">You're not alone</p>
            <h1>A community for the burdens most men carry alone.</h1>
            <p>
              Pick up where you left off with topic spaces, direct messages, and
              member support built around honest conversation.
            </p>
            <p>
              The navigation above keeps the working areas close, while this home
              screen stays calm, branded, and focused.
            </p>
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
            Whether you need guidance, encouragement, or someone who gets it,
            you will find men here who have your back.
          </p>
        </div>
      </section>

      <section className="public-section">
        <div className="public-section-head">
          <div>
            <p className="public-kicker">Live community</p>
            <h2>A quick read on what is available now.</h2>
          </div>
          <p>
            These numbers come from the live topic data, so the home screen feels
            connected to the actual community without turning into a busy dashboard.
          </p>
        </div>

        <div className="public-topic-grid">
          {dashboardStats.map((item, index) => (
            <div key={item.label} className="public-card">
              <div className="public-card-number">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3>
                {item.value} {item.label}
              </h3>
              <p>{item.helper}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="public-section">
        <div className="public-section-head">
          <div>
            <p className="public-kicker">Active topics</p>
            <h2>Spaces people are using now.</h2>
          </div>
          <p>
            A simple preview of the topic areas currently available in the app.
          </p>
        </div>

        {topTopics.length > 0 ? (
          <div className="public-topic-grid">
            {topTopics.map((topic, index) => (
              <div key={topic.id} className="public-card">
                <div className="public-card-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3>{topic.title}</h3>
                <p>
                  {topic.description ||
                    "A discussion space ready for the next conversation."}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="public-card">
            <div className="public-card-number">01</div>
            <h3>No topics yet</h3>
            <p>Use the admin area to create the first community spaces.</p>
          </div>
        )}
      </section>
    </div>
  );
}
