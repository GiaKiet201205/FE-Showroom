import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { firstValueFrom, Subject, throwError } from 'rxjs';
import { AdminBrandsComponent } from '../../../src/app/features/admin/brands/brands.component';
import { BrandService } from '../../../src/app/core/services/brand/brand.service';
import { Brand } from '../../../src/app/core/models/brand.model';

describe('08. Brands component — TestBed', () => {
  let fixture: ComponentFixture<AdminBrandsComponent>;
  let component: AdminBrandsComponent;
  let service: BrandService;
  const input = { name: 'Unit Brand', origin: 'Japan', listedVehicles: 0, status: 'active' as const };
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AdminBrandsComponent] }).compileComponents();
    service = TestBed.inject(BrandService);
    fixture = TestBed.createComponent(AdminBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('render catalog, phân trang và chặn trang ngoài phạm vi', async () => {
    expect(fixture.nativeElement.querySelectorAll('.brand-card').length).toBe(8);
    expect(component.total()).toBe(service.getSnapshot().length);
    const getList = spyOn(service, 'getList').and.callThrough();
    component.goToPage(0);
    component.goToPage(2);
    expect(getList).not.toHaveBeenCalled();
    await firstValueFrom(service.create(input));
    component.loadBrands();
    component.goToPage(2);
    expect(component.brands().map(b => b.name)).toEqual([input.name]);
  });

  it('debounce tìm kiếm + region, reset trang và bỏ lọc', fakeAsync(() => {
    const getList = spyOn(service, 'getList').and.callThrough();
    component.filterForm.patchValue({ search: 'BMW', region: 'Germany' });
    tick(299);
    expect(getList).not.toHaveBeenCalled();
    tick(1);
    expect(getList).toHaveBeenCalledOnceWith({ search: 'BMW', region: 'Germany', page: 1, pageSize: 8 });
    expect(component.brands().map(b => b.name)).toEqual(['BMW']);
    component.filterForm.patchValue({ region: 'Japan' });
    tick(300);
    expect(component.total()).toBe(0);
    component.filterForm.reset({ search: '', region: 'all' });
    tick(300);
    expect(component.total()).toBe(service.getSnapshot().length);
  }));

  it('chặn tên rỗng/quá dài và số xe âm, render validation', () => {
    const create = spyOn(service, 'create').and.callThrough();
    component.openAddModal();
    component.saveBrand();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Vui lòng nhập tên thương hiệu');
    component.brandForm.setValue({ ...input, name: 'x'.repeat(51), listedVehicles: -1 });
    component.saveBrand();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Tối đa 50 ký tự');
    expect(fixture.nativeElement.textContent).toContain('Số xe không được âm');
    expect(create).not.toHaveBeenCalled();
  });

  it('thêm/sửa brand không có xe rồi đóng modal và tải lại', () => {
    component.openAddModal();
    component.brandForm.setValue(input);
    component.saveBrand();
    const created = service.getSnapshot().find(b => b.name === input.name)!;
    expect(component.showModal()).toBeFalse();
    component.openEditModal(created);
    component.brandForm.patchValue({ name: 'Updated Brand', origin: 'France', status: 'inactive' });
    component.saveBrand();
    expect(service.getSnapshot().find(b => b.id === created.id)).toEqual({
      ...created, name: 'Updated Brand', origin: 'France', status: 'inactive',
    });
    expect(component.showModal()).toBeFalse();
  });

  it('không đổi tên/xóa brand có xe; form còn mở và dữ liệu không thay đổi', () => {
    const brand = service.getSnapshot().find(b => b.name === 'BMW')!;
    const before = service.getSnapshot();
    component.openEditModal(brand);
    component.brandForm.controls.name.setValue('Renamed BMW');
    component.saveBrand();
    expect(component.showModal()).toBeTrue();
    expect(component.saving()).toBeFalse();
    expect(service.getSnapshot()).toEqual(before);
    component.closeModal();
    spyOn(window, 'confirm').and.returnValue(true);
    const getList = spyOn(service, 'getList').and.callThrough();
    component.deleteBrand(brand);
    expect(getList).not.toHaveBeenCalled();
    expect(service.getSnapshot()).toEqual(before);
  });

  it('hủy modal/hủy xác nhận không ghi dữ liệu; xác nhận xóa brand trống thành công', async () => {
    const create = spyOn(service, 'create').and.callThrough();
    component.openAddModal();
    component.closeModal();
    expect(create).not.toHaveBeenCalled();
    const brand = await firstValueFrom(service.create(input));
    const confirmation = spyOn(window, 'confirm').and.returnValue(false);
    component.deleteBrand(brand);
    expect(service.getSnapshot().some(b => b.id === brand.id)).toBeTrue();
    confirmation.and.returnValue(true);
    component.deleteBrand(brand);
    expect(service.getSnapshot().some(b => b.id === brand.id)).toBeFalse();
  });

  it('nút lưu disabled trong request; lỗi giữ form để thử lại', () => {
    const pending = new Subject<Brand>();
    const create = spyOn(service, 'create').and.returnValue(pending);
    component.openAddModal();
    component.brandForm.setValue(input);
    component.saveBrand();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeTrue();
    pending.error(new Error('Create failed'));
    expect(component.saving()).toBeFalse();
    expect(component.showModal()).toBeTrue();
    expect(component.brandForm.getRawValue()).toEqual(input);
    create.and.callThrough();
    component.saveBrand();
    expect(component.showModal()).toBeFalse();
  });

  it('phục hồi sau lỗi tải danh sách', () => {
    const getList = spyOn(service, 'getList').and.returnValue(throwError(() => new Error('Load failed')));
    component.loadBrands();
    expect(component.loading()).toBeFalse();
    getList.and.callThrough();
    component.loadBrands();
    expect(component.brands().length).toBeGreaterThan(0);
  });
});
