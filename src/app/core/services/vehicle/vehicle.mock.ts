import {
  Vehicle
} from '../../models/vehicle.model';


export const MOCK_VEHICLES: Vehicle[] = [

  {
    id: 1,

    brand: 'BMW',

    model: 'M4 Competition',

    year: 2023,

    price: 78500,

    mileage: 12000,

    color: 'Isle of Man Green',

    imageUrl: '/images/car1.jpg',

    status: 'available',

    condition: 'used',

    fuelType: 'Petrol',

    transmission: 'Auto',

    bodyType: 'Coupe',

    engine:
      '3.0L Twin-Turbo Inline-6',

    horsepower:
      '503 hp',

    drivetrain:
      'RWD',

    featured: true
  },


  {
    id: 2,

    brand: 'Tesla',

    model: 'Model S Plaid',

    year: 2022,

    price: 89900,

    mileage: 8000,

    color: 'Blue',

    imageUrl: '/images/car2.jpg',

    status: 'available',

    condition: 'used',

    fuelType: 'Electric',

    transmission: 'Single',

    bodyType: 'Sedan',

    engine:
      'Dual Electric Motors',

    horsepower:
      '1020 hp',

    drivetrain:
      'AWD',

    featured: true
  },


  {
    id: 3,

    brand: 'Porsche',

    model: '911 Carrera S',

    year: 2021,

    price: 115000,

    mileage: 15000,

    color: 'Red',

    imageUrl: '/images/car3.jpg',

    status: 'available',

    condition: 'used',

    fuelType: 'Petrol',

    transmission: 'Manual',

    bodyType: 'Coupe',

    engine:
      '3.0L Twin-Turbo Flat-6',

    horsepower:
      '443 hp',

    drivetrain:
      'RWD',

    featured: true
  },


  {
    id: 4,

    brand: 'Audi',

    model: 'RS e-tron GT',

    year: 2024,

    price: 102000,

    mileage: 5000,

    color: 'Black',

    imageUrl: '/images/car4.jpg',

    status: 'available',

    condition: 'used',

    fuelType: 'Electric',

    transmission: 'Auto',

    bodyType: 'Sedan',

    engine:
      'Dual Electric Motors',

    horsepower:
      '637 hp',

    drivetrain:
      'AWD',

    featured: true
  },


  // ============================
  // DETAIL CAR
  // ============================

  {
    id: 5,

    brand: 'Porsche',

    model: '911 GT3 RS',

    year: 2024,

    price: 223800,

    mileage: 15,

    color: 'GT Silver Metallic',

    imageUrl:
      '/images/detail/porsche-main.jpg',

    status: 'available',

    condition: 'new',

    fuelType:
      'Premium Petrol',

    transmission:
      '7-Speed PDK Auto',

    bodyType:
      'Coupe',

    engine:
      '4.0L Naturally Aspirated Boxer-6',

    horsepower:
      '518 hp',

    drivetrain:
      'RWD',

    listingId:
      'AD-84029',

    images: [
      '/images/detail/porsche-main.jpg',
      '/images/detail/porsche-1.jpg',
      '/images/detail/porsche-2.jpg',
      '/images/detail/porsche-3.jpg',
      '/images/detail/porsche-4.jpg'
    ],

    seller: {

      name:
        'Metropolitan Porsche',

      avatar:
        '/images/seller.jpg',

      rating:
        4.9,

      reviews:
        124,

      address:
        'Beverly Hills, CA',

      phone:
        '+1 (310) 555-0199'
    },

    highlights: [
      'Carbon Ceramic Brakes (PCCB)',
      'Weissach Performance Package',
      'Alcantara Race-tex Racing Bucket Seats',
      'Front Axle Lift System',
      'Bespoke Sport Chrono Package',
      'Matrix LED Headlights with PDLS+'
    ],

    description:
      'The 2024 Porsche 911 GT3 RS is designed for maximum track performance.'
  }

];

export const MOCK_VEHICLES_TOTAL =248;