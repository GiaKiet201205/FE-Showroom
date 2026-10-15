import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  SiteContentService
} from '../../../core/services/site-content/site-content.service';
import {
  Statistic,
  Leader,
  Pillar
} from '../../../core/models/site-content.model';


@Component({
  selector: 'app-about',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {

  statistics: Statistic[] = [];

  leaders: Leader[] = [];

  pillars: Pillar[] = [];


  constructor(
    private siteContentService:
      SiteContentService
  ) {}


  ngOnInit(): void {

    this.siteContentService
      .getAboutContent()
      .subscribe(data => {

        this.statistics =
          data.statistics;

        this.leaders =
          data.leaders;

        this.pillars =
          data.pillars;

      });

  }

}