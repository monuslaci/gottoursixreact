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

const experienceSources = [
  "From fathers.",
  "From husbands.",
  "From divorced men.",
  "From men who rebuilt their careers.",
  "From men who fought through anxiety.",
  "From men who have been where you are now.",
];

const outcomes = [
  "Navigate divorce",
  "Improve relationships",
  "Find new careers",
  "Become better fathers",
  "Build confidence",
  "Recover from burnout",
  "Make it through difficult times",
];

const simpleRules = [
  "Be respectful.",
  "Be honest.",
  "Help when you can.",
  "Ask when you need help.",
  "No personal attacks.",
  "No hate.",
  "No shaming.",
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
            <p>
              This page should feel familiar before it feels informative. Most men
              arrive here carrying something they have not said out loud yet.
            </p>
          </div>
        </div>

        <div className="public-emotion-list">
          {whyYouMightBeHere.map((reason, index) => (
            <div key={reason} className="public-emotion-row">
              <span className="public-emotion-row__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="public-emotion-row__content">
                <h3>{reason}</h3>
                <p>
                  Honest conversation starts faster when someone else has already
                  put the feeling into words.
                </p>
              </div>
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
              No matter where you are in life
            </p>
            <h2>
              Someone here has probably been there before.
            </h2>
            <p>
              Start with the part of life that feels heaviest right now. The room
              matters less than finding the first honest conversation.
            </p>
          </div>
        </div>

        <div className="public-topic-rail">
          {topics.map(([title, description], index) => (
            <div key={title} className="public-topic-rail__row">
              <div className="public-topic-rail__number">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div className="public-topic-rail__content">
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
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
              What&apos;s possible?
            </p>
            <h2>
              You don&apos;t need to have everything figured out.
            </h2>
          </div>
          <p>
            Men come here to get through real situations, make better decisions,
            and find a place to start.
          </p>
        </div>

        <div className="public-outcome-band">
          {outcomes.map((outcome, index) => (
            <div key={outcome} className="public-outcome-chip">
              <span className="public-outcome-chip__index">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="public-outcome-chip__content">
                <h3>{outcome}</h3>
                <p>
                  One honest conversation can make the next step easier to see.
                </p>
              </div>
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
          <p className="public-kicker">Why men stay</p>
          <h2>Because the advice comes from experience.</h2>
          <p>
            Not from influencers. Not from people trying to sell a course.
          </p>

          <div className="public-story-list">
            {experienceSources.map((source, index) => (
              <div key={source} className="public-story-item">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{source}</p>
              </div>
            ))}
          </div>

          <p>
            Sometimes one honest conversation can save months of struggle.
          </p>
        </div>

        <div className="public-steps-card">
          <p className="public-steps-kicker">The rules are simple</p>
          <h2>Be useful. Be honest. Keep it respectful.</h2>

          <div className="public-values-grid">
            {simpleRules.map((rule) => (
              <div key={rule} className="public-value-pill">
                {rule}
              </div>
            ))}
          </div>

          <p className="public-steps-card__quote">
            Just men helping men.
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
        </div>
      </motion.section>
    </div>
  );
}
