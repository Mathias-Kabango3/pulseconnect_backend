/*
  Warnings:

  - You are about to drop the column `appointmentFrom` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `appointmentTo` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `appointmentTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "appointmentFrom",
DROP COLUMN "appointmentTo",
ADD COLUMN     "appointmentTime" TEXT NOT NULL;
