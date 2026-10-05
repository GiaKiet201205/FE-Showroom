import { UserAccount, UserStats } from '../../models/user.model';

export const MOCK_USER_STATS: UserStats = {
  totalUsers: 28400,
  totalUsersGrowth: 12.5,
  activeUsers: 24800,
  activeUsersGrowth: 8.2,
  newThisMonth: 1402,
  newThisMonthGrowth: 24.1,
  blockedUsers: 142,
  blockedUsersGrowth: -4.8
};

export const MOCK_USERS: UserAccount[] = [
  { id: 1, fullName: 'Sarah Connor', email: 'sarah.c@gmail.com', phone: '+1 (512) 485-2319', registeredAt: 'Jul 12, 2023', role: 'admin', status: 'active' },
  { id: 2, fullName: 'Michael Chang', email: 'm.chang@autodrive.com', phone: '+1 (512) 993-4122', registeredAt: 'Aug 04, 2023', role: 'seller', status: 'active' },
  { id: 3, fullName: 'Emily Watson', email: 'emily.w@yahoo.com', phone: '+1 (415) 302-8841', registeredAt: 'Sep 19, 2023', role: 'user', status: 'pending' },
  { id: 4, fullName: 'David Miller', email: 'david.miller@fastcars.org', phone: '+1 (312) 745-9293', registeredAt: 'Oct 01, 2023', role: 'seller', status: 'active' },
  { id: 5, fullName: 'Helena Vance', email: 'helena.v@outlook.com', phone: '+1 (512) 662-8119', registeredAt: 'Oct 02, 2023', role: 'user', status: 'blocked' },
  { id: 6, fullName: 'Marcus Sterling', email: 'marcus.sterling@gmail.com', phone: '+1 (201) 441-2309', registeredAt: 'Oct 14, 2023', role: 'user', status: 'active' },
  { id: 7, fullName: 'Clara Oswald', email: 'clara_os@autodrive.com', phone: '+1 (512) 808-1123', registeredAt: 'Oct 15, 2023', role: 'admin', status: 'active' },
  { id: 8, fullName: 'Julian Brooks', email: 'jbrooks@gmail.com', phone: '+1 (310) 902-8812', registeredAt: 'Oct 19, 2023', role: 'user', status: 'pending' }
];

export const MOCK_USERS_TOTAL = 1240;