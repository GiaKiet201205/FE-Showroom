export type UserAccountRole = 'admin' | 'seller' | 'user';
export type UserAccountStatus = 'active' | 'pending' | 'blocked';

export interface UserAccount {

  id: number;

  fullName: string;

  email: string;

  phone: string;

  registeredAt: string;

  role: UserAccountRole;

  status: UserAccountStatus;

  avatarUrl?: string;


  // User profile
  location?: string;

  membership?: string;

}

export interface UserStats {
  totalUsers: number;
  totalUsersGrowth: number;
  activeUsers: number;
  activeUsersGrowth: number;
  newThisMonth: number;
  newThisMonthGrowth: number;
  blockedUsers: number;
  blockedUsersGrowth: number;
}

export interface UserListResult {
  items: UserAccount[];
  total: number;
  page: number;
  pageSize: number;
  stats: UserStats;
}


export type UserAccountInput = Omit<UserAccount, 'id'> & { password?: string };
export type UserAccountChanges = Partial<UserAccount> & { password?: string };
