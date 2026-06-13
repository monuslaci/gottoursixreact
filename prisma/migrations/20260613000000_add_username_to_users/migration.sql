ALTER TABLE "users" ADD COLUMN "username" TEXT;

WITH base_usernames AS (
  SELECT
    id,
    LOWER(
      REGEXP_REPLACE(
        COALESCE(
          NULLIF(BTRIM("name"), ''),
          SPLIT_PART(COALESCE("email", 'user'), '@', 1),
          "id"
        ),
        '[^a-zA-Z0-9]+',
        '-',
        'g'
      )
    ) AS base_username
  FROM "users"
),
ranked_usernames AS (
  SELECT
    id,
    base_username,
    ROW_NUMBER() OVER (PARTITION BY base_username ORDER BY id) AS row_number
  FROM base_usernames
)
UPDATE "users" AS users
SET "username" = CASE
  WHEN ranked_usernames.row_number = 1 THEN ranked_usernames.base_username
  ELSE ranked_usernames.base_username || '-' || ranked_usernames.row_number
END
FROM ranked_usernames
WHERE users.id = ranked_usernames.id;

ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
