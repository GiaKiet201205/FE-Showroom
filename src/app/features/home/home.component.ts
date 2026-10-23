import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  Benefit,
  BodyTypeOption,
  PriceRangeOption
} from '../../core/models/site-content.model';

import {
  SiteContentService
} from '../../core/services/site-content/site-content.service';

import {
  VehicleService
} from '../../core/services/vehicle/vehicle.service';

import {
  Vehicle
} from '../../core/models/vehicle.model';
import {
  VehicleCardComponent
} from './vehicle-card/vehicle-card.component';


@Component({
  selector: 'app-home',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    VehicleCardComponent
  ],

  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent
  implements OnInit {

  private router = inject(Router);

  private siteContentService =
    inject(SiteContentService);

  private vehicleService =
    inject(VehicleService);


  selectedMake = '';
  selectedModel = '';
  selectedPrice = '';


  makes: string[] = [];

  models: string[] = [];

  priceRanges: PriceRangeOption[] = [];

  bodyTypes: BodyTypeOption[] = [];

  benefits: Benefit[] = [];

  vehicles: Vehicle[] = [];


  ngOnInit(): void {

    this.loadContent();

    this.loadFeaturedVehicles();

  }


  private loadContent(): void {

    this.siteContentService
      .getHomeContent()
      .subscribe(data => {

        this.makes =
          data.makes;

        this.models =
          data.models;

        this.priceRanges =
          data.priceRanges;

        this.bodyTypes =
          data.bodyTypes;

        this.benefits =
          data.benefits;

      });

  }


  private loadFeaturedVehicles(): void {
    this.vehicleService.getFeatured(4).subscribe(data => {this.vehicles = data;});
  }


  browseCars(): void {

    let minPrice:
      number | null = null;

    let maxPrice:
      number | null = null;


    if (
      this.selectedPrice
    ) {

      const parts =
        this.selectedPrice
          .split('-');


      if (
        parts.length === 2
      ) {

        minPrice =
          Number(parts[0]);

        maxPrice =
          Number(parts[1]);

      }

      else {

        minPrice =
          Number(parts[0]);

      }

    }


    this.router.navigate(
      ['/cars'],
      {
        queryParams: {

          brand:
            this.selectedMake ||
            null,

          bodyType:
            this.selectedModel ||
            null,

          minPrice,

          maxPrice

        }
      }
    );

  }


  filterByBodyType(
    type: string
  ): void {

    this.router.navigate(
      ['/cars'],
      {
        queryParams: {
          bodyType: type
        }
      }
    );

  }


  viewVehicle(
    id: number
  ): void {

    this.router.navigate([
      '/cars',
      id
    ]);

  }

}