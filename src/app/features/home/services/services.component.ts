import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  PremiumService
} from '../../../core/models/site-content.model';

import {
  SiteContentService
} from '../../../core/services/site-content/site-content.service';


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

  learnMore(
    service: PremiumService
  ): void {

    switch (
      service.type
    ) {

      case 'test-drive':

        this.router.navigate([
          '/test-drives'
        ]);

        break;


      case 'financing':
      case 'insurance':
      case 'inspection':
      case 'trade-in':

        console.log(
          'Selected service:',
          service.type
        );

        break;

    }

  }

}