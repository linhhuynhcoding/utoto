-- AlterTable
ALTER TABLE "locations" ALTER COLUMN "ward_id" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "district_id" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "province_id" SET DATA TYPE VARCHAR(20);

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "provinces"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_district_id_fkey" FOREIGN KEY ("district_id") REFERENCES "districts"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "locations" ADD CONSTRAINT "locations_ward_id_fkey" FOREIGN KEY ("ward_id") REFERENCES "wards"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;
