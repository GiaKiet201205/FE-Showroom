import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  Vehicle
} from '../../../core/models/vehicle.model';

import {
  VehicleService
} from '../../../core/services/vehicle/vehicle.service';

import {
  FavoriteService
} from '../../../core/services/favorite.service';


@Component({
  selector: 'app-cars-listing',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './cars-listing.component.html',

  styleUrl:
    './cars-listing.component.scss'
})
export class CarsListingComponent
  implements OnInit {

  // =========================================
  // FILTER UI
  // =========================================

  condition = 'all';

  selectedBrand = '';

  minPrice = 20000;

  maxPrice = 150000;

  minYear = 2018;

  maxYear = 2026;


  bodyTypes = {
    sedan: true,
    suv: false,
    hatchback: false,
    coupe: false
  };


  // =========================================
  // DATA
  // =========================================

  cars: Vehicle[] = [];


  constructor(
    private router: Router,

    private vehicleService:
      VehicleService,

    public favoriteService:
      FavoriteService
  ) {}


  ngOnInit(): void {

    this.loadCars();

  }


  // =========================================
  // LOAD
  // =========================================

  private loadCars(): void {

    this.vehicleService
      .getList({
        page: 1,
        pageSize: 20
      })
      .subscribe(result => {

        this.cars =
          result.items;

      });

  }


  // =========================================
  // VIEW DETAIL
  // =========================================

  viewCar(id: number): void {

    this.router.navigate([
      '/cars',
      id
    ]);

  }


  // =========================================
  // FAVORITE
  // =========================================

  toggleFavorite(
    car: Vehicle,
    event: Event
  ): void {

    event.stopPropagation();


    this.favoriteService.toggle({

      id: car.id,

      name:
        `${car.brand} ${car.model}`,

      image:
        car.imageUrl ?? '',

      price:
        car.price,

      year:
        car.year,

      mileage:
        `${car.mileage.toLocaleString()} mi`,

      fuel:
        car.fuelType ?? '-',

      transmission:
        car.transmission ?? '-'

    });

  }

}