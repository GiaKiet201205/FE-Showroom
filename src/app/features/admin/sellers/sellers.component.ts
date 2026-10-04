import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SellerService } from '../../../core/services/seller/seller.service';
import { Seller, SellerStats } from '../../../core/models/seller.model';

@Component({
  selector: 'app-admin-sellers',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './sellers.component.html',
  styleUrl: './sellers.component.scss'
})
export class AdminSellersComponent implements OnInit {
  private sellerService = inject(SellerService);

  sellers = signal<Seller[]>([]);
  stats = signal<SellerStats | null>(null);
  total = signal(0);
  loading = signal(true);

  searchTerm = signal('');
  statusFilter = signal('all');

  page = signal(1);
  pageSize = 8;

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));
  rangeEnd = computed(() => Math.min(this.page() * this.pageSize, this.total()));

  ngOnInit(): void {
    this.loadSellers();
  }

  loadSellers(): void {
    this.loading.set(true);
    this.sellerService
      .getList({
        search: this.searchTerm(),
        status: this.statusFilter() === 'all' ? undefined : this.statusFilter(),
        page: this.page(),
        pageSize: this.pageSize
      })
      .subscribe({
        next: (res) => {
          this.sellers.set(res.items);
          this.total.set(res.total);
          this.stats.set(res.stats);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  onFilterChange(): void {
    this.page.set(1);
    this.loadSellers();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.loadSellers();
  }
}