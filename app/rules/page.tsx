"use client";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";

const rules = [
  {
    title: "Respect Comes First",
    text: "Be civil. No insults, humiliation, mocking, or personal attacks.",
  },
  {
    title: "No Hate Speech",
    text: "No degrading or hostile language aimed at any group of people.",
  },
  {
    title: "No Bullying or Harassment",
    text: "No stalking, threats, pressure campaigns, or repeated targeting.",
  },
  {
    title: "Help, Do Not Hurt",
    text: "Challenge each other honestly, but keep your words constructive.",
  },
  {
    title: "No Encouraging Violence or Self-Harm",
    text: "Never push someone toward harm. Urge emergency help when needed.",
  },
  {
    title: "Respect Privacy",
    text: "Do not share private details, screenshots, or documents without permission.",
  },
  {
    title: "No Revenge or Public Shaming",
    text: "This app is not for exposure, retaliation, or intimidation.",
  },
  {
    title: "No Misogyny or Anti-Men Hate",
    text: "Pain is welcome. Hate toward any gender or group is not.",
  },
  {
    title: "No Professional Advice Pretending",
    text: "Share experience freely, but don’t pretend to be a licensed professional.",
  },
  {
    title: "No Manipulation",
    text: "Do not encourage coercion, blackmail, stalking, or abusive relationship tactics.",
  },
  {
    title: "Stay Supportive and Relevant",
    text: "Keep posts on topic and grounded in support, growth, or shared experience.",
  },
  {
    title: "No Sexual Harassment",
    text: "No explicit sexual comments, unwanted messages, or graphic content.",
  },
  {
    title: "No Illegal Activity",
    text: "Do not promote fraud, hacking, violence, drug abuse, or other illegal acts.",
  },
  {
    title: "No Spam or Self-Promotion",
    text: "Don’t use the community to push products, services, or paid programs.",
  },
  {
    title: "Be Honest, But Kind",
    text: "Speak directly when needed, but never attack another man’s dignity.",
  },
  {
    title: "Respect Different Life Paths",
    text: "Men here may be single, married, divorced, fathers, childless, young, or older.",
  },
  {
    title: "Report Harmful Behavior",
    text: "If you see abuse, threats, hate, or harassment, report it and move on.",
  },
  {
    title: "Moderator Decisions Stand",
    text: "Moderators can remove content or users when the community needs protection.",
  },
  {
    title: "Ban Policy Applies",
    text: "Severe or repeated violations can result in an immediate ban.",
  },
  {
    title: "Core Principle",
    text: "If your words help, guide, support, or respectfully challenge, you belong here.",
  },
];

export default function RulesPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-primary/15 bg-content1 shadow-[0_24px_70px_rgb(var(--heroui-colors-primary-500)/0.12)]">
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5 p-5 sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                as={Link}
                href="/"
                variant="flat"
                startContent={<ArrowLeft size={16} />}
              >
                Back home
              </Button>
              <Chip color="primary" variant="flat">
                Community policy
              </Chip>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-secondary/12 p-3 text-secondary">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                    Got Your Six Community Rules
                  </p>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                    Clear standards for support, honesty, and respect.
                  </h1>
                </div>
              </div>

              <p className="max-w-3xl text-sm leading-6 text-default-600 sm:text-base">
                Got Your Six is a support community for men helping each other
                through life, fatherhood, relationships, divorce, health, career,
                mental health, and personal growth.
              </p>
              <p className="max-w-3xl text-sm leading-6 text-default-600 sm:text-base">
                The purpose is simple: men supporting men. Everyone should feel
                safe to ask for help, share honestly, and receive respectful support.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center bg-brotherhood-navy p-5 text-white sm:p-8">
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-[1.5rem] border border-white/12 bg-white/8 shadow-[0_24px_70px_rgb(0_0_0/0.18)]">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <ShieldCheck className="h-12 w-12" />
                </div>
              </div>
              <p className="text-sm leading-6 text-white/75">
                Speak with strength, but never with cruelty. Challenge ideas, not
                dignity.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rules.map((rule, index) => (
          <Card
            key={rule.title}
            className="border border-divider/70 bg-content1 shadow-[0_14px_38px_rgba(15,23,42,0.08)]"
          >
            <CardBody className="gap-3 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary/12 text-sm font-semibold text-secondary">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h2 className="text-base font-semibold">{rule.title}</h2>
              </div>
              <p className="text-sm leading-6 text-default-600">{rule.text}</p>
            </CardBody>
          </Card>
        ))}
      </section>
    </div>
  );
}
