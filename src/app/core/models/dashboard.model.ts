export interface DashboardStats {
  totalCars: number;
  totalCarsGrowth: number;
  totalUsers: number;
  totalUsersGrowth: number;
  totalTestDrives: number;
  totalTestDrivesGrowth: number;
  totalSales: number;
  totalSalesGrowth: number;
  revenue: number;
  revenueGrowth: number;
}

export interface SalesTrendPoint {
  month: string;
  revenue: number;
  salesTarget: number;
}

export interface VehicleCategoryStat {
  name: string;
  unitCount: number;
  percentage: number;
  color: string;
}

export interface RecentActivity {
  id: number;
  actorName: string;
  actorAvatarUrl?: string;
  description: string;
  createdAt: string;
}

export type VehicleListingStatus = 'available' | 'reserved' | 'sold';

export interface RecentVehicleListing {
  id: number;
  name: string;
  price: number;
  imageUrl?: string;
  status: VehicleListingStatus;
}

export type TestDriveStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface UpcomingTestDrive {
  id: number;
  customerName: string;
  customerAvatarUrl?: string;
  vehicleName: string;
  date: string;
  time: string;
  location: string;
  status: TestDriveStatus;
}

export interface DashboardOverview {
  stats: DashboardStats;
  salesTrend: SalesTrendPoint[];
  vehicleCategories: VehicleCategoryStat[];
  recentActivities: RecentActivity[];
  recentListings: RecentVehicleListing[];
  upcomingTestDrives: UpcomingTestDrive[];
}
