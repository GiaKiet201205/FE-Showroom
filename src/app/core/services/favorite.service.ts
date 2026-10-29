import { MOCK_VEHICLES } from './vehicle/vehicle.mock';
import {
  Injectable,
  PLATFORM_ID,
  inject,
  signal
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { FavoriteVehicle } from '../models/favorite-vehicle.model';
import { Vehicle } from '../models/vehicle.model';
import { CompareService } from './compare.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private compareService = inject(CompareService);

  private readonly STORAGE_KEY = 'favoriteVehicles';

  private platformId = inject(PLATFORM_ID);

  private favoritesSignal =
    signal<FavoriteVehicle[]>(this.loadFavorites());

  readonly favorites = this.favoritesSignal.asReadonly();


  // =========================================
  // LOAD LOCAL STORAGE
  // =========================================

  private loadFavorites(): FavoriteVehicle[] {

    if (!isPlatformBrowser(this.platformId)) {
      return [];
    }

    const data =
      localStorage.getItem(this.STORAGE_KEY);

    if (!data) {
      return [];
    }

    try {
      const saved: FavoriteVehicle[] = JSON.parse(data);
      if (!Array.isArray(saved)) return [];
      return saved.map(vehicle => ({
        ...vehicle,
        stockQuantity: Number.isInteger(vehicle.stockQuantity) && vehicle.stockQuantity >= 0
          ? vehicle.stockQuantity
          : MOCK_VEHICLES.find(item => item.id === vehicle.id)?.stockQuantity ?? 0
      }));
    } catch {
      return [];
    }

  }


  // =========================================
  // SAVE LOCAL STORAGE
  // =========================================

  private saveFavorites(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(this.favoritesSignal())
    );

  }


  // =========================================
  // ADD
  // =========================================

  add(vehicle: FavoriteVehicle): void {
    this.compareService.add(vehicle.id);

    if (this.isFavorite(vehicle.id)) {
      return;
    }

    this.favoritesSignal.update(
      current => [
        ...current,
        vehicle
      ]
    );

    this.saveFavorites();

  }


  // =========================================
  // REMOVE
  // =========================================

  remove(id: number): void {
    this.compareService.remove(id);

    this.favoritesSignal.update(
      current =>
        current.filter(
          vehicle => vehicle.id !== id
        )
    );

    this.saveFavorites();

  }


  // =========================================
  // TOGGLE
  // =========================================

  toggle(vehicle: FavoriteVehicle): void {

    if (this.isFavorite(vehicle.id)) {
      this.remove(vehicle.id);
    } else {
      this.add(vehicle);
    }

  }

  toggleVehicle(vehicle: Vehicle): void {
    this.toggle({
      id: vehicle.id,
      name: `${vehicle.brand} ${vehicle.model}`,
      image: vehicle.imageUrl ?? '/images/vehicle-placeholder.svg',
      price: vehicle.price,
      year: vehicle.year,
      stockQuantity: vehicle.stockQuantity,
      fuel: vehicle.fuelType ?? '-',
      transmission: vehicle.transmission ?? '-'
    });
  }


  // =========================================
  // CHECK
  // =========================================

  isFavorite(id: number): boolean {

    return this.favoritesSignal().some(
      vehicle => vehicle.id === id
    );

  }


  clear(): void {
    this.favoritesSignal().forEach(vehicle => this.compareService.remove(vehicle.id));

    this.favoritesSignal.set([]);

    this.saveFavorites();

  }

}
