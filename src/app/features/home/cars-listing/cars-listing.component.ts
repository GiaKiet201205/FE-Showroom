import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FavoriteService } from '../../../core/services/favorite.service';
import {
  Vehicle
} from '../../../core/models/vehicle.model';

import {
  VehicleService
} from '../../../core/services/vehicle/vehicle.service';


@Component({
  selector: 'app-cars-listing',

  standalone: true,

  imports: [CommonModule, FormsModule],

  templateUrl: './cars-listing.component.html',
  styleUrl: './cars-listing.component.scss'
})
export class CarsListingComponent implements OnInit {
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
}