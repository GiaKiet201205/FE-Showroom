import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  PremiumService
} from '../../../core/models/site-content.model';

import {
  SiteContentService
} from '../../../core/services/site-content/site-content.service';

interface PremiumService {
  id: number;
  title: string;
  description: string;
  icon: string;
  type:
    | 'financing'
    | 'insurance'
    | 'inspection'
    | 'trade-in'
    | 'test-drive';
}

@Component({
  selector: 'app-services',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {

  services: PremiumService[] = [];

  constructor(
    private router: Router,

    private siteContentService:
      SiteContentService
  ) {}


  ngOnInit(): void {

    this.siteContentService
      .getPremiumServices()
      .subscribe(data => {

        this.services = data;

      });

  }

}