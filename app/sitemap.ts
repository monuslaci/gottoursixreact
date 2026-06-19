import type { MetadataRoute } from "next";

import { getTopicById, listTopics } from "@/lib/community";
import { getCanonicalUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: getCanonicalUrl("/"),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: getCanonicalUrl("/topics"),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: getCanonicalUrl("/rules"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: getCanonicalUrl("/terms"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const topics = await listTopics();
    const topicEntries = await Promise.all(
      topics.map(async (topic) => {
        const detail = await getTopicById(topic.id);

        return {
          url: getCanonicalUrl(`/topics/${topic.id}`),
          lastModified: detail?.updatedAt || topic.updatedAt,
          changeFrequency: "daily" as const,
          priority: 0.8,
        };
      })
    );

    return [...staticRoutes, ...topicEntries];
  } catch {
    return staticRoutes;
  }
}
