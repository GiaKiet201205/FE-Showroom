import { ReportOverview } from '../../models/report.model';

export const MOCK_REPORT_OVERVIEW: ReportOverview = {
  stats: {
    totalRevenue: 14200000,
    totalRevenueGrowth: 18.2,
    carsSold: 1248,
    carsSoldGrowth: 12.5,
    avgSalePrice: 84500,
    avgSalePriceGrowth: 4.8,
    conversionRate: 5.8,
    conversionRateGrowth: -2.1
  },
  revenueTrend: [
    { month: 'Jan', revenue: 4200 },
    { month: 'Feb', revenue: 5800 },
    { month: 'Mar', revenue: 4600 },
    { month: 'Apr', revenue: 6400 },
    { month: 'May', revenue: 7200 },
    { month: 'Jun', revenue: 6900 },
    { month: 'Jul', revenue: 7800 },
    { month: 'Aug', revenue: 8600 },
    { month: 'Sep', revenue: 7400 }
  ],
  totalRevenueLabel: 14248000,
  vehicleCategories: [
    { name: 'SUVs', unitCount: 485, percentage: 40, color: '#6366f1' },
    { name: 'Sedans', unitCount: 322, percentage: 30, color: '#22c55e' },
    { name: 'Coupes', unitCount: 184, percentage: 18, color: '#f59e0b' },
    { name: 'Electric', unitCount: 120, percentage: 12, color: '#8b5cf6' }
  ],
  topSellers: [
    { rank: 1, name: 'Texas Premium Auto', unitsSold: 32, revenue: 1400000, tier: 'Premier' },
    { rank: 2, name: 'Austin North Center', unitsSold: 28, revenue: 1100000, tier: 'Premier' },
    { rank: 3, name: 'Premier Cars Dallas', unitsSold: 22, revenue: 920000, tier: 'Premier' },
    { rank: 4, name: 'Houston Central Sales', unitsSold: 18, revenue: 810000, tier: 'Premier' }
  ],
  salesByBrand: [
    { brand: 'Tesla', units: 320, color: '#6366f1' },
    { brand: 'BMW', units: 260, color: '#a855f7' },
    { brand: 'Audi', units: 210, color: '#22c55e' },
    { brand: 'Porsche', units: 150, color: '#f59e0b' },
    { brand: 'Mercedes', units: 130, color: '#eab308' }
  ],
  funnel: [
    { vehicleModel: 'Tesla Model S Plaid', views: 4280, inquiries: 482, testDrives: 84, sales: 32, revenue: 3100000, conversionPct: 7.4 },
    { vehicleModel: 'BMW M4 Competition', views: 3840, inquiries: 395, testDrives: 72, sales: 24, revenue: 2100000, conversionPct: 6.2 },
    { vehicleModel: 'Audi RS Q8 Sport', views: 3110, inquiries: 312, testDrives: 65, sales: 18, revenue: 2000000, conversionPct: 5.7 },
    { vehicleModel: 'Mercedes-Benz C-Class', views: 2950, inquiries: 284, testDrives: 52, sales: 14, revenue: 618000, conversionPct: 4.7 }
  ]
};