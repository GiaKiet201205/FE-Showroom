import {
  AboutContent,
  ContactContent,
  HomeContent,
  PremiumService
} from '../../models/site-content.model';


// =====================================================
// HOME
// =====================================================

export const MOCK_HOME_CONTENT: HomeContent = {

  makes: [
    'BMW',
    'Mercedes-Benz',
    'Audi',
    'Porsche',
    'Ferrari',
    'Lamborghini'
  ],

  models: [
    'Sedan',
    'SUV',
    'Coupe',
    'Hatchback',
    'Truck'
  ],

  priceRanges: [
    {
      label: 'Under $50,000',
      value: '0-50000'
    },
    {
      label: '$50,000 - $100,000',
      value: '50000-100000'
    },
    {
      label: '$100,000 - $200,000',
      value: '100000-200000'
    },
    {
      label: 'Above $200,000',
      value: '200000'
    }
  ],

  bodyTypes: [
    {
      name: 'Sedan',
      icon: 'fa-solid fa-car-side'
    },
    {
      name: 'SUV',
      icon: 'fa-solid fa-car'
    },
    {
      name: 'Hatchback',
      icon: 'fa-solid fa-car-side'
    },
    {
      name: 'Coupe',
      icon: 'fa-solid fa-car-rear'
    },
    {
      name: 'Truck',
      icon: 'fa-solid fa-truck-pickup'
    },
    {
      name: 'Van',
      icon: 'fa-solid fa-van-shuttle'
    }
  ],

  benefits: [
    {
      icon: 'fa-solid fa-shield-halved',
      title: 'Verified Sellers',
      description:
        'Every partner passes through professional licensing checks.'
    },
    {
      icon: 'fa-solid fa-wallet',
      title: 'Easy Financing',
      description:
        'Instantly compare competitive loan rates from top auto banks.'
    },
    {
      icon: 'fa-solid fa-clipboard-check',
      title: 'Free Inspection',
      description:
        'Comprehensive 150-point report provided with every vehicle.'
    },
    {
      icon: 'fa-solid fa-headset',
      title: '24/7 Support',
      description:
        'Direct hotline assistance during purchasing and active transport.'
    }
  ]

};


// =====================================================
// SERVICES PAGE
// =====================================================

export const MOCK_PREMIUM_SERVICES: PremiumService[] = [

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

    icon: 'fa-solid fa-file-lines',

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

    icon: 'fa-solid fa-car-side',

    type: 'test-drive'
  }

];


// =====================================================
// ABOUT PAGE
// =====================================================

export const MOCK_ABOUT_CONTENT: AboutContent = {

  statistics: [
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
  ],

  leaders: [
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
  ],

  pillars: [
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
  ]

};


// =====================================================
// CONTACT PAGE
// =====================================================

export const MOCK_CONTACT_CONTENT: ContactContent = {

  subjects: [
    {
      value: 'general',
      label: 'General Inquiry'
    },
    {
      value: 'vehicle',
      label: 'Vehicle Inquiry'
    },
    {
      value: 'financing',
      label: 'Financing'
    },
    {
      value: 'insurance',
      label: 'Insurance'
    },
    {
      value: 'test-drive',
      label: 'Test Drive'
    },
    {
      value: 'trade-in',
      label: 'Trade-In'
    }
  ],

  faqs: [
    {
      question:
        'How does nationwide transport delivery work?',

      answer:
        'Once your acquisition is completed and verified, we coordinate enclosed carrier transport directly to your designated address.',

      open: true
    },

    {
      question:
        'Can I inspect the car in person before purchasing?',

      answer:
        'Absolutely. Scheduled test drives and direct viewings are available at all dealership partner locations.',

      open: false
    },

    {
      question:
        'Are vehicle background checks guaranteed?',

      answer:
        'Yes. Every listed vehicle contains verified background certifications and a 150-point report.',

      open: false
    },

    {
      question:
        'Do you accept trades for other luxury vehicles?',

      answer:
        'We provide virtual valuation metrics and fair value acquisition proposals for selected vehicles.',

      open: false
    }
  ]

};