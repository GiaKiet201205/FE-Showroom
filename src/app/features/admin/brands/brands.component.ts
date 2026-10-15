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
import { BrandService } from '../../../core/services/brand/brand.service';
import { Brand } from '../../../core/models/brand.model';

@Component({
  selector: 'app-admin-brands',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class AdminBrandsComponent implements OnInit {
  private brandService = inject(BrandService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  brands = signal<Brand[]>([]);
  total = signal(0);
  loading = signal(true);

  page = signal(1);
  pageSize = 8;

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));

  // Bộ lọc: Reactive Forms + debounceTime + switchMap
  filterForm = this.fb.nonNullable.group({
    search: '',
    region: 'all'
  });

  /** Mỗi lần .next() là một lần tải lại danh sách (đổi lọc, đổi trang, sau khi lưu/xoá). */
  private reload$ = new Subject<void>();

  // Modal thêm/sửa: Reactive Forms + validator
  showModal = signal(false);
  editingBrand = signal<Brand | null>(null);
  saving = signal(false);

  brandForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    origin: ['Germany', Validators.required],
    listedVehicles: [0, [Validators.required, Validators.min(0)]],
    status: ['active', Validators.required]
  });

  /** Viết tắt cho template: f.name.invalid, f.listedVehicles.errors ... */
  get f() {
    return this.brandForm.controls;
  }

  ngOnInit(): void {
    // switchMap huỷ request cũ nếu có request mới (tránh kết quả về sai thứ tự)
    this.reload$
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap(() =>
          this.brandService.getList(this.buildQuery()).pipe(
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
        this.brands.set(res.items);
        this.total.set(res.total);
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
        this.loadBrands();
      });

    this.loadBrands();
  }

  loadBrands(): void {
    this.reload$.next();
  }

  private buildQuery() {
    const { search, region } = this.filterForm.getRawValue();
    return {
      search,
      region: region === 'all' ? undefined : region,
      page: this.page(),
      pageSize: this.pageSize
    };
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.loadBrands();
  }

  deleteBrand(brand: Brand): void {
    if (!confirm(`Xác nhận xoá thương hiệu ${brand.name}?`)) return;
    this.brandService
      .delete(brand.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadBrands(),
        error: () => {
          /* lỗi đã được errorInterceptor hiển thị, không reload như một thao tác thành công */
        }
      });
  }

  // ---- Modal -----------------------------------------------------------------

  openAddModal(): void {
    this.editingBrand.set(null);
    this.brandForm.reset({
      name: '',
      origin: 'Germany',
      listedVehicles: 0,
      status: 'active'
    });
    this.showModal.set(true);
  }

  openEditModal(brand: Brand): void {
    this.editingBrand.set(brand);
    this.brandForm.reset(); // xoá trạng thái touched/dirty của lần mở trước
    this.brandForm.patchValue(brand);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveBrand(): void {
    if (this.brandForm.invalid) {
      this.brandForm.markAllAsTouched(); // hiện toàn bộ lỗi validator
      return;
    }

    const data = this.brandForm.getRawValue() as Omit<Brand, 'id'>;
    const current = this.editingBrand();

    const request$ = (
      current ? this.brandService.update(current.id, data) : this.brandService.create(data)
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
          this.loadBrands();
        },
        error: () => {
          /* giữ modal mở để người dùng thử lại; thông báo lỗi do errorInterceptor hiển thị */
        }
      });
  }
}