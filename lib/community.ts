import { resolveAvatarPath } from "@/lib/avatars";
import { prisma } from "@/lib/prisma";

export type TopicListItem = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  tags: string[];
  deletedAt: string | null;
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
  isEdited: boolean;
  author: {
    id: string;
    username: string;
    image: string | null;
  } | null;
  subtopic: {
    id: string;
    title: string;
    slug: string;
  } | null;
  parentPostId: string | null;
  replyCount: number;
  likeCount: number;
  likedByMe: boolean;
  replies: TopicPostItem[];
};

export type RecentConversationItem = {
  id: string;
  body: string;
  createdAt: string;
  replyCount: number;
  author: {
    id: string;
    username: string;
    image: string | null;
  } | null;
  topic: {
    id: string;
    title: string;
    slug: string;
  } | null;
  subtopic: {
    id: string;
    title: string;
    slug: string;
  } | null;
};

export type MyPostActivityItem = {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  topic: {
    id: string;
    title: string;
    slug: string;
  } | null;
  subtopic: {
    id: string;
    title: string;
    slug: string;
  } | null;
  parentPost: {
    id: string;
    body: string;
    author: {
      id: string;
      username: string;
      image: string | null;
    } | null;
  } | null;
};

export type MyPostActivityPayload = {
  posts: MyPostActivityItem[];
  comments: MyPostActivityItem[];
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

export type SubtopicListItem = {
  id: string;
  topicId: string;
  title: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  topic: {
    id: string;
    title: string;
    slug: string;
  };
  counts: {
    posts: number;
    subscriptions: number;
  };
};

export type SuggestionListItem = {
  id: string;
  kind: "TOPIC" | "SUBTOPIC";
  topicId: string | null;
  title: string;
  description: string | null;
  status: "PENDING" | "REVIEWED" | "APPROVED" | "REJECTED";
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  topic: {
    id: string;
    title: string;
    slug: string;
  } | null;
  suggestedBy: {
    id: string;
    username: string;
    email: string | null;
  } | null;
  reviewedBy: {
    id: string;
    username: string;
    email: string | null;
  } | null;
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

function toSubtopicListItem(subtopic: {
  id: string;
  topicId: string;
  title: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  topic: {
    id: string;
    title: string;
    slug: string;
  };
  _count: {
    posts: number;
    subscriptions: number;
  };
}): SubtopicListItem {
  return {
    id: subtopic.id,
    topicId: subtopic.topicId,
    title: subtopic.title,
    slug: subtopic.slug,
    description: subtopic.description,
    sortOrder: subtopic.sortOrder,
    deletedAt: subtopic.deletedAt?.toISOString() ?? null,
    createdAt: subtopic.createdAt.toISOString(),
    updatedAt: subtopic.updatedAt.toISOString(),
    topic: subtopic.topic,
    counts: {
      posts: subtopic._count.posts,
      subscriptions: subtopic._count.subscriptions,
    },
  };
}

function toSuggestionListItem(suggestion: {
  id: string;
  kind: "TOPIC" | "SUBTOPIC";
  topicId: string | null;
  title: string;
  description: string | null;
  status: "PENDING" | "REVIEWED" | "APPROVED" | "REJECTED";
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  topic: {
    id: string;
    title: string;
    slug: string;
  } | null;
  suggestedBy: {
    id: string;
    username: string;
    email: string | null;
  } | null;
  reviewedBy: {
    id: string;
    username: string;
    email: string | null;
  } | null;
}): SuggestionListItem {
  return {
    id: suggestion.id,
    kind: suggestion.kind,
    topicId: suggestion.topicId,
    title: suggestion.title,
    description: suggestion.description,
    status: suggestion.status,
    reviewedAt: suggestion.reviewedAt?.toISOString() ?? null,
    createdAt: suggestion.createdAt.toISOString(),
    updatedAt: suggestion.updatedAt.toISOString(),
    topic: suggestion.topic,
    suggestedBy: suggestion.suggestedBy,
    reviewedBy: suggestion.reviewedBy,
  };
}

function buildTopicListItem(
  topic: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    tags: string[];
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: {
      subscriptions: number;
      posts: number;
      subtopics?: number;
    };
  },
  subtopicCount?: number
): TopicListItem {
  return {
    id: topic.id,
    title: topic.title,
    slug: topic.slug,
    description: topic.description,
    tags: topic.tags,
    deletedAt: topic.deletedAt?.toISOString() ?? null,
    createdAt: topic.createdAt.toISOString(),
    updatedAt: topic.updatedAt.toISOString(),
    counts: {
      subtopics: subtopicCount ?? topic._count.subtopics ?? 0,
      subscriptions: topic._count.subscriptions,
      posts: topic._count.posts,
    },
  };
}

function toTopicListItem(topic: {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  tags: string[];
  deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: {
      subscriptions: number;
      posts: number;
      subtopics?: number;
    };
}): TopicListItem {
  return buildTopicListItem(topic);
}

type TopicPostRecord = {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    username: string;
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
    likes: number;
  };
  likes?: Array<{
    userId: string;
  }>;
};

