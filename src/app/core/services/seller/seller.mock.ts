import { Seller, SellerStats } from '../../models/seller.model';
import { MOCK_USERS } from '../user/user.mock';

// Sellers use exactly the same identities as the User list.
export const MOCK_SELLERS: Seller[] = MOCK_USERS.filter(user => user.role === 'seller').map(user => ({
  id: user.id, userId: user.id, fullName: user.fullName, email: user.email, phone: user.phone,
  company: 'Showroom', listings: 0, joinDate: user.registeredAt,
  status: user.status === 'active' ? 'verified' : user.status === 'blocked' ? 'suspended' : 'pending'
}));
export const MOCK_SELLERS_TOTAL = MOCK_SELLERS.length;
export const MOCK_SELLER_STATS: SellerStats = {
  totalSellers: MOCK_SELLERS.length, totalSellersGrowth: 0,
  verified: MOCK_SELLERS.filter(seller => seller.status === 'verified').length, verifiedGrowth: 0,
  pendingVerification: MOCK_SELLERS.filter(seller => seller.status === 'pending').length, pendingVerificationGrowth: 0,
  suspended: MOCK_SELLERS.filter(seller => seller.status === 'suspended').length, suspendedGrowth: 0
};
