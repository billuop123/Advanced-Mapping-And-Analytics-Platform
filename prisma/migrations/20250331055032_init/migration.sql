-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verifiedToken" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "verifiedTokenExpiry" TEXT NOT NULL DEFAULT '';
