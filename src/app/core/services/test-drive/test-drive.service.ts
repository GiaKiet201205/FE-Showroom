import { Injectable, inject } from '@angular/core';
import { Observable, defer, of } from 'rxjs';
import { TestDriveListResult, TestDriveBooking, TestDriveInput } from '../../models/test-drive.model';
import { MOCK_TEST_DRIVES, MOCK_TEST_DRIVE_STATS } from './test-drive.mock';
import { UserService } from '../user/user.service';
import { SellerService } from '../seller/seller.service';
import { MockVehicleStore } from '../../mock/mock-vehicle.store';

export interface TestDriveQuery {
  search?: string;
  date?: string;
  status?: string;
  customerId?: number;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class TestDriveService {
  private users = inject(UserService);
  private sellers = inject(SellerService);
  private vehicles = inject(MockVehicleStore);
  private readonly storageKey = 'mock_test_drive_bookings';
  private bookings = this.readBookings();

  private readBookings(): TestDriveBooking[] {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(this.storageKey) ?? 'null');
      if (Array.isArray(saved) && saved.every(booking => booking &&
        typeof booking.id === 'string' && /^TD-\d+$/.test(booking.id) &&
        Number.isSafeInteger(booking.customerId) && Number.isSafeInteger(booking.sellerId) &&
        Number.isSafeInteger(booking.vehicleId) &&
        ['customerName', 'sellerName', 'vehicleName', 'preferredDate', 'timeSlot', 'location'].every(key => typeof booking[key] === 'string') &&
        ['pending', 'confirmed', 'completed', 'cancelled'].includes(booking.status))) {
        return saved;
      }
    } catch { /* Use seed data if saved bookings cannot be read. */ }
    return MOCK_TEST_DRIVES.map(booking => ({ ...booking }));
  }

  private persist(bookings: TestDriveBooking[]): void {
    // Save before changing memory so a storage failure leaves the current list intact.
    localStorage.setItem(this.storageKey, JSON.stringify(bookings));
    this.bookings = bookings;
  }

  constructor() { this.bookings.forEach(booking => this.retain(booking)); }

  getOptions(existing?: TestDriveBooking) {
    return {
      customers: this.users.getSnapshot().filter(user => user.role === 'user' && (user.status === 'active' || user.id === existing?.customerId)),
      sellers: this.sellers.getSnapshot().filter(seller => (seller.status === 'verified' || seller.id === existing?.sellerId)),
      vehicles: this.vehicles.getSnapshot().filter(vehicle => (vehicle.stockQuantity > 0 && vehicle.status === 'available') || vehicle.id === existing?.vehicleId)
    };
  }

  private hydrate(booking: TestDriveBooking): TestDriveBooking {
    const customer = this.users.getSnapshot().find(user => user.id === booking.customerId);
    const seller = this.sellers.getSnapshot().find(seller => seller.id === booking.sellerId);
    const vehicle = this.vehicles.getSnapshot().find(vehicle => vehicle.id === booking.vehicleId);
    return { ...booking, customerName: customer?.fullName ?? booking.customerName,
      sellerName: seller?.fullName ?? booking.sellerName,
      vehicleName: vehicle ? `${vehicle.brand} ${vehicle.model}` : booking.vehicleName,
      vehicleImageUrl: vehicle?.imageUrl ?? booking.vehicleImageUrl };
  }

  getList(query: TestDriveQuery): Observable<TestDriveListResult> {
    const all = this.bookings.map(booking => this.hydrate(booking));
    const search = query.search?.trim().toLowerCase();
    const result = all.filter(booking =>
      (!search || [booking.id, booking.customerName, booking.vehicleName, booking.sellerName].some(value => value.toLowerCase().includes(search))) &&
      (!query.date || booking.preferredDate === query.date) &&
      (!query.status || query.status === 'all' || booking.status === query.status) &&
      (query.customerId === undefined || booking.customerId === query.customerId));
    const start = (query.page - 1) * query.pageSize;
    return of({ items: result.slice(start, start + query.pageSize), total: result.length, page: query.page, pageSize: query.pageSize,
      stats: { ...MOCK_TEST_DRIVE_STATS, totalBookings: all.length, pending: all.filter(b => b.status === 'pending').length,
        confirmed: all.filter(b => b.status === 'confirmed').length, completed: all.filter(b => b.status === 'completed').length } });
  }

  create(input: TestDriveInput): Observable<TestDriveBooking> {
    return defer(() => {
      const booking = this.resolve(input, `TD-${Math.max(8400, ...this.bookings.map(b => Number(b.id.slice(3)))) + 1}`);
      this.persist([...this.bookings, booking]);
      this.retain(booking);
      return of(this.hydrate(booking));
    });
  }

  update(id: string, changes: Partial<TestDriveInput>): Observable<TestDriveBooking> {
    return defer(() => {
      const current = this.bookings.find(booking => booking.id === id);
      if (!current) throw new Error('Không tìm thấy lịch lái thử.');
      const booking = this.resolve({ ...current, ...changes }, id);
      this.persist(this.bookings.map(item => item.id === id ? booking : item));
      this.retain(booking);
      return of(this.hydrate(booking));
    });
  }

  delete(id: string): Observable<void> {
    return defer(() => {
      const booking = this.bookings.find(booking => booking.id === id);
      if (!booking) throw new Error('Không tìm thấy lịch lái thử.');
      if (booking.status === 'completed') throw new Error('Không thể huỷ lịch đã hoàn thành.');
      this.persist(this.bookings.map(item => item.id === id ? { ...item, status: 'cancelled' } : item));
      return of(undefined);
    });
  }

  private resolve(input: TestDriveInput, id: string): TestDriveBooking {
    const customer = this.users.getSnapshot().find(user => user.id === input.customerId && user.role === 'user');
    const seller = this.sellers.getSnapshot().find(seller => seller.id === input.sellerId);
    const vehicle = this.vehicles.getSnapshot().find(vehicle => vehicle.id === input.vehicleId);
    if (!customer || !seller || !vehicle) throw new Error('Khách hàng, seller và xe phải tồn tại trong dữ liệu showroom.');
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(input.status)) throw new Error('Trạng thái lịch không hợp lệ.');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.preferredDate) || !Number.isFinite(Date.parse(input.preferredDate)) || !input.timeSlot.trim() || !input.location.trim()) throw new Error('Vui lòng nhập đủ ngày, giờ và địa điểm hợp lệ.');
    const active = input.status === 'pending' || input.status === 'confirmed';
    if (active && (customer.status !== 'active' || seller.status !== 'verified' || vehicle.stockQuantity <= 0 || vehicle.status !== 'available')) throw new Error('Khách hàng và seller phải hoạt động; xe phải còn hàng và sẵn sàng lái thử.');
    if (active && this.bookings.some(b => b.id !== id && ['pending', 'confirmed'].includes(b.status) && b.preferredDate === input.preferredDate && b.timeSlot === input.timeSlot && (b.sellerId === seller.id || b.customerId === customer.id))) throw new Error('Khách hàng hoặc seller đã có lịch trong khung giờ này.');
    return { ...input, id, customerName: customer.fullName, sellerName: seller.fullName,
      vehicleName: `${vehicle.brand} ${vehicle.model}`, vehicleImageUrl: vehicle.imageUrl };
  }

  private retain(booking: TestDriveBooking): void {
    this.users.retainForBooking(booking.customerId);
    this.users.retainForBooking(booking.sellerId);
    this.vehicles.retainForBooking(booking.vehicleId);
  }
}