function toTopicPostItem(post: TopicPostRecord): TopicPostItem {
  return {
    id: post.id,
    body: post.body,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    isEdited: post.updatedAt.getTime() > post.createdAt.getTime(),
    author: post.author
      ? {
          ...post.author,
          image: resolveAvatarPath(post.author.image, post.author.username, post.author.id),
        }
      : null,
    subtopic: post.subtopic,
    parentPostId: post.parentPostId,
    replyCount: post._count.replies,
    likeCount: post._count.likes,
    likedByMe: Boolean(post.likes?.length),
    replies: [],
  };
}

function buildTopicPostTree(posts: TopicPostRecord[]) {
  const items = posts.map(toTopicPostItem);
  const postMap = new Map(items.map((item) => [item.id, item]));
  const roots: TopicPostItem[] = [];

  for (const item of items) {
    if (item.parentPostId) {
      const parent = postMap.get(item.parentPostId);

      if (parent) {
        parent.replies.push(item);
        continue;
      }
    }

    roots.push(item);
  }

  return roots;
}

function mapMyPostActivityItem(post: {
  id: string;
  body: string;
  createdAt: Date;
  updatedAt: Date;
  topic: {
    id: string;
    title: string;
    slug: string;
  } | null;
  subtopic: {
    id: string;
    title: string;
    slug: string;
  } | null;
  parentPost: {
    id: string;
    body: string;
    author: {
      id: string;
      username: string;
      image: string | null;
    } | null;
  } | null;
}): MyPostActivityItem {
  return {
    id: post.id,
    body: post.body,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    isEdited: post.updatedAt.getTime() > post.createdAt.getTime(),
    topic: post.topic,
    subtopic: post.subtopic,
    parentPost: post.parentPost
      ? {
          id: post.parentPost.id,
          body: post.parentPost.body,
          author: post.parentPost.author
            ? {
                ...post.parentPost.author,
                image: resolveAvatarPath(
                  post.parentPost.author.image,
                  post.parentPost.author.username,
                  post.parentPost.author.id
                ),
              }
            : null,
        }
      : null,
  };
}

