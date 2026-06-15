import { PrismaClient } from "@prisma/client";
import { pbkdf2Sync, randomBytes } from "node:crypto";

const prisma = new PrismaClient();
const DEMO_PASSWORD = "Password123!";

function createPasswordRecord(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 210_000, 32, "sha256").toString("hex");

  return {
    salt,
    hash,
  };
}

const demoPasswordRecord = createPasswordRecord(DEMO_PASSWORD);

type SeedPost = {
  body: string;
  authorId: string;
  parentIndex?: number;
};

type TopicSeed = {
  title: string;
  description: string;
  tags: string[];
  createdById: string;
  subtopics: Array<{
    title: string;
    slug: string;
    description: string;
  }>;
  posts: SeedPost[];
  subscriptions: string[];
};

async function main() {
  const admin = await prisma.user.upsert({
    where: {
      email: "alex.hartley@gotyoursix.local",
    },
    update: {
      username: "alex-hartley",
      businessPhones: [],
      passwordHash: demoPasswordRecord.hash,
      passwordSalt: demoPasswordRecord.salt,
    },
    create: {
      username: "alex-hartley",
      email: "alex.hartley@gotyoursix.local",
      businessPhones: [],
      passwordHash: demoPasswordRecord.hash,
      passwordSalt: demoPasswordRecord.salt,
    },
  });

  const member = await prisma.user.upsert({
    where: {
      email: "miles.parker@gotyoursix.local",
    },
    update: {
      username: "miles-parker",
      businessPhones: [],
      passwordHash: demoPasswordRecord.hash,
      passwordSalt: demoPasswordRecord.salt,
    },
    create: {
      username: "miles-parker",
      email: "miles.parker@gotyoursix.local",
      businessPhones: [],
      passwordHash: demoPasswordRecord.hash,
      passwordSalt: demoPasswordRecord.salt,
    },
  });

  await prisma.message.deleteMany();
  await prisma.conversationMember.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.discussionPost.deleteMany();
  await prisma.subtopicSubscription.deleteMany();
  await prisma.topicSubscription.deleteMany();
  await prisma.subtopic.deleteMany();
  await prisma.topic.deleteMany();

  const topicSeeds: TopicSeed[] = [
    {
      title: "Men's health",
      description:
        "A practical space for sleep, stress, fitness, and recovery conversations.",
      tags: ["health", "habits", "recovery"],
      createdById: admin.id,
      subtopics: [
        {
          title: "Sleep",
          slug: "sleep",
          description: "Sleep routines, recovery, and better mornings.",
        },
        {
          title: "Stress",
          slug: "stress",
          description: "Grounding habits and calm under pressure.",
        },
      ],
      posts: [
        {
          body: "What is one sleep habit that actually changed your mornings?",
          authorId: admin.id,
        },
        {
          body: "I moved my phone out of the bedroom and it made a bigger difference than I expected.",
          authorId: member.id,
          parentIndex: 0,
        },
      ],
      subscriptions: [admin.id, member.id],
    },
    {
      title: "Career and purpose",
      description:
        "Discussion for work transitions, long-term goals, and steady growth.",
      tags: ["career", "purpose", "growth"],
      createdById: member.id,
      subtopics: [
        {
          title: "Next steps",
          slug: "next-steps",
          description: "Decision-making when the path forward feels unclear.",
        },
        {
          title: "Leadership",
          slug: "leadership",
          description: "How to lead with clarity, calm, and accountability.",
        },
      ],
      posts: [
        {
          body: "How do you keep moving when your job feels stuck?",
          authorId: member.id,
        },
      ],
      subscriptions: [member.id],
    },
    {
      title: "Fatherhood",
      description:
        "A place for dads to share routines, setbacks, and wins.",
      tags: ["family", "fatherhood", "support"],
      createdById: admin.id,
      subtopics: [
        {
          title: "Routines",
          slug: "routines",
          description: "Small family rhythms that make the week easier.",
        },
      ],
      posts: [
        {
          body: "What is one routine you protect no matter how busy the week gets?",
          authorId: admin.id,
        },
      ],
      subscriptions: [admin.id],
    },
  ];

  for (const seed of topicSeeds) {
    const topic = await prisma.topic.create({
      data: {
        title: seed.title,
        slug: seed.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        description: seed.description,
        tags: [...seed.tags],
        createdById: seed.createdById,
        subtopics: {
          create: seed.subtopics.map((subtopic, index) => ({
            title: subtopic.title,
            slug: subtopic.slug,
            description: subtopic.description,
            sortOrder: index,
            createdById: seed.createdById,
          })),
        },
      },
      include: {
        subtopics: true,
      },
    });

    for (const subscriberId of seed.subscriptions) {
      await prisma.topicSubscription.create({
        data: {
          userId: subscriberId,
          topicId: topic.id,
        },
      });
    }

    const createdPosts: string[] = [];

    for (const postSeed of seed.posts) {
      const post = await prisma.discussionPost.create({
        data: {
          topicId: topic.id,
          body: postSeed.body,
          authorId: postSeed.authorId,
          subtopicId: topic.subtopics[0]?.id ?? null,
          parentPostId:
            postSeed.parentIndex !== undefined
              ? createdPosts[postSeed.parentIndex] ?? null
              : null,
        },
      });

      createdPosts.push(post.id);
    }
  }

  const conversation = await prisma.conversation.create({
    data: {
      createdById: admin.id,
      isGroup: true,
      lastMessageAt: new Date(),
      members: {
        create: [
          {
            userId: admin.id,
          },
          {
            userId: member.id,
          },
        ],
      },
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        senderId: admin.id,
        body: "Glad we got this space seeded and ready for the next round.",
      },
      {
        conversationId: conversation.id,
        senderId: member.id,
        body: "Nice. The topic tables are finally visible in Studio.",
      },
    ],
  });

  await prisma.conversation.update({
    where: {
      id: conversation.id,
    },
    data: {
      lastMessageAt: new Date(),
    },
  });

  console.log("Seeded community demo data.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
