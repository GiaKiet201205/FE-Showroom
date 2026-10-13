import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Seller, SellerListResult } from '../../models/seller.model';
import { MOCK_SELLERS, MOCK_SELLER_STATS } from './seller.mock';

export interface SellerQuery {
  search?: string;
  status?: string;
  date?: string;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class SellerService {
  // Khởi tạo mảng dữ liệu đệm nội bộ
  private sellers: Seller[] = MOCK_SELLERS.map(s => ({ ...s }));

  getList(query: SellerQuery): Observable<SellerListResult> {
    let result = [...this.sellers];

    // Xử lý bộ lọc tìm kiếm
    const search = query.search?.trim().toLowerCase();
    if (search) {
      result = result.filter(s =>
        s.fullName.toLowerCase().includes(search) ||
        s.email.toLowerCase().includes(search) ||
        s.company.toLowerCase().includes(search) ||
        s.phone.includes(search)
      );
    }

    // Xử lý bộ lọc ngày tham gia (joinDate)
    if (query.date) {
      const filterDate = new Date(query.date);
      result = result.filter(s => {
        const sDate = new Date(s.joinDate);
        return sDate.getFullYear() === filterDate.getFullYear() &&
               sDate.getMonth() === filterDate.getMonth() &&
               sDate.getDate() === filterDate.getDate();
      });
    }

    // Xử lý bộ lọc trạng thái
    if (query.status && query.status !== 'all') {
      result = result.filter(s => s.status === query.status);
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
      stats: MOCK_SELLER_STATS
    });
  }
}