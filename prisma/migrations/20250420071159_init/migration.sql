-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetToken" TEXT DEFAULT '',
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);
