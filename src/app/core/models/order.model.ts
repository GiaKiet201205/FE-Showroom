export type OrderMethod = 'finance' | 'card' | 'cash';
export type OrderPayment = 'paid' | 'pending' | 'partial' | 'refunded';
export type OrderStatus = 'completed' | 'processing' | 'shipped' | 'cancelled';

export interface Order {
  id: string; // ví dụ: #ORD-001
  customerName: string;
  customerAvatarUrl?: string;
  vehicleName: string;
  price: number;
  method: OrderMethod;
  payment: OrderPayment;
  date: string;
  status: OrderStatus;
}

export interface OrderStats {
  totalOrders: number;
  totalOrdersGrowth: number;
  revenueThisMonth: number;
  revenueThisMonthGrowth: number;
  completedSales: number;
  completedSalesGrowth: number;
  pendingPayments: number;
  pendingPaymentsGrowth: number;
}

export interface OrderListResult {
  items: Order[];
  total: number;
  page: number;
  pageSize: number;
  stats: OrderStats;
}