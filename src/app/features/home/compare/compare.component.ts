import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Vehicle
} from '../../../core/models/vehicle.model';

import {
  VehicleService
} from '../../../core/services/vehicle/vehicle.service';

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
  vehicles: Vehicle[] = [];
  constructor(
    private vehicleService:
      VehicleService
  ) {}


  ngOnInit(): void {

    this.vehicleService
      .getByIds([
        3,
        1,
        4
      ])
      .subscribe(data => {
        this.vehicles = data;
      });
  }
  removeVehicle(
    id: number
  ): void {

    this.vehicles =
      this.vehicles.filter(
        vehicle =>
          vehicle.id !== id
      );

  }

}