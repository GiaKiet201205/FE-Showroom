import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoriteService } from '../../../core/services/favorite.service';
import {
  Vehicle
} from '../../../core/models/vehicle.model';

import {
  VehicleService
} from '../../../core/services/vehicle/vehicle.service';

interface Specification {
  label: string;
  value: string;
}

interface Seller {
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  address: string;
  phone: string;
}

interface CarDetail {
  id: number;

  listingId: string;

  name: string;
  year: number;
  price: number;

  images: string[];

  seller: Seller;

  specifications: Specification[];

  highlights: string[];

  description: string;
}

@Component({
  selector: 'app-car-detail',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './car-detail.component.html',
  styleUrl: './car-detail.component.scss'
})
export class CarDetailComponent {

  car?: Vehicle;

  selectedImage = '';


  constructor(
    private route: ActivatedRoute,

    private router: Router,

    private vehicleService:
      VehicleService,

    public favoriteService:
      FavoriteService
  ) {

    const id =
      Number(
        this.route.snapshot
          .paramMap
          .get('id')
      );


    this.vehicleService
      .getById(id)
      .subscribe(vehicle => {

        this.car = vehicle;


        if (vehicle) {

          this.selectedImage =
            vehicle.images?.[0]
            ?? vehicle.imageUrl
            ?? '';

        }
      });
  }
}