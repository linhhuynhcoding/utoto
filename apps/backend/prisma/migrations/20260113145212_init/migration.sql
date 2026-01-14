-- CreateTable
CREATE TABLE "administrative_regions" (
    "id" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255) NOT NULL,
    "code_name" VARCHAR(255),
    "code_name_en" VARCHAR(255),

    CONSTRAINT "administrative_regions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "administrative_units" (
    "id" INTEGER NOT NULL,
    "full_name" VARCHAR(255),
    "full_name_en" VARCHAR(255),
    "short_name" VARCHAR(255),
    "short_name_en" VARCHAR(255),
    "code_name" VARCHAR(255),
    "code_name_en" VARCHAR(255),

    CONSTRAINT "administrative_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brands" (
    "brand_id" BIGINT NOT NULL,
    "brand_name" VARCHAR NOT NULL,
    "logo" VARCHAR NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("brand_id")
);

-- CreateTable
CREATE TABLE "car_features" (
    "car_id" VARCHAR(20) NOT NULL,
    "feature_id" VARCHAR(10) NOT NULL
);

-- CreateTable
CREATE TABLE "car_images" (
    "car_id" VARCHAR(20) NOT NULL,
    "image_url" VARCHAR NOT NULL
);

-- CreateTable
CREATE TABLE "car_models" (
    "model_id" BIGINT NOT NULL,
    "brand_id" BIGINT NOT NULL,
    "model_name" VARCHAR NOT NULL,

    CONSTRAINT "car_models_pkey" PRIMARY KEY ("model_id")
);

