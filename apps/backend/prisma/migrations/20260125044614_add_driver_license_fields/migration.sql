-- AlterTable
ALTER TABLE "users" ADD COLUMN     "driver_license_class" VARCHAR,
ADD COLUMN     "driver_license_expiry_date" VARCHAR,
ADD COLUMN     "driver_license_image_back" VARCHAR,
ADD COLUMN     "driver_license_image_front" VARCHAR,
ADD COLUMN     "driver_license_issue_date" VARCHAR;
