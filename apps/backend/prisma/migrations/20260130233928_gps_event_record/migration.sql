-- CreateTable
CREATE TABLE "gps_events" (
    "id" TEXT NOT NULL,
    "car_id" VARCHAR(20) NOT NULL,
    "license_number" VARCHAR(20) NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION,
    "distance" DOUBLE PRECISION,
    "total_distance" DOUBLE PRECISION,
    "state" VARCHAR(20),
    "behavior" VARCHAR(20),
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gps_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gps_events_car_id_idx" ON "gps_events"("car_id");

-- CreateIndex
CREATE INDEX "gps_events_timestamp_idx" ON "gps_events"("timestamp");

-- AddForeignKey
ALTER TABLE "gps_events" ADD CONSTRAINT "gps_events_car_id_fkey" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
