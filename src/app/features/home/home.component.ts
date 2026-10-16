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


@Component({
  selector: 'app-home',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
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

    this.router.navigate(
      ['/cars'],
      {
        queryParams: {
          make:
            this.selectedMake || null,

          model:
            this.selectedModel || null,

          price:
            this.selectedPrice || null
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