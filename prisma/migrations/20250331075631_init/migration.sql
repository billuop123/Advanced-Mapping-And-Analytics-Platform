/*
  Warnings:

  - The `verifiedTokenExpiry` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "verifiedTokenExpiry",
ADD COLUMN     "verifiedTokenExpiry" TIMESTAMP(3);
