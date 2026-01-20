import prisma from "@/database";
import { Province, District, Ward } from "@utoto/shared";

export class LocationRepository {
  private naturalSort(a: string, b: string): number {
    const extractNumber = (s: string) => {
      const match = s.match(/\d+/);
      return match ? parseInt(match[0], 10) : null;
    };

    const numA = extractNumber(a);
    const numB = extractNumber(b);

    if (numA !== null && numB !== null) {
      if (numA !== numB) return numA - numB;
      return a.localeCompare(b, "vi");
    }

    if (numA !== null) return -1;
    if (numB !== null) return 1;

    return a.localeCompare(b, "vi");
  }

  async findProvinces(): Promise<Province[]> {
    const provinces = await prisma.provinces.findMany({
      orderBy: { name: "asc" },
    });
    return provinces.map((p) => ({
      code: p.code,
      name: p.name,
      full_name: p.full_name,
    }));
  }

  async findDistrictsByProvince(provinceCode: string): Promise<District[]> {
    const districts = await prisma.districts.findMany({
      where: { province_code: provinceCode },
    });

    return districts
      .map((d) => ({
        code: d.code,
        name: d.name,
        full_name: d.full_name,
        province_code: d.province_code,
      }))
      .sort((a, b) => this.naturalSort(a.name, b.name));
  }

  async findWardsByDistrict(districtCode: string): Promise<Ward[]> {
    const wards = await prisma.wards.findMany({
      where: { district_code: districtCode },
    });

    return wards
      .map((w) => ({
        code: w.code,
        name: w.name,
        full_name: w.full_name,
        district_code: w.district_code,
      }))
      .sort((a, b) => this.naturalSort(a.name, b.name));
  }
}
