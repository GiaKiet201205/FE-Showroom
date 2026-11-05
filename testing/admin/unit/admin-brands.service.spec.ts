import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { BrandService } from '../../../src/app/core/services/brand/brand.service';
import { MockVehicleStore } from '../../../src/app/core/mock/mock-vehicle.store';

describe('09. Brands service — TestBed', () => {
  let service: BrandService;
  const input = { name: 'UNITTEST Brand', origin: 'Japan', listedVehicles: 0, status: 'active' as const };
  beforeEach(() => { service = TestBed.inject(BrandService); });

  it('thêm/sửa/xóa brand trống với ID riêng và snapshot độc lập', async () => {
    const a = await firstValueFrom(service.create(input));
    const b = await firstValueFrom(service.create({ ...input, name: 'Other Brand' }));
    expect(b.id).toBeGreaterThan(a.id);
    const copy = service.getSnapshot();
    copy.find(v => v.id === a.id)!.name = 'Mutated';
    expect(service.getSnapshot().find(v => v.id === a.id)?.name).toBe(input.name);
    const updated = await firstValueFrom(service.update(a.id, { name: 'Updated Brand', status: 'inactive' }));
    expect(updated.status).toBe('inactive');
    await firstValueFrom(service.delete(a.id));
    expect(service.getSnapshot().some(v => v.id === a.id)).toBeFalse();
    expect(() => service.update(999999, input)).toThrowError('Không tìm thấy dữ liệu');
  });

  it('tìm theo tên/xuất xứ không phân biệt hoa thường, lọc AND và phân trang', async () => {
    const a = await firstValueFrom(service.create(input));
    const b = await firstValueFrom(service.create({ ...input, name: 'UNITTEST French', origin: 'France' }));
    const query = { search: '  unittest  ', page: 1, pageSize: 100 };
    expect((await firstValueFrom(service.getList(query))).items.map(b => b.id)).toEqual([a.id, b.id]);
    expect((await firstValueFrom(service.getList({ ...query, region: 'Japan' }))).items).toEqual([a]);
    expect((await firstValueFrom(service.getList({ ...query, region: 'Italy' }))).total).toBe(0);
    expect((await firstValueFrom(service.getList({ ...query, search: 'japan' }))).items).toEqual([a]);
    const page = await firstValueFrom(service.getList({ ...query, page: 2, pageSize: 1 }));
    expect(page.items).toEqual([b]);
    expect(page.total).toBe(2);
  });

  it('brand có xe không được đổi tên/xóa; vẫn được cập nhật xuất xứ và trạng thái', async () => {
    const brand = service.getSnapshot().find(b => b.name === 'BMW')!;
    const before = service.getSnapshot();
    await expectAsync(firstValueFrom(service.update(brand.id, { name: 'Other BMW' }))).toBeRejected();
    await expectAsync(firstValueFrom(service.delete(brand.id))).toBeRejected();
    expect(service.getSnapshot()).toEqual(before);
    expect((await firstValueFrom(service.update(brand.id, { origin: 'Germany', status: 'inactive' }))).status).toBe('inactive');
  });

  it('số xe tự đồng bộ sau thêm/sửa/xóa vehicle và chỉ xóa brand khi hết xe', async () => {
    const store = TestBed.inject(MockVehicleStore);
    const a = await firstValueFrom(service.create(input));
    const b = await firstValueFrom(service.create({ ...input, name: 'Unit Other' }));
    const data = { brand: a.name, model: 'Unit Car', year: 2024, price: 50000,
      stockQuantity: 1, color: 'Black', status: 'available' as const };
    const vehicle = await firstValueFrom(store.create(data));
    expect(service.getSnapshot().find(v => v.id === a.id)?.listedVehicles).toBe(1);
    await expectAsync(firstValueFrom(service.delete(a.id))).toBeRejected();
    await firstValueFrom(store.update(vehicle.id, { ...data, brand: b.name }));
    expect(service.getSnapshot().find(v => v.id === a.id)?.listedVehicles).toBe(0);
    expect(service.getSnapshot().find(v => v.id === b.id)?.listedVehicles).toBe(1);
    await firstValueFrom(service.delete(a.id));
    await firstValueFrom(store.delete(vehicle.id));
    expect(service.getSnapshot().find(v => v.id === b.id)?.listedVehicles).toBe(0);
    await firstValueFrom(service.delete(b.id));
  });
});
