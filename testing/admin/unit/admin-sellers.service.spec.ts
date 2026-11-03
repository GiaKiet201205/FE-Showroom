import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { SellerService } from '../../../src/app/core/services/seller/seller.service';
import { UserService } from '../../../src/app/core/services/user/user.service';
import { TestDriveService } from '../../../src/app/core/services/test-drive/test-drive.service';
import { SellerInput } from '../../../src/app/core/models/seller.model';

describe('11. Sellers service — TestBed', () => {
  let service: SellerService;
  let users: UserService;
  const input: SellerInput = { fullName: 'Unit Seller', email: 'unit.seller@example.com',
    phone: '0998880001', company: 'Unit Company', joinDate: '2030-12-01', status: 'verified' };
  beforeEach(() => { localStorage.clear(); service = TestBed.inject(SellerService); users = TestBed.inject(UserService); });
  afterEach(() => localStorage.clear());

  it('tạo/sửa seller đồng bộ User và chuyển đổi đủ 3 trạng thái', async () => {
    const seller = await firstValueFrom(service.create(input));
    expect(seller.userId).toBe(seller.id);
    for (const [status, userStatus] of [['verified', 'active'], ['pending', 'pending'], ['suspended', 'blocked']] as const) {
      const updated = await firstValueFrom(service.update(seller.id, { ...input, fullName: 'Updated Seller', status }));
      expect(updated.status).toBe(status);
      expect(users.getSnapshot().find(u => u.id === seller.userId)).toEqual(jasmine.objectContaining({
        role: 'seller', fullName: 'Updated Seller', status: userStatus,
      }));
    }
    await firstValueFrom(service.delete(seller.id));
    expect(service.getSnapshot().some(s => s.id === seller.id)).toBeFalse();
    expect(users.getSnapshot().some(u => u.id === seller.userId)).toBeFalse();
  });

  it('tìm theo tên/email/phone/company, lọc date/status AND, phân trang và stats', async () => {
    const a = await firstValueFrom(service.create(input));
    const b = await firstValueFrom(service.create({ ...input, email: 'unit.other@example.com', joinDate: '2030-12-02', status: 'pending' }));
    const query = { search: '  UNIT  ', page: 1, pageSize: 100 };
    expect((await firstValueFrom(service.getList(query))).items.map(s => s.id)).toEqual([a.id, b.id]);
    for (const search of ['unit company', input.phone]) {
      expect((await firstValueFrom(service.getList({ ...query, search }))).total).toBe(2);
    }
    expect((await firstValueFrom(service.getList({ ...query, search: input.email }))).items).toEqual([a]);
    expect((await firstValueFrom(service.getList({ ...query, date: input.joinDate, status: 'verified' }))).items).toEqual([a]);
    expect((await firstValueFrom(service.getList({ ...query, date: input.joinDate, status: 'pending' }))).total).toBe(0);
    const page = await firstValueFrom(service.getList({ ...query, page: 2, pageSize: 1 }));
    expect(page.items).toEqual([b]);
    expect(page.total).toBe(2);
    const all = await firstValueFrom(service.getList({ page: 1, pageSize: 100 }));
    expect(all.stats.totalSellers).toBe(all.total);
    expect(all.stats.verified).toBe(all.items.filter(s => s.status === 'verified').length);
    expect(all.stats.pendingVerification).toBe(all.items.filter(s => s.status === 'pending').length);
    expect(all.stats.suspended).toBe(all.items.filter(s => s.status === 'suspended').length);
  });

  it('từ chối dữ liệu sai khi thêm/sửa mà không thay đổi Seller và User', async () => {
    const seller = await firstValueFrom(service.create(input));
    const before = users.getSnapshot();
    for (const invalid of [{ fullName: '   ' }, { fullName: 'x'.repeat(81) }, { email: 'invalid' },
      { phone: 'abc' }, { company: ' ' }, { company: 'x'.repeat(101) },
      { joinDate: 'invalid' }, { status: 'invalid' as SellerInput['status'] }]) {
      await expectAsync(firstValueFrom(service.create({ ...input, ...invalid }))).toBeRejected();
      await expectAsync(firstValueFrom(service.update(seller.id, { ...input, ...invalid }))).toBeRejected();
    }
    expect(users.getSnapshot()).toEqual(before);
    expect(service.getSnapshot().find(s => s.id === seller.id)).toEqual(seller);
  });

  it('email trùng/reserved không được tạo hay cập nhật; ID không tồn tại bị từ chối', async () => {
    const a = await firstValueFrom(service.create(input));
    const b = await firstValueFrom(service.create({ ...input, email: 'other@example.com' }));
    const before = service.getSnapshot();
    for (const email of [input.email.toUpperCase(), 'admin@giakiet.com']) {
      await expectAsync(firstValueFrom(service.create({ ...input, email }))).toBeRejected();
      await expectAsync(firstValueFrom(service.update(b.id, { ...input, email }))).toBeRejected();
    }
    await expectAsync(firstValueFrom(service.update(999999, input))).toBeRejected();
    await expectAsync(firstValueFrom(service.delete(999999))).toBeRejected();
    expect(service.getSnapshot()).toEqual(before);
    expect(service.getSnapshot().some(s => s.id === a.id)).toBeTrue();
  });

  it('seller có booking không được xóa nhưng được sửa tên để đồng bộ lịch', async () => {
    const bookings = TestBed.inject(TestDriveService);
    const seller = service.getSnapshot().find(s => s.id === 2)!;
    await expectAsync(firstValueFrom(service.delete(2))).toBeRejected();
    await firstValueFrom(service.update(2, { ...seller, fullName: 'Renamed Seller' }));
    const result = await firstValueFrom(bookings.getList({ page: 1, pageSize: 1000 }));
    expect(result.items.filter(b => b.sellerId === 2).every(b => b.sellerName === 'Renamed Seller')).toBeTrue();
  });

  it('khôi phục tên/email/phone/ngày/status qua User sau khi tạo lại service', async () => {
    const seller = await firstValueFrom(service.create({ ...input, status: 'suspended' }));
    TestBed.resetTestingModule();
    service = TestBed.inject(SellerService);
    expect(service.getSnapshot().find(s => s.id === seller.id)).toEqual(jasmine.objectContaining({
      fullName: input.fullName, email: input.email, phone: input.phone, joinDate: input.joinDate, status: 'suspended',
    }));
  });
});
