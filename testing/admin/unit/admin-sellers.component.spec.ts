import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { firstValueFrom, Subject, throwError } from 'rxjs';
import { AdminSellersComponent } from '../../../src/app/features/admin/sellers/sellers.component';
import { SellerService } from '../../../src/app/core/services/seller/seller.service';
import { TestDriveService } from '../../../src/app/core/services/test-drive/test-drive.service';
import { Seller, SellerInput } from '../../../src/app/core/models/seller.model';

describe('10. Sellers component — TestBed', () => {
  let fixture: ComponentFixture<AdminSellersComponent>;
  let component: AdminSellersComponent;
  let service: SellerService;
  const input: SellerInput = {
    fullName: 'Unit Seller', email: 'unit.seller@example.com', phone: '0901234567',
    company: 'Unit Company', joinDate: '2030-12-01', status: 'verified',
  };
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({ imports: [AdminSellersComponent] }).compileComponents();
    service = TestBed.inject(SellerService);
    fixture = TestBed.createComponent(AdminSellersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => localStorage.clear());

  it('render bảng/thống kê, phân trang và chặn trang không hợp lệ', () => {
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(8);
    expect(component.stats()?.totalSellers).toBe(service.getSnapshot().length);
    const getList = spyOn(service, 'getList').and.callThrough();
    component.goToPage(0);
    component.goToPage(component.totalPages() + 1);
    expect(getList).not.toHaveBeenCalled();
    component.goToPage(2);
    expect(getList).toHaveBeenCalledWith(jasmine.objectContaining({ page: 2 }));
  });

  it('debounce search/date/status và reset trang khi lọc', fakeAsync(() => {
    component.goToPage(2);
    const getList = spyOn(service, 'getList').and.callThrough();
    component.filterForm.patchValue({ search: 'Unit', date: input.joinDate, status: 'pending' });
    tick(299);
    expect(getList).not.toHaveBeenCalled();
    tick(1);
    expect(getList).toHaveBeenCalledOnceWith({ search: 'Unit', date: input.joinDate, status: 'pending', page: 1, pageSize: 8 });
    expect(component.total()).toBe(0);
    component.filterForm.reset({ search: '', date: '', status: 'all' });
    tick(300);
    expect(component.total()).toBe(service.getSnapshot().length);
  }));

  it('chặn trường trống, whitespace, email/phone sai, tên/công ty quá dài', () => {
    const create = spyOn(service, 'create').and.callThrough();
    component.openAddModal();
    component.saveSeller();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Nhập email hợp lệ.');
    for (const invalid of [
      { fullName: '   ', company: '   ' }, { email: 'invalid', phone: 'abc', joinDate: '' },
      { fullName: 'x'.repeat(81), company: 'x'.repeat(101) },
    ]) {
      component.sellerForm.setValue({ ...input, ...invalid });
      component.saveSeller();
      expect(component.sellerForm.invalid).toBeTrue();
    }
    expect(create).not.toHaveBeenCalled();
  });

  it('thêm/sửa seller với joinDate đúng định dạng và cập nhật bảng', () => {
    component.openAddModal();
    component.sellerForm.setValue(input);
    component.saveSeller();
    const seller = service.getSnapshot().find(s => s.email === input.email)!;
    expect(component.showModal()).toBeFalse();
    component.openEditModal(seller);
    expect(component.sellerForm.controls.joinDate.value).toBe(input.joinDate);
    component.sellerForm.patchValue({ fullName: 'Updated Seller', company: 'Updated Company', status: 'suspended' });
    component.saveSeller();
    expect(component.showModal()).toBeFalse();
    expect(service.getSnapshot().find(s => s.id === seller.id)).toEqual(jasmine.objectContaining({
      fullName: 'Updated Seller', company: 'Updated Company', status: 'suspended',
    }));
  });

  it('email trùng giữ modal và dữ liệu, sửa email thì thử lại được', () => {
    component.openAddModal();
    component.sellerForm.setValue({ ...input, email: 'admin@giakiet.com' });
    component.saveSeller();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('Email đã được sử dụng');
    expect(component.showModal()).toBeTrue();
    expect(component.saving()).toBeFalse();
    component.sellerForm.controls.email.setValue(input.email);
    component.saveSeller();
    expect(component.showModal()).toBeFalse();
  });

  it('chặn submit trùng và đóng modal khi đang lưu; hủy trước khi lưu không tạo', () => {
    const pending = new Subject<Seller>();
    const create = spyOn(service, 'create').and.returnValue(pending);
    component.openAddModal();
    component.closeModal();
    expect(create).not.toHaveBeenCalled();
    component.openAddModal();
    component.sellerForm.setValue(input);
    component.saveSeller();
    component.saveSeller();
    component.closeModal();
    fixture.detectChanges();
    expect(create).toHaveBeenCalledTimes(1);
    expect(component.showModal()).toBeTrue();
    expect(fixture.nativeElement.querySelector('button[type="submit"]').disabled).toBeTrue();
    expect(fixture.nativeElement.querySelector('.btn-cancel').disabled).toBeTrue();
    pending.error(new Error('Save failed'));
    expect(component.saving()).toBeFalse();
    expect(component.errorMessage()).toBe('Save failed');
  });

  it('sửa lỗi giữ modal; hủy xác nhận xóa giữ seller, xác nhận xóa thành công', async () => {
    const seller = await firstValueFrom(service.create(input));
    const update = spyOn(service, 'update').and.returnValue(throwError(() => new Error('Update failed')));
    component.openEditModal(seller);
    component.saveSeller();
    expect(component.showModal()).toBeTrue();
    expect(component.errorMessage()).toBe('Update failed');
    update.and.callThrough();
    component.saveSeller();
    expect(component.showModal()).toBeFalse();
    const confirmation = spyOn(window, 'confirm').and.returnValue(false);
    component.deleteSeller(seller);
    expect(service.getSnapshot().some(s => s.id === seller.id)).toBeTrue();
    confirmation.and.returnValue(true);
    component.deleteSeller(seller);
    expect(service.getSnapshot().some(s => s.id === seller.id)).toBeFalse();
  });

  it('xóa seller có lịch thất bại và hiển thị thông báo', () => {
    TestBed.inject(TestDriveService);
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteSeller(service.getSnapshot().find(s => s.id === 2)!);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('được liên kết với lịch lái thử');
    expect(service.getSnapshot().some(s => s.id === 2)).toBeTrue();
  });

  it('xóa dòng cuối trang cuối thì tự quay về trang hợp lệ', async () => {
    let last = await firstValueFrom(service.create(input));
    // Arrange total = pageSize + 1 modulo pageSize, so the last page has one row.
    while (service.getSnapshot().length % component.pageSize !== 1) {
      last = await firstValueFrom(service.create({ ...input, email: `extra${service.getSnapshot().length}@example.com` }));
    }
    component.loadSellers();
    component.goToPage(component.totalPages());
    expect(component.sellers().length).toBe(1);
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteSeller(last);
    expect(component.page()).toBe(component.totalPages());
    expect(component.sellers().length).toBe(component.pageSize);
  });

  it('phục hồi sau lỗi tải danh sách', () => {
    const getList = spyOn(service, 'getList').and.returnValue(throwError(() => new Error('Load failed')));
    component.loadSellers();
    expect(component.loading()).toBeFalse();
    getList.and.callThrough();
    component.loadSellers();
    expect(component.sellers().length).toBeGreaterThan(0);
  });
});
