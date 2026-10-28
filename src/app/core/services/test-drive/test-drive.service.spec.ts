import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { TestDriveService } from './test-drive.service';
import { UserService } from '../user/user.service';
import { SellerService } from '../seller/seller.service';
import { MockVehicleStore } from '../../mock/mock-vehicle.store';
import { BrandService } from '../brand/brand.service';

describe('Synchronized showroom bookings', () => {
  let service: TestDriveService;
  const input = { customerId: 6, vehicleId: 6, sellerId: 2, preferredDate: '2026-12-01', timeSlot: '09:00 AM', location: 'Showroom', status: 'pending' as const };
  beforeEach(() => { localStorage.clear(); service = TestBed.inject(TestDriveService); });
  afterEach(() => localStorage.clear());

  it('provides cars for every brand and valid references for every seeded booking', async () => {
    const vehicles = TestBed.inject(MockVehicleStore).getSnapshot();
    const users = TestBed.inject(UserService).getSnapshot();
    const sellers = TestBed.inject(SellerService).getSnapshot();
    expect(TestBed.inject(BrandService).getSnapshot().every(brand => vehicles.some(vehicle => vehicle.brand === brand.name))).toBeTrue();
    const result = await firstValueFrom(service.getList({ page: 1, pageSize: 100 }));
    expect(result.items.every(booking => users.some(user => user.id === booking.customerId) && sellers.some(seller => seller.id === booking.sellerId) && vehicles.some(vehicle => vehicle.id === booking.vehicleId))).toBeTrue();
    expect(sellers.every(seller => users.some(user => user.id === seller.userId && user.role === 'seller'))).toBeTrue();
  });

  it('rejects nonexistent references and conflicting seller or customer times', async () => {
    await firstValueFrom(service.create(input));
    await expectAsync(firstValueFrom(service.create({ ...input, sellerId: 999 }))).toBeRejected();
    await expectAsync(firstValueFrom(service.create(input))).toBeRejected();
  });

  it('shares bookings, reflects user name updates, and preserves cancellation history', async () => {
    const created = await firstValueFrom(service.create(input));
    await firstValueFrom(TestBed.inject(UserService).update(6, { fullName: 'Updated Customer' }));
    const result = await firstValueFrom(service.getList({ customerId: 6, page: 1, pageSize: 100 }));
    expect(result.items.find(item => item.id === created.id)?.customerName).toBe('Updated Customer');
    await firstValueFrom(service.delete(created.id));
    const cancelled = await firstValueFrom(service.getList({ status: 'cancelled', page: 1, pageSize: 100 }));
    expect(cancelled.items.some(item => item.id === created.id)).toBeTrue();
    await expectAsync(firstValueFrom(TestBed.inject(UserService).delete(6))).toBeRejected();
  });
  it('keeps admin status updates and cancellations after reloading the service', async () => {
    const created = await firstValueFrom(service.create(input));
    await firstValueFrom(service.update(created.id, { status: 'confirmed', location: 'Showroom A' }));
    TestBed.resetTestingModule();
    service = TestBed.inject(TestDriveService);
    let result = await firstValueFrom(service.getList({ customerId: input.customerId, page: 1, pageSize: 1000 }));
    expect(result.items.find(item => item.id === created.id)?.status).toBe('confirmed');
    expect(result.items.find(item => item.id === created.id)?.location).toBe('Showroom A');
    await firstValueFrom(service.delete(created.id));
    TestBed.resetTestingModule();
    service = TestBed.inject(TestDriveService);
    result = await firstValueFrom(service.getList({ customerId: input.customerId, page: 1, pageSize: 1000 }));
    expect(result.items.find(item => item.id === created.id)?.status).toBe('cancelled');
    const other = await firstValueFrom(service.getList({ customerId: 3, page: 1, pageSize: 1000 }));
    expect(other.items.some(item => item.id === created.id)).toBeFalse();
  });

});
