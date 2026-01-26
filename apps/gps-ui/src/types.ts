export interface GpsPoint {
  licenseNumber: string;
  lat: number;
  lng: number;
  timestamp?: number;
}

export interface Car {
  id: string;
  licenseNumber: string;
  model: string;
  brand: string;
}
