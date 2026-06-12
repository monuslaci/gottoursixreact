import { prisma } from "@/lib/prisma";

export type TopicListItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  counts: {
    subtopics: number;
    subscriptions: number;
    posts: number;
  };
};

export type TopicPostItem = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  subtopic: {
    id: string;
    title: string;
    slug: string;
  } | null;
  parentPostId: string | null;
  replyCount: number;
};

export type TopicDetailItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  counts: {
    subtopics: number;
    subscriptions: number;
    posts: number;
  };
  subtopics: Array<{
    id: string;
    title: string;
    slug: string;
    description: string | null;
    sortOrder: number;
  }>;
};

export class CommunityError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "CommunityError";
    this.statusCode = statusCode;
  }
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function normalizeTags(tags: string[] | undefined) {
  if (!tags) {
    return [];
  }

  return Array.from(
    new Set(
      tags
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0)
    )
  ).slice(0, 12);
}

function toTopicListItem(topic: {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  _count: {
    subtopics: number;
    subscriptions: number;
    posts: number;
  };
}): TopicListItem {
  return {
    id: topic.id,
    title: topic.title,
    slug: topic.slug,
    description: topic.description,
    tags: topic.tags,
    createdAt: topic.createdAt.toISOString(),
    updatedAt: topic.updatedAt.toISOString(),
    counts: {
      subtopics: topic._count.subtopics,
      subscriptions: topic._count.subscriptions,
      posts: topic._count.posts,
    },
  };
}

function toTopicPostItem(post: {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
  subtopic: {
    id: string;
    title: string;
    slug: string;
  } | null;
  parentPostId: string | null;
  _count: {
    replies: number;
  };
}): TopicPostItem {
  return {
    id: post.id,
    body: post.body,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    author: post.author,
    subtopic: post.subtopic,
    parentPostId: post.parentPostId,
    replyCount: post._count.replies,
  };
}

async function generateUniqueTopicSlug(title: string) {
  const baseSlug = slugify(title) || "topic";
  const existingSlugs = await prisma.topic.findMany({
    where: {
      slug: {
        startsWith: baseSlug,
      },
    },
    select: {
      slug: true,
    },
  });

  const taken = new Set(existingSlugs.map((item) => item.slug));

  if (!taken.has(baseSlug)) {
    return baseSlug;
  }

  let suffix = 2;
  while (taken.has(`${baseSlug}-${suffix}`)) {
    suffix += 1;
  }

  return `${baseSlug}-${suffix}`;
}

export async function listTopics() {
  const topics = await prisma.topic.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      _count: {
        select: {
          subtopics: true,
          subscriptions: true,
          posts: true,
        },
      },
    },
  });

  return topics.map(toTopicListItem);
}

export async function getTopicById(topicId: string) {
  const topic = await prisma.topic.findUnique({
    where: {
      id: topicId,
    },
    include: {
      subtopics: {
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          sortOrder: true,
        },
      },
      _count: {
        select: {
          subtopics: true,
          subscriptions: true,
          posts: true,
        },
      },
    },
  });

  if (!topic) {
    return null;
  }

  const detail: TopicDetailItem = {
    id: topic.id,
    title: topic.title,
    slug: topic.slug,
    description: topic.description,
    tags: topic.tags,
    createdAt: topic.createdAt.toISOString(),
    updatedAt: topic.updatedAt.toISOString(),
    counts: {
      subtopics: topic._count.subtopics,
      subscriptions: topic._count.subscriptions,
      posts: topic._count.posts,
    },
    subtopics: topic.subtopics,
  };

  return detail;
}

export async function createTopic(input: {
  title: string;
  description?: string | null;
  tags?: string[] | string;
  createdById?: string | null;
}) {
  const title = input.title.trim();

  if (!title) {
    throw new CommunityError("Topic title is required.", 400);
  }

  const slug = await generateUniqueTopicSlug(title);
  const tags = Array.isArray(input.tags)
    ? normalizeTags(input.tags)
    : normalizeTags(
        typeof input.tags === "string"
          ? input.tags.split(",")
          : undefined
      );

  const topic = await prisma.topic.create({
    data: {
      title,
      slug,
      description: input.description?.trim() || null,
      tags,
      createdById: input.createdById ?? null,
    },
    include: {
      _count: {
        select: {
          subtopics: true,
          subscriptions: true,
          posts: true,
        },
      },
    },
  });

  return toTopicListItem(topic);
}

export async function listTopicPosts(topicId: string) {
  const posts = await prisma.discussionPost.findMany({
    where: {
      topicId,
    },
    orderBy: [{ createdAt: "desc" }],
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      subtopic: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
  });

  return posts.map(toTopicPostItem);
}

export async function createTopicPost(
  topicId: string,
  input: {
    body: string;
    authorId?: string | null;
    subtopicId?: string | null;
    parentPostId?: string | null;
  }
) {
  const body = input.body.trim();

  if (!body) {
    throw new CommunityError("Post body is required.", 400);
  }

  const topic = await prisma.topic.findUnique({
    where: {
      id: topicId,
    },
    select: {
      id: true,
    },
  });

  if (!topic) {
    throw new CommunityError("Topic not found.", 404);
  }

  if (input.subtopicId) {
    const subtopic = await prisma.subtopic.findUnique({
      where: {
        id: input.subtopicId,
      },
      select: {
        id: true,
        topicId: true,
      },
    });

    if (!subtopic) {
      throw new CommunityError("Subtopic not found.", 404);
    }

    if (subtopic.topicId !== topicId) {
      throw new CommunityError("Subtopic does not belong to the topic.", 400);
    }
  }

  if (input.parentPostId) {
    const parentPost = await prisma.discussionPost.findUnique({
      where: {
        id: input.parentPostId,
      },
      select: {
        id: true,
        topicId: true,
      },
    });

    if (!parentPost) {
      throw new CommunityError("Parent post not found.", 404);
    }

    if (parentPost.topicId !== topicId) {
      throw new CommunityError("Parent post does not belong to the topic.", 400);
    }
  }

  const post = await prisma.discussionPost.create({
    data: {
      authorId: input.authorId ?? null,
      topicId,
      subtopicId: input.subtopicId ?? null,
      parentPostId: input.parentPostId ?? null,
      body,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      subtopic: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      _count: {
        select: {
          replies: true,
        },
      },
    },
  });

  return toTopicPostItem(post);
}
