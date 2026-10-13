import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Order, OrderListResult } from '../../models/order.model';
import { MOCK_ORDERS, MOCK_ORDER_STATS } from './order.mock';

export interface OrderQuery {
  search?: string;
  date?: string;
  payment?: string;
  status?: string;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  // Khởi tạo mảng dữ liệu đệm nội bộ
  private orders: Order[] = MOCK_ORDERS.map(o => ({ ...o }));

  getList(query: OrderQuery): Observable<OrderListResult> {
    let result = [...this.orders];

    // Xử lý bộ lọc tìm kiếm
    const search = query.search?.trim().toLowerCase();
    if (search) {
      result = result.filter(o =>
        o.customerName.toLowerCase().includes(search) ||
        o.vehicleName.toLowerCase().includes(search) ||
        o.id.toLowerCase().includes(search)
      );
    }

    // Xử lý bộ lọc ngày đặt hàng
    if (query.date) {
      const filterDate = new Date(query.date);
      result = result.filter(o => {
        const oDate = new Date(o.date);
        return oDate.getFullYear() === filterDate.getFullYear() &&
               oDate.getMonth() === filterDate.getMonth() &&
               oDate.getDate() === filterDate.getDate();
      });
    }

    // Xử lý bộ lọc phương thức thanh toán
    if (query.payment && query.payment !== 'all') {
      result = result.filter(o => o.payment === query.payment);
    }

    // Xử lý bộ lọc trạng thái đơn hàng
    if (query.status && query.status !== 'all') {
      result = result.filter(o => o.status === query.status);
    }

    // Xử lý phân trang
    const total = result.length;
    const start = (query.page - 1) * query.pageSize;
    const items = result.slice(start, start + query.pageSize);

    return of({
      items,
      total,
      page: query.page,
      pageSize: query.pageSize,
      stats: MOCK_ORDER_STATS
    });
  }

  delete(id: string): Observable<void> {
    this.orders = this.orders.filter(o => o.id !== id);
    return of(undefined);
  }
}