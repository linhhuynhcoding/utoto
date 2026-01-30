/*
  Warnings:

  - A unique constraint covering the columns `[license_number]` on the table `cars` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `license_number` to the `cars` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "cars" ADD COLUMN     "license_number" VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "cars_license_number_key" ON "cars"("license_number");
