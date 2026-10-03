import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-admin-vehicles',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.scss'
})
export class AdminVehiclesComponent implements OnInit {
  private vehicleService = inject(VehicleService);

  vehicles = signal<Vehicle[]>([]);
  total = signal(0);
  loading = signal(true);

  searchTerm = signal('');
  brandFilter = signal('all');
  statusFilter = signal('all');
  yearFilter = signal('all');

  page = signal(1);
  pageSize = 10;

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));
  rangeEnd = computed(() => Math.min(this.page() * this.pageSize, this.total()));

  brandOptions = ['Tesla', 'BMW', 'Mercedes-Benz', 'Audi', 'Toyota', 'Porsche', 'Ford', 'Lexus'];
  yearOptions = [2023, 2022, 2021, 2020];

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.loading.set(true);
    this.vehicleService
      .getList({
        search: this.searchTerm(),
        brand: this.brandFilter() === 'all' ? undefined : this.brandFilter(),
        status: this.statusFilter() === 'all' ? undefined : this.statusFilter(),
        year: this.yearFilter() === 'all' ? undefined : this.yearFilter(),
        page: this.page(),
        pageSize: this.pageSize
      })
      .subscribe({
        next: (res) => {
          this.vehicles.set(res.items);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  onFilterChange(): void {
    this.page.set(1);
    this.loadVehicles();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.loadVehicles();
  }

  deleteVehicle(vehicle: Vehicle): void {
    if (!confirm(`Xoá xe "${vehicle.brand} ${vehicle.model}"?`)) return;
    this.vehicleService.delete(vehicle.id).subscribe({
      next: () => this.loadVehicles(),
      error: () => this.loadVehicles()
    });
  }
}