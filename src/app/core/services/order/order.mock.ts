import { Order, OrderStats } from '../../models/order.model';

export const MOCK_ORDER_STATS: OrderStats = {
  totalOrders: 2485,
  totalOrdersGrowth: 11.2,
  revenueThisMonth: 2800000,
  revenueThisMonthGrowth: 18.4,
  completedSales: 1842,
  completedSalesGrowth: 14.1,
  pendingPayments: 18,
  pendingPaymentsGrowth: -5.2
};

export const MOCK_ORDERS: Order[] = [
  { id: '#ORD-001', customerName: 'Marcus Sterling', vehicleName: 'Porsche Taycan S', price: 187400, method: 'finance', payment: 'paid', date: 'Oct 24, 2024', status: 'completed' },
  { id: '#ORD-002', customerName: 'Helena Vance', vehicleName: 'BMW M4 Coupe', price: 89990, method: 'finance', payment: 'pending', date: 'Oct 24, 2024', status: 'processing' },
  { id: '#ORD-003', customerName: 'Julian Brooks', vehicleName: 'Tesla Model S Plaid', price: 98990, method: 'card', payment: 'paid', date: 'Oct 23, 2024', status: 'completed' },
  { id: '#ORD-004', customerName: 'Sarah Connor', vehicleName: 'Tesla Model 3', price: 54990, method: 'cash', payment: 'paid', date: 'Oct 22, 2024', status: 'completed' },
  { id: '#ORD-005', customerName: 'Michael Chang', vehicleName: 'Mercedes AMG GT', price: 124500, method: 'finance', payment: 'partial', date: 'Oct 21, 2024', status: 'processing' },
  { id: '#ORD-006', customerName: 'Emily Watson', vehicleName: 'Audi RS Q8 Sport', price: 116200, method: 'finance', payment: 'refunded', date: 'Oct 19, 2024', status: 'cancelled' },
  { id: '#ORD-007', customerName: 'David Miller', vehicleName: 'BMW M8 Gran Coupe', price: 118500, method: 'cash', payment: 'paid', date: 'Oct 18, 2024', status: 'completed' },
  { id: '#ORD-008', customerName: 'Clara Oswald', vehicleName: 'Audi Q5 Sportback', price: 58400, method: 'card', payment: 'paid', date: 'Oct 15, 2024', status: 'shipped' }
];

export const MOCK_ORDERS_TOTAL = 248;