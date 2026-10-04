export type BrandStatus = 'active' | 'inactive';

export interface Brand {
  id: number;
  name: string;
  origin: string;
  listedVehicles: number;
  status: BrandStatus;
  logoUrl?: string;
}

export interface BrandListResult {
  items: Brand[];
  total: number;
  page: number;
  pageSize: number;
}