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

  statistics: Statistic[] = [
    {
      value: '500+',
      label: 'Premium Cars Sold'
    },

    {
      value: '50+',
      label: 'Verified Brands'
    },

    {
      value: '10K+',
      label: 'Happy Customers'
    },

    {
      value: '15+',
      label: 'Years of Trust'
    }
  ];


  leaders: Leader[] = [
    {
      name: 'Marcus Sterling',
      role: 'CEO & Founder',
      image: '/images/leader-1.jpg'
    },

    {
      name: 'Sarah Jenkins',
      role: 'Head of Acquisitions',
      image: '/images/leader-2.jpg'
    },

    {
      name: 'David Vance',
      role: 'Chief Mechanic Officer',
      image: '/images/leader-3.jpg'
    },

    {
      name: 'Elena Rostova',
      role: 'Client Relations Director',
      image: '/images/leader-4.jpg'
    }
  ];


  pillars: Pillar[] = [
    {
      title: 'Trust',

      description:
        'No hidden clauses. Full transparency in history and specifications.',

      icon: 'fa-solid fa-shield-halved'
    },

    {
      title: 'Quality',

      description:
        'Every vehicle is exhaustively certified through 150-point inspection.',

      icon: 'fa-regular fa-square-check'
    },

    {
      title: 'Innovation',

      description:
        'Online instant rates and streamlined virtual configuration path.',

      icon: 'fa-regular fa-credit-card'
    },

    {
      title: 'Customer First',

      description:
        'Dedicated advisor assistance with seamless home delivery options.',

      icon: 'fa-solid fa-headset'
    }
  ];

}