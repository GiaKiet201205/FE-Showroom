import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  Brand
} from '../../../core/models/brand.model';

import {
  BrandService
} from '../../../core/services/brand/brand.service';


@Component({
  selector: 'app-brands',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './brands.component.html',

  styleUrl:
    './brands.component.scss'
})
export class BrandsComponent
  implements OnInit {

  brands: Brand[] = [];


  constructor(
    private router: Router,

    private brandService:
      BrandService
  ) {}


  ngOnInit(): void {

    this.brandService
      .getList({

        page: 1,

        pageSize: 50

      })
      .subscribe(result => {

        this.brands =
          result.items;

      });

  }


  selectBrand(
    brand: Brand
  ): void {

    this.router.navigate(
      ['/cars'],
      {
        queryParams: {
          brand:
            brand.name
        }
      }
    );

  }

}