import { CommonModule } from '@angular/common';

import {
  Component
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Vehicle,
  VehicleSpecification
} from '../../../core/models/vehicle.model';

import {
  VehicleService
} from '../../../core/services/vehicle/vehicle.service';

import {
  FavoriteService
} from '../../../core/services/favorite.service';


@Component({
  selector: 'app-car-detail',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './car-detail.component.html',

  styleUrl:
    './car-detail.component.scss'
})
export class CarDetailComponent {

  car?: Vehicle;

  selectedImage = '';

  specifications:
    VehicleSpecification[] = [];


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


        if (!vehicle) {
          return;
        }


        this.selectedImage =
          vehicle.images?.[0]
          ?? vehicle.imageUrl
          ?? '';


        this.specifications =
          this.buildSpecifications(
            vehicle
          );

      });

  }


  // =========================================
  // SPECIFICATIONS
  // =========================================

  private buildSpecifications(
    vehicle: Vehicle
  ): VehicleSpecification[] {

    return [

      {
        label: 'Engine',
        value:
          vehicle.engine ?? '-'
      },

      {
        label: 'Horsepower',
        value:
          vehicle.horsepower ?? '-'
      },

      {
        label: 'Fuel Type',
        value:
          vehicle.fuelType ?? '-'
      },

      {
        label: 'Transmission',
        value:
          vehicle.transmission ?? '-'
      },

      {
        label: 'Số lượng trong kho',
        value:
          `${vehicle.stockQuantity.toLocaleString()} xe`
      },

      {
        label: 'Body Type',
        value:
          vehicle.bodyType ?? '-'
      },

      {
        label: 'Drivetrain',
        value:
          vehicle.drivetrain ?? '-'
      },

      {
        label: 'Exterior Color',
        value:
          vehicle.color
      }

    ];

  }


  // =========================================
  // IMAGE
  // =========================================

  selectImage(
    image: string
  ): void {

    this.selectedImage =
      image;

  }


  // =========================================
  // TEST DRIVE
  // =========================================

  scheduleTestDrive(): void {

    if (!this.car) {
      return;
    }


    this.router.navigate(
      ['/test-drives'],
      {
        queryParams: {
          vehicleId:
            this.car.id
        }
      }
    );

  }


  // =========================================
  // CONTACT
  // =========================================

  contactDealer(): void {

    console.log(
      'Contact dealer:',
      this.car?.seller?.name
    );

  }


  // =========================================
  // FAVORITE
  // =========================================

  toggleFavorite(): void {

    if (!this.car) {
      return;
    }


    this.favoriteService.toggle({

      id:
        this.car.id,

      name:
        `${this.car.brand} ${this.car.model}`,

      image:
        this.car.imageUrl ?? '',

      price:
        this.car.price,

      year:
        this.car.year,

      stockQuantity:
        this.car.stockQuantity,

      fuel:
        this.car.fuelType ?? '-',

      transmission:
        this.car.transmission ?? '-'

    });

  }

}