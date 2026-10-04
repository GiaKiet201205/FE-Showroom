import { Brand } from '../../models/brand.model';

export const MOCK_BRANDS: Brand[] = [
  { id: 1, name: 'Lamborghini', origin: 'Italy', listedVehicles: 245, status: 'active' },
  { id: 2, name: 'Ferrari', origin: 'Italy', listedVehicles: 198, status: 'active' },
  { id: 3, name: 'Audi', origin: 'Germany', listedVehicles: 154, status: 'active' },
  { id: 4, name: 'Porsche', origin: 'Germany', listedVehicles: 182, status: 'active' },
  { id: 5, name: 'BMW', origin: 'Germany', listedVehicles: 110, status: 'active' },
  { id: 6, name: 'Bugatti', origin: 'France', listedVehicles: 85, status: 'inactive' },
  { id: 7, name: 'Maserati', origin: 'Italy', listedVehicles: 94, status: 'active' },
  { id: 8, name: 'Rolls-Royce', origin: 'Germany', listedVehicles: 72, status: 'active' },
  // { id: 9, name: 'McLaren', origin: 'Germany', listedVehicles: 72, status: 'active' },
  // { id: 10, name: 'Lexus', origin: 'Germany', listedVehicles: 72, status: 'active' },
  // { id: 11, name: 'Bentley', origin: 'Germany', listedVehicles: 72, status: 'active' }

];

export const MOCK_BRANDS_TOTAL = 32;