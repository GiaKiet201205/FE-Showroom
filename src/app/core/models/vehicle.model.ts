export type VehicleStatus = 'available' | 'reserved' | 'sold' | 'draft';

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
}

export interface VehicleListResult {
    items: Vehicle[];
    total: number;
    page: number;
    pageSize: number;
}