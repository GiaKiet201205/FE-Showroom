import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TestDriveListResult, TestDriveBooking } from '../../models/test-drive.model';
import { MOCK_TEST_DRIVES, MOCK_TEST_DRIVE_STATS } from './test-drive.mock';

export interface TestDriveQuery {
  search?: string;
  date?: string;
  status?: string;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class TestDriveService {
  // Khởi tạo mảng dữ liệu đệm nội bộ
  private bookings: TestDriveBooking[] = MOCK_TEST_DRIVES.map(b => ({ ...b }));

  getList(query: TestDriveQuery): Observable<TestDriveListResult> {
    let result = [...this.bookings];

    // Xử lý bộ lọc tìm kiếm
    const search = query.search?.trim().toLowerCase();
    if (search) {
      result = result.filter(b => 
        b.customerName.toLowerCase().includes(search) || 
        b.vehicleName.toLowerCase().includes(search) ||
        b.id.toLowerCase().includes(search)
      );
    }

    // Xử lý đối chiếu dữ liệu ngày tháng
    if (query.date) {
      const filterDate = new Date(query.date);
      result = result.filter(b => {
        const bDate = new Date(b.preferredDate);
        return bDate.getFullYear() === filterDate.getFullYear() &&
               bDate.getMonth() === filterDate.getMonth() &&
               bDate.getDate() === filterDate.getDate();
      });
    }

    if (query.status && query.status !== 'all') {
      result = result.filter(b => b.status === query.status);
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
      stats: MOCK_TEST_DRIVE_STATS
    });
  }

  create(booking: Omit<TestDriveBooking, 'id'>): Observable<TestDriveBooking> {
    const numericIds = this.bookings.map(b => parseInt(b.id.replace('TD-', '')) || 0);
    const newBooking: TestDriveBooking = {
      ...booking,
      id: `TD-${Math.max(8000, ...numericIds) + 1}`
    };
    this.bookings = [...this.bookings, newBooking];
    return of(newBooking);
  }

  update(id: string, changes: Partial<TestDriveBooking>): Observable<TestDriveBooking> {
    const index = this.bookings.findIndex(b => b.id === id);
    if (index === -1) {
      throw new Error('Không tìm thấy dữ liệu');
    }
    const updated = { ...this.bookings[index], ...changes };
    this.bookings = this.bookings.map(b => b.id === id ? updated : b);
    return of(updated);
  }

  delete(id: string): Observable<void> {
    this.bookings = this.bookings.filter(b => b.id !== id);
    return of(undefined);
  }
}