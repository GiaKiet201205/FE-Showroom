import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FavoriteService } from '../../../core/services/favorite.service';

@Component({
  selector: 'app-favorites',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent {

  constructor(
    public favoriteService: FavoriteService,
    private router: Router
  ) {}


  viewDetails(id: number): void {
    this.router.navigate([
      '/cars',
      id
    ]);
  }


  removeFavorite(
    id: number,
    event: Event
  ): void {

    event.stopPropagation();

    this.favoriteService.remove(id);
  }


  browseCars(): void {
    this.router.navigate(['/cars']);
  }

}