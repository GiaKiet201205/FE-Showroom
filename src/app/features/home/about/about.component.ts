import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Statistic {
  value: string;
  label: string;
}

interface Leader {
  name: string;
  role: string;
  image: string;
}

interface Pillar {
  title: string;
  description: string;
  icon: string;
}

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