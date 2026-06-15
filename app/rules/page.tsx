"use client";

import { Button, Card, CardBody, Chip } from "@heroui/react";
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Eye,
  HandHeart,
  Lock,
  MessageSquareWarning,
  Scale,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

const values = [
  {
    title: "Respect each other",
    description: "Speak directly without attacking another member's dignity.",
    icon: HandHeart,
  },
  {
    title: "Protect privacy",
    description: "No private details, screenshots, or documents without consent.",
    icon: Lock,
  },
  {
    title: "Disagree respectfully",
    description: "Challenge ideas and choices without humiliating the person.",
    icon: Scale,
  },
  {
    title: "Report harm",
    description: "Flag abuse, threats, hate, or harassment so moderators can act.",
    icon: MessageSquareWarning,
  },
];

const standards = [
  "No insults, humiliation, mocking, or personal attacks.",
  "No hate speech or degrading language aimed at any group.",
  "No bullying, stalking, threats, pressure campaigns, or repeated targeting.",
  "No encouraging violence, self-harm, coercion, blackmail, or abusive tactics.",
  "No revenge posts, public shaming, sexual harassment, spam, or illegal activity.",
  "No pretending to be a licensed professional when sharing personal experience.",
];

const principles = [
  "Listen before judging.",
  "Help, guide, support, or respectfully challenge.",
  "Stay relevant to support, growth, or shared experience.",
  "Respect different life paths, including single, married, divorced, fathers, childless, younger, and older men.",
  "Accept that moderators can remove content or users when the community needs protection.",
];

export default function RulesPage() {
  return (
    <div className="space-y-8 pb-6">
      <section className="overflow-hidden rounded-[1.5rem] border border-divider bg-content1 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-6 p-6 sm:p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                as={Link}
                href="/"
                variant="flat"
                className="bg-secondary/10 text-secondary hover:bg-secondary/16"
                startContent={<ArrowLeft size={16} />}
              >
                Back home
              </Button>
              <Chip color="primary" variant="flat">
                Community charter
              </Chip>
            </div>

            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
                Got Your Six community values
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                A serious support space needs clear standards.
              </h1>
              <p className="max-w-3xl text-base leading-7 text-default-600">
                Got Your Six is a community where men can support each other,
                share experiences, ask questions, and find practical advice from
                people who have been through similar situations.
              </p>
              <p className="max-w-3xl text-base leading-7 text-default-600">
                The goal is simple: respectful conversations focused on helping,
                not criticizing. We are here to help each other become better men,
                better fathers, better partners, and better human beings.
              </p>
            </div>
          </div>

          <div className="bg-primary p-6 text-white sm:p-8 lg:p-10">
            <div className="flex h-full flex-col justify-between gap-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
                  <ShieldCheck className="h-7 w-7 text-warning" />
                </div>
                <span className="rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75">
                  Safety first
                </span>
              </div>

              <div className="space-y-4">
                <p className="text-2xl font-semibold leading-9">
                  Because when things get difficult, we've got your six.
                </p>
                <p className="text-sm leading-6 text-white/72">
                  Pain is welcome here. Hate is not. Members can speak honestly,
                  but cruelty, intimidation, and privacy violations do not belong
                  in this community.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {["Support", "Privacy", "Moderation"].map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/12 bg-white/8 px-4 py-3 text-sm font-medium text-white/85"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {values.map((value) => {
          const Icon = value.icon;

          return (
            <Card
              key={value.title}
              className="border border-divider bg-content1 shadow-[0_12px_32px_rgba(15,23,42,0.06)]"
            >
              <CardBody className="gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/8 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-base font-semibold text-foreground">
                    {value.title}
                  </h2>
                  <p className="text-sm leading-6 text-default-600">
                    {value.description}
                  </p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[1.25rem] border border-divider bg-content1 p-6 shadow-[0_14px_36px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-warning/15 text-warning">
              <Ban className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                Not allowed
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                Behaviors that break trust.
              </h2>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {standards.map((standard) => (
              <div key={standard} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-warning" />
                <p className="text-sm leading-6 text-default-600">{standard}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.25rem] border border-primary/15 bg-primary p-6 text-white shadow-[0_18px_42px_rgba(27,54,93,0.18)] sm:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-warning">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">
                Expected here
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                The standard for strong conversation.
              </h2>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {principles.map((principle) => (
              <div key={principle} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <p className="text-sm leading-6 text-white/82">{principle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[1.25rem] border border-divider bg-content1 p-6 shadow-[0_14px_36px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/12 text-secondary">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary">
                Moderation
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">
                Full visibility for safety.
              </h2>
            </div>
          </div>
          <p className="text-sm leading-6 text-default-600">
            Admins can review activity when needed to protect the community.
            Severe or repeated violations can result in removal or an immediate
            ban. If you see harmful behavior, report it and move on.
          </p>
        </div>
      </section>

      <section className="flex flex-col items-start justify-between gap-4 rounded-[1.25rem] border border-divider bg-background p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
            <UsersRound className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Ready to join?
            </h2>
            <p className="text-sm leading-6 text-default-600">
              No man should have to carry life's challenges alone.
            </p>
          </div>
        </div>
        <Button as={Link} href="/auth?mode=register" color="primary">
          Create account
        </Button>
      </section>
    </div>
  );
}