async function generateUniqueTopicSlug(title: string, excludeTopicId?: string) {
  const baseSlug = slugify(title) || "topic";
  const existingSlugs = await prisma.topic.findMany({
    where: {
      slug: {
        startsWith: baseSlug,
      },
      ...(excludeTopicId
        ? {
            NOT: {
              id: excludeTopicId,
            },
          }
        : {}),
    },
    select: {
      id: true,
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

async function generateUniqueSubtopicSlug(
  title: string,
  topicId: string,
  excludeSubtopicId?: string
) {
  const baseSlug = slugify(title) || "subtopic";
  const existingSlugs = await prisma.subtopic.findMany({
    where: {
      topicId,
      slug: {
        startsWith: baseSlug,
      },
      ...(excludeSubtopicId
        ? {
            NOT: {
              id: excludeSubtopicId,
            },
          }
        : {}),
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

async function countActiveSubtopics(topicId: string) {
  return prisma.subtopic.count({
    where: {
      topicId,
      deletedAt: null,
    },
  });
}

async function mapTopicsToListItems(
  topics: Array<{
    id: string;
    title: string;
    slug: string;
    description: string | null;
    tags: string[];
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: {
      subscriptions: number;
      posts: number;
      subtopics?: number;
    };
  }>
) {
  return Promise.all(
    topics.map(async (topic) =>
      buildTopicListItem(topic, await countActiveSubtopics(topic.id))
    )
  );
}

export async function listTopics() {
  const topics = await prisma.topic.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: [{ createdAt: "desc" }],
    include: {
      _count: {
        select: {
          subscriptions: true,
          posts: true,
        },
      },
    },
  });

  return mapTopicsToListItems(topics);
}

export async function listAdminTopics() {
  const topics = await prisma.topic.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      _count: {
        select: {
          subscriptions: true,
          posts: true,
        },
      },
    },
  });

  return mapTopicsToListItems(topics);
}

export async function getTopicById(topicId: string) {
  const topic = await prisma.topic.findUnique({
    where: {
      id: topicId,
    },
    include: {
      subtopics: {
        where: {
          deletedAt: null,
        },
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
          subscriptions: true,
          posts: true,
        },
      },
    },
  });

  if (!topic) {
    return null;
  }

  if (topic.deletedAt) {
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
      subtopics: topic.subtopics.length,
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
          subscriptions: true,
          posts: true,
        },
      },
    },
  });

  const activeSubtopicCount = await countActiveSubtopics(topic.id);

  return buildTopicListItem(topic, activeSubtopicCount);
}

export async function updateTopic(
  topicId: string,
  input: {
    title: string;
    description?: string | null;
    tags?: string[] | string;
  }
) {
  const existingTopic = await prisma.topic.findUnique({
    where: {
      id: topicId,
    },
    select: {
      id: true,
      title: true,
      deletedAt: true,
    },
  });

  if (!existingTopic || existingTopic.deletedAt) {
    throw new CommunityError("Topic not found.", 404);
  }

  const title = input.title.trim();

  if (!title) {
    throw new CommunityError("Topic title is required.", 400);
  }

  const slug =
    title === existingTopic.title
      ? undefined
      : await generateUniqueTopicSlug(title, topicId);

  const tags = Array.isArray(input.tags)
    ? normalizeTags(input.tags)
    : normalizeTags(
        typeof input.tags === "string"
          ? input.tags.split(",")
          : undefined
      );

  const topic = await prisma.topic.update({
    where: {
      id: topicId,
    },
    data: {
      title,
      ...(slug ? { slug } : {}),
      description: input.description?.trim() || null,
      tags,
    },
    include: {
      _count: {
        select: {
          subscriptions: true,
          posts: true,
        },
      },
    },
  });

  const activeSubtopicCount = await countActiveSubtopics(topic.id);

  return buildTopicListItem(topic, activeSubtopicCount);
}

export async function softDeleteTopic(topicId: string) {
  const existingTopic = await prisma.topic.findUnique({
    where: {
      id: topicId,
    },
    select: {
      id: true,
      deletedAt: true,
    },
  });

  if (!existingTopic || existingTopic.deletedAt) {
    throw new CommunityError("Topic not found.", 404);
  }

  const topic = await prisma.topic.update({
    where: {
      id: topicId,
    },
    data: {
      deletedAt: new Date(),
    },
    include: {
      _count: {
        select: {
          subscriptions: true,
          posts: true,
        },
      },
    },
  });

  const activeSubtopicCount = await countActiveSubtopics(topic.id);

  return buildTopicListItem(topic, activeSubtopicCount);
}

