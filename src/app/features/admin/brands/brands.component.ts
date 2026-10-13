import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BrandService } from '../../../core/services/brand/brand.service';
import { Brand } from '../../../core/models/brand.model';

@Component({
  selector: 'app-admin-brands',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class AdminBrandsComponent implements OnInit {
  private brandService = inject(BrandService);

  brands = signal<Brand[]>([]);
  total = signal(0);
  loading = signal(true);

  searchTerm = signal('');
  regionFilter = signal('all');

  page = signal(1);
  pageSize = 8;

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));

  showModal = signal(false);
  editingBrand = signal<Brand | null>(null);
  formData: Partial<Brand> = {};

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.loading.set(true);
    this.brandService
      .getList({
        search: this.searchTerm(),
        region: this.regionFilter() === 'all' ? undefined : this.regionFilter(),
        page: this.page(),
        pageSize: this.pageSize
      })
      .subscribe({
        next: (res) => {
          this.brands.set(res.items);
          this.total.set(res.total);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  onFilterChange(): void {
    this.page.set(1);
    this.loadBrands();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.loadBrands();
  }

  deleteBrand(brand: Brand): void {
    if (!confirm(`Xác nhận xoá thương hiệu ${brand.name}?`)) return;
    this.brandService.delete(brand.id).subscribe({
      next: () => this.loadBrands(),
      error: () => this.loadBrands()
    });
  }

  openAddModal(): void {
    this.editingBrand.set(null);
    this.formData = {
      name: '',
      origin: 'Germany',
      listedVehicles: 0,
      status: 'active'
    };
    this.showModal.set(true);
  }

  openEditModal(brand: Brand): void {
    this.editingBrand.set(brand);
    this.formData = { ...brand };
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveBrand(): void {
    const data = this.formData as Omit<Brand, 'id'>;
    const current = this.editingBrand();

    if (current) {
      this.brandService.update(current.id, data).subscribe({
        next: () => {
          this.loadBrands();
          this.closeModal();
        },
        error: () => {
          this.loadBrands();
          this.closeModal();
        }
      });
    } else {
      this.brandService.create(data).subscribe({
        next: () => {
          this.loadBrands();
          this.closeModal();
        },
        error: () => {
          this.loadBrands();
          this.closeModal();
        }
      });
    }
  }
}