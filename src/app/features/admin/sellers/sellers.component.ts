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
import { EMPTY, Subject, catchError, debounceTime, distinctUntilChanged, switchMap, tap, finalize } from 'rxjs';
import { SellerService } from '../../../core/services/seller/seller.service';
import { Seller, SellerStats, SellerInput } from '../../../core/models/seller.model';

@Component({
  selector: 'app-admin-sellers',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './sellers.component.html',
  styleUrl: './sellers.component.scss'
})
export class AdminSellersComponent implements OnInit {
  private sellerService = inject(SellerService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  sellers = signal<Seller[]>([]);
  stats = signal<SellerStats | null>(null);
  total = signal(0);
  loading = signal(true);
  showModal = signal(false);
  editingSeller = signal<Seller | null>(null);
  saving = signal(false);
  errorMessage = signal('');
  sellerForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.maxLength(80), Validators.pattern(/\S/)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[+]?[-\d\s().]{7,20}$/)]],
    company: ['Showroom', [Validators.required, Validators.maxLength(100), Validators.pattern(/\S/)]],
    status: ['verified', Validators.required],
    joinDate: [new Date().toLocaleDateString('en-CA'), Validators.required]
  });


  page = signal(1);
  pageSize = 8;

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1));
  rangeEnd = computed(() => Math.min(this.page() * this.pageSize, this.total()));

  // Bộ lọc: Reactive Forms + debounceTime + switchMap
  filterForm = this.fb.nonNullable.group({
    search: '',
    date: '', // yyyy-MM-dd, rỗng = không lọc
    status: 'all'
  });

  /** Mỗi lần .next() là một lần tải lại danh sách (đổi lọc, đổi trang). */
  private reload$ = new Subject<void>();

  ngOnInit(): void {
    // switchMap huỷ request cũ nếu có request mới (tránh kết quả về sai thứ tự)
    this.reload$
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap(() =>
          this.sellerService.getList(this.buildQuery()).pipe(
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
        if (this.page() > 1 && res.items.length === 0) {
          this.page.set(Math.max(1, Math.ceil(res.total / this.pageSize)));
          this.loadSellers();
          return;
        }
        this.sellers.set(res.items);
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
        this.loadSellers();
      });

    this.loadSellers();
  }

  loadSellers(): void {
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
    this.loadSellers();
  }

  openAddModal(): void {
    this.errorMessage.set('');
    this.editingSeller.set(null);
    this.sellerForm.reset({ fullName: '', email: '', phone: '', company: 'Showroom', status: 'verified', joinDate: this.dateInput(new Date()) });
    this.showModal.set(true);
  }

  openEditModal(seller: Seller): void {
    this.errorMessage.set('');
    this.editingSeller.set(seller);
    this.sellerForm.reset({ ...seller, joinDate: this.dateInput(new Date(seller.joinDate)) });
    this.showModal.set(true);
  }

  closeModal(): void { if (!this.saving()) this.showModal.set(false); }

  invalid(name: keyof typeof this.sellerForm.controls): boolean {
    const control = this.sellerForm.controls[name];
    return control.touched && control.invalid;
  }

  saveSeller(): void {
    if (this.saving()) return;
    this.errorMessage.set('');
    if (this.sellerForm.invalid) { this.sellerForm.markAllAsTouched(); return; }
    const input = this.sellerForm.getRawValue() as SellerInput;
    const seller = this.editingSeller();
    this.saving.set(true);
    (seller ? this.sellerService.update(seller.id, input) : this.sellerService.create(input))
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => { this.showModal.set(false); this.loadSellers(); },
        error: (error: Error) => this.errorMessage.set(error.message)
      });
  }

  deleteSeller(seller: Seller): void {
    if (!confirm(`Xoá seller ${seller.fullName} và tài khoản User tương ứng?`)) return;
    this.errorMessage.set('');
    this.sellerService.delete(seller.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.loadSellers(),
      error: (error: Error) => this.errorMessage.set(error.message)
    });
  }

  private dateInput(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}