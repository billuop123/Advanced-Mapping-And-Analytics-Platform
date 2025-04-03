/*
  Warnings:

  - The `verifiedTokenExpiry` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN DEFAULT false,
DROP COLUMN "verifiedTokenExpiry",
ADD COLUMN     "verifiedTokenExpiry" BIGINT DEFAULT 0;
