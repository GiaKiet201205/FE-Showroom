<<<<<<< Updated upstream
import { CommonModule } from '@angular/common';
=======
import { inject } from '@angular/core';
import { BrandService } from '../../../core/services/brand/brand.service';
import {
  CommonModule
} from '@angular/common';

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  // =========================================
  // FILTER UI
  // =========================================
=======
  // =====================================================
  // SEARCH
  // =====================================================

  private brandService = inject(BrandService);
  get brands(): string[] { return this.brandService.getSnapshot().map(brand => brand.name); }
  search = '';


  // =====================================================
  // FILTER
  // =====================================================
>>>>>>> Stashed changes

  condition = 'new';

  selectedBrand = '';

  minPrice = 20000;

<<<<<<< Updated upstream
  maxPrice = 150000;
=======
  maxPrice = 6000000;
>>>>>>> Stashed changes

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


<<<<<<< Updated upstream
  // =========================================
=======
  // =====================================================
  // SEARCH
  // =====================================================

  searchCars(): void {

    this.currentPage = 1;

    this.loadCars();

  }


  // =====================================================
  // FILTER
  // =====================================================

  applyFilters(): void {

    this.currentPage = 1;

    this.loadCars();

  }


  resetFilters(): void {

    this.search = '';

    this.condition = 'new';

    this.selectedBrand = '';

    this.minPrice = 0;

    this.maxPrice = 6000000;

    this.minYear = 2018;

    this.maxYear = 2026;

    this.bodyTypes = {

      sedan: false,

      suv: false,

      hatchback: false,

      coupe: false

    };

    this.sort = 'newest';

    this.currentPage = 1;


    this.loadCars();

  }


  // =====================================================
  // BODY TYPE
  // =====================================================

  private getSelectedBodyTypes():
    string[] {

    const selected:
      string[] = [];


    if (
      this.bodyTypes.sedan
    ) {

      selected.push(
        'Sedan'
      );

    }


    if (
      this.bodyTypes.suv
    ) {

      selected.push(
        'SUV'
      );

    }


    if (
      this.bodyTypes.hatchback
    ) {

      selected.push(
        'Hatchback'
      );

    }


    if (
      this.bodyTypes.coupe
    ) {

      selected.push(
        'Coupe'
      );

    }


    return selected;

  }


  private setBodyType(
    bodyType: string
  ): void {

    const type =
      bodyType.toLowerCase();


    if (
      type === 'sedan'
    ) {

      this.bodyTypes.sedan =
        true;

    }


    if (
      type === 'suv'
    ) {

      this.bodyTypes.suv =
        true;

    }


    if (
      type === 'hatchback'
    ) {

      this.bodyTypes.hatchback =
        true;

    }


    if (
      type === 'coupe'
    ) {

      this.bodyTypes.coupe =
        true;

    }

  }


  // =====================================================
  // SORT
  // =====================================================

  changeSort(): void {

    this.currentPage = 1;

    this.loadCars();

  }


  // =====================================================
  // PAGINATION
  // =====================================================

  goToPage(
    page: number
  ): void {

    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage
    ) {

      return;

    }


    this.currentPage =
      page;

    this.loadCars();


    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

  }


  get pages(): number[] {

    return Array.from(
      {
        length:
          this.totalPages
      },

      (_, index) =>
        index + 1
    );

  }


  // =====================================================
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
      mileage:
        `${car.mileage.toLocaleString()} mi`,
=======
        stockQuantity:
          car.stockQuantity,
>>>>>>> Stashed changes

      fuel:
        car.fuelType ?? '-',

      transmission:
        car.transmission ?? '-'

    });

  }

}