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
import { VehicleService } from '../../../core/services/vehicle/vehicle.service';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-admin-vehicles',
  standalone: true,
  // [3] OnPush: chỉ render lại khi signal / event / async input thay đổi
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class AdminVehiclesComponent implements OnInit {
  private vehicleService = inject(VehicleService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  vehicles = signal<Vehicle[]>([]);
  total = signal(0);
  loading = signal(true);

  page = signal(1);
  pageSize = 10;

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));
  rangeEnd = computed(() => Math.min(this.page() * this.pageSize, this.total()));

  brandOptions = ['Lamborghini', 'Ferrari', 'Audi', 'Porsche', 'BMW', 'Bugatti', 'Maserati', 'Rolls-Royce'];
  yearOptions = [2024, 2023, 2022, 2021];

  // ---------------------------------------------------------------------------
  // [1] Bộ lọc + ô tìm kiếm: Reactive Forms + debounceTime + switchMap
  // ---------------------------------------------------------------------------
  filterForm = this.fb.nonNullable.group({
    search: '',
    brand: 'all',
    status: 'all',
    year: this.fb.nonNullable.control<string | number>('all')
  });

  /** Mỗi lần .next() là một lần tải lại danh sách (đổi lọc, đổi trang, sau khi lưu/xoá). */
  private reload$ = new Subject<void>();

  // ---------------------------------------------------------------------------
  // [3] Modal thêm/sửa: Reactive Forms + validator
  // ---------------------------------------------------------------------------
  showModal = signal(false);
  editingVehicle = signal<Vehicle | null>(null);
  saving = signal(false);

  readonly currentYear = new Date().getFullYear();

  vehicleForm = this.fb.nonNullable.group({
    brand: ['', Validators.required],
    model: ['', [Validators.required, Validators.maxLength(60)]],
    year: [
      this.currentYear,
      [Validators.required, Validators.min(1900), Validators.max(this.currentYear + 1)]
    ],
    price: [0, [Validators.required, Validators.min(1)]],
    mileage: [0, [Validators.required, Validators.min(0)]],
    color: ['', Validators.required],
    status: ['available', Validators.required],
    imageUrl: ['', Validators.pattern(/^(https?:\/\/\S+)?$/)] // rỗng hoặc URL http(s)
  });

  /** Viết tắt cho template: f.brand.invalid, f.price.errors ... */
  get f() {
    return this.vehicleForm.controls;
  }

  ngOnInit(): void {
    // Luồng tải dữ liệu: switchMap huỷ request cũ nếu có request mới (tránh kết quả về sai thứ tự)
    this.reload$
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap(() =>
          this.vehicleService.getList(this.buildQuery()).pipe(
            // catchError đặt BÊN TRONG switchMap để luồng chính không chết khi 1 request lỗi.
            // Thông báo lỗi đã do HttpInterceptor xử lý.
            catchError(() => {
              this.loading.set(false);
              return EMPTY;
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        this.vehicles.set(res.items);
        this.total.set(res.total);
        this.loading.set(false);
      });

    // Luồng lọc: đợi người dùng ngừng gõ 300ms, bỏ qua nếu giá trị không đổi
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.page.set(1);
        this.loadVehicles();
      });

    this.loadVehicles();
  }

  loadVehicles(): void {
    this.reload$.next();
  }

private buildQuery() {
  const { search, brand, status, year } = this.filterForm.getRawValue();
  return {
    search,
    brand: brand === 'all' ? undefined : brand,
    status: status === 'all' ? undefined : status,
    year: year === 'all' ? undefined : String(year), // đổi chỗ này
    page: this.page(),
    pageSize: this.pageSize
  };
}

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.loadVehicles();
  }

  deleteVehicle(vehicle: Vehicle): void {
    if (!confirm(`Xác nhận xoá xe ${vehicle.brand} ${vehicle.model}?`)) return;
    this.vehicleService
      .delete(vehicle.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadVehicles(),
        error: () => {
          /* lỗi đã được errorInterceptor hiển thị, không reload như một thao tác thành công */
        }
      });
  }

  // ---- Modal -----------------------------------------------------------------

  openAddModal(): void {
    this.editingVehicle.set(null);
    this.vehicleForm.reset({
      brand: '',
      model: '',
      year: this.currentYear,
      price: 0,
      mileage: 0,
      color: '',
      status: 'available',
      imageUrl: ''
    });
    this.showModal.set(true);
  }

  openEditModal(vehicle: Vehicle): void {
    this.editingVehicle.set(vehicle);
    this.vehicleForm.reset(); // xoá trạng thái touched/dirty của lần mở trước
    this.vehicleForm.patchValue(vehicle);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveVehicle(): void {
    if (this.vehicleForm.invalid) {
      this.vehicleForm.markAllAsTouched(); // hiện toàn bộ lỗi validator
      return;
    }

    const data = this.vehicleForm.getRawValue() as Omit<Vehicle, 'id'>;
    const current = this.editingVehicle();

    const request$ = (
      current ? this.vehicleService.update(current.id, data) : this.vehicleService.create(data)
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
          this.loadVehicles();
        },
        error: () => {
          /* giữ modal mở để người dùng thử lại; thông báo lỗi do errorInterceptor hiển thị */
        }
      });
  }
}