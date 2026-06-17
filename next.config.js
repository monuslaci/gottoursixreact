/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@heroui/aria-utils",
    "@heroui/button",
    "@heroui/card",
    "@heroui/dom-animation",
    "@heroui/framer-utils",
    "@heroui/link",
    "@heroui/popover",
    "@heroui/react",
    "@heroui/react-utils",
    "@heroui/ripple",
    "@heroui/shared-icons",
    "@heroui/shared-utils",
    "@heroui/system",
    "@heroui/system-rsc",
    "@heroui/theme",
    "@heroui/tooltip",
    "@heroui/use-aria-button",
    "@heroui/use-aria-link",
    "@heroui/use-aria-overlay",
    "@heroui/use-callback-ref",
    "@heroui/use-safe-layout-effect",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

module.exports = nextConfig;
