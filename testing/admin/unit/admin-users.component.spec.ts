import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Subject, throwError, firstValueFrom } from 'rxjs';
import { AdminUsersComponent } from '../../../src/app/features/admin/users/users.component';
import { UserService } from '../../../src/app/core/services/user/user.service';
import { UserAccount } from '../../../src/app/core/models/user.model';

describe('04. Users component — TestBed', () => {
  let fixture: ComponentFixture<AdminUsersComponent>;
  let component: AdminUsersComponent;
  let users: UserService;
  const form = {
    fullName: 'Unit Customer', email: 'unit.customer@example.com', phone: '0901234567',
    password: 'customer123', role: 'user' as const, status: 'active' as const,
  };

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [AdminUsersComponent] }).compileComponents();
    users = TestBed.inject(UserService);
    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => localStorage.clear());

  it('render danh sách, thống kê và phân trang; chặn trang ngoài phạm vi', () => {
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(8);
    expect(component.stats()?.totalUsers).toBe(users.getSnapshot().length);
    const getList = spyOn(users, 'getList').and.callThrough();
    component.goToPage(0);
    component.goToPage(component.totalPages() + 1);
    expect(getList).not.toHaveBeenCalled();
    component.goToPage(2);
    expect(getList).toHaveBeenCalledWith(jasmine.objectContaining({ page: 2 }));
  });

  it('debounce search/role/status, reset trang và phục hồi khi bỏ bộ lọc', fakeAsync(() => {
    component.goToPage(2);
    const getList = spyOn(users, 'getList').and.callThrough();
    component.filterForm.patchValue({ search: 'mar', role: 'user', status: 'active' });
    tick(299);
    expect(getList).not.toHaveBeenCalled();
    tick(1);
    expect(getList).toHaveBeenCalledOnceWith({ search: 'mar', role: 'user', status: 'active', page: 1, pageSize: 8 });
    expect(component.users().every(user => user.role === 'user' && user.status === 'active')).toBeTrue();
    component.filterForm.reset({ search: '', role: 'all', status: 'all' });
    tick(300);
    expect(component.total()).toBe(users.getSnapshot().length);
  }));

  it('hiện validation và không tạo khi thiếu trường, email sai hoặc mật khẩu ngắn', () => {
    const create = spyOn(users, 'create').and.callThrough();
    component.openAddModal();
    component.saveUser();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Yêu cầu nhập họ và tên.');
    component.userForm.setValue({ ...form, email: 'invalid', password: '123', fullName: 'x'.repeat(81) });
    component.saveUser();
    expect(component.f.email.hasError('email')).toBeTrue();
    expect(component.f.password.hasError('minlength')).toBeTrue();
    expect(component.f.fullName.hasError('maxlength')).toBeTrue();
    expect(create).not.toHaveBeenCalled();
  });

  it('thêm người dùng và sửa không đổi mật khẩu khi để trống', async () => {
    component.openAddModal();
    component.userForm.setValue(form);
    component.saveUser();
    const created = users.getSnapshot().find(user => user.email === form.email)!;
    expect(created).toBeDefined();
    expect(component.showModal()).toBeFalse();
    component.openEditModal(created);
    expect(component.f.password.value).toBe('');
    expect(component.f.password.valid).toBeTrue();
    component.f.fullName.setValue('Updated Customer');
    component.saveUser();
    expect(users.authenticate(form.email, form.password)?.fullName).toBe('Updated Customer');
    const updated = await firstValueFrom(users.getList({ search: form.email, page: 1, pageSize: 8 }));
    expect(updated.total).toBe(1);
  });

  it('báo email trùng, giữ dữ liệu và cho phép thử lại', () => {
    component.openAddModal();
    component.userForm.setValue({ ...form, email: 'admin@giakiet.com' });
    component.saveUser();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Email đã được sử dụng');
    expect(component.showModal()).toBeTrue();
    expect(component.saving()).toBeFalse();
    component.f.email.setValue(form.email);
    component.saveUser();
    expect(component.showModal()).toBeFalse();
  });

  it('chặn submit trùng, không lưu khi hủy modal', () => {
    const pending = new Subject<UserAccount>();
    const create = spyOn(users, 'create').and.returnValue(pending);
    component.openAddModal();
    component.closeModal();
    expect(create).not.toHaveBeenCalled();
    component.openAddModal();
    component.userForm.setValue(form);
    component.saveUser();
    component.saveUser();
    fixture.detectChanges();
    expect(create).toHaveBeenCalledTimes(1);
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeTrue();
    pending.error(new Error('Save failed'));
    expect(component.saving()).toBeFalse();
    expect(component.showModal()).toBeTrue();
  });

  it('bảo vệ admin; hủy xác nhận thì không khóa/xóa người dùng', () => {
    const confirmation = spyOn(window, 'confirm').and.returnValue(false);
    const admin = users.getSnapshot().find(user => user.role === 'admin')!;
    component.openEditModal(admin);
    component.deleteUser(admin);
    component.toggleBlock(admin);
    expect(confirmation).not.toHaveBeenCalled();
    expect(component.showModal()).toBeFalse();
    const remove = spyOn(users, 'delete').and.callThrough();
    const block = spyOn(users, 'toggleBlock').and.callThrough();
    const user = users.getSnapshot().find(user => user.role === 'user')!;
    component.deleteUser(user);
    component.toggleBlock(user);
    expect(remove).not.toHaveBeenCalled();
    expect(block).not.toHaveBeenCalled();
  });

  it('khóa/mở khóa/xóa thành công và báo lỗi nếu có liên kết lịch lái thử', async () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const user = await firstValueFrom(users.create({ ...form, registeredAt: '' }));
    component.toggleBlock(user);
    expect(users.getSnapshot().find(u => u.id === user.id)?.status).toBe('blocked');
    component.toggleBlock(user);
    expect(users.getSnapshot().find(u => u.id === user.id)?.status).toBe('active');
    users.retainForBooking(user.id);
    component.deleteUser(user);
    expect(component.errorMessage()).toContain('được liên kết với lịch lái thử');
    component.toggleBlock(user);
    expect(component.errorMessage()).toContain('được liên kết với lịch lái thử');
    const other = await firstValueFrom(users.create({ ...form, registeredAt: '', email: 'other@example.com' }));
    component.deleteUser(other);
    expect(users.getSnapshot().some(u => u.id === other.id)).toBeFalse();
  });

  it('phục hồi danh sách sau request lỗi và render kết quả rỗng', () => {
    const getList = spyOn(users, 'getList').and.returnValue(throwError(() => new Error('List failed')));
    component.loadUsers();
    expect(component.loading()).toBeFalse();
    getList.and.callThrough();
    component.filterForm.controls.search.setValue('NO MATCH', { emitEvent: false });
    component.loadUsers();
    fixture.detectChanges();
    expect(component.total()).toBe(0);
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(0);
  });
});
