import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { OrderService } from '../../../core/services/order/order.service';
import { Order, OrderStats } from '../../../core/models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders = signal<Order[]>([]);
  stats = signal<OrderStats | null>(null);
  total = signal(0);
  loading = signal(true);

  searchTerm = signal('');
  dateFilter = signal('');
  paymentFilter = signal('all');
  statusFilter = signal('all');

  page = signal(1);
  pageSize = 8;

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));
  rangeEnd = computed(() => Math.min(this.page() * this.pageSize, this.total()));

  // Các biến trạng thái quản lý hộp thoại hóa đơn
  showInvoiceModal = signal(false);
  selectedOrder = signal<Order | null>(null);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.orderService
      .getList({
        search: this.searchTerm(),
        date: this.dateFilter() ? this.dateFilter() : undefined,
        payment: this.paymentFilter() === 'all' ? undefined : this.paymentFilter(),
        status: this.statusFilter() === 'all' ? undefined : this.statusFilter(),
        page: this.page(),
        pageSize: this.pageSize
      })
      .subscribe({
        next: (res) => {
          this.orders.set(res.items);
          this.total.set(res.total);
          this.stats.set(res.stats);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  onFilterChange(): void {
    this.page.set(1);
    this.loadOrders();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.loadOrders();
  }

  deleteOrder(order: Order): void {
    if (!confirm(`Xoá đơn hàng ${order.id} của khách hàng ${order.customerName}?`)) return;
    this.orderService.delete(order.id).subscribe({
      next: () => this.loadOrders(),
      error: () => this.loadOrders()
    });
  }

  exportCsv(): void {
    const header = ['Order ID', 'Customer', 'Vehicle', 'Price', 'Method', 'Payment', 'Date', 'Status'];
    const rows = this.orders().map((o) => [
      o.id, o.customerName, o.vehicleName, o.price, o.method, o.payment, o.date, o.status
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  formatCurrency(value: number): string {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value}`;
  }

  // Hàm mở hộp thoại hóa đơn
  openInvoice(order: Order): void {
    this.selectedOrder.set(order);
    this.showInvoiceModal.set(true);
  }

  // Hàm đóng hộp thoại hóa đơn
  closeInvoice(): void {
    this.showInvoiceModal.set(false);
    this.selectedOrder.set(null);
  }

  // Hàm in hóa đơn
  printInvoice(): void {
    window.print();
  }
}