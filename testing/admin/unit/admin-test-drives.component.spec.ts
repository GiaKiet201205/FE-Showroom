import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { firstValueFrom, Subject, throwError } from 'rxjs';
import { AdminTestDrivesComponent } from '../../../src/app/features/admin/test-drives/test-drives.component';
import { TestDriveService } from '../../../src/app/core/services/test-drive/test-drive.service';
import { TestDriveBooking, TestDriveInput } from '../../../src/app/core/models/test-drive.model';

describe('06. Test Drives component — TestBed', () => {
  let fixture: ComponentFixture<AdminTestDrivesComponent>;
  let component: AdminTestDrivesComponent;
  let service: TestDriveService;
  const input: TestDriveInput = {
    customerId: 6, vehicleId: 6, sellerId: 2, preferredDate: '2030-12-01',
    timeSlot: '09:00 AM', location: 'Unit Showroom', status: 'pending',
  };
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [AdminTestDrivesComponent] }).compileComponents();
    service = TestBed.inject(TestDriveService);
    fixture = TestBed.createComponent(AdminTestDrivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => localStorage.clear());

  it('render danh sách, stats và chỉ cho chọn khách/xe/seller hợp lệ', () => {
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(8);
    expect(component.stats()?.totalBookings).toBe(component.total());
    expect(component.options.customers.every(u => u.role === 'user' && u.status === 'active')).toBeTrue();
    expect(component.options.vehicles.every(v => v.stockQuantity > 0 && v.status === 'available')).toBeTrue();
    expect(component.options.sellers.every(s => s.status === 'verified')).toBeTrue();
  });

  it('debounce search/date/status và đưa về trang 1; không tải trang ngoài phạm vi', fakeAsync(() => {
    const getList = spyOn(service, 'getList').and.callThrough();
    component.goToPage(0);
    component.goToPage(component.totalPages() + 1);
    expect(getList).not.toHaveBeenCalled();
    component.goToPage(2);
    getList.calls.reset();
    component.filterForm.patchValue({ search: 'Marcus', date: input.preferredDate, status: 'pending' });
    tick(299);
    expect(getList).not.toHaveBeenCalled();
    tick(1);
    expect(getList).toHaveBeenCalledOnceWith({ search: 'Marcus', date: input.preferredDate, status: 'pending', page: 1, pageSize: 8 });
    expect(component.total()).toBe(0);
    component.filterForm.reset({ search: '', date: '', status: 'all' });
    tick(300);
    expect(component.total()).toBeGreaterThan(0);
  }));

  it('form trống hiển thị validation và không tạo lịch', () => {
    const create = spyOn(service, 'create').and.callThrough();
    component.openAddModal();
    component.saveBooking();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.field-error').length).toBe(6);
    expect(create).not.toHaveBeenCalled();
    expect(component.showModal()).toBeTrue();
  });

  it('thêm/sửa lịch hợp lệ, đóng form và tải lại', () => {
    const create = spyOn(service, 'create').and.callThrough();
    component.openAddModal();
    component.bookingForm.setValue(input);
    component.saveBooking();
    expect(create).toHaveBeenCalledOnceWith(input);
    expect(component.showModal()).toBeFalse();
    const booking = JSON.parse(localStorage.getItem('mock_test_drive_bookings')!).find((b: TestDriveBooking) => b.preferredDate === input.preferredDate);
    const update = spyOn(service, 'update').and.callThrough();
    component.openEditModal(booking);
    component.bookingForm.patchValue({ status: 'confirmed', location: 'Updated Showroom' });
    component.saveBooking();
    expect(update).toHaveBeenCalledOnceWith(booking.id, { ...input, status: 'confirmed', location: 'Updated Showroom' });
    expect(component.showModal()).toBeFalse();
  });

  it('trùng khung giờ: báo lỗi, giữ form; đổi giờ thì lưu được', async () => {
    await firstValueFrom(service.create(input));
    component.openAddModal();
    component.bookingForm.setValue(input);
    component.saveBooking();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('đã có lịch trong khung giờ này');
    expect(component.bookingForm.getRawValue()).toEqual(input);
    expect(component.saving()).toBeFalse();
    expect(component.showModal()).toBeTrue();
    component.bookingForm.controls.timeSlot.setValue('10:30 AM');
    component.saveBooking();
    expect(component.showModal()).toBeFalse();
  });

  it('sửa thất bại giữ dữ liệu và không reload như thành công', async () => {
    const booking = await firstValueFrom(service.create(input));
    spyOn(service, 'update').and.returnValue(throwError(() => new Error('Update failed')));
    const getList = spyOn(service, 'getList').and.callThrough();
    component.openEditModal(booking);
    component.saveBooking();
    expect(component.errorMessage()).toBe('Update failed');
    expect(component.showModal()).toBeTrue();
    expect(component.saving()).toBeFalse();
    expect(getList).not.toHaveBeenCalled();
  });

  it('chặn submit trùng và hủy modal không lưu', () => {
    const pending = new Subject<TestDriveBooking>();
    const create = spyOn(service, 'create').and.returnValue(pending);
    component.openAddModal();
    component.closeModal();
    expect(create).not.toHaveBeenCalled();
    component.openAddModal();
    component.bookingForm.setValue(input);
    component.saveBooking();
    component.saveBooking();
    fixture.detectChanges();
    expect(create).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeTrue();
    pending.error(new Error('Save failed'));
    expect(component.saving()).toBeFalse();
  });

  it('hủy xác nhận không đổi lịch; xác nhận hủy giữ lịch sử cancelled', async () => {
    const booking = await firstValueFrom(service.create(input));
    const confirmation = spyOn(window, 'confirm').and.returnValue(false);
    const remove = spyOn(service, 'delete').and.callThrough();
    component.deleteBooking(booking);
    expect(remove).not.toHaveBeenCalled();
    confirmation.and.returnValue(true);
    component.deleteBooking(booking);
    const result = await firstValueFrom(service.getList({ search: booking.id, page: 1, pageSize: 8 }));
    expect(result.items[0].status).toBe('cancelled');
    expect(result.total).toBe(1);
  });

  it('lịch completed không thể hủy và hiển thị lỗi ngoài modal', async () => {
    const booking = await firstValueFrom(service.create({ ...input, status: 'completed' }));
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteBooking(booking);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Không thể huỷ lịch đã hoàn thành.');
  });

  it('phục hồi sau lỗi tải dữ liệu', () => {
    const getList = spyOn(service, 'getList').and.returnValue(throwError(() => new Error('Load failed')));
    component.loadBookings();
    expect(component.loading()).toBeFalse();
    getList.and.callThrough();
    component.loadBookings();
    expect(component.bookings().length).toBeGreaterThan(0);
  });
});
