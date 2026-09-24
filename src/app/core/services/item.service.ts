import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';

/**
 * Service mẫu gọi API backend. Đường dẫn '/items' sẽ tự động được
 * ghép với environment.apiUrl nhờ apiPrefixInterceptor.
 * Đổi tên/endpoint theo domain thực tế của đồ án bạn.
 */
@Injectable({ providedIn: 'root' })
export class ItemService {
  private http = inject(HttpClient);
  private endpoint = '/items';

  getAll(): Observable<Item[]> {
    return this.http.get<Item[]>(this.endpoint);
  }

  getById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.endpoint}/${id}`);
  }

  create(item: Partial<Item>): Observable<Item> {
    return this.http.post<Item>(this.endpoint, item);
  }

  update(id: number, item: Partial<Item>): Observable<Item> {
    return this.http.put<Item>(`${this.endpoint}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
