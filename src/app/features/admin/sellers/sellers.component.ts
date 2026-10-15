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
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EMPTY, Subject, catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs';
import { SellerService } from '../../../core/services/seller/seller.service';
import { Seller, SellerStats } from '../../../core/models/seller.model';

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
}