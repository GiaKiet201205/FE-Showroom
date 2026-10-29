import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';

import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-vehicle-card',

  standalone: true,

  imports: [CommonModule],

  templateUrl: './vehicle-card.component.html',

  styleUrl: './vehicle-card.component.scss',
})
export class VehicleCardComponent {
  readonly favoriteService = inject(FavoriteService);

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favoriteService.toggleVehicle(this.vehicle);
  }

  // =========================================
  // INPUT
  // Home truyền Vehicle xuống component này
  // =========================================

  @Input({
    required: true,
  })
  vehicle!: Vehicle;

  @Output()
  selected = new EventEmitter<number>();

  viewDetails(): void {
    this.selected.emit(this.vehicle.id);
  }

}
