import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Vehicle } from '../../../core/models/vehicle.model';
import { VehicleService } from '../../../core/services/vehicle/vehicle.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { BrandService } from '../../../core/services/brand/brand.service';

@Component({
  selector: 'app-cars-listing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cars-listing.component.html',
  styleUrl: './cars-listing.component.scss'
})
export class CarsListingComponent implements OnInit {
  // SEARCH
  search = '';

  // FILTER
  condition = 'new';
  selectedBrand = '';
  brands: string[] = [];

  minPrice = 0;
  maxPrice = 250000;

  minYear = 2018;
  maxYear = 2026;

  bodyTypes = {
    sedan: false,
    suv: false,
    hatchback: false,
    coupe: false
  };

  // SORT
  sort = 'newest';

  // DATA
  cars: Vehicle[] = [];

  // PAGINATION
  currentPage = 1;
  pageSize = 3;
  total = 0;
  totalPages = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private brandService: BrandService,
    public favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    this.brands = this.brandService.getSnapshot().map(brand => brand.name);
    this.readQueryParams();
    this.loadCars();
  }

  // QUERY PARAMS
  private readQueryParams(): void {
    const params = this.route.snapshot.queryParamMap;

    const brand = params.get('brand');
    const bodyType = params.get('bodyType');
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');

    if (brand) {
      this.selectedBrand = brand;
    }

    if (bodyType) {
      this.setBodyType(bodyType);
    }

    if (minPrice) {
      this.minPrice = Number(minPrice);
    }

    if (maxPrice) {
      this.maxPrice = Number(maxPrice);
    }
  }

  // LOAD CARS
  loadCars(): void {
    this.vehicleService
      .getList({
        search: this.search,
        brand: this.selectedBrand || undefined,

        // User chỉ hiển thị xe available
        status: 'available',

        condition: this.condition,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        minYear: this.minYear,
        maxYear: this.maxYear,
        bodyTypes: this.getSelectedBodyTypes(),
        sort: this.sort,
        page: this.currentPage,
        pageSize: this.pageSize
      })
      .subscribe(result => {
        this.cars = result.items;
        this.total = result.total;

        this.totalPages = Math.max(
          1,
          Math.ceil(result.total / result.pageSize)
        );
      });
  }

  // SEARCH
  searchCars(): void {
    this.currentPage = 1;
    this.loadCars();
  }

  // FILTER
  applyFilters(): void {
    this.currentPage = 1;
    this.loadCars();
  }

  resetFilters(): void {
    this.search = '';
    this.condition = 'all';
    this.selectedBrand = '';

    this.minPrice = 0;
    this.maxPrice = 250000;

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

  // BODY TYPE
  private getSelectedBodyTypes(): string[] {
    const selected: string[] = [];

    if (this.bodyTypes.sedan) {
      selected.push('Sedan');
    }

    if (this.bodyTypes.suv) {
      selected.push('SUV');
    }

    if (this.bodyTypes.hatchback) {
      selected.push('Hatchback');
    }

    if (this.bodyTypes.coupe) {
      selected.push('Coupe');
    }

    return selected;
  }

  private setBodyType(bodyType: string): void {
    const type = bodyType.toLowerCase();

    if (type === 'sedan') {
      this.bodyTypes.sedan = true;
    }

    if (type === 'suv') {
      this.bodyTypes.suv = true;
    }

    if (type === 'hatchback') {
      this.bodyTypes.hatchback = true;
    }

    if (type === 'coupe') {
      this.bodyTypes.coupe = true;
    }
  }

  // SORT
  changeSort(): void {
    this.currentPage = 1;
    this.loadCars();
  }

  // PAGINATION
  goToPage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage
    ) {
      return;
    }

    this.currentPage = page;
    this.loadCars();

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  get pages(): number[] {
    return Array.from(
      { length: this.totalPages },
      (_, index) => index + 1
    );
  }

  // VIEW DETAIL
  viewCar(id: number): void {
    this.router.navigate(['/cars', id]);
  }

  // FAVORITE
  toggleFavorite(car: Vehicle, event: Event): void {
    event.stopPropagation();

    this.favoriteService.toggle({
      id: car.id,
      name: `${car.brand} ${car.model}`,
      image: car.imageUrl ?? '',
      price: car.price,
      year: car.year,
      stockQuantity: car.stockQuantity,
      fuel: car.fuelType ?? '-',
      transmission: car.transmission ?? '-'
    });
  }
}
