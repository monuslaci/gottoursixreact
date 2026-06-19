import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const sections = [
  {
    title: "1. Acceptance of these terms",
    body: [
      "By creating an account, signing in, or using Got Your Six, you agree to these terms and the community rules. If you do not agree, do not use the service.",
      "Got Your Six may update these terms as the platform grows. Continued use after an update means you accept the updated terms.",
    ],
  },
  {
    title: "2. Account access",
    body: [
      "You are responsible for the activity that happens through your account. Keep your login access secure and do not share your account with another person.",
      "You must provide accurate account information and use the service only for lawful, respectful community participation.",
    ],
  },
  {
    title: "3. Community participation",
    body: [
      "Got Your Six exists for support, honest conversation, and practical discussion. You may not use it for harassment, hate, threats, spam, illegal activity, privacy violations, or abuse.",
      "Posts, messages, profiles, and other user content may be reviewed or removed when needed to protect members or enforce the rules.",
    ],
  },
  {
    title: "4. Moderation and admin visibility",
    body: [
      "Admins and moderators may review platform activity, including private messages, when needed for safety, moderation, abuse prevention, support, or legal compliance.",
      "Accounts may be warned, restricted, suspended, or removed if they break the rules or create risk for the community.",
    ],
  },
  {
    title: "5. User content",
    body: [
      "You keep responsibility for the content you submit. Do not post content you do not have permission to share.",
      "Got Your Six does not take responsibility for user-generated content, including posts, comments, messages, profile details, advice, opinions, or links shared by members.",
      "By submitting content, you allow Got Your Six to store, display, process, moderate, and use that content as needed to operate the service.",
    ],
  },
  {
    title: "6. No professional advice",
    body: [
      "Got Your Six is a peer support community, not a provider of medical, legal, financial, therapeutic, or emergency services.",
      "Content shared by members is personal experience or opinion. For urgent danger, medical needs, legal problems, or mental health emergencies, contact qualified professionals or local emergency services.",
    ],
  },
  {
    title: "7. Service availability",
    body: [
      "The platform is provided as available. Got Your Six may change, pause, limit, or stop features as needed for maintenance, security, moderation, or product development.",
      "We cannot guarantee uninterrupted access, error-free operation, or that every conversation will meet your expectations.",
    ],
  },
  {
    title: "8. Contact",
    body: [
      "For questions about these terms or moderation decisions, contact the site owner through the support channel provided by Got Your Six.",
    ],
  },
];

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl pb-8">
      <header className="border-b border-divider pb-8 pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-secondary transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-secondary">
          Legal
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Terms of Service
        </h1>
        <p className="mt-5 text-base leading-7 text-default-600">
          These terms explain the basic rules for using Got Your Six. They work
          together with the community rules so the platform can stay useful,
          respectful, and safe.
        </p>
        <p className="mt-4 text-sm font-medium text-default-500">
          Last updated: June 19, 2026
        </p>
      </header>

      <div className="space-y-10 py-10">
        {sections.map((section) => (
          <section key={section.title} className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-base leading-7 text-default-600">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="border-t border-divider pt-6 text-sm leading-6 text-default-500">
        These terms are a practical operating policy for this community. They are
        not a substitute for legal advice tailored to a specific business,
        country, or jurisdiction.
      </section>
    </article>
  );
}
