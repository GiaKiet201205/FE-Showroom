import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { AdminVehiclesComponent } from '../../../src/app/features/admin/vehicles/vehicles.component';
import { VehicleService } from '../../../src/app/core/services/vehicle/vehicle.service';
import { BrandService } from '../../../src/app/core/services/brand/brand.service';
import { Vehicle } from '../../../src/app/core/models/vehicle.model';

describe('02. Vehicles — TestBed', () => {
  let fixture: ComponentFixture<AdminVehiclesComponent>;
  let component: AdminVehiclesComponent;
  let service: jasmine.SpyObj<VehicleService>;
  const vehicle = {
    id: 42, brand: 'BMW', model: 'Advanced Test', year: 2024, price: 50000,
    stockQuantity: 3, color: 'Black', status: 'available', imageUrl: '',
  } satisfies Vehicle;
  const { id, ...input } = vehicle;
  const list = { items: [vehicle], total: 21, page: 1, pageSize: 10 };

  beforeEach(async () => {
    service = jasmine.createSpyObj<VehicleService>('VehicleService', ['getList', 'create', 'update', 'delete']);
    service.getList.and.returnValue(of(list));
    service.create.and.returnValue(of(vehicle));
    service.update.and.returnValue(of(vehicle));
    service.delete.and.returnValue(of(undefined));
    await TestBed.configureTestingModule({
      imports: [AdminVehiclesComponent],
      providers: [
        { provide: VehicleService, useValue: service },
        { provide: BrandService, useValue: { getSnapshot: () => [{ name: 'BMW' }, { name: 'Audi' }] } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminVehiclesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('tải và hiển thị danh sách cùng phân trang', () => {
    expect(service.getList).toHaveBeenCalledOnceWith({
      search: '', brand: undefined, status: undefined, year: undefined, page: 1, pageSize: 10,
    });
    expect(fixture.nativeElement.querySelector('tbody').textContent).toContain(vehicle.model);
    expect(component.pages()).toEqual([1, 2, 3]);
    expect(component.loading()).toBeFalse();
    expect(component.brandOptions).toEqual(['BMW', 'Audi']);
  });

  it('debounce tìm kiếm, kết hợp brand/status/year và reset trang về 1', fakeAsync(() => {
    component.goToPage(2);
    service.getList.calls.reset();
    component.filterForm.patchValue({ search: 'Adv' });
    tick(200);
    component.filterForm.patchValue({ search: 'Advanced', brand: 'BMW', status: 'sold', year: 2024 });
    tick(299);
    expect(service.getList).not.toHaveBeenCalled();
    tick(1);
    expect(service.getList).toHaveBeenCalledOnceWith({
      search: 'Advanced', brand: 'BMW', status: 'sold', year: '2024', page: 1, pageSize: 10,
    });
    service.getList.calls.reset();
    component.filterForm.patchValue({ search: 'Advanced', brand: 'BMW', status: 'sold', year: 2024 });
    tick(300);
    expect(service.getList).not.toHaveBeenCalled();
    component.filterForm.patchValue({ search: '', brand: 'all', status: 'all', year: 'all' });
    tick(300);
    expect(service.getList).toHaveBeenCalledOnceWith({
      search: '', brand: undefined, status: undefined, year: undefined, page: 1, pageSize: 10,
    });
  }));

  it('chặn trang ngoài phạm vi và xử lý danh sách rỗng', () => {
    service.getList.calls.reset();
    component.goToPage(0);
    component.goToPage(4);
    expect(service.getList).not.toHaveBeenCalled();
    service.getList.and.returnValue(of({ ...list, items: [], total: 0 }));
    component.loadVehicles();
    fixture.detectChanges();
    expect(component.totalPages()).toBe(1);
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(0);
  });

  it('hiện lỗi bắt buộc khi submit form trống và không gọi API', () => {
    component.openAddModal();
    component.saveVehicle();
    fixture.detectChanges();
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Vui lòng nhập thương hiệu');
    expect(text).toContain('Vui lòng nhập tên dòng xe');
    expect(text).toContain('Vui lòng nhập màu xe');
    expect(text).toContain('Giá phải lớn hơn 0');
    expect(service.create).not.toHaveBeenCalled();
  });

  for (const invalid of [
    { name: 'giá bằng 0', changes: { price: 0 } },
    { name: 'giá âm', changes: { price: -1 } },
    { name: 'năm quá nhỏ', changes: { year: 1899 } },
    { name: 'năm quá lớn', changes: { year: new Date().getFullYear() + 2 } },
    { name: 'tồn kho âm', changes: { stockQuantity: -1 } },
    { name: 'tồn kho thập phân', changes: { stockQuantity: 1.5 } },
    { name: 'model quá 60 ký tự', changes: { model: 'x'.repeat(61) } },
    { name: 'URL ảnh không hợp lệ', changes: { imageUrl: 'invalid-url' } },
  ]) {
    it(`chặn dữ liệu sai: ${invalid.name}`, () => {
      component.openAddModal();
      component.vehicleForm.setValue({ ...input, ...invalid.changes });
      component.saveVehicle();
      expect(component.vehicleForm.invalid).toBeTrue();
      expect(service.create).not.toHaveBeenCalled();
      expect(component.showModal()).toBeTrue();
    });
  }

  it('thêm xe hợp lệ, đóng modal và tải lại danh sách', () => {
    component.openAddModal();
    component.vehicleForm.setValue(input);
    component.saveVehicle();
    expect(service.create).toHaveBeenCalledOnceWith(input);
    expect(component.showModal()).toBeFalse();
    expect(service.getList).toHaveBeenCalledTimes(2);
    expect(component.saving()).toBeFalse();
  });

  it('sửa đúng xe với các trường đã cập nhật', () => {
    component.openEditModal(vehicle);
    component.vehicleForm.patchValue({ model: 'Updated', status: 'sold' });
    component.saveVehicle();
    expect(service.update).toHaveBeenCalledOnceWith(id, { ...input, model: 'Updated', status: 'sold' });
    expect(service.create).not.toHaveBeenCalled();
    expect(component.showModal()).toBeFalse();
  });

  it('giữ modal và dữ liệu sau lỗi thêm/sửa; cho phép thử lại', () => {
    for (const edit of [false, true]) {
      service.getList.calls.reset();
      service.create.and.returnValue(throwError(() => new Error('Save failed')));
      service.update.and.returnValue(throwError(() => new Error('Save failed')));
      edit ? component.openEditModal(vehicle) : component.openAddModal();
      component.vehicleForm.setValue(input);
      component.saveVehicle();
      expect(component.showModal()).toBeTrue();
      expect(component.vehicleForm.getRawValue()).toEqual(input);
      expect(component.saving()).toBeFalse();
      expect(service.getList).not.toHaveBeenCalled();
      service.create.and.returnValue(of(vehicle));
      service.update.and.returnValue(of(vehicle));
      component.saveVehicle();
      expect(component.showModal()).toBeFalse();
      expect(service.getList).toHaveBeenCalledTimes(1);
    }
  });

  it('chặn lưu trùng trong khi request đang chạy', () => {
    const pending = new Subject<Vehicle>();
    service.create.and.returnValue(pending);
    component.openAddModal();
    component.vehicleForm.setValue(input);
    component.saveVehicle();
    component.saveVehicle();
    fixture.detectChanges();
    expect(service.create).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeTrue();
    pending.next(vehicle);
    pending.complete();
    expect(component.saving()).toBeFalse();
  });

  it('hủy modal không tạo hay sửa xe', () => {
    component.openAddModal();
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.btn-cancel').click();
    expect(component.showModal()).toBeFalse();
    expect(service.create).not.toHaveBeenCalled();
    expect(service.update).not.toHaveBeenCalled();
  });

  it('chỉ xóa khi xác nhận, tải lại danh sách sau thành công', () => {
    const confirmation = spyOn(window, 'confirm').and.returnValue(false);
    component.deleteVehicle(vehicle);
    expect(service.delete).not.toHaveBeenCalled();
    confirmation.and.returnValue(true);
    component.deleteVehicle(vehicle);
    expect(service.delete).toHaveBeenCalledOnceWith(id);
    expect(service.getList).toHaveBeenCalledTimes(2);
  });

  it('xóa thất bại không làm mất xe hoặc tải lại như đã thành công', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    service.delete.and.returnValue(throwError(() => new Error('Vehicle has bookings')));
    service.getList.calls.reset();
    component.deleteVehicle(vehicle);
    expect(component.vehicles()).toEqual([vehicle]);
    expect(service.getList).not.toHaveBeenCalled();
  });

  it('kết thúc loading sau lỗi tải danh sách và phục hồi ở lần sau', () => {
    service.getList.and.returnValue(throwError(() => new Error('Server error')));
    component.loadVehicles();
    expect(component.loading()).toBeFalse();
    service.getList.and.returnValue(of({ ...list, items: [], total: 0 }));
    component.loadVehicles();
    expect(component.vehicles()).toEqual([]);
    expect(component.total()).toBe(0);
  });
});
