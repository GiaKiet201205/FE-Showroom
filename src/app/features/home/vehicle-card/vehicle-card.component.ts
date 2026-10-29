import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Vehicle
} from '../../../core/models/vehicle.model';
import { FavoriteService } from '../../../core/services/favorite.service';


@Component({
  selector: 'app-vehicle-card',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './vehicle-card.component.html',

  styleUrl:
    './vehicle-card.component.scss'
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
    required: true
  })
  vehicle!: Vehicle;


  // =========================================
  // OUTPUT
  // Component con gửi id xe về Home
  // =========================================

  @Output()
  selected =
    new EventEmitter<number>();


  // =========================================
  // CLICK VEHICLE
  // =========================================

  viewDetails(): void {

    this.selected.emit(
      this.vehicle.id
    );

  }

}
