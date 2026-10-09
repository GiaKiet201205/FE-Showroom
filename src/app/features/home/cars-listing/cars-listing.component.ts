import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FavoriteService } from '../../../core/services/favorite.service';

interface Car {
  id: number;

  name: string;
  year: number;

  mileage: string;
  fuel: string;
  transmission: string;

  price: number;

  image: string;
}

@Component({
  selector: 'app-cars-listing',

  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: './cars-listing.component.html',
  styleUrl: './cars-listing.component.scss'
})
export class CarsListingComponent {

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


  cars: Car[] = [
    {
      id: 1,
      name: 'BMW M4 Competition',
      year: 2023,

      mileage: '12k mi',
      fuel: 'Petrol',
      transmission: 'Auto',

      price: 78500,

      image: '/images/car1.jpg'
    },

    {
      id: 2,
      name: 'Tesla Model S Plaid',
      year: 2022,

      mileage: '8k mi',
      fuel: 'Electric',
      transmission: 'Single',

      price: 89900,

      image: '/images/car2.jpg'
    },

    {
      id: 3,
      name: 'Porsche 911 Carrera S',
      year: 2021,

      mileage: '15k mi',
      fuel: 'Petrol',
      transmission: 'Manual',

      price: 115000,

      image: '/images/car3.jpg'
    },

    {
      id: 4,
      name: 'Audi RS e-tron GT',
      year: 2024,

      mileage: '5k mi',
      fuel: 'Electric',
      transmission: 'Auto',

      price: 102000,

      image: '/images/car4.jpg'
    },

    {
      id: 5,
      name: 'Mercedes-Benz AMG GT63',
      year: 2023,

      mileage: '9k mi',
      fuel: 'Petrol',
      transmission: 'Auto',

      price: 124000,

      image: '/images/car1.jpg'
    },

    {
      id: 6,
      name: 'Land Rover Defender 110',
      year: 2022,

      mileage: '18k mi',
      fuel: 'Diesel',
      transmission: 'Auto',

      price: 94500,

      image: '/images/car2.jpg'
    }
  ];


  constructor(
    private router: Router,
    public favoriteService: FavoriteService
  ) {}


  viewCar(id: number): void {

    this.router.navigate([
      '/cars',
      id
    ]);

  }

  toggleFavorite(
    car: any,
    event: Event
  ): void {

    event.stopPropagation();

    this.favoriteService.toggle({
      id: car.id,

      name: car.name,
      image: car.image,

      price: car.price,
      year: car.year,

      mileage: car.mileage,
      fuel: car.fuel,
      transmission: car.transmission
    });

  }

}