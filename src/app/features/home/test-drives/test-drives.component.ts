import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../core/services/notification.service';
import { TestDriveService } from '../../../core/services/test-drive/test-drive.service';
import { AuthService } from '../../../core/services/auth.service';
import { TestDriveBooking } from '../../../core/models/test-drive.model';

type TestDriveStatus = 'upcoming' | 'completed' | 'cancelled';
interface DriveView {
  id: string; vehicleName: string; vehicleImage: string; vehicleDescription: string;
  date: string; time: string; location: string; status: TestDriveStatus; bookingStatus: string; sellerName: string;
}

@Component({
  selector: 'app-test-drives', standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './test-drives.component.html', styleUrl: './test-drives.component.scss'
})
export class TestDrivesComponent {
  private service = inject(TestDriveService);
  auth = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private notification = inject(NotificationService);
  private fb = inject(FormBuilder);
  activeTab: TestDriveStatus = 'upcoming';
  showSuccess = false;
  errorMessage = '';
  submitting = false;
  readonly today = this.localDate();

  private localDate(): string {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  private customerId?: number;
  options = this.service.getOptions();
  vehicles = this.options.vehicles.map(vehicle => ({ id: vehicle.id, name: `${vehicle.brand} ${vehicle.model}` }));
  sellers = this.options.sellers;
  testDrives: DriveView[] = [];
  timeSlots = ['08:00 AM', '09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM'];
  bookingForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    selectedVehicleId: this.fb.control<number | null>(null, Validators.required),
    sellerId: [0, [Validators.required, Validators.min(1)]],
    preferredDate: ['', Validators.required], preferredTime: ['', Validators.required]
  });

  constructor() {
    const current = this.options.customers.find(user => user.id === this.auth.currentUser()?.id);
    if (current) {
      this.customerId = current.id;
      this.bookingForm.patchValue({ fullName: current.fullName, email: current.email });
      this.loadBookings();
    }
    const vehicleId = Number(this.route.snapshot.queryParamMap.get('vehicleId'));
    if (this.vehicles.some(vehicle => vehicle.id === vehicleId)) this.bookingForm.controls.selectedVehicleId.setValue(vehicleId);
  }
  get filteredTestDrives(): DriveView[] { return this.testDrives.filter(drive => drive.status === this.activeTab); }
  setTab(tab: TestDriveStatus): void { this.activeTab = tab; }

  bookTestDrive(): void {
    if (this.submitting) return;
    this.showSuccess = false;
    this.errorMessage = '';
    if (this.bookingForm.invalid) { this.bookingForm.markAllAsTouched(); return; }
    const data = this.bookingForm.getRawValue();
    const customer = this.service.getOptions().customers.find(user => user.id === this.auth.currentUser()?.id);
    if (!customer) {
      this.errorMessage = 'Vui lòng đăng nhập bằng tài khoản User đang hoạt động và sử dụng email của tài khoản đó.';
      return;
    }
    if (data.preferredDate < this.localDate()) {
      this.errorMessage = 'Vui lòng chọn ngày lái thử từ hôm nay trở đi.';
      return;
    }
    this.submitting = true;
    this.service.create({ customerId: customer.id, vehicleId: data.selectedVehicleId!, sellerId: data.sellerId,
      preferredDate: data.preferredDate, timeSlot: data.preferredTime, location: 'Showroom', status: 'pending'
    }).pipe(finalize(() => this.submitting = false), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.customerId = customer.id;
        this.loadBookings(); this.activeTab = 'upcoming'; this.showSuccess = true;
        this.bookingForm.patchValue({ preferredDate: '', preferredTime: '' });
        this.bookingForm.markAsUntouched();
        this.notification.showSuccess('Đã đặt lịch lái thử và phân công seller đi cùng.');
      },
      error: (error: Error) => this.errorMessage = error.message
    });
  }
  cancelTestDrive(id: string): void {
    this.errorMessage = '';
    if (!this.testDrives.some(drive => drive.id === id && drive.status === 'upcoming')) return;
    if (!confirm('Bạn muốn huỷ lịch lái thử này?')) return;
    this.service.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.loadBookings(), error: (error: Error) => this.errorMessage = error.message
    });
  }
  private loadBookings(): void {
    if (this.customerId === undefined) return;
    this.service.getList({ customerId: this.customerId, page: 1, pageSize: 1000 }).subscribe(result => {
      this.testDrives = result.items.map((booking: TestDriveBooking) => ({
        id: booking.id, vehicleName: booking.vehicleName, vehicleImage: booking.vehicleImageUrl ?? '/images/vehicle-placeholder.svg',
        vehicleDescription: `Seller đi cùng: ${booking.sellerName}`, sellerName: booking.sellerName,
        bookingStatus: booking.status, date: booking.preferredDate, time: booking.timeSlot, location: booking.location,
        status: booking.status === 'completed' || booking.status === 'cancelled' ? booking.status : 'upcoming'
      }));
    });
  }
  invalid(name: keyof typeof this.bookingForm.controls): boolean {
    const control = this.bookingForm.controls[name]; return control.invalid && control.touched;
  }
}
