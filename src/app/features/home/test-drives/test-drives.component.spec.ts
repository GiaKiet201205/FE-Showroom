import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { TestDrivesComponent } from './test-drives.component';
import { AuthService } from '../../../core/services/auth.service';
import { TestDriveService } from '../../../core/services/test-drive/test-drive.service';
import { NotificationService } from '../../../core/services/notification.service';

describe('Customer test drives', () => {
  let customerId: number | null;
  beforeEach(() => {
    localStorage.clear();
    customerId = 6;
    TestBed.configureTestingModule({
      imports: [TestDrivesComponent],
      providers: [provideRouter([]),
        { provide: AuthService, useValue: {
          currentUser: () => customerId === null ? null : { id: customerId },
          isLoggedIn: () => customerId !== null
        } },
        { provide: NotificationService, useValue: { showSuccess: jasmine.createSpy('showSuccess') } }
      ]
    });
  });
  afterEach(() => localStorage.clear());

  it('registers for the signed-in customer and shows changes made by admin on the next visit', async () => {
    const fixture = TestBed.createComponent(TestDrivesComponent);
    fixture.detectChanges();
    const page = fixture.componentInstance;
    page.bookingForm.patchValue({ selectedVehicleId: 6, sellerId: 2, preferredDate: '2099-12-01', preferredTime: '09:00 AM' });
    page.bookTestDrive();
    expect(page.showSuccess).toBeTrue();
    const service = TestBed.inject(TestDriveService);
    const result = await firstValueFrom(service.getList({ customerId: 6, date: '2099-12-01', page: 1, pageSize: 100 }));
    expect(result.items.length).toBe(1);
    const booking = result.items[0];
    expect(booking.status).toBe('pending');
    await firstValueFrom(service.update(booking.id, { status: 'confirmed', location: 'Showroom A' }));
    fixture.destroy();
    const nextVisit = TestBed.createComponent(TestDrivesComponent);
    expect(nextVisit.componentInstance.testDrives.find(drive => drive.id === booking.id)?.bookingStatus).toBe('confirmed');
    expect(nextVisit.componentInstance.testDrives.find(drive => drive.id === booking.id)?.location).toBe('Showroom A');
    nextVisit.destroy();
    customerId = 3;
    const otherUser = TestBed.createComponent(TestDrivesComponent);
    expect(otherUser.componentInstance.testDrives.some(drive => drive.id === booking.id)).toBeFalse();
  });

  it('shows a login link and disables registration for visitors', () => {
    customerId = null;
    const fixture = TestBed.createComponent(TestDrivesComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.testDrives).toEqual([]);
    expect(fixture.nativeElement.querySelector('a[href="/sign-in"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('fieldset').disabled).toBeTrue();
  });

  it('rejects dates in the past', () => {
    const page = TestBed.createComponent(TestDrivesComponent).componentInstance;
    page.bookingForm.patchValue({ selectedVehicleId: 6, sellerId: 2, preferredDate: '2000-01-01', preferredTime: '09:00 AM' });
    page.bookTestDrive();
    expect(page.showSuccess).toBeFalse();
    expect(page.errorMessage).toContain('hôm nay');
  });
});
