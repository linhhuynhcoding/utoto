import { CarRepository } from "../repositories/car.repository";
import { CreateCar, UpdateCar, CarFilter, CarResponse } from "@utoto/shared";

export class CarService {
  private repository: CarRepository;

  constructor() {
    this.repository = new CarRepository();
  }

  async createCar(ownerId: string, data: CreateCar): Promise<CarResponse> {
    // Business logic: check if owner exists? (handled by prisma FK usually)
    // Extra validation if needed
    return await this.repository.create(ownerId, data);
  }

  async getCarById(id: string): Promise<CarResponse | null> {
    return await this.repository.findById(id);
  }

  async updateCar(id: string, data: UpdateCar): Promise<CarResponse> {
    return await this.repository.update(id, data);
  }

  async deleteCar(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async searchCars(
    filter: CarFilter,
  ): Promise<{ items: CarResponse[]; total: number }> {
    return await this.repository.findMany(filter);
  }

  async getCarCalendar(carId: string) {
    return await this.repository.getCalendar(carId);
  }
}
