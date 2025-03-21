/*
  Warnings:

  - Added the required column `appointmentFrom` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `appointmentTo` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "operatingStatus" AS ENUM ('Closed', 'Open');

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "appointmentFrom" TEXT NOT NULL,
ADD COLUMN     "appointmentTo" TEXT NOT NULL;
