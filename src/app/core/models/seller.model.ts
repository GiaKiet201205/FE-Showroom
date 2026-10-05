export type SellerStatus = 'verified' | 'pending' | 'suspended';

export interface Seller {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  listings: number;
  status: SellerStatus;
  joinDate: string;
  avatarUrl?: string;
}

export interface SellerStats {
  totalSellers: number;
  totalSellersGrowth: number;
  verified: number;
  verifiedGrowth: number;
  pendingVerification: number;
  pendingVerificationGrowth: number;
  suspended: number;
  suspendedGrowth: number;
}

export interface SellerListResult {
  items: Seller[];
  total: number;
  page: number;
  pageSize: number;
  stats: SellerStats;
}