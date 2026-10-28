import { UserService } from '../user/user.service';
import { Injectable, inject } from '@angular/core';
import { Observable, of, defer, map, tap } from 'rxjs';
import { Seller, SellerListResult, SellerInput } from '../../models/seller.model';
import { MOCK_SELLER_STATS } from './seller.mock';

export interface SellerQuery {
  search?: string;
  status?: string;
  date?: string;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class SellerService {
  private users = inject(UserService);
  private details = new Map<number, { company: string }>();

  create(input: SellerInput): Observable<Seller> {
    return defer(() => {
      this.validate(input);
      return this.users.create({ fullName: input.fullName.trim(), email: input.email, phone: input.phone.trim(),
        registeredAt: input.joinDate, role: 'seller', status: this.userStatus(input.status)
      }).pipe(
        tap(user => this.details.set(user.id, { company: input.company.trim() })),
        map(user => this.getSnapshot().find(seller => seller.id === user.id)!)
      );
    });
  }

  update(id: number, input: SellerInput): Observable<Seller> {
    return defer(() => {
      this.validate(input);
      if (!this.getSnapshot().some(seller => seller.id === id)) throw new Error('Không tìm thấy seller.');
      return this.users.update(id, { fullName: input.fullName.trim(), email: input.email, phone: input.phone.trim(),
        registeredAt: input.joinDate, role: 'seller', status: this.userStatus(input.status)
      }).pipe(
        tap(() => this.details.set(id, { company: input.company.trim() })),
        map(() => this.getSnapshot().find(seller => seller.id === id)!)
      );
    });
  }

  delete(id: number): Observable<void> {
    return defer(() => {
      if (!this.getSnapshot().some(seller => seller.id === id)) throw new Error('Không tìm thấy seller.');
      return this.users.delete(id).pipe(tap(() => this.details.delete(id)));
    });
  }

  private userStatus(status: SellerInput['status']): 'active' | 'pending' | 'blocked' {
    return status === 'verified' ? 'active' : status === 'suspended' ? 'blocked' : 'pending';
  }

  private validate(input: SellerInput): void {
    if (!input.fullName.trim() || input.fullName.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) ||
        !/^[+]?[-\d\s().]{7,20}$/.test(input.phone.trim()) || !input.company.trim() || input.company.length > 100 ||
        !Number.isFinite(Date.parse(input.joinDate)) || !['verified', 'pending', 'suspended'].includes(input.status)) {
      throw new Error('Vui lòng nhập đầy đủ thông tin seller hợp lệ.');
    }
  }

  getSnapshot(): Seller[] {
    return this.users.getSnapshot().filter(user => user.role === 'seller').map(user => ({
      id: user.id, userId: user.id, fullName: user.fullName, email: user.email, phone: user.phone,
      company: this.details.get(user.id)?.company ?? 'Showroom', listings: 0, joinDate: user.registeredAt,
      status: user.status === 'active' ? 'verified' : user.status === 'blocked' ? 'suspended' : 'pending'
    }));
  }

  getList(query: SellerQuery): Observable<SellerListResult> {
    let result = this.getSnapshot();

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
      stats: { ...MOCK_SELLER_STATS, totalSellers: this.getSnapshot().length, verified: this.getSnapshot().filter(s => s.status === 'verified').length, pendingVerification: this.getSnapshot().filter(s => s.status === 'pending').length, suspended: this.getSnapshot().filter(s => s.status === 'suspended').length }
    });
  }
}