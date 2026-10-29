import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { apiPrefixInterceptor } from '../../../core/interceptors/api-prefix.interceptor';
import { mockApiInterceptor } from '../../../core/mock/mock-api.interceptor';
import { MockVehicleStore } from '../../../core/mock/mock-vehicle.store';
import { CompareService } from '../../../core/services/compare.service';
import { MOCK_VEHICLES } from '../../../core/services/vehicle/vehicle.mock';
import { CompareComponent } from './compare.component';

describe('Selected vehicle comparison', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [CompareComponent],
      providers: [provideRouter([]), provideHttpClient(withInterceptors([apiPrefixInterceptor, mockApiInterceptor]))]
    });
  });
  afterEach(() => localStorage.clear());

  it('starts empty instead of comparing fixed vehicles', fakeAsync(() => {
    const fixture = TestBed.createComponent(CompareComponent);
    fixture.detectChanges();
    tick(450);
    fixture.detectChanges();
    expect(fixture.componentInstance.vehicles).toEqual([]);
    expect(fixture.nativeElement.querySelector('.empty-compare')).not.toBeNull();
  }));

  it('highlights actual best values, handles missing horsepower and recalculates after removal', fakeAsync(() => {
    const selection = TestBed.inject(CompareService);
    const store = TestBed.inject(MockVehicleStore);
    const ids: number[] = [];
    [
      { price: 100000, year: 2024, horsepower: '600 hp' },
      { price: 200000, year: 2026, horsepower: '1,000 hp' },
      { price: 200000, year: 2026, horsepower: undefined }
    ].forEach(specs => {
      store.create({ ...MOCK_VEHICLES[0], ...specs }).subscribe(vehicle => {
        ids.push(vehicle.id);
        selection.add(vehicle.id);
      });
    });
    const fixture = TestBed.createComponent(CompareComponent);
    fixture.detectChanges();
    tick(450);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    expect(component.vehicles.map(vehicle => vehicle.id)).toEqual(ids);
    expect([...component.winners.price]).toEqual([ids[0]]);
    expect([...component.winners.horsepower]).toEqual([ids[1]]);
    expect([...component.winners.year]).toEqual([ids[1], ids[2]]);
    expect(fixture.nativeElement.querySelectorAll('.highlight').length).toBe(4);

    component.removeVehicle(ids[0]);
    fixture.detectChanges();
    tick(450);
    fixture.detectChanges();
    // Equal prices/years and only one known horsepower give no meaningful winner.
    expect(component.winners.price.size).toBe(0);
    expect(component.winners.year.size).toBe(0);
    expect(component.winners.horsepower.size).toBe(0);
    expect(fixture.nativeElement.querySelectorAll('.compare-card').length).toBe(2);
  }));
});
