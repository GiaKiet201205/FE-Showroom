export interface AdminProfile {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  bio: string;
  avatarUrl?: string;
}

export interface NotificationPrefs {
  email: boolean;
  push: boolean;
  sms: boolean;
  weeklyReports: boolean;
  newUserRegistration: boolean;
  testDriveBookings: boolean;
  orderStatusUpdates: boolean;
}

export interface AdminSettings {
  profile: AdminProfile;
  notifications: NotificationPrefs;
  twoFactorEnabled: boolean;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}