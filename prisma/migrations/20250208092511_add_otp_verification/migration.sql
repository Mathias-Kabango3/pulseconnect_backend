/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[licenseNumber]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[registrationNumber]` on the table `Hospital` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationNumber` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Hospital` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_userId_fkey";

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "availableFrom" TEXT,
ADD COLUMN     "availableTo" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "licenseNumber" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "yearsOfExperience" INTEGER;

-- AlterTable
ALTER TABLE "Hospital" ADD COLUMN     "acceptedInsuranceProviders" TEXT[],
ADD COLUMN     "availableBeds" INTEGER,
ADD COLUMN     "bedCapacity" INTEGER,
ADD COLUMN     "departments" TEXT[],
ADD COLUMN     "description" TEXT,
ADD COLUMN     "emergencyContact" TEXT,
ADD COLUMN     "facilities" TEXT[],
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "openingHours" TEXT,
ADD COLUMN     "operatingStatus" TEXT NOT NULL DEFAULT 'Open',
ADD COLUMN     "queueSystem" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0.0,
ADD COLUMN     "registrationNumber" TEXT NOT NULL,
ADD COLUMN     "services" TEXT[],
ADD COLUMN     "telemedicine" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "totalReviews" INTEGER DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "verifiedBy" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "hospitalId" INTEGER,
ADD COLUMN     "idNumber" TEXT,
ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "verificationDocument" TEXT;

-- DropTable
DROP TABLE "Admin";

-- CreateTable
CREATE TABLE "HospitalAdmin" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "hospitalId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HospitalAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HospitalAdmin_userId_hospitalId_key" ON "HospitalAdmin"("userId", "hospitalId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_licenseNumber_key" ON "Doctor"("licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_registrationNumber_key" ON "Hospital"("registrationNumber");

-- AddForeignKey
ALTER TABLE "HospitalAdmin" ADD CONSTRAINT "HospitalAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HospitalAdmin" ADD CONSTRAINT "HospitalAdmin_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
