import prisma from "@/database";
import { CreateCar, UpdateCar, CarFilter, CarResponse } from "@utoto/shared";
import { Prisma } from "@/prisma/client";
import { generateId } from "@/utils/id.util";

export class CarRepository {
  private static includeAll = {
    car_models: {
      include: {
        brands: true,
      },
    },
    car_features: {
      include: {
        features: true,
      },
    },
    car_images: true,
    locations: {
      include: {
        // We might want to join with provinces, districts, wards if needed
        // but for now let's keep it simple as per DTO
      },
    },
  };

  private mapToResponse(car: any): CarResponse {
    return {
      id: car.id,
      owner: car.owner,
      name: car.name,
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
      maxOverTimeHour: car.maxOverTimeHour || 0,
      brand: {
        id: car.car_models.brands.brand_id.toString(),
        name: car.car_models.brands.brand_name,
        logo: car.car_models.brands.logo,
      },
      model: {
        id: car.car_models.model_id.toString(),
        name: car.car_models.model_name,
      },
      features: car.car_features.map((cf: any) => ({
        id: cf.features.id,
        name: cf.features.name,
        logo: cf.features.logo,
      })),
      images: car.car_images.map((ci: any) => ci.image_url),
      location: car.locations
        ? {
            id: car.locations.id.toString(),
            lat: car.locations.lat,
            lon: car.locations.lon,
            street: car.locations.street,
            province: car.locations.province_id.toString(), // Simplified for now
            district: car.locations.district_id.toString(),
            ward: car.locations.ward_id.toString(),
          }
        : null,
    };
  }

  async create(ownerId: string, data: CreateCar): Promise<CarResponse> {
    const { feature_ids, image_urls, address, ...carData } = data;

    let locationId = carData.location_id ? BigInt(carData.location_id) : null;

    if (address) {
      const location = await prisma.locations.create({
        data: {
          street: address.street,
          province_id: parseInt(address.province),
          district_id: parseInt(address.district),
          ward_id: parseInt(address.ward),
        },
      });
      locationId = location.id;
    }

    if (image_urls && image_urls.length > 0) {
      await prisma.images.createMany({
        data: image_urls.map((url) => ({
          url,
          width: 0,
          height: 0,
        })),
        skipDuplicates: true,
      });
    }

    const car = await prisma.cars.create({
      data: {
        ...carData,
        id: generateId(20),
        owner: ownerId,
        model_id: BigInt(carData.model_id),
        location_id: locationId,
        price: new Prisma.Decimal(carData.price),
        priceWithPlatformFee: new Prisma.Decimal(carData.price * 1.1), // Example platform fee
        deliveryFee: new Prisma.Decimal(carData.deliveryFee || 0),
        batteryChargingPerPercentPrice: new Prisma.Decimal(
          carData.batteryChargingPerPercentPrice || 0,
        ),
        batteryChargingPrice: new Prisma.Decimal(
          carData.batteryChargingPrice || 0,
        ),
        deodorisePrice: new Prisma.Decimal(carData.deodorisePrice || 0),
        washingPrice: new Prisma.Decimal(carData.washingPrice || 0),
        overTimePrice: new Prisma.Decimal(carData.overTimePrice || 0),
        car_features: {
          create: feature_ids?.map((id) => ({ feature_id: id })),
        },
        car_images: {
          create: image_urls?.map((url) => ({ image_url: url })),
        },
      },
      include: CarRepository.includeAll,
    });

    return this.mapToResponse(car);
  }

  async findById(id: string): Promise<CarResponse | null> {
    const car = await prisma.cars.findUnique({
      where: { id },
      include: CarRepository.includeAll,
    });

    return car ? this.mapToResponse(car) : null;
  }

  async update(id: string, data: UpdateCar): Promise<CarResponse> {
    const { feature_ids, image_urls, ...carData } = data;

    // Update basic info
    const updateData: any = { ...carData };
    if (carData.model_id) updateData.model_id = BigInt(carData.model_id);
    if (carData.location_id)
      updateData.location_id = BigInt(carData.location_id);
    if (carData.price) {
      updateData.price = new Prisma.Decimal(carData.price);
      updateData.priceWithPlatformFee = new Prisma.Decimal(carData.price * 1.1);
    }

    // Handle relationships if provided
    if (feature_ids) {
      updateData.car_features = {
        deleteMany: {},
        create: feature_ids.map((fid) => ({ feature_id: fid })),
      };
    }

    if (image_urls && image_urls.length > 0) {
      await prisma.images.createMany({
        data: image_urls.map((url) => ({
          url,
          width: 0,
          height: 0,
        })),
        skipDuplicates: true,
      });

      updateData.car_images = {
        deleteMany: {},
        create: image_urls.map((url) => ({ image_url: url })),
      };
    }

    const car = await prisma.cars.update({
      where: { id },
      data: updateData,
      include: CarRepository.includeAll,
    });

    return this.mapToResponse(car);
  }

  async delete(id: string): Promise<void> {
    await prisma.$transaction([
      prisma.car_features.deleteMany({ where: { car_id: id } }),
      prisma.car_images.deleteMany({ where: { car_id: id } }),
      prisma.cars.delete({ where: { id } }),
    ]);
  }

  async findMany(
    filter: CarFilter,
  ): Promise<{ items: CarResponse[]; total: number }> {
    const { page = 1, limit = 10, ...filters } = filter;
    const skip = (page - 1) * limit;

    const where: Prisma.carsWhereInput = {};

    if (filters.brand_id) {
      where.car_models = { brand_id: BigInt(filters.brand_id) };
    }
    if (filters.model_id) {
      where.model_id = BigInt(filters.model_id);
    }
    if (filters.transmission) {
      where.transmission = filters.transmission;
    }
    if (filters.seat) {
      where.seat = filters.seat;
    }
    if (filters.engine_type) {
      where.engine_type = filters.engine_type;
    }
    if (filters.location_id) {
      where.location_id = BigInt(filters.location_id);
    }

    if (filters.min_price !== undefined || filters.max_price !== undefined) {
      where.price = {};
      if (filters.min_price !== undefined)
        where.price.gte = new Prisma.Decimal(filters.min_price);
      if (filters.max_price !== undefined)
        where.price.lte = new Prisma.Decimal(filters.max_price);
    }

    if (filters.features && filters.features.length > 0) {
      where.car_features = {
        every: {
          feature_id: { in: filters.features },
        },
      };
      // Note: "every" might not be what we want if we want cars that have ALL specified features.
      // Usually, we want cars that have AT LEAST all specified features.
      // For "at least all", we might need multiple AND conditions or a more complex query.
      where.AND = filters.features.map((fid) => ({
        car_features: {
          some: { feature_id: fid },
        },
      }));
    }

    const [items, total] = await Promise.all([
      prisma.cars.findMany({
        where,
        include: CarRepository.includeAll,
        skip,
        take: limit,
        orderBy: { price: "asc" },
      }),
      prisma.cars.count({ where }),
    ]);

    return {
      items: items.map((car) => this.mapToResponse(car)),
      total,
    };
  }
}
