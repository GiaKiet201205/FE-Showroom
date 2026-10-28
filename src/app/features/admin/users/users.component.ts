import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import {
  EMPTY,
  Observable,
  Subject,
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize,
  switchMap,
  tap
} from 'rxjs';
import { UserService } from '../../../core/services/user/user.service';
import { UserAccount, UserStats, UserAccountInput } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);

  users = signal<UserAccount[]>([]);
  stats = signal<UserStats | null>(null);
  total = signal(0);
  loading = signal(true);

  page = signal(1);
  pageSize = 8;

  totalPages = computed(() => Math.max(1, Math.ceil(this.total() / this.pageSize)));
  pages = computed(() => Array.from({ length: this.totalPages() }, (_, index) => index + 1));
  rangeEnd = computed(() => Math.min(this.page() * this.pageSize, this.total()));

  filterForm = this.fb.nonNullable.group({
    search: '',
    role: 'all',
    status: 'all'
  });

  private reload$ = new Subject<void>();

  showModal = signal(false);
  editingUser = signal<UserAccount | null>(null);
  saving = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);
  currentPassword = signal('');
  showCurrentPassword = signal(false);

  userForm = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    password: ['', Validators.minLength(6)],
    role: ['user', Validators.required],
    status: ['active', Validators.required]
  });

  get f() {
    return this.userForm.controls;
  }

  ngOnInit(): void {
    this.reload$
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap(() =>
          this.userService.getList(this.buildQuery()).pipe(
            catchError(() => {
              this.loading.set(false);
              return EMPTY;
            })
          )
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((res) => {
        this.users.set(res.items);
        this.total.set(res.total);
        this.stats.set(res.stats);
        this.loading.set(false);
      });

    this.filterForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        this.page.set(1);
        this.loadUsers();
      });

    this.loadUsers();
  }

  loadUsers(): void {
    this.reload$.next();
  }

  private buildQuery() {
    const { search, role, status } = this.filterForm.getRawValue();
    return {
      search,
      role: role === 'all' ? undefined : role,
      status: status === 'all' ? undefined : status,
      page: this.page(),
      pageSize: this.pageSize
    };
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages()) return;
    this.page.set(p);
    this.loadUsers();
  }

  toggleBlock(user: UserAccount): void {
    if (user.role === 'admin') return;
    const action = user.status === 'blocked' ? 'mở khoá' : 'khoá';
    if (!confirm(`Xác nhận ${action} tài khoản ${user.fullName}.`)) return;
    
    this.userService
      .toggleBlock(user.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadUsers(),
        error: (error: Error) => this.errorMessage.set(error.message)
      });
  }

  deleteUser(user: UserAccount): void {
    if (user.role === 'admin') return;
    if (!confirm(`Xác nhận xoá tài khoản ${user.fullName}. Hành động này không thể hoàn tác.`)) return;
    
    this.userService
      .delete(user.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loadUsers(),
        error: (error: Error) => this.errorMessage.set(error.message)
      });
  }

  openAddModal(): void {
    this.currentPassword.set('');
    this.showCurrentPassword.set(false);
    this.errorMessage.set('');
    this.editingUser.set(null);
    this.showPassword.set(false);
    this.f.password.setValidators([Validators.required, Validators.minLength(6)]);
    this.f.password.updateValueAndValidity();
    this.userForm.reset({
      fullName: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
      status: 'active'
    });
    this.showModal.set(true);
  }

  openEditModal(user: UserAccount): void {
    if (user.role === 'admin') return;
    this.errorMessage.set('');
    this.editingUser.set(user);
    this.currentPassword.set(this.userService.getMockPassword(user.id));
    this.showCurrentPassword.set(false);
    this.showPassword.set(false);
    this.f.password.setValidators([Validators.minLength(6)]);
    this.f.password.updateValueAndValidity();
    this.userForm.reset();
    this.userForm.patchValue(user);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.currentPassword.set('');
    this.showCurrentPassword.set(false);
    this.showModal.set(false);
  }

  saveUser(): void {
    if (this.saving()) return;
    this.errorMessage.set('');
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const data = this.userForm.getRawValue() as UserAccountInput;
    const current = this.editingUser();

    const request$ = (
      current
        ? this.userService.update(current.id, data)
        : this.userService.create(data)
    ) as Observable<unknown>;

    this.saving.set(true);
    request$
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: () => {
          this.closeModal();
          this.loadUsers();
        },
        error: (error: Error) => this.errorMessage.set(error.message)
      });
  }
}