import { TestBed } from '@angular/core/testing';
import { CompareService } from './compare.service';
import { FavoriteService } from './favorite.service';
import { MOCK_VEHICLES } from './vehicle/vehicle.mock';

describe('Favorite and comparison selection', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it('adds a heart selection to both lists without duplicates and removes it on toggle', () => {
    const favorites = TestBed.inject(FavoriteService);
    const compare = TestBed.inject(CompareService);
    favorites.toggleVehicle(MOCK_VEHICLES[0]);
    compare.add(MOCK_VEHICLES[0].id);
    expect(favorites.isFavorite(MOCK_VEHICLES[0].id)).toBeTrue();
    expect(compare.ids()).toEqual([MOCK_VEHICLES[0].id]);
    expect(JSON.parse(localStorage.getItem('compareVehicleIds')!)).toEqual(compare.ids());
    favorites.toggleVehicle(MOCK_VEHICLES[0]);
    expect(favorites.favorites()).toEqual([]);
    expect(compare.ids()).toEqual([]);
  });

  it('keeps the favorite when removed only from comparison and remembers that removal', () => {
    const favorites = TestBed.inject(FavoriteService);
    const compare = TestBed.inject(CompareService);
    favorites.toggleVehicle(MOCK_VEHICLES[0]);
    compare.remove(MOCK_VEHICLES[0].id);
    expect(favorites.isFavorite(MOCK_VEHICLES[0].id)).toBeTrue();
    TestBed.resetTestingModule();
    expect(TestBed.inject(CompareService).ids()).toEqual([]);
  });

  it('starts comparison with existing favorites when no comparison has been saved', () => {
    localStorage.setItem('favoriteVehicles', JSON.stringify([{ id: 1 }, { id: 4 }, { id: 1 }]));
    expect(TestBed.inject(CompareService).ids()).toEqual([1, 4]);
  });
});
