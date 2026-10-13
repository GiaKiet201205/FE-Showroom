import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../../core/services/user/user.service';
import { UserAccount, UserStats } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);

  users = signal<UserAccount[]>([]);
  stats = signal<UserStats | null>(null);
  total = signal(0);
  loading = signal(true);

  searchTerm = signal('');
  roleFilter = signal('all');
  statusFilter = signal('all');

  page = signal(1);
  pageSize = 8;

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));
  rangeEnd = computed(() => Math.min(this.page() * this.pageSize, this.total()));

  // Trạng thái quản lý hộp thoại
  showModal = signal(false);
  editingUser = signal<UserAccount | null>(null);
  formData = signal<Partial<UserAccount>>({});

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.userService
      .getList({
        search: this.searchTerm(),
        role: this.roleFilter() === 'all' ? undefined : this.roleFilter(),
        status: this.statusFilter() === 'all' ? undefined : this.statusFilter(),
        page: this.page(),
        pageSize: this.pageSize
      })
      .subscribe({
        next: (res) => {
          this.users.set(res.items);
          this.total.set(res.total);
          this.stats.set(res.stats);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  onFilterChange(): void {
    this.page.set(1);
    this.loadUsers();
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.loadUsers();
  }

  toggleBlock(user: UserAccount): void {
    const action = user.status === 'blocked' ? 'mở khoá' : 'khoá';
    if (!confirm(`Xác nhận ${action} tài khoản ${user.fullName}?`)) return;
    this.userService.toggleBlock(user.id).subscribe({
      next: () => this.loadUsers(),
      error: () => this.loadUsers()
    });
  }

  deleteUser(user: UserAccount): void {
    if (!confirm(`Xoá tài khoản ${user.fullName}? Hành động không thể hoàn tác.`)) return;
    this.userService.delete(user.id).subscribe({
      next: () => this.loadUsers(),
      error: () => this.loadUsers()
    });
  }

  // Chức năng điều khiển hộp thoại
  openAddModal(): void {
    this.editingUser.set(null);
    this.formData.set({
      fullName: '',
      email: '',
      phone: '',
      role: 'user',
      status: 'active',
      registeredAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    });
    this.showModal.set(true);
  }

  openEditModal(user: UserAccount): void {
    this.editingUser.set(user);
    this.formData.set({ ...user });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveUser(): void {
    const data = this.formData() as Omit<UserAccount, 'id'>;
    const currentUser = this.editingUser();

    if (currentUser) {
      this.userService.update(currentUser.id, data).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: () => {
          this.loadUsers();
          this.closeModal();
        }
      });
    } else {
      this.userService.create(data).subscribe({
        next: () => {
          this.loadUsers();
          this.closeModal();
        },
        error: () => {
          this.loadUsers();
          this.closeModal();
        }
      });
    }
  }
}