import { DashboardOverview } from '../models/dashboard.model';

export const MOCK_DASHBOARD_OVERVIEW: DashboardOverview = {
  stats: {
    totalCars: 1248,
    totalCarsGrowth: 14.8,
    totalUsers: 28400,
    totalUsersGrowth: 8.2,
    totalTestDrives: 142,
    totalTestDrivesGrowth: 4.1,
    totalSales: 98,
    totalSalesGrowth: 12.5,
    revenue: 14200000,
    revenueGrowth: -3.6
  },
  salesTrend: [
    { month: 'Jan', revenue: 4200, salesTarget: 5000 },
    { month: 'Feb', revenue: 5800, salesTarget: 5000 },
    { month: 'Mar', revenue: 4600, salesTarget: 5200 },
    { month: 'Apr', revenue: 6400, salesTarget: 5200 },
    { month: 'May', revenue: 7200, salesTarget: 5500 },
    { month: 'Jun', revenue: 6900, salesTarget: 5500 },
    { month: 'Jul', revenue: 7800, salesTarget: 6000 },
    { month: 'Aug', revenue: 8600, salesTarget: 6000 },
    { month: 'Sep', revenue: 7400, salesTarget: 6200 }
  ],
  vehicleCategories: [
    { name: 'SUVs', unitCount: 485, percentage: 40, color: '#6366f1' },
    { name: 'Sedans', unitCount: 322, percentage: 30, color: '#22c55e' },
    { name: 'Coupes & Convertibles', unitCount: 184, percentage: 18, color: '#f59e0b' },
    { name: 'Electric & Hybrids', unitCount: 120, percentage: 12, color: '#3b82f6' }
  ],
  recentActivities: [
    { id: 1, actorName: 'Sarah Connor', description: 'requested a test drive for Tesla Model S', createdAt: '10 mins ago' },
    { id: 2, actorName: 'David Miller', description: 'purchased a BMW M4 Competition', createdAt: '45 mins ago' },
    { id: 3, actorName: 'System', description: 'New vehicle listing added: Audi e-tron GT 2023', createdAt: '2 hours ago' },
    { id: 4, actorName: 'Premier Cars Dallas', description: 'Seller verified', createdAt: '5 hours ago' },
    { id: 5, actorName: 'System', description: 'System Report Generated: Monthly Sales PDF', createdAt: '1 day ago' }
  ],
  recentListings: [
    { id: 1, name: 'Mercedes-Benz AMG GT', price: 124500, status: 'available' },
    { id: 2, name: 'Tesla Model S Plaid', price: 98990, status: 'reserved' },
    { id: 3, name: 'Audi RS Q8 Sportback', price: 116200, status: 'available' },
    { id: 4, name: 'Porsche Taycan Turbo S', price: 187400, status: 'sold' }
  ],
  upcomingTestDrives: [
    { id: 1, customerName: 'Marcus Sterling', vehicleName: 'Porsche Taycan Turbo S', date: 'Oct 24, 2024', time: '10:30 AM', location: 'Austin North Center', status: 'confirmed' },
    { id: 2, customerName: 'Helena Vance', vehicleName: 'BMW M4 Coupe', date: 'Oct 24, 2024', time: '01:15 PM', location: 'Austin Downtown', status: 'pending' },
    { id: 3, customerName: 'Julian Brooks', vehicleName: 'Tesla Model S', date: 'Oct 25, 2024', time: '09:00 AM', location: 'Austin North Center', status: 'completed' },
    { id: 4, customerName: 'Clara Oswald', vehicleName: 'Audi RS Q8', date: 'Oct 25, 2024', time: '03:45 PM', location: 'Austin Downtown', status: 'confirmed' }
  ]
};
