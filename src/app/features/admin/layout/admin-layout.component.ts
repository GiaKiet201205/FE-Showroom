import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Vehicles', icon: 'directions_car', route: '/admin/vehicles' },
    { label: 'Users', icon: 'group', route: '/admin/users' },
    { label: 'Test Drives', icon: 'event_available', route: '/admin/test-drives' },
    { label: 'Brands', icon: 'sell', route: '/admin/brands' },
    { label: 'Sellers', icon: 'storefront', route: '/admin/sellers' },
    { label: 'Orders', icon: 'shopping_cart', route: '/admin/orders' },
    { label: 'Reports', icon: 'description', route: '/admin/reports' },
    { label: 'Settings', icon: 'settings', route: '/admin/settings' }
  ];

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
