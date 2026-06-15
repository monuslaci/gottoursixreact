"use client";

import Link from "next/link";

const topics = [
  [
    "Career",
    "Interviews, job searching, career growth, leadership, workplace challenges, and professional development.",
  ],
  [
    "Relationships",
    "Dating, marriage, communication, boundaries, trust, and rebuilding relationships.",
  ],
  [
    "Divorce & Separation",
    "Co-parenting, custody arrangements, and rebuilding life after major changes.",
  ],
  [
    "Fatherhood",
    "Parenting, family life, and the practical work of raising children well.",
  ],
  [
    "Mental Fitness",
    "Stress, anxiety, burnout, confidence, motivation, and personal growth.",
  ],
  [
    "Health & Fitness",
    "Exercise, nutrition, sleep, recovery, and building healthier habits.",
  ],
];

const reasons = [
  "Real men. Real experiences.",
  "Anonymous if you want.",
  "Judgment-free community.",
  "Practical support.",
  "Brotherhood.",
];

const steps = [
  "Create a free account.",
  "Complete your profile.",
  "Browse topics that matter to you.",
  "Ask questions or join discussions.",
  "Support other members when you can.",
];

export function PublicLanding() {
  return (
    <div className="public-landing">
      <section className="public-hero">
        <div className="public-hero__copy">
          <div className="public-eyebrows">
            <span className="public-pill public-pill--bronze">
                Got Your Six
            </span>
            <span className="public-pill public-pill--slate">
                Men helping men
            </span>
          </div>

          <div className="public-heading">
            <p className="public-kicker">
                You're not alone
            </p>
            <h1>
                A community for the burdens most men carry alone.
            </h1>
            <p>
                Life can be tough. Career setbacks, relationship problems, divorce,
                fatherhood challenges, stress, anxiety, loneliness, health concerns,
                or simply feeling stuck.
            </p>
            <p>
                Got Your Six exists so men can share experience, ask honest
                questions, and find practical support from people who understand.
            </p>
          </div>

          <div className="public-actions">
            <Link href="/auth?mode=register" className="public-button public-button--primary">
              Create account
            </Link>
            <Link href="/auth?mode=login" className="public-button public-button--secondary">
              Sign in
            </Link>
          </div>
        </div>

        <div className="public-hero__panel">
          <div className="public-panel-top">
            <div className="public-logo-frame public-logo-frame--hero">
              <img src="/logo.png" alt="Got Your Six logo" />
            </div>
            <div className="public-panel-badge">
                  Community first
            </div>
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
            <p className="public-kicker">
              What you can find here
            </p>
            <h2>
              Focused spaces for real-life pressure points.
            </h2>
          </div>
          <p>
            Each area is built around practical experience, respectful discussion,
            and support that is useful beyond the screen.
          </p>
        </div>

        <div className="public-topic-grid">
          {topics.map(([title, description], index) => (
            <div key={title} className="public-card">
              <div className="public-card-number">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="public-split">
        <div className="public-info-card">
          <p className="public-kicker">
            Why join
          </p>
          <h2>
            Support with standards.
          </h2>

          <div className="public-reason-grid">
            {reasons.map((reason) => (
              <div key={reason}>
                {reason}
              </div>
            ))}
          </div>

          <p>
            Advice comes from people who have lived through similar situations.
            Conversations are focused on helping, not criticizing.
          </p>
        </div>

        <div className="public-steps-card">
          <p className="public-steps-kicker">
            How it works
          </p>
          <h2>
            The strongest communities are built when everyone contributes.
          </h2>

          <div className="public-steps">
            {steps.map((step, index) => (
              <div key={step}>
                <span>
                  {index + 1}
                </span>
                <p>{step}</p>
              </div>
            ))}
          </div>

          <div className="public-actions public-actions--compact">
            <Link href="/auth?mode=register" className="public-button public-button--bronze">
              Join now
            </Link>
            <Link href="/rules" className="public-button public-button--outline">
              Community values
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
