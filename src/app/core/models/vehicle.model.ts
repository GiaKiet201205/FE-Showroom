export type VehicleStatus =
  | 'available'
  | 'reserved'
  | 'sold'
  | 'draft';

export type VehicleCondition =
  | 'new'
  | 'used';


export interface VehicleSeller {
  name: string;
  avatar: string;

  rating: number;
  reviews: number;

  address: string;
  phone: string;
}


export interface VehicleSpecification {
  label: string;
  value: string;
}


export interface Vehicle {

  id: number;

  brand: string;
  model: string;

  year: number;

  price: number;

  mileage: number;

  color: string;

  imageUrl?: string;

  status: VehicleStatus;


  // ================================
  // USER PAGE
  // ================================

  condition?: VehicleCondition;

  fuelType?: string;

  transmission?: string;

  bodyType?: string;

  engine?: string;

  horsepower?: string;

  drivetrain?: string;

  featured?: boolean;

  listingId?: string;

  images?: string[];

  seller?: VehicleSeller;

  highlights?: string[];

  description?: string;

}


export interface VehicleListResult {

  items: Vehicle[];

  total: number;

  page: number;

  pageSize: number;

}