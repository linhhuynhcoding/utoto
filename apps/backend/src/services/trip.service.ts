import { TripRepository } from "@/repositories/trip.repository";
import { CreateTrip, TripFilter, UpdateTrip } from "@utoto/shared";
import { randomBytes } from "crypto";

export class TripService {
  private tripRepository: TripRepository;

  constructor() {
    this.tripRepository = new TripRepository();
  }

  async createTrip(data: CreateTrip) {
    const trip_id = randomBytes(4).toString("hex").toUpperCase(); // Simple ID generation
    // TODO: Validate car availability
    // TODO: Validate renter existence
    // TODO: Calculate rent amount if not provided or verify correctness

    return this.tripRepository.create({
      ...data,
      trip_id,
      status: "PENDING",
    });
  }

  async getTripById(id: string) {
    return this.tripRepository.findById(id);
  }

  async updateTrip(id: string, data: UpdateTrip) {
    const existingTrip = await this.tripRepository.findById(id);
    if (!existingTrip) {
      throw new Error("Trip not found");
    }
    return this.tripRepository.update(id, data);
  }

  async deleteTrip(id: string) {
    const existingTrip = await this.tripRepository.findById(id);
    if (!existingTrip) {
      throw new Error("Trip not found");
    }
    return this.tripRepository.delete(id);
  }

  async searchTrips(filter: TripFilter) {
    return this.tripRepository.findAll(filter);
  }
}
