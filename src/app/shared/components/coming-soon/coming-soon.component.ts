import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * Trang chờ dùng chung cho các module admin chưa được xây chi tiết
 * (Users, Test Drives, Brands, Sellers, Orders, Reports, Settings...).
 * Dùng @Input() để mỗi route truyền tiêu đề/icon riêng -> minh chứng
 * cho cơ chế input/output giao tiếp component.
 */
@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss'
})
export class ComingSoonComponent {
  @Input() title = 'Tính năng';
  @Input() icon = 'construction';
}
