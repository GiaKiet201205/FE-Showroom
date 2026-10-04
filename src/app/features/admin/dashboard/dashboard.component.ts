import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from '../../../core/services/dashboard/dashboard.service';
import { AuthService } from '../../../core/services/auth.service';
import { DashboardOverview } from '../../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  auth = inject(AuthService);

  overview = signal<DashboardOverview | null>(null);
  loading = signal(true);

  maxRevenue = computed(() => {
    const trend = this.overview()?.salesTrend ?? [];
    return Math.max(...trend.map((p) => p.revenue), 1);
  });

  ngOnInit(): void {
    this.dashboardService.getOverview().subscribe({
      next: (data) => {
        this.overview.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  barHeight(revenue: number): number {
    const max = this.maxRevenue();
    return Math.round((revenue / max) * 100);
  }

  formatCurrency(value: number): string {
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
    return `$${value}`;
  }

  formatCompactNumber(value: number): string {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return `${value}`;
  }
}
