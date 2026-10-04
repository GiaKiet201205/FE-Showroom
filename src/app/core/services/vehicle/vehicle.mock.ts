import {Vehicle} from '../../models/vehicle.model';

export const MOCK_VEHICLES: Vehicle[] = [
  {
    id: 1,
    brand: 'Lamborghini',
    model: 'Revuelto',
    year: 2024,
    price: 608000,
    mileage: 1500,
    color: 'Yellow',
    imageUrl: 'https://example.com/lamborghini_revuelto.jpg',
    status: 'available'
  },
  {
    id: 2,
    brand: 'Ferrari',
    model: 'Roma',
    year: 2024,
    price: 250000,
    mileage: 5000,
    color: 'White',
    imageUrl: 'https://example.com/ferrari_roma.jpg',
    status: 'reserved'
  },
  {
    id: 3,
    brand: 'Audi',
    model: 'RS7',
    year: 2024,
    price: 120000,
    mileage: 3000,
    color: 'Red',
    imageUrl: 'https://example.com/audi_rs7.jpg',
    status: 'sold'
  },
  {
    id: 4,
    brand: 'Porsche',
    model: '911 Carrera',
    year: 2023,
    price: 95000,
    mileage: 8000,
    color: 'Blue',
    imageUrl: 'https://example.com/porsche_911_carrera.jpg',
    status: 'available'
  },
  {
    id: 5,
    brand: 'BMW',
    model: 'X5',
    year: 2024,
    price: 75000,
    mileage: 6000,
    color: 'Gray',
    imageUrl: 'https://example.com/bmw_x5.jpg',
    status: 'draft'
  },
  {
    id: 6,
    brand: 'Bugatti',
    model: 'Chiron',
    year: 2024,
    price: 300000,
    mileage: 1000,
    color: 'Black',
    imageUrl: 'https://example.com/bugatti_chiron.jpg',
    status: 'available'
  },
  {
    id: 7,
    brand: 'Maserati',
    model: 'Ghibli',
    year: 2024,
    price: 85000,
    mileage: 3500,
    color: 'Silver',
    imageUrl: 'https://example.com/maserati_ghibli.jpg',
    status: 'reserved'
  },
  {
    id: 8,
    brand: 'Rolls-Royce',
    model: 'Phantom',
    year: 2024,
    price: 450000,
    mileage: 4500,
    color: 'White',
    imageUrl: 'https://example.com/rolls_royce_phantom.jpg',
    status: 'available'
  }
//   {
//     id: 9,
//     brand: 'McLaren',
//     model: '750S',
//     year: 2024,
//     price: 324000,
//     mileage: 1000,
//     color: 'Orange',
//     imageUrl: 'https://example.com/mclaren_750s.jpg',
//     status: 'available'
//   },
//   {
//     id: 10,
//     brand: 'Lexus',
//     model: 'RX 350',
//     year: 2024,
//     price: 52000,
//     mileage: 7000,
//     color: 'Black',
//     imageUrl: 'https://example.com/lexus_rx350.jpg',
//     status: 'reserved'
//   },
//   {
//     id: 11,
//     brand: 'Bentley',
//     model: 'Continental GT',
//     year: 2024,
//     price: 250000,
//     mileage: 2000,
//     color: 'Green',
//     imageUrl: 'https://example.com/bentley_continental_gt.jpg',
//     status: 'sold'
//   }
];

export const MOCK_VEHICLES_TOTAL =248;