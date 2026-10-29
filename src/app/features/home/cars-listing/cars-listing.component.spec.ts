import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { apiPrefixInterceptor } from '../../../core/interceptors/api-prefix.interceptor';
import { mockApiInterceptor } from '../../../core/mock/mock-api.interceptor';
import { CarsListingComponent } from './cars-listing.component';

describe('Cars listing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CarsListingComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([apiPrefixInterceptor, mockApiInterceptor])),
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({}) } } }
      ]
    });
  });

  it('shows inventory on arrival and removes the condition tabs', fakeAsync(() => {
    const fixture = TestBed.createComponent(CarsListingComponent);
    fixture.detectChanges();
    tick(450);
    fixture.detectChanges();
    expect(fixture.componentInstance.total).toBe(32);
    expect(fixture.nativeElement.querySelectorAll('.car-card').length).toBe(6);
    expect(fixture.nativeElement.querySelector('.condition-tabs')).toBeNull();
    expect(fixture.componentInstance.priceLimit).toBeGreaterThanOrEqual(5800000);
  }));

  it('searches on click and resets price, year and body type restrictions', fakeAsync(() => {
    const fixture = TestBed.createComponent(CarsListingComponent);
    fixture.detectChanges();
    tick(450);
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.search-input input');
    input.value = 'Lam';
    input.dispatchEvent(new Event('input'));
    fixture.nativeElement.querySelector('.search-button').click();
    tick(450);
    expect(fixture.componentInstance.total).toBe(4);
    expect(fixture.componentInstance.cars.every(car => car.brand === 'Lamborghini')).toBeTrue();

    const component = fixture.componentInstance;
    component.maxPrice = 1000;
    component.minYear = 2030;
    component.bodyTypes = { Coupe: true };
    component.applyFilters();
    tick(450);
    expect(component.total).toBe(0);
    component.resetFilters();
    tick(450);
    expect(component.total).toBe(32);
    expect(component.maxPrice).toBeUndefined();
    expect(component.minYear).toBeUndefined();
  }));
});
