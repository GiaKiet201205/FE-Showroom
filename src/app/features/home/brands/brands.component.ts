import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Brand {
  id: number;
  name: string;
  available: number;
  icon: string;
}

@Component({
  selector: 'app-brands',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent {

  brands: Brand[] = [
    {
      id: 1,
      name: 'BMW',
      available: 1248,
      icon: 'fa-solid fa-circle-xmark'
    },

    {
      id: 2,
      name: 'Mercedes-Benz',
      available: 982,
      icon: 'fa-regular fa-star'
    },

    {
      id: 3,
      name: 'Audi',
      available: 841,
      icon: 'fa-regular fa-circle-xmark'
    },

    {
      id: 4,
      name: 'Porsche',
      available: 310,
      icon: 'fa-regular fa-shield'
    },

    {
      id: 5,
      name: 'Tesla',
      available: 419,
      icon: 'fa-solid fa-bolt'
    },

    {
      id: 6,
      name: 'Toyota',
      available: 2104,
      icon: 'fa-solid fa-car-side'
    },

    {
      id: 7,
      name: 'Honda',
      available: 1452,
      icon: 'fa-solid fa-car-side'
    },

    {
      id: 8,
      name: 'Ford',
      available: 1120,
      icon: 'fa-solid fa-car-side'
    }
  ];


  constructor(
    private router: Router
  ) {}


  selectBrand(brand: Brand): void {

    this.router.navigate(
      ['/cars'],
      {
        queryParams: {
          brand: brand.name
        }
      }
    );

  }

}