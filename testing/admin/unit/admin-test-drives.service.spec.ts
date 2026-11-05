import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { TestDriveService } from '../../../src/app/core/services/test-drive/test-drive.service';
import { TestDriveInput } from '../../../src/app/core/models/test-drive.model';
import { UserService } from '../../../src/app/core/services/user/user.service';
import { SellerService } from '../../../src/app/core/services/seller/seller.service';
import { MockVehicleStore } from '../../../src/app/core/mock/mock-vehicle.store';

describe('07. Test Drives service — TestBed', () => {
  let service: TestDriveService;
  const input: TestDriveInput = {
    customerId: 6, vehicleId: 6, sellerId: 2, preferredDate: '2030-12-01',
    timeSlot: '09:00 AM', location: 'Unit Showroom', status: 'pending',
  };
  const all = { page: 1, pageSize: 1000 };
  beforeEach(() => { localStorage.clear(); service = TestBed.inject(TestDriveService); });
  afterEach(() => localStorage.clear());

  it('thêm/sửa/hủy, giữ lịch sử và khôi phục cancelled sau reload', async () => {
    const booking = await firstValueFrom(service.create(input));
    expect(booking.customerName).toBe('Marcus Sterling');
    await firstValueFrom(service.update(booking.id, { location: 'Updated', status: 'confirmed' }));
    TestBed.resetTestingModule();
    service = TestBed.inject(TestDriveService);
    let result = await firstValueFrom(service.getList({ ...all, search: booking.id }));
    expect(result.items[0].location).toBe('Updated');
    expect(result.items[0].status).toBe('confirmed');
    await firstValueFrom(service.delete(booking.id));
    TestBed.resetTestingModule();
    service = TestBed.inject(TestDriveService);
    result = await firstValueFrom(service.getList({ ...all, search: booking.id }));
    expect(result.total).toBe(1);
    expect(result.items[0].status).toBe('cancelled');
  });

  it('lọc AND theo search/date/status/customerId, phân trang và stats đúng', async () => {
    const a = await firstValueFrom(service.create(input));
    const b = await firstValueFrom(service.create({ ...input, timeSlot: '10:30 AM', status: 'confirmed' }));
    const query = { ...all, date: input.preferredDate, search: '  MARCUS  ', customerId: 6 };
    expect((await firstValueFrom(service.getList(query))).items.map(b => b.id)).toEqual([a.id, b.id]);
    expect((await firstValueFrom(service.getList({ ...query, status: 'confirmed' }))).items).toEqual([b]);
    expect((await firstValueFrom(service.getList({ ...query, status: 'cancelled' }))).total).toBe(0);
    const page = await firstValueFrom(service.getList({ ...query, page: 2, pageSize: 1 }));
    expect(page.items).toEqual([b]);
    expect(page.total).toBe(2);
    const result = await firstValueFrom(service.getList(all));
    expect(result.stats.totalBookings).toBe(result.total);
    expect(result.stats.pending).toBe(result.items.filter(b => b.status === 'pending').length);
    expect(result.stats.confirmed).toBe(result.items.filter(b => b.status === 'confirmed').length);
  });

  it('từ chối reference không tồn tại, status/ngày/giờ/địa điểm sai; không ghi thêm lịch', async () => {
    const before = await firstValueFrom(service.getList(all));
    for (const changes of [
      { customerId: 999999 }, { vehicleId: 999999 }, { sellerId: 999999 },
      { status: 'invalid' as TestDriveInput['status'] }, { preferredDate: 'invalid' },
      { timeSlot: '   ' }, { location: '   ' },
    ]) await expectAsync(firstValueFrom(service.create({ ...input, ...changes }))).toBeRejected();
    expect((await firstValueFrom(service.getList(all))).items).toEqual(before.items);
  });

  it('khách bị khóa, seller không verified hoặc xe hết hàng/không available bị từ chối', async () => {
    await firstValueFrom(TestBed.inject(UserService).update(6, { status: 'blocked' }));
    await expectAsync(firstValueFrom(service.create(input))).toBeRejected();
    await firstValueFrom(TestBed.inject(UserService).update(6, { status: 'active' }));
    const sellers = TestBed.inject(SellerService);
    const seller = sellers.getSnapshot().find(s => s.id === 2)!;
    await firstValueFrom(sellers.update(2, { ...seller, status: 'suspended' }));
    await expectAsync(firstValueFrom(service.create(input))).toBeRejected();
    await firstValueFrom(sellers.update(2, { ...seller, status: 'verified' }));
    const store = TestBed.inject(MockVehicleStore);
    const vehicle = store.getSnapshot().find(v => v.id === 6)!;
    for (const change of [{ stockQuantity: 0 }, { stockQuantity: 3, status: 'sold' as const }]) {
      await firstValueFrom(store.update(6, { ...vehicle, ...change }));
      await expectAsync(firstValueFrom(service.create(input))).toBeRejected();
    }
  });

  it('chặn trùng lịch của cùng khách hoặc cùng seller; sửa chính lịch không tự xung đột', async () => {
    const booking = await firstValueFrom(service.create(input));
    await expectAsync(firstValueFrom(service.create({ ...input, customerId: 7 }))).toBeRejected();
    await expectAsync(firstValueFrom(service.create({ ...input, sellerId: 4 }))).toBeRejected();
    expect((await firstValueFrom(service.update(booking.id, { location: 'New location' }))).location).toBe('New location');
    await firstValueFrom(service.delete(booking.id));
    expect((await firstValueFrom(service.create(input))).status).toBe('pending');
  });

  it('không hủy lịch completed, không sửa/xóa ID không tồn tại', async () => {
    const booking = await firstValueFrom(service.create({ ...input, status: 'completed' }));
    await expectAsync(firstValueFrom(service.delete(booking.id))).toBeRejectedWithError('Không thể huỷ lịch đã hoàn thành.');
    await expectAsync(firstValueFrom(service.delete('TD-999999'))).toBeRejected();
    await expectAsync(firstValueFrom(service.update('TD-999999', input))).toBeRejected();
  });

  it('đổi tên User được phản ánh ở lịch; không cho xóa/khóa/đổi role khách đã liên kết', async () => {
    const booking = await firstValueFrom(service.create(input));
    const users = TestBed.inject(UserService);
    await firstValueFrom(users.update(6, { fullName: 'Updated Customer' }));
    expect((await firstValueFrom(service.getList({ ...all, search: booking.id }))).items[0].customerName).toBe('Updated Customer');
    await expectAsync(firstValueFrom(users.delete(6))).toBeRejected();
    await expectAsync(firstValueFrom(users.toggleBlock(6))).toBeRejected();
    await expectAsync(firstValueFrom(users.update(6, { role: 'seller' }))).toBeRejected();
  });

  it('lỗi ghi storage không thay đổi lịch trong bộ nhớ', async () => {
    const before = await firstValueFrom(service.getList(all));
    spyOn(Storage.prototype, 'setItem').and.throwError('Storage unavailable');
    await expectAsync(firstValueFrom(service.create(input))).toBeRejectedWithError('Storage unavailable');
    expect((await firstValueFrom(service.getList(all))).items).toEqual(before.items);
  });
});
