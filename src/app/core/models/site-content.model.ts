export interface PriceRangeOption {
  label: string;
  value: string;
}

export interface BodyTypeOption {
  name: string;
  icon: string;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface HomeContent {
  makes: string[];
  models: string[];
  priceRanges: PriceRangeOption[];
  bodyTypes: BodyTypeOption[];
  benefits: Benefit[];
}

// =====================================================
// SERVICES PAGE
// =====================================================

export type PremiumServiceType =
  | 'financing'
  | 'insurance'
  | 'inspection'
  | 'trade-in'
  | 'test-drive';

export interface PremiumService {
  id: number;
  title: string;
  description: string;
  icon: string;
  type: PremiumServiceType;
}

// =====================================================
// ABOUT PAGE
// =====================================================

export interface Statistic {
  value: string;
  label: string;
}

export interface Leader {
  name: string;
  role: string;
  image: string;
}

export interface Pillar {
  title: string;
  description: string;
  icon: string;
}

export interface AboutContent {
  statistics: Statistic[];
  leaders: Leader[];
  pillars: Pillar[];
}

// =====================================================
// CONTACT PAGE
// =====================================================

export interface ContactSubject {
  value: string;
  label: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  open: boolean;
}

export interface ContactContent {
  subjects: ContactSubject[];
  faqs: FaqItem[];
}