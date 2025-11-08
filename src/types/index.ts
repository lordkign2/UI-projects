export interface Service {
  id: string;
  name: string;
  category: string;
  baseRate: number;
  complexity: 'low' | 'medium' | 'high';
}

export interface ScopeItem {
  id: string;
  name: string;
  description: string;
  estimatedHours: number;
  hourlyRate: number;
  total: number;
}

export interface PricingCalculation {
  basePrice: number;
  adjustedPrice: number;
  marketRange: {
    min: number;
    max: number;
    average: number;
  };
  factors: {
    experience: number;
    location: number;
    complexity: number;
    market: number;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  skillLevel: 'beginner' | 'intermediate' | 'expert';
  location: string;
  specialties: string[];
  hourlyRate: number;
}

export interface Quote {
  id: string;
  clientName: string;
  projectName: string;
  serviceType: string;
  scopeItems: ScopeItem[];
  totalHours: number;
  totalPrice: number;
  createdAt: Date;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
}