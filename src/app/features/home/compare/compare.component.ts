import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of, switchMap, tap } from 'rxjs';
import { Vehicle } from '../../../core/models/vehicle.model';
import { VehicleService } from '../../../core/services/vehicle/vehicle.service';
import { CompareService } from '../../../core/services/compare.service';

type CompareMetric = 'price' | 'year' | 'horsepower';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.scss'
})
export class CompareComponent {
  private readonly vehicleService = inject(VehicleService);
  private readonly compareService = inject(CompareService);
  vehicles: Vehicle[] = [];
  loading = true;
  error = false;
  winners: Record<CompareMetric, Set<number>> = {
    price: new Set(), year: new Set(), horsepower: new Set()
  };

  constructor() {
    toObservable(this.compareService.ids).pipe(
      tap(() => { this.loading = true; this.error = false; }),
      switchMap(ids => ids.length
        ? this.vehicleService.getByIds(ids).pipe(catchError(() => {
            this.error = true;
            return of([] as Vehicle[]);
          }))
        : of([] as Vehicle[])),
      takeUntilDestroyed()
    ).subscribe(vehicles => {
      this.vehicles = vehicles;
      this.loading = false;
      this.winners = {
        price: this.findWinners('price'),
        year: this.findWinners('year'),
        horsepower: this.findWinners('horsepower')
      };
    });
  }

  private findWinners(metric: CompareMetric): Set<number> {
    const entries = this.vehicles.map(vehicle => {
      const horsepower = vehicle.horsepower?.match(/^\s*([\d,.]+)\s*(?:hp|bhp)\s*$/i);
      const value = metric === 'horsepower'
        ? (horsepower ? Number(horsepower[1].replace(/,/g, '')) : NaN)
        : vehicle[metric];
      return { id: vehicle.id, value };
    }).filter(entry => Number.isFinite(entry.value) && entry.value > 0);

    if (entries.length < 2) return new Set();
    const values = entries.map(entry => entry.value);
    if (Math.min(...values) === Math.max(...values)) return new Set();
    const best = metric === 'price' ? Math.min(...values) : Math.max(...values);
    return new Set(entries.filter(entry => entry.value === best).map(entry => entry.id));
  }

  removeVehicle(id: number): void {
    this.compareService.remove(id);
  }
}
