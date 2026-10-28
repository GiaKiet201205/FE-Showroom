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

    stockQuantity: 5,

    color: 'Isle of Man Green',

    imageUrl: '/images/car1.jpg',

    status: 'available',

    condition: 'new',

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

    brand: 'Ferrari',

    model: '296 GTB',

    year: 2022,

    price: 340000,

    stockQuantity: 3,

    color: 'Blue',

    imageUrl: '/images/vehicle-placeholder.svg',

    status: 'available',

    condition: 'new',

    fuelType: 'Hybrid',

    transmission: '8-Speed DCT',

    bodyType: 'Coupe',

    engine:
      '3.0L Twin-Turbo V6 Hybrid',

    horsepower:
      '819 hp',

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

    stockQuantity: 4,

    color: 'Red',

    imageUrl: '/images/car3.jpg',

    status: 'available',

    condition: 'new',

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

    stockQuantity: 2,

    color: 'Black',

    imageUrl: '/images/car4.jpg',

    status: 'available',

    condition: 'new',

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

    stockQuantity: 2,

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
  },
  { id: 6, brand: 'Lamborghini', model: 'Huracán Tecnica', year: 2026, price: 285000, stockQuantity: 3, color: 'Black', imageUrl: '/images/vehicle-placeholder.svg', status: 'available', condition: 'new', fuelType: 'Petrol', transmission: 'Auto', bodyType: 'Coupe', engine: '5.2L V10', horsepower: '631 hp', drivetrain: 'RWD' },
  { id: 7, brand: 'Bugatti', model: 'Chiron', year: 2026, price: 3000000, stockQuantity: 1, color: 'Black', imageUrl: '/images/vehicle-placeholder.svg', status: 'available', condition: 'new', fuelType: 'Petrol', transmission: 'Auto', bodyType: 'Coupe', engine: '8.0L Quad-Turbo W16', horsepower: '1500 hp', drivetrain: 'RWD' },
  { id: 8, brand: 'Maserati', model: 'MC20', year: 2026, price: 240000, stockQuantity: 2, color: 'Black', imageUrl: '/images/vehicle-placeholder.svg', status: 'available', condition: 'new', fuelType: 'Petrol', transmission: 'Auto', bodyType: 'Coupe', engine: '3.0L Twin-Turbo V6', horsepower: '621 hp', drivetrain: 'RWD' },
  { id: 9, brand: 'Rolls-Royce', model: 'Spectre', year: 2026, price: 450000, stockQuantity: 2, color: 'Black', imageUrl: '/images/vehicle-placeholder.svg', status: 'available', condition: 'new', fuelType: 'Electric', transmission: 'Auto', bodyType: 'Coupe', engine: 'Dual Electric Motors', horsepower: '577 hp', drivetrain: 'RWD' },

  // Additional inventory for brand, body type, price and pagination demos.
  {"id": 10, "brand": "BMW", "model": "M3 Competition", "year": 2025, "price": 89000, "stockQuantity": 1, "color": "Pearl White", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Sedan", "listingId": "SR-0010", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 11, "brand": "BMW", "model": "M8 Competition", "year": 2026, "price": 145000, "stockQuantity": 2, "color": "Obsidian Black", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0011", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 12, "brand": "BMW", "model": "XM", "year": 2025, "price": 165000, "stockQuantity": 3, "color": "Rosso Red", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Hybrid", "transmission": "Auto", "bodyType": "SUV", "listingId": "SR-0012", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 13, "brand": "Ferrari", "model": "Roma", "year": 2026, "price": 250000, "stockQuantity": 4, "color": "Silver Metallic", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0013", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 14, "brand": "Ferrari", "model": "SF90 Stradale", "year": 2025, "price": 530000, "stockQuantity": 5, "color": "Royal Blue", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Hybrid", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0014", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 15, "brand": "Ferrari", "model": "Purosangue", "year": 2026, "price": 420000, "stockQuantity": 6, "color": "Emerald Green", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "SUV", "listingId": "SR-0015", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 16, "brand": "Porsche", "model": "911 Turbo S", "year": 2025, "price": 230000, "stockQuantity": 1, "color": "Pearl White", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0016", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 17, "brand": "Porsche", "model": "Taycan Turbo GT", "year": 2026, "price": 245000, "stockQuantity": 2, "color": "Obsidian Black", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Electric", "transmission": "Auto", "bodyType": "Sedan", "listingId": "SR-0017", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 18, "brand": "Audi", "model": "R8 V10 Performance", "year": 2025, "price": 210000, "stockQuantity": 3, "color": "Rosso Red", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0018", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 19, "brand": "Audi", "model": "RS7 Sportback", "year": 2026, "price": 130000, "stockQuantity": 4, "color": "Silver Metallic", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Sedan", "listingId": "SR-0019", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 20, "brand": "Audi", "model": "RS Q8", "year": 2025, "price": 150000, "stockQuantity": 5, "color": "Royal Blue", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "SUV", "listingId": "SR-0020", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 21, "brand": "Lamborghini", "model": "Revuelto", "year": 2026, "price": 610000, "stockQuantity": 6, "color": "Emerald Green", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Hybrid", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0021", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 22, "brand": "Lamborghini", "model": "Urus S", "year": 2025, "price": 250000, "stockQuantity": 1, "color": "Pearl White", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "SUV", "listingId": "SR-0022", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 23, "brand": "Lamborghini", "model": "Huracán STO", "year": 2026, "price": 335000, "stockQuantity": 2, "color": "Obsidian Black", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0023", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 24, "brand": "Bugatti", "model": "Chiron Super Sport", "year": 2025, "price": 3900000, "stockQuantity": 3, "color": "Rosso Red", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0024", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 25, "brand": "Bugatti", "model": "Divo", "year": 2026, "price": 5800000, "stockQuantity": 4, "color": "Silver Metallic", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0025", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 26, "brand": "Bugatti", "model": "W16 Mistral", "year": 2025, "price": 5000000, "stockQuantity": 5, "color": "Royal Blue", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Convertible", "listingId": "SR-0026", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 27, "brand": "Maserati", "model": "GranTurismo Trofeo", "year": 2026, "price": 195000, "stockQuantity": 6, "color": "Emerald Green", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Coupe", "listingId": "SR-0027", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 28, "brand": "Maserati", "model": "Grecale Trofeo", "year": 2025, "price": 115000, "stockQuantity": 1, "color": "Pearl White", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "SUV", "listingId": "SR-0028", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 29, "brand": "Maserati", "model": "GranCabrio Trofeo", "year": 2026, "price": 205000, "stockQuantity": 2, "color": "Obsidian Black", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Convertible", "listingId": "SR-0029", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 30, "brand": "Rolls-Royce", "model": "Ghost", "year": 2025, "price": 355000, "stockQuantity": 3, "color": "Rosso Red", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Sedan", "listingId": "SR-0030", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 31, "brand": "Rolls-Royce", "model": "Phantom", "year": 2026, "price": 510000, "stockQuantity": 4, "color": "Silver Metallic", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "Sedan", "listingId": "SR-0031", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."},
  {"id": 32, "brand": "Rolls-Royce", "model": "Cullinan", "year": 2025, "price": 410000, "stockQuantity": 5, "color": "Royal Blue", "imageUrl": "/images/vehicle-placeholder.svg", "status": "available", "condition": "new", "fuelType": "Petrol", "transmission": "Auto", "bodyType": "SUV", "listingId": "SR-0032", "description": "Xe mới trong bộ sưu tập showroom. Giá và số lượng là dữ liệu giả lập."}
];

export const MOCK_VEHICLES_TOTAL = MOCK_VEHICLES.length;