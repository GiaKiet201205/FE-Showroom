export type TestDriveBookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface TestDriveBooking {
  id: string; // ví dụ: TD-8402
  customerName: string;
  customerAvatarUrl?: string;
  vehicleName: string;
  vehicleImageUrl?: string;
  preferredDate: string;
  timeSlot: string;
  location: string;
  status: TestDriveBookingStatus;
}

export interface TestDriveStats {
  totalBookings: number;
  totalBookingsGrowth: number;
  pending: number;
  pendingGrowth: number;
  confirmed: number;
  confirmedGrowth: number;
  completed: number;
  completedGrowth: number;
}

export interface TestDriveListResult {
  items: TestDriveBooking[];
  total: number;
  page: number;
  pageSize: number;
  stats: TestDriveStats;
}
