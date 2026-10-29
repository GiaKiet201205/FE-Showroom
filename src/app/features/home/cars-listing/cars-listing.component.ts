import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../../core/services/brand/brand.service';

import { Vehicle } from '../../../core/models/vehicle.model';
import { VehicleService } from '../../../core/services/vehicle/vehicle.service';
import { FavoriteService } from '../../../core/services/favorite.service';

@Component({
  selector: 'app-cars-listing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cars-listing.component.html',
  styleUrl: './cars-listing.component.scss',
})
export class CarsListingComponent implements OnInit {
  // SEARCH
  search = '';

  // FILTER
  selectedBrand = '';
  brands: string[] = [];

  minPrice = 0;
  maxPrice?: number;
  priceLimit = 0;

  minYear?: number;
  maxYear?: number;

  availableBodyTypes: string[] = [];
  bodyTypes: Record<string, boolean> = {};

  // SORT
  sort = 'newest';

  // DATA
  cars: Vehicle[] = [];
  loading = true;

  // PAGINATION
  currentPage = 1;
  pageSize = 6;
  total = 0;
  totalPages = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService,
    private brandService: BrandService,
    public favoriteService: FavoriteService,
  ) {}

  ngOnInit(): void {
    this.brands = this.brandService.getSnapshot().map(brand => brand.name);
    this.vehicleService.getBodyTypes().subscribe(types => {
      this.availableBodyTypes = types;
    });
    this.vehicleService.getList({ status: 'available', sort: 'price-desc', page: 1, pageSize: 1 })
      .subscribe(result => {
        this.priceLimit = Math.max(5000, Math.ceil((result.items[0]?.price ?? 0) / 5000) * 5000);
      });
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
    this.loading = true;
    this.vehicleService
      .getList({
        search: this.search.trim(),
        brand: this.selectedBrand || undefined,

        // User chỉ hiển thị xe available
        status: 'available',

        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
        minYear: this.minYear,
        maxYear: this.maxYear,
        bodyTypes: this.getSelectedBodyTypes(),
        sort: this.sort,
        page: this.currentPage,
        pageSize: this.pageSize,
      })
      .subscribe(result => {
        this.loading = false;
        this.cars = result.items;
        this.total = result.total;

        this.totalPages = Math.max(
          1,
          Math.ceil(result.total / result.pageSize),
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
    this.selectedBrand = '';

    this.minPrice = 0;
    this.maxPrice = undefined;

    this.minYear = undefined;
    this.maxYear = undefined;

    this.bodyTypes = {};

    this.sort = 'newest';
    this.currentPage = 1;

    this.loadCars();
  }

  // BODY TYPE
  private getSelectedBodyTypes(): string[] {
    return Object.keys(this.bodyTypes).filter(type => this.bodyTypes[type]);
  }

  private setBodyType(bodyType: string): void {
    this.bodyTypes[bodyType] = true;
  }

  // SORT
  changeSort(): void {
    this.currentPage = 1;
    this.loadCars();
  }

  // PAGINATION
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.loadCars();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, index) => index + 1);
  }

  // VIEW DETAIL
  viewCar(id: number): void {
    this.router.navigate(['/cars', id]);
  }

  // FAVORITE
  toggleFavorite(car: Vehicle, event: Event): void {
    event.stopPropagation();

    this.favoriteService.toggleVehicle(car);
  }
}
