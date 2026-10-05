export type ReportTimeRange = 'week' | 'month' | 'quarter' | 'year' | 'custom';

export interface ReportStats {
  totalRevenue: number;
  totalRevenueGrowth: number;
  carsSold: number;
  carsSoldGrowth: number;
  avgSalePrice: number;
  avgSalePriceGrowth: number;
  conversionRate: number;
  conversionRateGrowth: number;
}

export interface RevenueTrendPoint {
  month: string;
  revenue: number;
}

export interface CategoryShare {
  name: string;
  unitCount: number;
  percentage: number;
  color: string;
}

export interface TopSeller {
  rank: number;
  name: string;
  unitsSold: number;
  revenue: number;
  tier: string;
}

export interface BrandSales {
  brand: string;
  units: number;
  color: string;
}

export interface FunnelRow {
  vehicleModel: string;
  views: number;
  inquiries: number;
  testDrives: number;
  sales: number;
  revenue: number;
  conversionPct: number;
}

export interface ReportOverview {
  stats: ReportStats;
  revenueTrend: RevenueTrendPoint[];
  totalRevenueLabel: number;
  vehicleCategories: CategoryShare[];
  topSellers: TopSeller[];
  salesByBrand: BrandSales[];
  funnel: FunnelRow[];
}