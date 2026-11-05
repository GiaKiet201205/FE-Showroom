import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../../src/app/core/services/user/user.service';
import { MockAuthStore } from '../../../src/app/core/mock/mock-auth.store';
import { UserAccountInput } from '../../../src/app/core/models/user.model';

describe('05. Users service — TestBed', () => {
  let users: UserService;
  const input: UserAccountInput = {
    fullName: 'Unit Filter Customer', email: 'unit@example.com', phone: '0999999999',
    registeredAt: '', role: 'user', status: 'active', password: 'initial123',
  };
  beforeEach(() => { localStorage.clear(); users = TestBed.inject(UserService); });
  afterEach(() => localStorage.clear());

  it('tạo tài khoản, chuẩn hóa email, lưu/khôi phục dữ liệu mà không lộ password trong profile', async () => {
    const user = await firstValueFrom(users.create({ ...input, email: ' UNIT@EXAMPLE.COM ' }));
    expect(user.email).toBe(input.email);
    expect(user.registeredAt).toBeTruthy();
    expect(Object.keys(user)).not.toContain('password');
    TestBed.resetTestingModule();
    users = TestBed.inject(UserService);
    expect(users.authenticate(input.email, input.password!)?.id).toBe(user.id);
  });

  it('tìm theo tên/email/phone; lọc role/status kết hợp và phân trang', async () => {
    const a = await firstValueFrom(users.create(input));
    const b = await firstValueFrom(users.create({ ...input, email: 'seller@example.com', role: 'seller', status: 'pending' }));
    const query = { search: '  UNIT FILTER  ', page: 1, pageSize: 8 };
    expect((await firstValueFrom(users.getList(query))).items.map(u => u.id)).toEqual([a.id, b.id]);
    expect((await firstValueFrom(users.getList({ ...query, role: 'seller', status: 'pending' }))).items).toEqual([b]);
    expect((await firstValueFrom(users.getList({ ...query, role: 'seller', status: 'blocked' }))).total).toBe(0);
    expect((await firstValueFrom(users.getList({ ...query, search: input.email }))).items).toEqual([a]);
    expect((await firstValueFrom(users.getList({ ...query, search: input.phone }))).total).toBe(2);
    const second = await firstValueFrom(users.getList({ ...query, page: 2, pageSize: 1 }));
    expect(second.items).toEqual([b]);
    expect(second.total).toBe(2);
  });

  it('từ chối email trùng, mật khẩu ngắn và tạo/promote admin', async () => {
    const a = await firstValueFrom(users.create(input));
    const before = users.getSnapshot();
    for (const invalid of [input, { ...input, email: 'ADMIN@GIAKIET.COM' },
      { ...input, email: 'new@example.com', password: '123' }, { ...input, role: 'admin' as const }]) {
      await expectAsync(firstValueFrom(users.create(invalid))).toBeRejected();
    }
    await expectAsync(firstValueFrom(users.update(a.id, { role: 'admin' }))).toBeRejected();
    expect(users.getSnapshot()).toEqual(before);
  });

  it('reset password vô hiệu phiên cũ; mật khẩu trống giữ nguyên', async () => {
    const user = await firstValueFrom(users.create(input));
    const auth = TestBed.inject(MockAuthStore);
    const old = auth.login({ email: input.email, password: input.password! });
    await firstValueFrom(users.update(user.id, { password: '' }));
    expect(users.authenticate(input.email, input.password!)?.id).toBe(user.id);
    await firstValueFrom(users.update(user.id, { password: 'changed123' }));
    expect(auth.sessionUser(old.accessToken)).toBeNull();
    expect(() => auth.login({ email: input.email, password: input.password! })).toThrow();
    expect(auth.login({ email: input.email, password: 'changed123' }).user.id).toBe(user.id);
  });

  it('khóa chặn đăng nhập, mở khóa cho đăng nhập, xóa không thể đăng nhập nữa', async () => {
    const user = await firstValueFrom(users.create(input));
    const auth = TestBed.inject(MockAuthStore);
    const credentials = { email: input.email, password: input.password! };
    await firstValueFrom(users.toggleBlock(user.id));
    expect(() => auth.login(credentials)).toThrow();
    await firstValueFrom(users.toggleBlock(user.id));
    expect(auth.login(credentials).user.id).toBe(user.id);
    await firstValueFrom(users.delete(user.id));
    expect(() => auth.login(credentials)).toThrow();
  });

  it('bảo vệ admin và tài khoản có lịch; cập nhật tên vẫn được', async () => {
    const user = await firstValueFrom(users.create(input));
    users.retainForBooking(user.id);
    for (const request of [users.delete(1), users.toggleBlock(1), users.update(1, { fullName: 'Other' }),
      users.delete(user.id), users.toggleBlock(user.id), users.update(user.id, { role: 'seller' })]) {
      await expectAsync(firstValueFrom<unknown>(request)).toBeRejected();
    }
    expect((await firstValueFrom(users.update(user.id, { fullName: 'Renamed' }))).fullName).toBe('Renamed');
    await expectAsync(firstValueFrom(users.update(999999, { fullName: 'Missing' }))).toBeRejected();
  });
});
