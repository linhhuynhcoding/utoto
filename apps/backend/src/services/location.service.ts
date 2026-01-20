import { LocationRepository } from "../repositories/location.repository";
import { Province, District, Ward } from "@utoto/shared";

export class LocationService {
  private repository: LocationRepository;

  constructor() {
    this.repository = new LocationRepository();
  }

  async getProvinces(): Promise<Province[]> {
    return await this.repository.findProvinces();
  }

  async getDistricts(provinceCode: string): Promise<District[]> {
    return await this.repository.findDistrictsByProvince(provinceCode);
  }

  async getWards(districtCode: string): Promise<Ward[]> {
    return await this.repository.findWardsByDistrict(districtCode);
  }
}
