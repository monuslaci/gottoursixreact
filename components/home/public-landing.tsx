"use client";

import { motion } from "framer-motion";
import { LogIn, ShieldPlus, UserPlus } from "lucide-react";

import { AnimatedCtaLink } from "@/components/home/animated-cta-link";

const whyYouMightBeHere = [
  "My marriage is falling apart.",
  "I'm struggling with anxiety.",
  "I'm worried about my children.",
  "I feel stuck in my career.",
  "I don't have anyone to talk to.",
  "I'm trying to rebuild my life after divorce.",
];

const topics = [
  [
    "Divorce & Separation",
    "When your life changes overnight and you're trying to figure out what comes next.",
  ],
  [
    "Fatherhood",
    "Because raising children doesn't come with a manual.",
  ],
  [
    "Relationships",
    "Communication, trust, dating, marriage, boundaries, and everything in between.",
  ],
  [
    "Career & Purpose",
    "Job loss, career growth, leadership, burnout, and finding meaning in your work.",
  ],
  [
    "Mental Fitness",
    "Stress, anxiety, confidence, motivation, resilience, and staying mentally strong.",
  ],
  [
    "Health & Fitness",
    "Sleep, nutrition, exercise, recovery, and building habits that last.",
  ],
];

const reasons = [
  "Because they realize they aren't the only one.",
  "Because they find men who have lived through the same fears and setbacks.",
  "Because sometimes the most valuable thing isn't advice.",
  "It's hearing someone say: \"I've been there.\"",
];

const values = [
  "Men support each other.",
  "Questions are welcomed.",
  "Vulnerability is not weakness.",
  "Respect comes first.",
  "Personal attacks have no place.",
  "Growth matters more than ego.",
];

export function PublicLanding() {
  return (
    <div className="public-landing">
      <motion.section
        className="public-hero"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
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
                Every man carries something
            </p>
            <h1>
                You don't have to carry it alone.
            </h1>
            <p>
                Maybe it&apos;s stress. Maybe it&apos;s a relationship that&apos;s
                falling apart. Maybe it&apos;s the pressure of providing for your
                family. Maybe it&apos;s anxiety, loneliness, burnout, or the feeling
                that you&apos;re supposed to have everything figured out by now.
            </p>
            <p>
                Most men carry these things silently. Not because they want to.
                Because they&apos;ve been taught to.
            </p>
            <p>
                Got Your Six is a community where men help men. No influencers.
                No gurus. No pretending. Just honest conversations with people
                who understand what you&apos;re going through because they&apos;ve
                been there too.
            </p>
            <p>
                Whether you&apos;re navigating divorce, fatherhood, career
                challenges, mental health struggles, relationships, or major
                life changes, you&apos;ll find men here who are willing to listen,
                share their experiences, and help.
            </p>
          </div>

          <div className="public-actions">
            <AnimatedCtaLink
              href="/auth?mode=register"
              icon={UserPlus}
              delay={0.08}
              showArrow
              variant="hero-primary"
            >
              Create account
            </AnimatedCtaLink>
            <AnimatedCtaLink
              href="/auth?mode=login"
              icon={LogIn}
              delay={0.14}
              variant="hero-secondary"
            >
              Sign in
            </AnimatedCtaLink>
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
                Most men don&apos;t need a brochure. They need to know someone
                will understand.
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
            <p className="public-kicker">
              You might be here because...
            </p>
            <h2>
              The thing weighing on you already has a place here.
            </h2>
          </div>
          <p>
            This page should feel familiar before it feels informative. Most men
            arrive here carrying something they have not said out loud yet.
          </p>
        </div>

        <div className="public-topic-grid">
          {whyYouMightBeHere.map((reason, index) => (
            <div key={reason} className="public-card">
              <div className="public-card-number">
                {String(index + 1).padStart(2, "0")}
              </div>
              <h3 className="public-card-copy-lg">{reason}</h3>
              <p>
                Honest conversation starts faster when someone else has already
                put the feeling into words.
              </p>
            </div>
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
            <p className="public-kicker">
              What brings men here?
            </p>
            <h2>
              The conversations usually begin in these parts of life.
            </h2>
          </div>
          <p>
            The categories matter, but only after a new visitor feels understood
            enough to take the first step.
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
      </motion.section>

      <motion.section
        className="public-split"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="public-info-card">
          <p className="public-kicker">
            Why men stay
          </p>
          <h2>
            Because they realize they aren&apos;t the only one.
          </h2>

          <div className="public-story-list">
            {reasons.map((reason) => (
              <div key={reason} className="public-story-item">
                <p>{reason}</p>
              </div>
            ))}
          </div>

          <p>
            They discover that other men have faced the same fears, made similar
            mistakes, survived difficult situations, and found ways forward.
          </p>
        </div>

        <div className="public-steps-card">
          <p className="public-steps-kicker">
            The kind of community we&apos;re building
          </p>
          <h2>
            This isn&apos;t social media. This is a brotherhood built around
            helping each other navigate life.
          </h2>

          <div className="public-values-grid">
            {values.map((value) => (
              <div key={value} className="public-value-pill">
                {value}
              </div>
            ))}
          </div>

          <p className="public-steps-card__quote">
            You don&apos;t need to have the answers. You just need to take the
            first step.
          </p>

          <p className="public-steps-card__quote">
            Create your account, introduce yourself, and join a community that
            believes no man should face life&apos;s challenges alone.
          </p>

          <div className="public-actions public-actions--compact">
            <AnimatedCtaLink
              href="/auth?mode=register"
              icon={ShieldPlus}
              delay={0.05}
              showArrow
              variant="hero-bronze"
            >
              Create account
            </AnimatedCtaLink>
            <AnimatedCtaLink
              href="/auth?mode=login"
              icon={LogIn}
              delay={0.1}
              variant="hero-outline"
            >
              Sign in
            </AnimatedCtaLink>
          </div>

          <p className="public-steps-card__quote">
            Because when things get difficult, we&apos;ve got your six.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
