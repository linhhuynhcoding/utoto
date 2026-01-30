import { CarResponse } from "@utoto/shared";

export class CarMapper {
  static mapToResponse(car: any): CarResponse {
    return {
      id: car.id,
      owner_id: car.owner,
      license_number: car.license_number,
      yom: car.yom,
      name:
        car.name != ""
          ? car.name
          : `${car.car_models?.brands?.brand_name?.toUpperCase() || ""} ${car.car_models?.model_name?.toUpperCase() || ""} ${car?.yom || ""}`.trim(),
      owner_info: car.users
        ? {
            name: car.users.name,
            avatar: car.users.avatar,
            isVerified: car.users.isVerified,
          }
        : undefined,
      desc: car.desc,
      model_id: car.model_id.toString(),
      transmission: car.transmission as any,
      seat: car.seat,
      engine_type: car.engine_type as any,
      price: Number(car.price),
      priceWithPlatformFee: Number(car.priceWithPlatformFee),
      deliveryFee: Number(car.deliveryFee || 0),
      deliveryRadius: car.deliveryRadius || 0,
      location_id: car.location_id?.toString(),
      batteryChargingPerPercentPrice: Number(
        car.batteryChargingPerPercentPrice || 0,
      ),
      batteryChargingPrice: Number(car.batteryChargingPrice || 0),
      deodorisePrice: Number(car.deodorisePrice || 0),
      washingPrice: Number(car.washingPrice || 0),
      overTimePrice: Number(car.overTimePrice || 0),
      maxOverTimeHour: car.maxOverTimeHour,
      is_self_driving: car.is_self_driving,
      is_with_driver: car.is_with_driver,
      is_long_term: car.is_long_term,
      brand: car.car_models?.brands
        ? {
            id: car.car_models.brands.brand_id.toString(),
            name: car.car_models.brands.brand_name,
            logo: car.car_models.brands.logo,
          }
        : (undefined as any),
      model: car.car_models
        ? {
            id: car.car_models.model_id.toString(),
            name: car.car_models.model_name,
          }
        : (undefined as any),
      features: car.car_features
        ? car.car_features.map((cf: any) => ({
            id: cf.features.id,
            name: cf.features.name,
            logo: cf.features.logo,
          }))
        : [],
      images: car.car_images
        ? car.car_images.map((ci: any) => ci.image_url)
        : [],
      location: car.locations
        ? {
            id: car.locations.id.toString(),
            lat: car.locations.lat,
            lon: car.locations.lon,
            street: car.locations.street,
            province: this.formatLocationName(car.locations.provinces),
            district: this.formatLocationName(car.locations.districts),
            ward: this.formatLocationName(car.locations.wards),
            province_id: car.locations.province_id,
            district_id: car.locations.district_id,
            ward_id: car.locations.ward_id,
          }
        : null,
    };
  }

  private static formatLocationName(entity: any): string {
    if (!entity) return "Unknown";

    const name = entity.name || "";
    const fullName = entity.full_name || "";
    const unitPrefix =
      entity.administrative_units?.full_name ||
      entity.administrative_units?.short_name ||
      "";

    if (fullName && fullName.length > name.length && fullName.includes(name)) {
      return fullName;
    }

    if (/^\d+$/.test(name) && unitPrefix) {
      return `${unitPrefix} ${name}`;
    }

    return fullName || name || "Unknown";
  }
}
