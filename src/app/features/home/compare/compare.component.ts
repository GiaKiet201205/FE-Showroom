import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface CompareVehicle {
  id: number;
  name: string;
  image: string;

  price: number;
  year: number;

  mileage: string;
  engine: string;
  horsepower: string;

  fuelType: string;
  transmission: string;

  bodyType: string;
  drivetrain: string;

  featured?: boolean;
}

@Component({
  selector: 'app-compare',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './compare.component.html',
  styleUrl: './compare.component.scss'
})
export class CompareComponent {

  vehicles: CompareVehicle[] = [
    {
      id: 1,

      name: 'Porsche 911 Carrera S',

      image: '/images/car-3.jpg',

      price: 115000,
      year: 2021,

      mileage: '15k mi',

      engine: '3.0L Twin-Turbo Flat-6',

      horsepower: '443 hp',

      fuelType: 'Petrol',

      transmission: 'Manual',

      bodyType: 'Coupe',

      drivetrain: 'RWD'
    },

    {
      id: 2,

      name: 'BMW M4 Competition',

      image: '/images/car-1.jpg',

      price: 78500,
      year: 2023,

      mileage: '12k mi',

      engine: '3.0L Twin-Turbo Inline-6',

      horsepower: '503 hp',

      fuelType: 'Petrol',

      transmission: 'Auto',

      bodyType: 'Coupe',

      drivetrain: 'RWD',

      featured: true
    },

    {
      id: 3,

      name: 'Audi RS e-tron GT',

      image: '/images/car-4.jpg',

      price: 104200,
      year: 2023,

      mileage: '3k mi',

      engine: 'Dual Electric Motors',

      horsepower: '637 hp',

      fuelType: 'Electric',

      transmission: 'Auto',

      bodyType: 'Sedan',

      drivetrain: 'AWD'
    }
  ];


  removeVehicle(id: number): void {

    this.vehicles =
      this.vehicles.filter(
        (vehicle) => vehicle.id !== id
      );

  }

}