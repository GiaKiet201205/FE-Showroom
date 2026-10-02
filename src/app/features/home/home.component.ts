import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface BodyType {
  name: string;
  icon: string;
}

interface Vehicle {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

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
export class HomeComponent {
  private router = inject(Router);

  selectedMake = '';
  selectedModel = '';
  selectedPrice = '';

  makes = [
    'BMW',
    'Mercedes-Benz',
    'Audi',
    'Porsche',
    'Ferrari',
    'Lamborghini'
  ];

  models = [
    'Sedan',
    'SUV',
    'Coupe',
    'Hatchback',
    'Truck'
  ];

  priceRanges = [
    {
      label: 'Under $50,000',
      value: '0-50000'
    },
    {
      label: '$50,000 - $100,000',
      value: '50000-100000'
    },
    {
      label: '$100,000 - $200,000',
      value: '100000-200000'
    },
    {
      label: 'Above $200,000',
      value: '200000'
    }
  ];

  bodyTypes = [
    {
      name: 'Sedan',
      icon: 'fa-solid fa-car-side'
    },
    {
      name: 'SUV',
      icon: 'fa-solid fa-car'
    },
    {
      name: 'Hatchback',
      icon: 'fa-solid fa-car-side'
    },
    {
      name: 'Coupe',
      icon: 'fa-solid fa-car-rear'
    },
    {
      name: 'Truck',
      icon: 'fa-solid fa-truck-pickup'
    },
    {
      name: 'Van',
      icon: 'fa-solid fa-van-shuttle'
    }
  ];

  vehicles: Vehicle[] = [
    {
      id: 1,
      name: 'BMW M3 Competition',
      category: '2026 • Automatic',
      price: 84900,
      image: '/images/car1.jpg'
    },
    {
      id: 2,
      name: 'Tesla Model S Plaid',
      category: '2026 • Electric',
      price: 89990,
      image: '/images/car2.jpg'
    },
    {
      id: 3,
      name: 'Porsche 911 Carrera',
      category: '2026 • Automatic',
      price: 120100,
      image: '/images/car3.jpg'
    },
    {
      id: 4,
      name: 'Audi RS7',
      category: '2026 • Automatic',
      price: 128600,
      image: '/images/car4.jpg'
    }
  ];

  benefits = [
    {
      icon: 'fa-solid fa-shield-halved',
      title: 'Verified Sellers',
      description:
        'Every partner passes through professional licensing checks.'
    },
    {
      icon: 'fa-solid fa-wallet',
      title: 'Easy Financing',
      description:
        'Instantly compare competitive loan rates from top auto banks.'
    },
    {
      icon: 'fa-solid fa-clipboard-check',
      title: 'Free Inspection',
      description:
        'Comprehensive 150-point report provided with every vehicle.'
    },
    {
      icon: 'fa-solid fa-headset',
      title: '24/7 Support',
      description:
        'Direct hotline assistance during purchasing and active transport.'
    }
  ];

  browseCars(): void {
    this.router.navigate(['/cars'], {
      queryParams: {
        make: this.selectedMake || null,
        model: this.selectedModel || null,
        price: this.selectedPrice || null
      }
    });
  }

  filterByBodyType(type: string): void {
    this.router.navigate(['/cars'], {
      queryParams: {
        bodyType: type
      }
    });
  }

  viewVehicle(id: number): void {
    this.router.navigate(['/cars', id]);
  }
} 