import type { Metadata } from "next";

const SITE_NAME = "Got Your Six";
const DEFAULT_DESCRIPTION =
  "A support community for men to find practical guidance, join topic-based discussions, and build trusted connections.";
const DEFAULT_OG_IMAGE = "/logo.png";

function normalizeSiteUrl(value?: string | null) {
  const fallback = "http://localhost:3000";

  try {
    const url = new URL(value || fallback);
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return url;
  } catch {
    return new URL(fallback);
  }
}

export const siteUrl = normalizeSiteUrl(process.env.NEXTAUTH_URL);

export function getSiteUrl() {
  return siteUrl.toString().replace(/\/$/, "");
}

export function getCanonicalUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

type BuildMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: string;
};

export function buildMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  keywords = [],
  noIndex = false,
  image = DEFAULT_OG_IMAGE,
}: BuildMetadataInput = {}): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonical = getCanonicalUrl(path);
  const openGraphImage = new URL(image, siteUrl).toString();

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: openGraphImage,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [openGraphImage],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}
