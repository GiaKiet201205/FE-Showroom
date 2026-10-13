import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TestDriveService } from '../../../core/services/test-drive/test-drive.service';
import { TestDriveBooking, TestDriveStats } from '../../../core/models/test-drive.model';

@Component({
  selector: 'app-admin-test-drives',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './test-drives.component.html',
  styleUrl: './test-drives.component.scss'
})
export class AdminTestDrivesComponent implements OnInit {
  private testDriveService = inject(TestDriveService);

  bookings = signal<TestDriveBooking[]>([]);
  stats = signal<TestDriveStats | null>(null);
  total = signal(0);
  loading = signal(true);

  searchTerm = signal('');
  dateFilter = signal('');
  statusFilter = signal('all');

  page = signal(1);
  pageSize = 8;

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));
  rangeEnd = computed(() => Math.min(this.page() * this.pageSize, this.total()));

  // Trạng thái quản lý hộp thoại
  showModal = signal(false);
  editingBooking = signal<TestDriveBooking | null>(null);
  formData = signal<Partial<TestDriveBooking>>({});

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);
    this.testDriveService
      .getList({
        search: this.searchTerm(),
        date: this.dateFilter() ? this.dateFilter() : undefined,
        status: this.statusFilter() === 'all' ? undefined : this.statusFilter(),
        page: this.page(),
        pageSize: this.pageSize
      })
      .subscribe({
        next: (res) => {
          this.bookings.set(res.items);
          this.total.set(res.total);
          this.stats.set(res.stats);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  onFilterChange(): void {
    this.page.set(1);
    this.loadBookings();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.loadBookings();
  }

  deleteBooking(booking: TestDriveBooking): void {
    if (!confirm(`Xác nhận huỷ lịch lái thử ${booking.id} của khách hàng ${booking.customerName}?`)) return;
    this.testDriveService.delete(booking.id).subscribe({
      next: () => this.loadBookings(),
      error: () => this.loadBookings()
    });
  }

  // Chức năng điều khiển hộp thoại
  openAddModal(): void {
    this.editingBooking.set(null);
    this.formData.set({
      customerName: '',
      vehicleName: '',
      preferredDate: '',
      timeSlot: '',
      location: '',
      status: 'pending'
    });
    this.showModal.set(true);
  }

  openEditModal(booking: TestDriveBooking): void {
    this.editingBooking.set(booking);
    this.formData.set({ ...booking });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveBooking(): void {
    const data = this.formData() as Omit<TestDriveBooking, 'id'>;
    const current = this.editingBooking();

    if (current) {
      this.testDriveService.update(current.id, data).subscribe({
        next: () => {
          this.loadBookings();
          this.closeModal();
        },
        error: () => {
          this.loadBookings();
          this.closeModal();
        }
      });
    } else {
      this.testDriveService.create(data).subscribe({
        next: () => {
          this.loadBookings();
          this.closeModal();
        },
        error: () => {
          this.loadBookings();
          this.closeModal();
        }
      });
    }
  }
}