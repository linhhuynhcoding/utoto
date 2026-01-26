-- AlterTable
ALTER TABLE "cars" ADD COLUMN     "is_long_term" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_self_driving" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_with_driver" BOOLEAN NOT NULL DEFAULT false;
