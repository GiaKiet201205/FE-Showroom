import { MOCK_ADMIN_LOGIN_RESPONSE } from '../auth.mock';
import {
  UserAccount,
  UserStats
} from '../../models/user.model';


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


// =====================================================
// CURRENT USER
// =====================================================

export const MOCK_CURRENT_USER: UserAccount = {
  id: 100,

  fullName: 'Jonathan Vance',

  email:
    'jonathan.vance@beverlyhills.org',

  phone:
    '+1 (310) 555-8422',

  registeredAt:
    'Jan 01, 2024',

  role: 'user',

  status: 'active',

  avatarUrl:
    '/images/avt.jpg',

  location:
    'Beverly Hills, CA',

  membership:
    'Elite Member since January 2024'
};


// =====================================================
// USERS
// =====================================================

export const MOCK_USERS: UserAccount[] = [

  {
    id: 1,
    fullName: MOCK_ADMIN_LOGIN_RESPONSE.user.fullName,
    email: MOCK_ADMIN_LOGIN_RESPONSE.user.email,
    phone: '+1 (512) 485-2319',
    registeredAt: 'Jul 12, 2023',
    role: 'admin',
    status: 'active'
  },

  {
    id: 2,
    fullName: 'Michael Chang',
    email: 'm.chang@autodrive.com',
    phone: '+1 (512) 993-4122',
    registeredAt: 'Aug 04, 2023',
    role: 'seller',
    status: 'active'
  },

  {
    id: 3,
    fullName: 'Emily Watson',
    email: 'emily.w@yahoo.com',
    phone: '+1 (415) 302-8841',
    registeredAt: 'Sep 19, 2023',
    role: 'user',
    status: 'pending'
  },

  {
    id: 4,
    fullName: 'David Miller',
    email: 'david.miller@fastcars.org',
    phone: '+1 (312) 745-9293',
    registeredAt: 'Oct 01, 2023',
    role: 'seller',
    status: 'active'
  },

  {
    id: 5,
    fullName: 'Helena Vance',
    email: 'helena.v@outlook.com',
    phone: '+1 (512) 662-8119',
    registeredAt: 'Oct 02, 2023',
    role: 'user',
    status: 'blocked'
  },

  {
    id: 6,
    fullName: 'Marcus Sterling',
    email: 'marcus.sterling@gmail.com',
    phone: '+1 (201) 441-2309',
    registeredAt: 'Oct 14, 2023',
    role: 'user',
    status: 'active'
  },

  {
    id: 7,
    fullName: 'Clara Oswald',
    email: 'clara_os@autodrive.com',
    phone: '+1 (512) 808-1123',
    registeredAt: 'Oct 15, 2023',
    role: 'user',
    status: 'active'
  },

  {
    id: 8,
    fullName: 'Julian Brooks',
    email: 'jbrooks@gmail.com',
    phone: '+1 (310) 902-8812',
    registeredAt: 'Oct 19, 2023',
    role: 'user',
    status: 'pending'
  },

  // Additional customers and showroom sales staff.
  {"id": 20, "fullName": "Nguyễn Minh Anh", "email": "seller1@showroom.example", "phone": "0902000001", "registeredAt": "2026-09-01", "role": "seller", "status": "active"},
  {"id": 21, "fullName": "Trần Hoàng Nam", "email": "seller2@showroom.example", "phone": "0902000002", "registeredAt": "2026-09-02", "role": "seller", "status": "active"},
  {"id": 22, "fullName": "Lê Thanh Hà", "email": "seller3@showroom.example", "phone": "0902000003", "registeredAt": "2026-09-03", "role": "seller", "status": "active"},
  {"id": 23, "fullName": "Phạm Quốc Huy", "email": "seller4@showroom.example", "phone": "0902000004", "registeredAt": "2026-09-04", "role": "seller", "status": "active"},
  {"id": 24, "fullName": "Võ Ngọc Linh", "email": "seller5@showroom.example", "phone": "0902000005", "registeredAt": "2026-09-05", "role": "seller", "status": "active"},
  {"id": 25, "fullName": "Đặng Tuấn Kiệt", "email": "seller6@showroom.example", "phone": "0902000006", "registeredAt": "2026-09-06", "role": "seller", "status": "active"},
  {"id": 26, "fullName": "Bùi Gia Bảo", "email": "seller7@showroom.example", "phone": "0902000007", "registeredAt": "2026-09-07", "role": "seller", "status": "pending"},
  {"id": 27, "fullName": "Đỗ Khánh Vy", "email": "seller8@showroom.example", "phone": "0902000008", "registeredAt": "2026-09-08", "role": "seller", "status": "blocked"},
  {"id": 40, "fullName": "Nguyễn Đức Anh", "email": "customer1@showroom.example", "phone": "0913000001", "registeredAt": "2026-10-01", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 41, "fullName": "Trần Bảo Ngọc", "email": "customer2@showroom.example", "phone": "0913000002", "registeredAt": "2026-10-02", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 42, "fullName": "Lê Minh Khang", "email": "customer3@showroom.example", "phone": "0913000003", "registeredAt": "2026-10-03", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 43, "fullName": "Phạm Thảo Nhi", "email": "customer4@showroom.example", "phone": "0913000004", "registeredAt": "2026-10-04", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 44, "fullName": "Hoàng Gia Hân", "email": "customer5@showroom.example", "phone": "0913000005", "registeredAt": "2026-10-05", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 45, "fullName": "Vũ Quang Minh", "email": "customer6@showroom.example", "phone": "0913000006", "registeredAt": "2026-10-06", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 46, "fullName": "Đặng Hải Đăng", "email": "customer7@showroom.example", "phone": "0913000007", "registeredAt": "2026-10-07", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 47, "fullName": "Bùi Phương Anh", "email": "customer8@showroom.example", "phone": "0913000008", "registeredAt": "2026-10-08", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 48, "fullName": "Đỗ Thiên Phúc", "email": "customer9@showroom.example", "phone": "0913000009", "registeredAt": "2026-10-09", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 49, "fullName": "Hồ Ngọc Trâm", "email": "customer10@showroom.example", "phone": "0913000010", "registeredAt": "2026-10-10", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 50, "fullName": "Ngô Thành Đạt", "email": "customer11@showroom.example", "phone": "0913000011", "registeredAt": "2026-10-11", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 51, "fullName": "Dương Mai Chi", "email": "customer12@showroom.example", "phone": "0913000012", "registeredAt": "2026-10-12", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 52, "fullName": "Lý Nhật Nam", "email": "customer13@showroom.example", "phone": "0913000013", "registeredAt": "2026-10-13", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 53, "fullName": "Trương Khánh Linh", "email": "customer14@showroom.example", "phone": "0913000014", "registeredAt": "2026-10-14", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 54, "fullName": "Đinh Tuấn Anh", "email": "customer15@showroom.example", "phone": "0913000015", "registeredAt": "2026-10-15", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 55, "fullName": "Phan Yến Nhi", "email": "customer16@showroom.example", "phone": "0913000016", "registeredAt": "2026-10-16", "role": "user", "status": "active", "location": "TP. Hồ Chí Minh"},
  {"id": 101, "fullName": "Demo User", "email": "user@giakiet.com", "phone": "0901234567", "registeredAt": "2026-10-28", "role": "user", "status": "active"},

  // Current logged-in mock user
  MOCK_CURRENT_USER

];


export const MOCK_USERS_TOTAL = MOCK_USERS.length;