function buildPostInclude(viewerId?: string | null) {
  return {
    author: {
      select: {
        id: true,
        username: true,
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
    likes: viewerId
      ? {
          where: {
            userId: viewerId,
          },
          select: {
            userId: true,
          },
        }
      : false,
    _count: {
      select: {
        replies: true,
        likes: true,
      },
    },
  } as const;
}

export async function listTopicPosts(topicId: string, viewerId?: string | null) {
  const posts = await prisma.discussionPost.findMany({
    where: {
      topicId,
    },
    orderBy: [{ createdAt: "desc" }],
    include: buildPostInclude(viewerId),
  });

  return buildTopicPostTree(posts);
}

export async function listSubtopicPosts(subtopicId: string, viewerId?: string | null) {
  const subtopic = await prisma.subtopic.findUnique({
    where: {
      id: subtopicId,
    },
    select: {
      id: true,
      deletedAt: true,
    },
  });

  if (!subtopic || subtopic.deletedAt) {
    throw new CommunityError("Subtopic not found.", 404);
  }

  const posts = await prisma.discussionPost.findMany({
    where: {
      subtopicId,
    },
    orderBy: [{ createdAt: "desc" }],
    include: buildPostInclude(viewerId),
  });

  return buildTopicPostTree(posts);
}

export async function listRecentCommunityPosts(limit = 4) {
  const posts = await prisma.discussionPost.findMany({
    where: {
      parentPostId: null,
      topicId: {
        not: null,
      },
      topic: {
        deletedAt: null,
      },
    },
    orderBy: [{ createdAt: "desc" }],
    take: limit,
    include: {
      author: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      topic: {
        select: {
          id: true,
          title: true,
          slug: true,
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

  return posts.map((post): RecentConversationItem => ({
    id: post.id,
    body: post.body,
    createdAt: post.createdAt.toISOString(),
    replyCount: post._count.replies,
    author: post.author
      ? {
          ...post.author,
          image: resolveAvatarPath(post.author.image, post.author.username, post.author.id),
        }
      : null,
    topic: post.topic,
    subtopic: post.subtopic,
  }));
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
      deletedAt: true,
    },
  });

  if (!topic) {
    throw new CommunityError("Topic not found.", 404);
  }

  if (topic.deletedAt) {
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
        deletedAt: true,
      },
    });

    if (!subtopic) {
      throw new CommunityError("Subtopic not found.", 404);
    }

    if (subtopic.topicId !== topicId) {
      throw new CommunityError("Subtopic does not belong to the topic.", 400);
    }

    if (subtopic.deletedAt) {
      throw new CommunityError("Subtopic not found.", 404);
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
    include: buildPostInclude(input.authorId),
  });

  return toTopicPostItem(post);
}

export async function createSubtopicPost(
  subtopicId: string,
  input: {
    body: string;
    authorId?: string | null;
    parentPostId?: string | null;
  }
) {
  const subtopic = await prisma.subtopic.findUnique({
    where: {
      id: subtopicId,
    },
    select: {
      id: true,
      topicId: true,
      deletedAt: true,
    },
  });

  if (!subtopic || subtopic.deletedAt) {
    throw new CommunityError("Subtopic not found.", 404);
  }

  return createTopicPost(subtopic.topicId, {
    body: input.body,
    authorId: input.authorId ?? null,
    subtopicId,
    parentPostId: input.parentPostId ?? null,
  });
}

export async function updatePost(
  postId: string,
  input: {
    body: string;
    userId?: string | null;
    userEmail?: string | null;
  }
) {
  const user = await resolveUserFromIdentity({
    userId: input.userId ?? null,
    userEmail: input.userEmail ?? null,
  });
  const body = input.body.trim();

  if (!body) {
    throw new CommunityError("Post body is required.", 400);
  }

  const existingPost = await prisma.discussionPost.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!existingPost) {
    throw new CommunityError("Post not found.", 404);
  }

  if (existingPost.authorId !== user.id) {
    throw new CommunityError("You can only edit your own posts.", 403);
  }

  const post = await prisma.discussionPost.update({
    where: {
      id: postId,
    },
    data: {
      body,
    },
    include: buildPostInclude(user.id),
  });

  return toTopicPostItem(post);
}

