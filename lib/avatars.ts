const DEFAULT_AVATAR_PATHS = [
  "/avatars/alligator.png",
  "/avatars/arcticfox.png",
  "/avatars/badger.png",
  "/avatars/bear.png",
  "/avatars/beaver.png",
  "/avatars/bison.png",
  "/avatars/blackbear.png",
  "/avatars/boar.png",
  "/avatars/bordercollie.png",
  "/avatars/buffalo.png",
  "/avatars/bull.png",
  "/avatars/capybara.png",
  "/avatars/cat.png",
  "/avatars/chicken.png",
  "/avatars/cobra.png",
  "/avatars/coyote.png",
  "/avatars/crocodile.png",
  "/avatars/dolphin.png",
  "/avatars/eagle.png",
  "/avatars/elk.png",
  "/avatars/falcon.png",
  "/avatars/fox.png",
  "/avatars/goldeneagle.png",
  "/avatars/goldfish.png",
  "/avatars/gorilla.png",
  "/avatars/greathornedowl.png",
  "/avatars/grizzlybear.png",
  "/avatars/hammerheadshark.png",
  "/avatars/hippo.png",
  "/avatars/horse.png",
  "/avatars/husky.png",
  "/avatars/jaguar.png",
  "/avatars/kangaroo.png",
  "/avatars/koala.png",
  "/avatars/lion.png",
  "/avatars/lynx.png",
  "/avatars/meerkat.png",
  "/avatars/moose.png",
  "/avatars/mouse.png",
  "/avatars/otter.png",
  "/avatars/otter2.png",
  "/avatars/owl.png",
  "/avatars/panda.png",
  "/avatars/panther.png",
  "/avatars/parrot.png",
  "/avatars/platypus.png",
  "/avatars/polarbear.png",
  "/avatars/ram.png",
  "/avatars/raven.png",
  "/avatars/redpanda.png",
  "/avatars/rhino.png",
  "/avatars/rooster.png",
  "/avatars/rottweiler.png",
  "/avatars/shark.png",
  "/avatars/shepherdog.png",
  "/avatars/snail.png",
  "/avatars/snowleopard.png",
  "/avatars/stag.png",
  "/avatars/timberwolf.png",
  "/avatars/turtle.png",
  "/avatars/wiseturtle.png",
  "/avatars/wolf.png",
  "/avatars/wolverine.png",
  "/avatars/wombat.png",
] as const;

const DEFAULT_AVATAR_PATH_SET = new Set<string>(DEFAULT_AVATAR_PATHS);
const AVATAR_LABEL_OVERRIDES: Record<string, string> = {
  arcticfox: "Arctic Fox",
  blackbear: "Black Bear",
  bordercollie: "Border Collie",
  goldeneagle: "Golden Eagle",
  greathornedowl: "Great Horned Owl",
  grizzlybear: "Grizzly Bear",
  hammerheadshark: "Hammerhead Shark",
  polarbear: "Polar Bear",
  redpanda: "Red Panda",
  shepherdog: "Shepherd Dog",
  snowleopard: "Snow Leopard",
  timberwolf: "Timber Wolf",
  wiseturtle: "Wise Turtle",
};

export type AvatarOption = {
  path: string;
  label: string;
};

function humanizeAvatarFileName(path: string) {
  const fileName = path.split("/").pop()?.replace(/\.[^.]+$/, "") ?? path;
  const normalizedFileName = fileName.toLowerCase();
  const override = AVATAR_LABEL_OVERRIDES[normalizedFileName];

  if (override) {
    return override;
  }

  return normalizedFileName
    .replace(/(\d+)/g, " $1 ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const AVATAR_OPTIONS: AvatarOption[] = DEFAULT_AVATAR_PATHS.map((path) => ({
  path,
  label: humanizeAvatarFileName(path),
}));

export function getDefaultAvatarPath(...seedParts: Array<string | null | undefined>) {
  const seed = seedParts
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .join("|")
    .toLowerCase();

  if (!seed) {
    return DEFAULT_AVATAR_PATHS[0];
  }

  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return DEFAULT_AVATAR_PATHS[hash % DEFAULT_AVATAR_PATHS.length];
}

export function resolveAvatarPath(
  image: string | null | undefined,
  ...seedParts: Array<string | null | undefined>
) {
  if (typeof image === "string") {
    const trimmed = image.trim();

    if (trimmed.length > 0) {
      if (!trimmed.startsWith("/avatars/")) {
        return trimmed;
      }

      if (DEFAULT_AVATAR_PATH_SET.has(trimmed)) {
        return trimmed;
      }
    }
  }

  return getDefaultAvatarPath(...seedParts);
}
