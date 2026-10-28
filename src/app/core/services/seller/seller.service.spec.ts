import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { SellerService } from './seller.service';
import { UserService } from '../user/user.service';
import { TestDriveService } from '../test-drive/test-drive.service';
import { SellerInput } from '../../models/seller.model';

describe('Seller CRUD and User synchronization', () => {
  let service: SellerService;
  const input: SellerInput = { fullName: 'New Seller', email: 'newseller@example.com', phone: '0901234567', company: 'New Showroom', status: 'pending', joinDate: '2026-10-28' };
  beforeEach(() => { localStorage.clear(); service = TestBed.inject(SellerService); });
  afterEach(() => localStorage.clear());

  it('creates a seller and its matching User, then updates both', async () => {
    const created = await firstValueFrom(service.create(input));
    expect(created.company).toBe(input.company);
    const user = TestBed.inject(UserService).getSnapshot().find(user => user.id === created.userId);
    expect(user?.role).toBe('seller');
    expect(user?.status).toBe('pending');
    const updated = await firstValueFrom(service.update(created.id, { ...input, fullName: 'Updated Seller', company: 'Updated Showroom', status: 'verified' }));
    expect(updated.fullName).toBe('Updated Seller');
    expect(updated.company).toBe('Updated Showroom');
    expect(TestBed.inject(UserService).getSnapshot().find(user => user.id === created.userId)?.status).toBe('active');
  });

  it('deletes an unreferenced seller and its matching User', async () => {
    const created = await firstValueFrom(service.create(input));
    await firstValueFrom(service.delete(created.id));
    expect(service.getSnapshot().some(seller => seller.id === created.id)).toBeFalse();
    expect(TestBed.inject(UserService).getSnapshot().some(user => user.id === created.userId)).toBeFalse();
  });

  it('rejects duplicate emails and preserves sellers linked to bookings', async () => {
    TestBed.inject(TestDriveService);
    const count = service.getSnapshot().length;
    await expectAsync(firstValueFrom(service.create({ ...input, email: 'admin@giakiet.com' }))).toBeRejected();
    await expectAsync(firstValueFrom(service.delete(2))).toBeRejected();
    expect(service.getSnapshot().length).toBe(count);
  });
});
