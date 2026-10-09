import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

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

  services: PremiumService[] = [
    {
      id: 1,

      title: 'Financing Plans',

      description:
        'Instantly discover optimal customized auto loans with transparent monthly quotes.',

      icon: 'fa-solid fa-percent',

      type: 'financing'
    },

    {
      id: 2,

      title: 'Vehicle Insurance',

      description:
        'Compare policy terms instantly with nationwide partner providers.',

      icon: 'fa-solid fa-shield-halved',

      type: 'insurance'
    },

    {
      id: 3,

      title: 'Rigorous Inspection',

      description:
        'Comprehensive 150-point report provided for absolute buyer confidence.',

      icon: 'fa-regular fa-file-lines',

      type: 'inspection'
    },

    {
      id: 4,

      title: 'Instant Trade-In Valuation',

      description:
        'Transition your asset value immediately toward selected premium configuration upgrades.',

      icon: 'fa-solid fa-arrow-right-arrow-left',

      type: 'trade-in'
    },

    {
      id: 5,

      title: 'VIP Test Drive Program',

      description:
        'Book personalized extended trial drives delivered straight to your local home.',

      icon: 'fa-regular fa-circle-xmark',

      type: 'test-drive'
    }
  ];


  constructor(
    private router: Router
  ) {}


  learnMore(service: PremiumService): void {

    switch (service.type) {

      case 'test-drive':

        this.router.navigate([
          '/test-drives'
        ]);

        break;


      case 'financing':

        console.log(
          'Financing service selected'
        );

        break;


      case 'insurance':

        console.log(
          'Insurance service selected'
        );

        break;


      case 'inspection':

        console.log(
          'Inspection service selected'
        );

        break;


      case 'trade-in':

        console.log(
          'Trade-in service selected'
        );

        break;

    }

  }

}