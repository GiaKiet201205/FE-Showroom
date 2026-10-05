import { TestDriveBooking, TestDriveStats } from '../../models/test-drive.model';

export const MOCK_TEST_DRIVE_STATS: TestDriveStats = {
  totalBookings: 1482,
  totalBookingsGrowth: 12.3,
  pending: 28,
  pendingGrowth: 2.5,
  confirmed: 1120,
  confirmedGrowth: 8.1,
  completed: 334,
  completedGrowth: 14.5
};

export const MOCK_TEST_DRIVES: TestDriveBooking[] = [
  { id: 'TD-8402', customerName: 'Marcus Sterling', vehicleName: 'Porsche Taycan Turbo S', preferredDate: 'Oct 24, 2024', timeSlot: '10:30 AM', location: 'Austin North', status: 'confirmed' },
  { id: 'TD-8403', customerName: 'Helena Vance', vehicleName: 'BMW M4 Coupe', preferredDate: 'Oct 24, 2024', timeSlot: '01:15 PM', location: 'Austin Downtown', status: 'pending' },
  { id: 'TD-8404', customerName: 'Julian Brooks', vehicleName: 'Tesla Model S Plaid', preferredDate: 'Oct 25, 2024', timeSlot: '09:00 AM', location: 'Austin North', status: 'completed' },
  { id: 'TD-8405', customerName: 'Clara Oswald', vehicleName: 'Audi RS Q8', preferredDate: 'Oct 25, 2024', timeSlot: '03:45 PM', location: 'Austin Downtown', status: 'confirmed' },
  { id: 'TD-8406', customerName: 'Sarah Connor', vehicleName: 'Mercedes-Benz AMG GT', preferredDate: 'Oct 26, 2024', timeSlot: '11:00 AM', location: 'Austin North', status: 'confirmed' },
  { id: 'TD-8407', customerName: 'David Miller', vehicleName: 'Tesla Model 3', preferredDate: 'Oct 26, 2024', timeSlot: '02:30 PM', location: 'Austin Downtown', status: 'cancelled' },
  { id: 'TD-8408', customerName: 'Emily Watson', vehicleName: 'Audi e-tron GT', preferredDate: 'Oct 27, 2024', timeSlot: '10:00 AM', location: 'Austin North', status: 'pending' },
  { id: 'TD-8409', customerName: 'Michael Chang', vehicleName: 'Porsche Taycan 4S', preferredDate: 'Oct 27, 2024', timeSlot: '04:00 PM', location: 'Austin Downtown', status: 'completed' }
];

export const MOCK_TEST_DRIVES_TOTAL = 92;