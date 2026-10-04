import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../../core/services/report/report.service';
import { ReportOverview, ReportTimeRange } from '../../../core/models/report.model';

interface RangeTab {
  label: string;
  value: ReportTimeRange;
}

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class AdminReportsComponent implements OnInit {
  private reportService = inject(ReportService);

  overview = signal<ReportOverview | null>(null);
  loading = signal(true);
  selectedRange = signal<ReportTimeRange>('month');

  rangeTabs: RangeTab[] = [
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'This Quarter', value: 'quarter' },
    { label: 'This Year', value: 'year' }
  ];

  maxRevenue = computed(() => {
    const trend = this.overview()?.revenueTrend ?? [];
    return Math.max(...trend.map((p) => p.revenue), 1);
  });

  maxBrandUnits = computed(() => {
    const brands = this.overview()?.salesByBrand ?? [];
    return Math.max(...brands.map((b) => b.units), 1);
  });

  ngOnInit(): void {
    this.loadOverview();
  }

  selectRange(range: ReportTimeRange): void {
    this.selectedRange.set(range);
    this.loadOverview();
  }

  loadOverview(): void {
    this.loading.set(true);
    this.reportService.getOverview(this.selectedRange()).subscribe({
      next: (data) => {
        this.overview.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  barHeight(revenue: number): number {
    return Math.round((revenue / this.maxRevenue()) * 100);
  }

  brandBarHeight(units: number): number {
    return Math.round((units / this.maxBrandUnits()) * 100);
  }

  formatCurrency(value: number): string {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value}`;
  }
}