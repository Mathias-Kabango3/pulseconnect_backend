/*
  Warnings:

  - Made the column `hospitalId` on table `Doctor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `licenseNumber` on table `Doctor` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phoneNumber` on table `Doctor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Doctor" DROP CONSTRAINT "Doctor_hospitalId_fkey";

-- AlterTable
ALTER TABLE "Doctor" ALTER COLUMN "hospitalId" SET NOT NULL,
ALTER COLUMN "licenseNumber" SET NOT NULL,
ALTER COLUMN "phoneNumber" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
