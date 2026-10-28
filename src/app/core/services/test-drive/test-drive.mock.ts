import { TestDriveBooking, TestDriveBookingStatus, TestDriveStats } from '../../models/test-drive.model';
import { MOCK_USERS } from '../user/user.mock';
import { MOCK_VEHICLES } from '../vehicle/vehicle.mock';
import { MOCK_SELLERS } from '../seller/seller.mock';

const customers = MOCK_USERS.filter(user => user.role === 'user' && user.status === 'active');
const sellers = MOCK_SELLERS.filter(seller => seller.status === 'verified');
const slots = ['09:00 AM', '10:30 AM', '02:30 PM', '04:00 PM'];
const statuses: TestDriveBookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

// Each row has its own day/time pair, keeping customer and seller schedules conflict-free.
export const MOCK_TEST_DRIVES: TestDriveBooking[] = Array.from({ length: 48 }, (_, index) => {
  const customer = customers[index % customers.length];
  const vehicle = MOCK_VEHICLES[index % MOCK_VEHICLES.length];
  const seller = sellers[index % sellers.length];
  const status = statuses[index % statuses.length];
  const historical = status === 'completed' || status === 'cancelled';
  const day = String(1 + Math.floor(index / slots.length)).padStart(2, '0');
  return {
    id: `TD-${8402 + index}`, customerId: customer.id, vehicleId: vehicle.id, sellerId: seller.id,
    customerName: customer.fullName, customerAvatarUrl: customer.avatarUrl, sellerName: seller.fullName,
    vehicleName: `${vehicle.brand} ${vehicle.model}`, vehicleImageUrl: vehicle.imageUrl,
    preferredDate: `2026-${historical ? '10' : '11'}-${day}`,
    timeSlot: slots[index % slots.length], location: 'Showroom', status
  };
});
export const MOCK_TEST_DRIVES_TOTAL = MOCK_TEST_DRIVES.length;
export const MOCK_TEST_DRIVE_STATS: TestDriveStats = {
  totalBookings: MOCK_TEST_DRIVES.length, totalBookingsGrowth: 0,
  pending: MOCK_TEST_DRIVES.filter(booking => booking.status === 'pending').length, pendingGrowth: 0,
  confirmed: MOCK_TEST_DRIVES.filter(booking => booking.status === 'confirmed').length, confirmedGrowth: 0,
  completed: MOCK_TEST_DRIVES.filter(booking => booking.status === 'completed').length, completedGrowth: 0
};
