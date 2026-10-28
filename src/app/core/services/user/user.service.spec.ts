import { UserService } from './user.service';
import { UserAccount } from '../../models/user.model';
import { MOCK_ADMIN_CREDENTIALS } from '../auth.mock';

describe('Single administrator policy in UserService', () => {
  let service: UserService;
  const user: Omit<UserAccount, 'id'> = {
    fullName: 'Test User', email: 'test@example.com', phone: '0901234567',
    registeredAt: '', role: 'user', status: 'active'
  };
  beforeEach(() => { localStorage.clear(); service = new UserService(); });
  afterEach(() => localStorage.clear());

  it('contains exactly one canonical administrator', () => {
    service.getList({ page: 1, pageSize: 100 }).subscribe(result => {
      const admins = result.items.filter(account => account.role === 'admin');
      expect(admins.length).toBe(1);
      expect(admins[0].email).toBe(MOCK_ADMIN_CREDENTIALS.email);
      expect(result.stats.totalUsers).toBe(result.total);
    });
  });

  it('rejects creating an admin and promoting an existing user', () => {
    const error = jasmine.createSpy('error');
    service.create({ ...user, role: 'admin' }).subscribe({ error });
    service.update(3, { role: 'admin' }).subscribe({ error });
    service.updateCurrentUser({ role: 'admin' }).subscribe({ error });
    expect(error).toHaveBeenCalledTimes(3);
  });

  it('protects the fixed admin against update, deletion, and blocking', () => {
    const error = jasmine.createSpy('error');
    service.update(1, { email: 'other@example.com' }).subscribe({ error });
    service.delete(1).subscribe({ error });
    service.toggleBlock(1).subscribe({ error });
    expect(error).toHaveBeenCalledTimes(3);
  });

  it('creates regular users and prevents using the reserved admin email', () => {
    service.create(user).subscribe(created => {
      expect(created.role).toBe('user');
      expect(created.registeredAt).toBeTruthy();
    });
    const error = jasmine.createSpy('error');
    service.create({ ...user, email: MOCK_ADMIN_CREDENTIALS.email.toUpperCase() }).subscribe({ error });
    expect(error).toHaveBeenCalled();
  });
});
