import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { firstValueFrom, Subject, throwError } from 'rxjs';
import { TestDrivesComponent } from '../../../src/app/features/home/test-drives/test-drives.component';
import { TestDriveService } from '../../../src/app/core/services/test-drive/test-drive.service';
import { AuthService } from '../../../src/app/core/services/auth.service';
import { NotificationService } from '../../../src/app/core/services/notification.service';
import { TestDriveBooking } from '../../../src/app/core/models/test-drive.model';

describe('User — đặt lịch lái thử qua TestBed', () => {
  let id: number | null;
  const input = { selectedVehicleId: 6, sellerId: 2, preferredDate: '2099-12-01', preferredTime: '09:00 AM' };
  beforeEach(() => {
    localStorage.clear(); id = 6;
    TestBed.configureTestingModule({ imports: [TestDrivesComponent], providers: [provideRouter([]),
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({ vehicleId: '6' }) } } },
      { provide: AuthService, useValue: { currentUser: () => id === null ? null : { id }, isLoggedIn: () => id !== null } },
      { provide: NotificationService, useValue: { showSuccess: jasmine.createSpy('showSuccess') } },
    ] });
  });
  afterEach(() => localStorage.clear());

  it('guest có lời nhắc đăng nhập, form disabled và không lộ lịch', () => {
    id = null;
    const fixture = TestBed.createComponent(TestDrivesComponent); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('fieldset').disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('a[href="/sign-in"]')).toBeTruthy();
    expect(fixture.componentInstance.testDrives).toEqual([]);
  });

  it('điền tài khoản hiện tại, chọn vehicle từ query và validation form thiếu', () => {
    const fixture = TestBed.createComponent(TestDrivesComponent); fixture.detectChanges();
    const page = fixture.componentInstance;
    expect(page.bookingForm.controls.fullName.value).toBe('Marcus Sterling');
    expect(page.bookingForm.controls.selectedVehicleId.value).toBe(6);
    expect(fixture.nativeElement.querySelector('#email').readOnly).toBeTrue();
    const create = spyOn(TestBed.inject(TestDriveService), 'create').and.callThrough();
    page.bookTestDrive(); fixture.detectChanges();
    expect(page.invalid('sellerId')).toBeTrue();
    expect(create).not.toHaveBeenCalled();
  });

  it('đặt lịch thuộc đúng User, bất kể dữ liệu tên/email bị sửa phía client', async () => {
    const page = TestBed.createComponent(TestDrivesComponent).componentInstance;
    page.bookingForm.patchValue({ ...input, fullName: 'Other Person', email: 'other@example.com' });
    page.bookTestDrive();
    expect(page.showSuccess).toBeTrue();
    expect(page.bookingForm.controls.preferredDate.value).toBe('');
    const result = await firstValueFrom(TestBed.inject(TestDriveService).getList({ customerId: 6, date: input.preferredDate, page: 1, pageSize: 100 }));
    expect(result.items.length).toBe(1);
    expect(result.items[0].customerName).toBe('Marcus Sterling');
    expect(result.items[0].status).toBe('pending');
    id = 7;
    const other = TestBed.createComponent(TestDrivesComponent).componentInstance;
    expect(other.testDrives.some(d => d.id === result.items[0].id)).toBeFalse();
  });

  it('chặn ngày quá khứ và tài khoản không còn hoạt động', () => {
    const page = TestBed.createComponent(TestDrivesComponent).componentInstance;
    const create = spyOn(TestBed.inject(TestDriveService), 'create').and.callThrough();
    page.bookingForm.patchValue({ ...input, preferredDate: '2000-01-01' });
    page.bookTestDrive(); expect(page.errorMessage).toContain('hôm nay');
    page.bookingForm.patchValue(input); id = null;
    page.bookTestDrive(); expect(page.errorMessage).toContain('đăng nhập');
    expect(create).not.toHaveBeenCalled();
  });

  it('trùng khung giờ báo lỗi, giữ lựa chọn; đổi giờ thử lại được', () => {
    const page = TestBed.createComponent(TestDrivesComponent).componentInstance;
    page.bookingForm.patchValue(input); page.bookTestDrive();
    page.bookingForm.patchValue(input); page.bookTestDrive();
    expect(page.errorMessage).toContain('đã có lịch trong khung giờ này');
    expect(page.submitting).toBeFalse(); expect(page.showSuccess).toBeFalse();
    expect(page.bookingForm.controls.preferredTime.value).toBe(input.preferredTime);
    page.bookingForm.controls.preferredTime.setValue('10:30 AM'); page.bookTestDrive();
    expect(page.showSuccess).toBeTrue();
  });

  it('chặn submit trùng và hiển thị lỗi service', () => {
    const pending = new Subject<TestDriveBooking>();
    const create = spyOn(TestBed.inject(TestDriveService), 'create').and.returnValue(pending);
    const page = TestBed.createComponent(TestDrivesComponent).componentInstance;
    page.bookingForm.patchValue(input); page.bookTestDrive(); page.bookTestDrive();
    expect(create).toHaveBeenCalledTimes(1);
    pending.error(new Error('Booking failed'));
    expect(page.errorMessage).toBe('Booking failed'); expect(page.submitting).toBeFalse();
  });

  it('hủy xác nhận không đổi lịch; chấp nhận chuyển sang cancelled, không hủy lịch của người khác', () => {
    const page = TestBed.createComponent(TestDrivesComponent).componentInstance;
    page.bookingForm.patchValue(input); page.bookTestDrive();
    const booking = page.testDrives.find(d => d.date === input.preferredDate)!;
    const confirmation = spyOn(window, 'confirm').and.returnValue(false);
    page.cancelTestDrive('TD-999999'); expect(confirmation).not.toHaveBeenCalled();
    page.cancelTestDrive(booking.id);
    expect(page.testDrives.find(d => d.id === booking.id)?.status).toBe('upcoming');
    confirmation.and.returnValue(true); page.cancelTestDrive(booking.id);
    page.setTab('cancelled');
    expect(page.filteredTestDrives.some(d => d.id === booking.id)).toBeTrue();
    const remove = spyOn(TestBed.inject(TestDriveService), 'delete').and.returnValue(throwError(() => new Error('Cancel failed')));
    page.cancelTestDrive(booking.id); expect(remove).not.toHaveBeenCalled();
  });

  it('thay đổi của admin hiển thị ở lần mở lại, gồm tab completed', async () => {
    const page = TestBed.createComponent(TestDrivesComponent).componentInstance;
    page.bookingForm.patchValue(input); page.bookTestDrive();
    const booking = page.testDrives.find(d => d.date === input.preferredDate)!;
    await firstValueFrom(TestBed.inject(TestDriveService).update(booking.id, { status: 'completed' }));
    const next = TestBed.createComponent(TestDrivesComponent).componentInstance;
    next.setTab('completed');
    expect(next.filteredTestDrives.find(d => d.id === booking.id)?.bookingStatus).toBe('completed');
  });
});
