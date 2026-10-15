<<<<<<< HEAD
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { UserListResult } from '../../models/user.model';
import { MOCK_CURRENT_USER, MOCK_USERS, MOCK_USERS_TOTAL, MOCK_USER_STATS } from './user.mock';
=======
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserAccount, UserListResult } from '../../models/user.model';
import { MOCK_USERS, MOCK_USER_STATS } from './user.mock';
>>>>>>> c42b7b62a72b7e494f7ea63e3ef7a309457390da

export interface UserQuery {
  search?: string;
  role?: string;
  status?: string;
  page: number;
  pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private endpoint = '/admin/users';
  // Khởi tạo mảng dữ liệu đệm nội bộ
  private users: UserAccount[] = MOCK_USERS.map(u => ({ ...u }));
  private currentUser: UserAccount = {
    ...MOCK_CURRENT_USER
  };


  getCurrentUser():
    Observable<UserAccount> {

    return of({
      ...this.currentUser
    });

  }


  updateCurrentUser(
    changes: Partial<UserAccount>
  ): Observable<UserAccount> {

    this.currentUser = {

      ...this.currentUser,

      ...changes

    };


    return of({
      ...this.currentUser
    });

  }

  getList(query: UserQuery): Observable<UserListResult> {
    let result = [...this.users];

    // Xử lý bộ lọc tìm kiếm
    const search = query.search?.trim().toLowerCase();
    if (search) {
      result = result.filter(u => 
        u.fullName.toLowerCase().includes(search) || 
        u.email.toLowerCase().includes(search) ||
        u.phone.includes(search)
      );
    }

    if (query.role && query.role !== 'all') {
      result = result.filter(u => u.role === query.role);
    }

    if (query.status && query.status !== 'all') {
      result = result.filter(u => u.status === query.status);
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
      stats: MOCK_USER_STATS
    });
  }

  create(user: Omit<UserAccount, 'id'>): Observable<UserAccount> {
    const newUser: UserAccount = {
      ...user,
      id: Math.max(0, ...this.users.map(u => u.id)) + 1
    };
    this.users = [...this.users, newUser];
    return of(newUser);
  }

  update(id: number, changes: Partial<UserAccount>): Observable<UserAccount> {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Không tìm thấy dữ liệu');
    }
    const updated = { ...this.users[index], ...changes };
    this.users = this.users.map(u => u.id === id ? updated : u);
    return of(updated);
  }

  delete(id: number): Observable<void> {
    this.users = this.users.filter(u => u.id !== id);
    return of(undefined);
  }

  toggleBlock(id: number): Observable<void> {
    this.users = this.users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' };
      }
      return u;
    });
    return of(undefined);
  }
}