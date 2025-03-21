/*
  Warnings:

  - You are about to drop the column `zip` on the `Address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Address" DROP COLUMN "zip",
ADD COLUMN     "postalCode" TEXT;
