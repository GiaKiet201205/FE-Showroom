import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
  tap
} from 'rxjs';
import { TestDriveService } from '../../../core/services/test-drive/test-drive.service';
import { TestDriveBooking, TestDriveStats } from '../../../core/models/test-drive.model';

@Component({
  selector: 'app-admin-test-drives',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './test-drives.component.html',
  styleUrl: './test-drives.component.scss'
})
export class AdminTestDrivesComponent implements OnInit {
  private testDriveService = inject(TestDriveService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  bookings = signal<TestDriveBooking[]>([]);
  stats = signal<TestDriveStats | null>(null);
  total = signal(0);
  loading = signal(true);

  page = signal(1);
  pageSize = 8;

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));
  rangeEnd = computed(() => Math.min(this.page() * this.pageSize, this.total()));

  // Bộ lọc: Reactive Forms + debounceTime + switchMap
  filterForm = this.fb.nonNullable.group({
    search: '',
    date: '', // yyyy-MM-dd, rỗng = không lọc
    status: 'all'
  });

  /** Mỗi lần .next() là một lần tải lại danh sách (đổi lọc, đổi trang, sau khi lưu/huỷ). */
  private reload$ = new Subject<void>();

  // Modal thêm/sửa: Reactive Forms + validator
  showModal = signal(false);
  editingBooking = signal<TestDriveBooking | null>(null);
  saving = signal(false);

  bookingForm = this.fb.nonNullable.group({
    customerName: ['', [Validators.required, Validators.maxLength(80)]],
    vehicleName: ['', [Validators.required, Validators.maxLength(80)]],
    preferredDate: ['', Validators.required],
    timeSlot: ['', Validators.required],
    location: ['', Validators.required],
    status: ['pending', Validators.required]
  });

  /** Viết tắt cho template: f.customerName.invalid, ... */
  get f() {
    return this.bookingForm.controls;
  }

  ngOnInit(): void {
    // switchMap huỷ request cũ nếu có request mới (tránh kết quả về sai thứ tự)
    this.reload$
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap(() =>
          this.testDriveService.getList(this.buildQuery()).pipe(
            // catchError đặt BÊN TRONG switchMap để luồng chính không chết khi 1 request lỗi.
            // Thông báo lỗi đã do errorInterceptor xử lý.
            catchError(() => {
              this.loading.set(false);
              return EMPTY;
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        this.bookings.set(res.items);
        this.total.set(res.total);
        this.stats.set(res.stats);
        this.loading.set(false);
      });

    // Đợi người dùng ngừng gõ 300ms, bỏ qua nếu giá trị không đổi
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.page.set(1);
        this.loadBookings();
      });

    this.loadBookings();
  }

  loadBookings(): void {
    this.reload$.next();
  }

  private buildQuery() {
    const { search, date, status } = this.filterForm.getRawValue();
    return {
      search,
      date: date ? date : undefined,
      status: status === 'all' ? undefined : status,
      page: this.page(),
      pageSize: this.pageSize
    };
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.loadBookings();
  }

  deleteBooking(booking: TestDriveBooking): void {
    if (!confirm(`Xác nhận huỷ lịch lái thử ${booking.id} của khách hàng ${booking.customerName}?`)) return;
    this.testDriveService
      .delete(booking.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadBookings(),
        error: () => {
          /* lỗi đã được errorInterceptor hiển thị, không reload như một thao tác thành công */
        }
      });
  }

  // ---- Modal -----------------------------------------------------------------

  openAddModal(): void {
    this.editingBooking.set(null);
    this.bookingForm.reset({
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
    this.bookingForm.reset(); // xoá trạng thái touched/dirty của lần mở trước
    this.bookingForm.patchValue(booking);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveBooking(): void {
    if (this.bookingForm.invalid) {
      this.bookingForm.markAllAsTouched(); // hiện toàn bộ lỗi validator
      return;
    }

    const data = this.bookingForm.getRawValue() as Omit<TestDriveBooking, 'id'>;
    const current = this.editingBooking();

    const request$ = (
      current
        ? this.testDriveService.update(current.id, data)
        : this.testDriveService.create(data)
    ) as Observable<unknown>;

    this.saving.set(true);
    request$
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.closeModal(); // chỉ đóng modal khi lưu THÀNH CÔNG
          this.loadBookings();
        },
        error: () => {
          /* giữ modal mở để người dùng thử lại; thông báo lỗi do errorInterceptor hiển thị */
        }
      });
  }
}