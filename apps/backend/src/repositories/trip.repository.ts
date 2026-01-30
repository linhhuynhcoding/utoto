import prisma from "@/database";
import { Prisma } from "@/prisma/client";
import { CreateTrip, TripFilter, UpdateTrip } from "@utoto/shared";
import { CarMapper } from "@/utils/car.mapper";
import { CarRepository } from "./car.repository";

export class TripRepository {
  async findById(id: string) {
    const trip = await prisma.trips.findUnique({
      where: { trip_id: id },
      include: {
        cars: {
          include: CarRepository.includeAll,
        },
        users: true,
      },
    });

    if (!trip) return null;

    return {
      ...trip,
      cars: trip.cars ? CarMapper.mapToResponse(trip.cars) : null,
    };
  }

  async create(data: CreateTrip & { trip_id: string; status: string }) {
    return prisma.trips.create({
      data: {
        trip_id: data.trip_id,
        renter_id: data.renter_id,
        car_id: data.car_id,
        status: data.status,
        from_date: new Date(data.from_date),
        to_date: new Date(data.to_date),
        ship_method: data.ship_method,
        ship_fee: data.ship_fee ? new Prisma.Decimal(data.ship_fee) : undefined,
        rent_amount: new Prisma.Decimal(data.rent_amount),
        payment_id: data.payment_id ? BigInt(data.payment_id) : undefined,
      },
    });
  }

  async update(id: string, data: UpdateTrip) {
    return prisma.trips.update({
      where: { trip_id: id },
      data: {
        status: data.status,
        ship_method: data.ship_method,
        ship_fee: data.ship_fee ? new Prisma.Decimal(data.ship_fee) : undefined,
        rent_amount: data.rent_amount
          ? new Prisma.Decimal(data.rent_amount)
          : undefined,
        payment_id: data.payment_id ? BigInt(data.payment_id) : undefined,
      },
    });
  }

  async delete(id: string) {
    return prisma.trips.delete({
      where: { trip_id: id },
    });
  }

  async findAll(filter: TripFilter) {
    const where: Prisma.tripsWhereInput = {};

    if (filter.renter_id) where.renter_id = filter.renter_id;
    if (filter.car_id) where.car_id = filter.car_id;
    if (filter.status) where.status = filter.status;
    if (filter.owner_id) {
      where.cars = {
        owner: filter.owner_id,
      };
    }
    if (filter.from_date_start || filter.from_date_end) {
      where.from_date = {
        gte: filter.from_date_start
          ? new Date(filter.from_date_start)
          : undefined,
        lte: filter.from_date_end ? new Date(filter.from_date_end) : undefined,
      };
    }

    const { page, limit } = filter;
    const skip = (page - 1) * limit;

    const [total, trips] = await Promise.all([
      prisma.trips.count({ where }),
      prisma.trips.findMany({
        where,
        skip,
        take: limit,
        orderBy: { from_date: "desc" },
        include: {
          cars: {
            include: CarRepository.includeAll,
          },
          users: true,
        },
      }),
    ]);

    return {
      trips: trips.map((trip) => ({
        ...trip,
        cars: trip.cars ? CarMapper.mapToResponse(trip.cars) : null,
      })),
      total,
      page,
      limit,
    };
  }
}
