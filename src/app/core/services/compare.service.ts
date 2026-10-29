import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CompareService {
  private readonly storageKey = 'compareVehicleIds';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly selectedIds = signal<number[]>(this.loadIds());
  readonly ids = this.selectedIds.asReadonly();

  private loadIds(): number[] {
    if (!isPlatformBrowser(this.platformId)) return [];
    try {
      const saved = localStorage.getItem(this.storageKey);
      // Include previously saved favorites the first time comparison is used.
      const value: unknown = saved !== null
        ? JSON.parse(saved)
        : JSON.parse(localStorage.getItem('favoriteVehicles') ?? '[]')
            .map((vehicle: { id: number }) => vehicle.id);
      return Array.isArray(value)
        ? [...new Set(value.filter((id): id is number => Number.isSafeInteger(id) && id > 0))]
        : [];
    } catch {
      return [];
    }
  }

  add(id: number): void {
    if (!this.ids().includes(id)) this.save([...this.ids(), id]);
  }

  remove(id: number): void {
    this.save(this.ids().filter(selected => selected !== id));
  }

  private save(ids: number[]): void {
    this.selectedIds.set(ids);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, JSON.stringify(ids));
    }
  }
}
