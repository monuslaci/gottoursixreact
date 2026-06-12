-- CreateEnum
CREATE TYPE "SuggestionKind" AS ENUM ('TOPIC', 'SUBTOPIC');

-- CreateEnum
CREATE TYPE "SuggestionStatus" AS ENUM ('PENDING', 'REVIEWED', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "suggestions" (
    "id" TEXT NOT NULL,
    "kind" "SuggestionKind" NOT NULL,
    "topicId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "SuggestionStatus" NOT NULL DEFAULT 'PENDING',
    "suggestedById" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "suggestions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "suggestions_kind_idx" ON "suggestions"("kind");

-- CreateIndex
CREATE INDEX "suggestions_status_idx" ON "suggestions"("status");

-- CreateIndex
CREATE INDEX "suggestions_topicId_idx" ON "suggestions"("topicId");

-- CreateIndex
CREATE INDEX "suggestions_suggestedById_idx" ON "suggestions"("suggestedById");

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topics"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_suggestedById_fkey" FOREIGN KEY ("suggestedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "suggestions" ADD CONSTRAINT "suggestions_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
