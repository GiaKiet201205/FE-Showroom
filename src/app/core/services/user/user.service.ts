import { Injectable } from '@angular/core';

import {
  Observable,
  of
} from 'rxjs';

import {
  UserAccount,
  UserListResult
} from '../../models/user.model';

import {
  MOCK_CURRENT_USER,
  MOCK_USERS,
  MOCK_USER_STATS
} from './user.mock';


export interface UserQuery {
  search?: string;

  role?: string;

  status?: string;

  page: number;

  pageSize: number;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  // =====================================================
  // MOCK DATA
  // =====================================================

  private users: UserAccount[] =
    MOCK_USERS.map(
      user => ({
        ...user
      })
    );


  private currentUser: UserAccount = {
    ...MOCK_CURRENT_USER
  };


  // =====================================================
  // CURRENT USER
  // =====================================================

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


    // Đồng bộ current user
    // vào danh sách user admin
    this.users =
      this.users.map(
        user =>
          user.id === this.currentUser.id
            ? {
                ...user,
                ...this.currentUser
              }
            : user
      );


    return of({
      ...this.currentUser
    });

  }


  // =====================================================
  // GET LIST
  // =====================================================

  getList(
    query: UserQuery
  ): Observable<UserListResult> {

    let result = [
      ...this.users
    ];


    // ===============================
    // SEARCH
    // ===============================

    const search =
      query.search
        ?.trim()
        .toLowerCase();


    if (search) {

      result =
        result.filter(
          user =>

            user.fullName
              .toLowerCase()
              .includes(search)

            ||

            user.email
              .toLowerCase()
              .includes(search)

            ||

            user.phone
              .toLowerCase()
              .includes(search)
        );

    }


    // ===============================
    // ROLE
    // ===============================

    if (
      query.role &&
      query.role !== 'all'
    ) {

      result =
        result.filter(
          user =>
            user.role === query.role
        );

    }


    // ===============================
    // STATUS
    // ===============================

    if (
      query.status &&
      query.status !== 'all'
    ) {

      result =
        result.filter(
          user =>
            user.status === query.status
        );

    }


    // ===============================
    // PAGINATION
    // ===============================

    const total =
      result.length;


    const start =
      (query.page - 1)
      * query.pageSize;


    const items =
      result.slice(
        start,
        start + query.pageSize
      );


    return of({

      items,

      total,

      page:
        query.page,

      pageSize:
        query.pageSize,

      stats:
        MOCK_USER_STATS

    });

  }


  // =====================================================
  // CREATE
  // =====================================================

  create(
    user:
      Omit<UserAccount, 'id'>
  ): Observable<UserAccount> {

    const newUser: UserAccount = {

      ...user,

      id:
        Math.max(
          0,
          ...this.users.map(
            user => user.id
          )
        ) + 1

    };


    this.users = [
      ...this.users,
      newUser
    ];


    return of(newUser);

  }


  // =====================================================
  // UPDATE
  // =====================================================

  update(
    id: number,
    changes:
      Partial<UserAccount>
  ): Observable<UserAccount> {

    const index =
      this.users.findIndex(
        user =>
          user.id === id
      );


    if (index === -1) {

      throw new Error(
        'Không tìm thấy dữ liệu'
      );

    }


    const updated: UserAccount = {

      ...this.users[index],

      ...changes

    };


    this.users =
      this.users.map(
        user =>
          user.id === id
            ? updated
            : user
      );


    // Nếu admin sửa đúng user
    // đang đăng nhập thì cập nhật profile
    if (
      id === this.currentUser.id
    ) {

      this.currentUser = {
        ...updated
      };

    }


    return of(updated);

  }


  // =====================================================
  // DELETE
  // =====================================================

  delete(
    id: number
  ): Observable<void> {

    this.users =
      this.users.filter(
        user =>
          user.id !== id
      );


    return of(undefined);

  }


  // =====================================================
  // BLOCK / UNBLOCK
  // =====================================================

  toggleBlock(
    id: number
  ): Observable<void> {

    this.users =
      this.users.map(
        user => {

          if (
            user.id === id
          ) {

            return {

              ...user,

              status:
                user.status === 'blocked'
                  ? 'active'
                  : 'blocked'

            };

          }


          return user;

        }
      );


    return of(undefined);

  }

}