import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoriteService } from '../../../core/services/favorite.service';

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

  selectedImage = '';

  car?: CarDetail;


  cars: CarDetail[] = [
    {
      id: 1,

      listingId: 'AD-84029',

      name: 'Porsche 911 GT3 RS',
      year: 2024,

      price: 223800,

      images: [
        '/images/detail/porsche-main.jpg',
        '/images/detail/porsche-1.jpg',
        '/images/detail/porsche-2.jpg',
        '/images/detail/porsche-3.jpg',
        '/images/detail/porsche-4.jpg'
      ],

      seller: {
        name: 'Metropolitan Porsche',
        avatar: '/images/seller.jpg',

        rating: 4.9,
        reviews: 124,

        address: 'Beverly Hills, CA',

        phone: '+1 (310) 555-0199'
      },

      specifications: [
        {
          label: 'Engine',
          value: '4.0L Naturally Aspirated Boxer-6'
        },
        {
          label: 'Horsepower',
          value: '518 hp'
        },
        {
          label: 'Fuel Type',
          value: 'Premium Petrol'
        },
        {
          label: 'Transmission',
          value: '7-Speed PDK Auto'
        },
        {
          label: 'Mileage',
          value: '15 mi (New)'
        },
        {
          label: 'Body Type',
          value: 'Coupe'
        },
        {
          label: 'Drivetrain',
          value: 'RWD'
        },
        {
          label: 'Exterior Color',
          value: 'GT Silver Metallic'
        }
      ],

      highlights: [
        'Carbon Ceramic Brakes (PCCB)',
        'Weissach Performance Package',
        'Alcantara Race-tex Racing Bucket Seats',
        'Front Axle Lift System',
        'Bespoke Sport Chrono Package',
        'Matrix LED Headlights with PDLS+'
      ],

      description:
        'The 2024 Porsche 911 GT3 RS is designed for maximum track performance. Powered by high-revving boxer unit, its state of the art active aerodynamics yield unprecedented high-cornering downforce capabilities. Hand-crafted lightweight carbon weave doors and bespoke motorsport suspension configurations.'
    }
  ];


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public favoriteService: FavoriteService
  ) {

    const id =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    this.car =
      this.cars.find(
        (car) => car.id === id
      );

    if (this.car) {
      this.selectedImage =
        this.car.images[0];
    }

  }


  selectImage(image: string): void {
    this.selectedImage = image;
  }


  scheduleTestDrive(): void {

    if (!this.car) {
      return;
    }


    this.router.navigate(
      ['/test-drives'],
      {
        queryParams: {
          vehicleId: this.car.id
        }
      }
    );

  }


  contactDealer(): void {
    console.log(
      'Contact dealer:',
      this.car?.seller.name
    );
  }


  toggleFavorite(): void {

    if (!this.car) {
      return;
    }

    this.favoriteService.toggle({
      id: this.car.id,

      name: this.car.name,
      image: this.car.images[0],

      price: this.car.price,
      year: this.car.year,

      mileage:
        this.getSpecification('Mileage'),

      fuel:
        this.getSpecification('Fuel Type'),

      transmission:
        this.getSpecification('Transmission')
    });

    

  }

  getSpecification(label: string): string {
    return (
      this.car?.specifications.find(
        spec => spec.label === label
      )?.value ?? '-'
    );

  }

}