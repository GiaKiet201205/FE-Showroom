import {Vehicle} from '../models/vehicle.model';

export const MOCK_VEHICLES: Vehicle[] = [
    {id: 1, brand: 'Toyota', model: 'Camry', year: 2020, price: 25000, mileage: 15000, color: 'White', imageUrl: 'https://example.com/toyota_camry.jpg', status: 'available'},
    {id: 2, brand: 'Honda', model: 'Civic', year: 2019, price: 22000, mileage: 20000, color: 'Black', imageUrl: 'https://example.com/honda_civic.jpg', status: 'reserved'},
    {id: 3, brand: 'Ford', model: 'Mustang', year: 2021, price: 35000, mileage: 10000, color: 'Red', imageUrl: 'https://example.com/ford_mustang.jpg', status: 'sold'},
    {id: 4, brand: 'Chevrolet', model: 'Malibu', year: 2018, price: 18000, mileage: 30000, color: 'Blue', imageUrl: 'https://example.com/chevrolet_malibu.jpg', status: 'available'},
    {id: 5, brand: 'Nissan', model: 'Altima', year: 2020, price: 24000, mileage: 12000, color: 'Gray', imageUrl: 'https://example.com/nissan_altima.jpg', status: 'draft'},
    {id: 6, brand: 'BMW', model: '3 Series', year: 2021, price: 40000, mileage: 8000, color: 'Silver', imageUrl: 'https://example.com/bmw_3series.jpg', status: 'available'},
    {id: 7, brand: 'Mercedes-Benz', model: 'C-Class', year: 2019, price: 38000, mileage: 15000, color: 'White', imageUrl: 'https://example.com/mercedes_cclass.jpg', status: 'reserved'},
    {id: 8, brand: 'Audi', model: 'A4', year: 2020, price: 37000, mileage: 10000, color: 'Black', imageUrl: 'https://example.com/audi_a4.jpg', status: 'available'}
];

export const MOCK_VEHICLES_TOTAL =248;