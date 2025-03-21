/*
  Warnings:

  - You are about to drop the column `appointmentTime` on the `Appointment` table. All the data in the column will be lost.
  - The `operatingStatus` column on the `Hospital` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "OperatingStatus" AS ENUM ('Closed', 'Open');

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "appointmentTime",
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD COLUMN     "startTime" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Hospital" DROP COLUMN "operatingStatus",
ADD COLUMN     "operatingStatus" "OperatingStatus" NOT NULL DEFAULT 'Open';

-- DropEnum
DROP TYPE "operatingStatus";