-- CreateTable
CREATE TABLE "cars" (
    "id" VARCHAR(20) NOT NULL,
    "owner" VARCHAR(20) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "desc" TEXT NOT NULL,
    "model_id" BIGINT NOT NULL,
    "transmission" VARCHAR(10) NOT NULL,
    "seat" INTEGER NOT NULL,
    "engine_type" VARCHAR(10) NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "priceWithPlatformFee" DECIMAL(12,2) NOT NULL,
    "deliveryFee" DECIMAL(12,2) DEFAULT 0,
    "deliveryRadius" INTEGER DEFAULT 20,
    "location_id" BIGINT,
    "batteryChargingPerPercentPrice" DECIMAL(12,2) DEFAULT 0,
    "batteryChargingPrice" DECIMAL(12,2) DEFAULT 0,
    "deodorisePrice" DECIMAL(12,2) DEFAULT 0,
    "washingPrice" DECIMAL(12,2) DEFAULT 0,
    "overTimePrice" DECIMAL(12,2) DEFAULT 0,
    "maxOverTimeHour" INTEGER DEFAULT 5,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "districts" (
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255),
    "full_name" VARCHAR(255),
    "full_name_en" VARCHAR(255),
    "code_name" VARCHAR(255),
    "province_code" VARCHAR(20),
    "administrative_unit_id" INTEGER,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "features" (
    "id" VARCHAR(10) NOT NULL,
    "logo" VARCHAR,
    "name" VARCHAR(100),

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "url" VARCHAR NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "desc" TEXT,

    CONSTRAINT "images_pkey" PRIMARY KEY ("url")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" BIGSERIAL NOT NULL,
    "lat" DOUBLE PRECISION,
    "lon" DOUBLE PRECISION,
    "ward_id" INTEGER NOT NULL,
    "district_id" INTEGER NOT NULL,
    "province_id" INTEGER NOT NULL,
    "street" VARCHAR(100) NOT NULL,
    "short_address" VARCHAR(100),

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "payment_id" BIGINT NOT NULL,
    "status" VARCHAR NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(12,2),
    "pay_at" TIMESTAMP(6),
    "tx_id_sepay" VARCHAR,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "provinces" (
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255),
    "full_name" VARCHAR(255) NOT NULL,
    "full_name_en" VARCHAR(255),
    "code_name" VARCHAR(255),
    "administrative_unit_id" INTEGER,
    "administrative_region_id" INTEGER,

    CONSTRAINT "provinces_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "trips" (
    "trip_id" VARCHAR(20) NOT NULL,
    "renter_id" VARCHAR(20) NOT NULL,
    "car_id" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "from_date" TIMESTAMP(6) NOT NULL,
    "to_date" TIMESTAMP(6) NOT NULL,
    "ship_method" INTEGER NOT NULL DEFAULT 1,
    "ship_fee" DECIMAL(12,2),
    "rent_amount" DECIMAL(12,2) NOT NULL,
    "payment_id" BIGINT,

    CONSTRAINT "trips_pkey" PRIMARY KEY ("trip_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(20) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR NOT NULL,
    "phone_number" VARCHAR(20) NOT NULL,
    "phone_code" VARCHAR(20) NOT NULL,
    "dob" DATE,
    "address_id" BIGINT,
    "avatar" VARCHAR,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "driver_license_code" VARCHAR,
    "driver_license_name" VARCHAR,
    "driver_license_dob" VARCHAR,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wards" (
    "code" VARCHAR(20) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "name_en" VARCHAR(255),
    "full_name" VARCHAR(255),
    "full_name_en" VARCHAR(255),
    "code_name" VARCHAR(255),
    "district_code" VARCHAR(20),
    "administrative_unit_id" INTEGER,

    CONSTRAINT "wards_pkey" PRIMARY KEY ("code")
);

-- CreateIndex
CREATE UNIQUE INDEX "car_features_car_id_feature_id_idx" ON "car_features"("car_id", "feature_id");

-- CreateIndex
CREATE UNIQUE INDEX "car_images_car_id_image_url_idx" ON "car_images"("car_id", "image_url");

-- CreateIndex
CREATE INDEX "idx_districts_province" ON "districts"("province_code");

-- CreateIndex
CREATE INDEX "idx_districts_unit" ON "districts"("administrative_unit_id");

-- CreateIndex
CREATE INDEX "idx_provinces_region" ON "provinces"("administrative_region_id");

-- CreateIndex
CREATE INDEX "idx_provinces_unit" ON "provinces"("administrative_unit_id");

-- CreateIndex
CREATE INDEX "idx_wards_district" ON "wards"("district_code");

-- CreateIndex
CREATE INDEX "idx_wards_unit" ON "wards"("administrative_unit_id");

-- AddForeignKey
ALTER TABLE "car_features" ADD CONSTRAINT "car_features_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "car_features" ADD CONSTRAINT "car_features_feature_id_fkey" FOREIGN KEY ("feature_id") REFERENCES "features"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "car_images" ADD CONSTRAINT "car_images_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "car_images" ADD CONSTRAINT "car_images_image_url_fkey" FOREIGN KEY ("image_url") REFERENCES "images"("url") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "car_models" ADD CONSTRAINT "car_models_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brands"("brand_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "car_models"("model_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_owner_fkey" FOREIGN KEY ("owner") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_administrative_unit_id_fkey" FOREIGN KEY ("administrative_unit_id") REFERENCES "administrative_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "districts" ADD CONSTRAINT "districts_province_code_fkey" FOREIGN KEY ("province_code") REFERENCES "provinces"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "provinces" ADD CONSTRAINT "provinces_administrative_region_id_fkey" FOREIGN KEY ("administrative_region_id") REFERENCES "administrative_regions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "provinces" ADD CONSTRAINT "provinces_administrative_unit_id_fkey" FOREIGN KEY ("administrative_unit_id") REFERENCES "administrative_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payments"("payment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "trips" ADD CONSTRAINT "trips_renter_id_fkey" FOREIGN KEY ("renter_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_fkey" FOREIGN KEY ("avatar") REFERENCES "images"("url") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wards" ADD CONSTRAINT "wards_administrative_unit_id_fkey" FOREIGN KEY ("administrative_unit_id") REFERENCES "administrative_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "wards" ADD CONSTRAINT "wards_district_code_fkey" FOREIGN KEY ("district_code") REFERENCES "districts"("code") ON DELETE NO ACTION ON UPDATE NO ACTION;
