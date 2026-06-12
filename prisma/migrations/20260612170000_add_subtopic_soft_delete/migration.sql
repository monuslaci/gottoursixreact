-- AlterTable
ALTER TABLE "subtopics" ADD COLUMN "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "subtopics_deletedAt_idx" ON "subtopics"("deletedAt");
