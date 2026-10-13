import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { VehicleService } from '../../../core/services/vehicle/vehicle.service';
import { Vehicle } from '../../../core/models/vehicle.model';
import { Observable } from 'rxjs';

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

  // Cập nhật danh sách tùy chọn dựa trên dữ liệu mẫu
  brandOptions = ['Lamborghini', 'Ferrari', 'Audi', 'Porsche', 'BMW', 'Bugatti', 'Maserati', 'Rolls-Royce'];
  yearOptions = [2024, 2023, 2022, 2021];

  // Trạng thái quản lý hộp thoại
  showModal = signal(false);
  editingVehicle = signal<Vehicle | null>(null);
  formData = signal<Partial<Vehicle>>({});

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
    if (!confirm(`Xác nhận xoá xe ${vehicle.brand} ${vehicle.model}?`)) return;
    this.vehicleService.delete(vehicle.id).subscribe({
      next: () => this.loadVehicles(),
      error: () => this.loadVehicles()
    });
  }

  // Chức năng điều khiển hộp thoại
  openAddModal(): void {
    this.editingVehicle.set(null);
    this.formData.set({
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      color: '',
      status: 'available',
      imageUrl: ''
    });
    this.showModal.set(true);
  }

  openEditModal(vehicle: Vehicle): void {
    this.editingVehicle.set(vehicle);
    this.formData.set({ ...vehicle });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveVehicle(): void {
    const data = this.formData() as Omit<Vehicle, 'id'>;
    const currentVehicle = this.editingVehicle();

    if (currentVehicle) {
      this.vehicleService.update(currentVehicle.id, data).subscribe({
        next: () => {
          this.loadVehicles();
          this.closeModal();
        }
      });
    } else {
      this.vehicleService.create(data).subscribe({
        next: () => {
          this.loadVehicles();
          this.closeModal();
        }
      });
    }
  }
}   