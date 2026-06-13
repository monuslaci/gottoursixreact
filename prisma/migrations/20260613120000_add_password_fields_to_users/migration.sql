-- Add password support for local login
ALTER TABLE "users"
ADD COLUMN "passwordHash" TEXT;

ALTER TABLE "users"
ADD COLUMN "passwordSalt" TEXT;
