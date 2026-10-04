import { Seller, SellerStats } from '../../models/seller.model';

export const MOCK_SELLER_STATS: SellerStats = {
  totalSellers: 412,
  totalSellersGrowth: 8.2,
  verified: 384,
  verifiedGrowth: 9.5,
  pendingVerification: 18,
  pendingVerificationGrowth: -3.6,
  suspended: 10,
  suspendedGrowth: 0.0
};

export const MOCK_SELLERS: Seller[] = [
  { id: 1, fullName: 'Sarah Connor', email: 'sarah.c@gmail.com', phone: '+1 (512) 485-2319', company: 'Connor Auto Austin', listings: 24, status: 'verified', joinDate: 'Jul 12, 2023' },
  { id: 2, fullName: 'Michael Chang', email: 'm.chang@autodrive.com', phone: '+1 (512) 993-4122', company: 'Elite Cars Dallas', listings: 41, status: 'verified', joinDate: 'Aug 04, 2023' },
  { id: 3, fullName: 'Emily Watson', email: 'emily.w@yahoo.com', phone: '+1 (415) 302-8841', company: 'Watson EV Houston', listings: 8, status: 'pending', joinDate: 'Sep 19, 2023' },
  { id: 4, fullName: 'David Miller', email: 'david.miller@fastcars.org', phone: '+1 (312) 745-9293', company: 'FastCars Superstore', listings: 65, status: 'verified', joinDate: 'Oct 01, 2023' },
  { id: 5, fullName: 'Helena Vance', email: 'helena.v@outlook.com', phone: '+1 (512) 662-8119', company: 'Vance Premium Motors', listings: 19, status: 'suspended', joinDate: 'Oct 02, 2023' },
  { id: 6, fullName: 'Marcus Sterling', email: 'marcus.sterling@gmail.com', phone: '+1 (201) 441-2309', company: 'Sterling Sportscars', listings: 32, status: 'verified', joinDate: 'Oct 14, 2023' },
  { id: 7, fullName: 'Clara Oswald', email: 'clara_os@autodrive.com', phone: '+1 (512) 808-1123', company: 'Oswald Prestige Group', listings: 15, status: 'verified', joinDate: 'Oct 15, 2023' },
  { id: 8, fullName: 'Julian Brooks', email: 'jbrooks@gmail.com', phone: '+1 (310) 902-8812', company: 'Brooks Auto Sales', listings: 5, status: 'pending', joinDate: 'Oct 19, 2023' }
];

export const MOCK_SELLERS_TOTAL = 412;