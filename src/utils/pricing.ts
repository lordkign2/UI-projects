import { Service } from '../types';

export const calculatePricing = (
  service: Service,
  hours: number,
  skillLevel: 'beginner' | 'intermediate' | 'expert',
  location: string
) => {
  let baseRate = service.baseRate;

  // Skill level multiplier
  const skillMultipliers = {
    beginner: 0.7,
    intermediate: 1.0,
    expert: 1.4
  };

  // Location multiplier (simplified for demo)
  const locationMultipliers: { [key: string]: number } = {
    'north-america': 1.2,
    'europe': 1.1,
    'asia': 0.8,
    'africa': 0.6,
    'south-america': 0.7,
    'oceania': 1.15
  };

  // Complexity multiplier
  const complexityMultipliers = {
    low: 0.9,
    medium: 1.0,
    high: 1.2
  };

  const skillAdjusted = baseRate * skillMultipliers[skillLevel];
  const locationAdjusted = skillAdjusted * (locationMultipliers[location] || 1.0);
  const complexityAdjusted = locationAdjusted * complexityMultipliers[service.complexity];

  const finalRate = Math.round(complexityAdjusted);
  const basePrice = finalRate * hours;

  // Generate market range (simulated)
  const marketAverage = basePrice;
  const marketMin = Math.round(marketAverage * 0.7);
  const marketMax = Math.round(marketAverage * 1.4);

  return {
    basePrice,
    adjustedPrice: basePrice,
    hourlyRate: finalRate,
    marketRange: {
      min: marketMin,
      max: marketMax,
      average: marketAverage
    },
    factors: {
      experience: skillMultipliers[skillLevel],
      location: locationMultipliers[location] || 1.0,
      complexity: complexityMultipliers[service.complexity],
      market: 1.0
    }
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const generateAISuggestion = (
  serviceType: string,
  totalHours: number,
  calculatedPrice: number
): string => {
  const suggestions = [
    `Based on current market trends for ${serviceType}, your pricing is competitive. Consider highlighting your unique value proposition to justify premium rates.`,
    `For ${serviceType} projects of this scope (${totalHours} hours), clients typically expect detailed deliverables. Include progress milestones to build trust.`,
    `Your rate aligns well with industry standards. Consider offering package deals for similar projects to increase client retention.`,
    `Market analysis shows ${serviceType} rates have increased 12% this year. Your pricing reflects current market conditions.`,
    `For this project size, consider structuring payment in 2-3 milestones to improve cash flow and reduce client risk concerns.`
  ];

  return suggestions[Math.floor(Math.random() * suggestions.length)];
};