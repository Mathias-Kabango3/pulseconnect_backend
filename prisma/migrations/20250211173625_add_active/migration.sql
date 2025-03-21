/*
  Warnings:

  - You are about to drop the column `address` on the `Hospital` table. All the data in the column will be lost.
  - You are about to drop the column `otp` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `otpExpiresAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[hospitalId]` on the table `Address` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "AppointmentStatus" ADD VALUE 'COMPLETED';

-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "hospitalId" INTEGER;

-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "address";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "otp",
DROP COLUMN "otpExpiresAt",
DROP COLUMN "refreshToken",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Address_hospitalId_key" ON "Address"("hospitalId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE SET NULL ON UPDATE CASCADE;
