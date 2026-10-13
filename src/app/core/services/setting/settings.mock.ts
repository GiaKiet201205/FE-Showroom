import { AdminSettings } from '../../models/settings.model';

export const MOCK_ADMIN_SETTINGS: AdminSettings = {
  profile: {
    fullName: 'Alex Mercer',
    email: 'alex.mercer@autodrive.com',
    phone: '+1 (512) 555-0199',
    role: 'Super Admin (Read-only)',
    bio: 'Dealership director and global fleet operations leader. Overseeing platform logistics and verified sellers list audits since 2021.'
  },
  notifications: {
    email: true,
    push: true,
    sms: false,
    weeklyReports: true,
    newUserRegistration: false,
    testDriveBookings: true,
    orderStatusUpdates: true
  },
  twoFactorEnabled: true
};