export async function listMyPostActivity(userId: string): Promise<MyPostActivityPayload> {
  const [posts, comments] = await Promise.all([
    prisma.discussionPost.findMany({
      where: {
        authorId: userId,
        parentPostId: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        subtopic: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        parentPost: {
          select: {
            id: true,
            body: true,
            author: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
    }),
    prisma.discussionPost.findMany({
      where: {
        authorId: userId,
        parentPostId: {
          not: null,
        },
        parentPost: {
          authorId: {
            not: userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        topic: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        subtopic: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        parentPost: {
          select: {
            id: true,
            body: true,
            author: {
              select: {
                id: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
    }),
  ]);

  return {
    posts: posts.map(mapMyPostActivityItem),
    comments: comments.map(mapMyPostActivityItem),
  };
}

export async function likePost(
  postId: string,
  input: UserIdentityInput
) {
  const user = await resolveUserFromIdentity(input);

  const post = await prisma.discussionPost.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
    },
  });

  if (!post) {
    throw new CommunityError("Post not found.", 404);
  }

  await prisma.postLike.upsert({
    where: {
      postId_userId: {
        postId,
        userId: user.id,
      },
    },
    update: {},
    create: {
      postId,
      userId: user.id,
    },
  });

  const likeCount = await prisma.postLike.count({
    where: {
      postId,
    },
  });

  return {
    liked: true,
    likeCount,
  };
}

export async function unlikePost(
  postId: string,
  input: UserIdentityInput
) {
  const user = await resolveUserFromIdentity(input);

  const post = await prisma.discussionPost.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
    },
  });

  if (!post) {
    throw new CommunityError("Post not found.", 404);
  }

  await prisma.postLike.deleteMany({
    where: {
      postId,
      userId: user.id,
    },
  });

  const likeCount = await prisma.postLike.count({
    where: {
      postId,
    },
  });

  return {
    liked: false,
    likeCount,
  };
}

export async function listAdminSubtopics() {
  const subtopics = await prisma.subtopic.findMany({
    orderBy: [
      {
        topic: {
          title: "asc",
        },
      },
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
    include: {
      topic: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      _count: {
        select: {
          posts: true,
          subscriptions: true,
        },
      },
    },
  });

  return subtopics.map(toSubtopicListItem);
}

export async function createSubtopic(input: {
  topicId: string;
  title: string;
  description?: string | null;
  sortOrder?: number;
  createdById?: string | null;
}) {
  const title = input.title.trim();

  if (!title) {
    throw new CommunityError("Subtopic title is required.", 400);
  }

  const topic = await prisma.topic.findUnique({
    where: {
      id: input.topicId,
    },
    select: {
      id: true,
      deletedAt: true,
    },
  });

  if (!topic || topic.deletedAt) {
    throw new CommunityError("Topic not found.", 404);
  }

  const slug = await generateUniqueSubtopicSlug(title, input.topicId);
  const sortOrder =
    Number.isFinite(input.sortOrder) && input.sortOrder !== undefined
      ? input.sortOrder
      : await prisma.subtopic.count({
          where: {
            topicId: input.topicId,
            deletedAt: null,
          },
        });

  const subtopic = await prisma.subtopic.create({
    data: {
      topicId: input.topicId,
      title,
      slug,
      description: input.description?.trim() || null,
      sortOrder,
      createdById: input.createdById ?? null,
    },
    include: {
      topic: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      _count: {
        select: {
          posts: true,
          subscriptions: true,
        },
      },
    },
  });

  return toSubtopicListItem(subtopic);
}

export async function updateSubtopic(
  subtopicId: string,
  input: {
    title: string;
    description?: string | null;
    sortOrder?: number;
  }
) {
  const existingSubtopic = await prisma.subtopic.findUnique({
    where: {
      id: subtopicId,
    },
    select: {
      id: true,
      title: true,
      topicId: true,
      deletedAt: true,
    },
  });

  if (!existingSubtopic || existingSubtopic.deletedAt) {
    throw new CommunityError("Subtopic not found.", 404);
  }

  const title = input.title.trim();

  if (!title) {
    throw new CommunityError("Subtopic title is required.", 400);
  }

  const slug =
    title === existingSubtopic.title
      ? undefined
      : await generateUniqueSubtopicSlug(title, existingSubtopic.topicId, subtopicId);

  const subtopic = await prisma.subtopic.update({
    where: {
      id: subtopicId,
    },
    data: {
      title,
      ...(slug ? { slug } : {}),
      description: input.description?.trim() || null,
      ...(Number.isFinite(input.sortOrder) && input.sortOrder !== undefined
        ? { sortOrder: input.sortOrder }
        : {}),
    },
    include: {
      topic: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      _count: {
        select: {
          posts: true,
          subscriptions: true,
        },
      },
    },
  });

  return toSubtopicListItem(subtopic);
}

export async function softDeleteSubtopic(subtopicId: string) {
  const existingSubtopic = await prisma.subtopic.findUnique({
    where: {
      id: subtopicId,
    },
    select: {
      id: true,
      deletedAt: true,
    },
  });

  if (!existingSubtopic || existingSubtopic.deletedAt) {
    throw new CommunityError("Subtopic not found.", 404);
  }

  const subtopic = await prisma.subtopic.update({
    where: {
      id: subtopicId,
    },
    data: {
      deletedAt: new Date(),
    },
    include: {
      topic: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      _count: {
        select: {
          posts: true,
          subscriptions: true,
        },
      },
    },
  });

  return toSubtopicListItem(subtopic);
}

export async function listSuggestions() {
  const suggestions = await prisma.suggestion.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      topic: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      suggestedBy: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      reviewedBy: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return suggestions.map(toSuggestionListItem);
}

export async function createSuggestion(input: {
  kind: "TOPIC" | "SUBTOPIC";
  title: string;
  description?: string | null;
  topicId?: string | null;
  suggestedById?: string | null;
  suggestedByEmail?: string | null;
}) {
  const title = input.title.trim();

  if (!title) {
    throw new CommunityError("Suggestion title is required.", 400);
  }

  if (input.kind === "SUBTOPIC" && !input.topicId) {
    throw new CommunityError("A topic is required for subtopic suggestions.", 400);
  }

  if (input.topicId) {
    const topic = await prisma.topic.findUnique({
      where: {
        id: input.topicId,
      },
      select: {
        id: true,
        deletedAt: true,
      },
    });

    if (!topic || topic.deletedAt) {
      throw new CommunityError("Topic not found.", 404);
    }
  }

  const user = await resolveUserFromIdentity({
    userId: input.suggestedById ?? null,
    userEmail: input.suggestedByEmail ?? null,
  }).catch(() => null);

  const suggestion = await prisma.suggestion.create({
    data: {
      kind: input.kind,
      topicId: input.topicId ?? null,
      title,
      description: input.description?.trim() || null,
      suggestedById: user?.id ?? null,
    },
    include: {
      topic: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      suggestedBy: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      reviewedBy: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return toSuggestionListItem(suggestion);
}

export async function updateSuggestionStatus(
  suggestionId: string,
  input: {
    status: "PENDING" | "REVIEWED" | "APPROVED" | "REJECTED";
    reviewedById?: string | null;
    reviewedByEmail?: string | null;
  }
) {
  const existingSuggestion = await prisma.suggestion.findUnique({
    where: {
      id: suggestionId,
    },
    select: {
      id: true,
    },
  });

  if (!existingSuggestion) {
    throw new CommunityError("Suggestion not found.", 404);
  }

  const reviewer = await resolveUserFromIdentity({
    userId: input.reviewedById ?? null,
    userEmail: input.reviewedByEmail ?? null,
  }).catch(() => null);

  const suggestion = await prisma.suggestion.update({
    where: {
      id: suggestionId,
    },
    data: {
      status: input.status,
      reviewedAt: input.status === "PENDING" ? null : new Date(),
      reviewedById: input.status === "PENDING" ? null : reviewer?.id ?? null,
    },
    include: {
      topic: {
        select: {
          id: true,
          title: true,
          slug: true,
        },
      },
      suggestedBy: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      reviewedBy: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  return toSuggestionListItem(suggestion);
}

type UserIdentityInput = {
  userId?: string | null;
  userEmail?: string | null;
};

async function resolveUserFromIdentity(input: UserIdentityInput) {
  if (input.userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: input.userId,
      },
      select: {
        id: true,
      },
    });

    if (user) {
      return user;
    }
  }

  if (input.userEmail) {
    const email = input.userEmail.trim().toLowerCase();

    if (email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
        select: {
          id: true,
        },
      });

      if (user) {
        return user;
      }
    }
  }

  throw new CommunityError("User not found.", 404);
}

type SubscriptionUserInput = UserIdentityInput;

async function resolveSubscriptionUser(input: SubscriptionUserInput) {
  return resolveUserFromIdentity(input);
}

async function assertTopicExists(topicId: string) {
  const topic = await prisma.topic.findUnique({
    where: {
      id: topicId,
    },
    select: {
      id: true,
      deletedAt: true,
    },
  });

  if (!topic || topic.deletedAt) {
    throw new CommunityError("Topic not found.", 404);
  }
}

async function assertSubtopicExists(subtopicId: string) {
  const subtopic = await prisma.subtopic.findUnique({
    where: {
      id: subtopicId,
    },
    select: {
      id: true,
      deletedAt: true,
    },
  });

  if (!subtopic || subtopic.deletedAt) {
    throw new CommunityError("Subtopic not found.", 404);
  }
}

export async function getTopicSubscriptionStatus(
  topicId: string,
  input: SubscriptionUserInput
) {
  if (!input.userId && !input.userEmail) {
    return false;
  }

  const user = await resolveSubscriptionUser(input);

  const subscription = await prisma.topicSubscription.findUnique({
    where: {
      userId_topicId: {
        userId: user.id,
        topicId,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(subscription);
}

export async function getSubtopicSubscriptionStatus(
  subtopicId: string,
  input: SubscriptionUserInput
) {
  if (!input.userId && !input.userEmail) {
    return false;
  }

  const user = await resolveSubscriptionUser(input);

  const subscription = await prisma.subtopicSubscription.findUnique({
    where: {
      userId_subtopicId: {
        userId: user.id,
        subtopicId,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(subscription);
}

export async function subscribeToTopic(
  topicId: string,
  input: SubscriptionUserInput
) {
  await assertTopicExists(topicId);
  const user = await resolveSubscriptionUser(input);

  await prisma.topicSubscription.upsert({
    where: {
      userId_topicId: {
        userId: user.id,
        topicId,
      },
    },
    create: {
      userId: user.id,
      topicId,
    },
    update: {},
  });

  return true;
}

export async function unsubscribeFromTopic(
  topicId: string,
  input: SubscriptionUserInput
) {
  const user = await resolveSubscriptionUser(input);

  await prisma.topicSubscription.deleteMany({
    where: {
      userId: user.id,
      topicId,
    },
  });

  return true;
}

export async function subscribeToSubtopic(
  subtopicId: string,
  input: SubscriptionUserInput
) {
  await assertSubtopicExists(subtopicId);
  const user = await resolveSubscriptionUser(input);

  await prisma.subtopicSubscription.upsert({
    where: {
      userId_subtopicId: {
        userId: user.id,
        subtopicId,
      },
    },
    create: {
      userId: user.id,
      subtopicId,
    },
    update: {},
  });

  return true;
}

export async function unsubscribeFromSubtopic(
  subtopicId: string,
  input: SubscriptionUserInput
) {
  const user = await resolveSubscriptionUser(input);

  await prisma.subtopicSubscription.deleteMany({
    where: {
      userId: user.id,
      subtopicId,
    },
  });

  return true;
}
