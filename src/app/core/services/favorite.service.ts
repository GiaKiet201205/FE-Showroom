import {
  Injectable,
  PLATFORM_ID,
  inject,
  signal
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import { FavoriteVehicle } from '../models/favorite-vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

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
      return JSON.parse(data);
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


  // =========================================
  // CHECK
  // =========================================

  isFavorite(id: number): boolean {

    return this.favoritesSignal().some(
      vehicle => vehicle.id === id
    );

  }


  clear(): void {

    this.favoritesSignal.set([]);

    this.saveFavorites();

  }

}