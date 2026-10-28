import { TestBed } from '@angular/core/testing';
import { MockVehicleStore } from './mock-vehicle.store';
import { MOCK_VEHICLES } from '../services/vehicle/vehicle.mock';

describe('Showroom inventory', () => {
  let store: MockVehicleStore;
  beforeEach(() => store = TestBed.inject(MockVehicleStore));

  it('contains only new vehicles with whole nonnegative stock quantities', () => {
    store.getList({ page: 1, pageSize: 100 }).subscribe(result => {
      expect(result.items.length).toBeGreaterThan(0);
      expect(result.items.every(vehicle => vehicle.condition === 'new' && Number.isInteger(vehicle.stockQuantity) && vehicle.stockQuantity >= 0)).toBeTrue();
    });
  });

  it('rejects negative and fractional inventory, and accepts zero', () => {
    expect(() => store.create({ ...MOCK_VEHICLES[0], stockQuantity: -1 })).toThrow();
    expect(() => store.update(1, { ...MOCK_VEHICLES[0], stockQuantity: 1.5 })).toThrow();
    store.update(1, { ...MOCK_VEHICLES[0], stockQuantity: 0 }).subscribe(vehicle => {
      expect(vehicle.stockQuantity).toBe(0);
      expect(vehicle.condition).toBe('new');
    });
  });

  it('preserves existing specifications when an admin edits inventory', () => {
    const vehicle = MOCK_VEHICLES[4];
    const { engine, images, highlights, ...formFields } = vehicle;
    store.update(vehicle.id, { ...formFields, stockQuantity: 7 }).subscribe(updated => {
      expect(updated.engine).toBe(engine);
      expect(updated.images).toEqual(images);
      expect(updated.highlights).toEqual(highlights);
      expect(updated.stockQuantity).toBe(7);
    });
  });
});
