ALTER TABLE "topics"
ADD COLUMN "deletedAt" TIMESTAMP(3);

CREATE INDEX "topics_deletedAt_idx" ON "topics"("deletedAt");
