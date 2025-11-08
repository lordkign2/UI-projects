import React, { useState, useEffect } from 'react';
import { services } from '../data/services';
import { calculatePricing, formatCurrency, generateAISuggestion } from '../utils/pricing';
import { Calculator, MapPin, User, Clock, TrendingUp } from 'lucide-react';

export const PricingCalculator: React.FC = () => {
  const [selectedService, setSelectedService] = useState(services[0]);
  const [hours, setHours] = useState(40);
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'expert'>('intermediate');
  const [location, setLocation] = useState('north-america');
  const [calculation, setCalculation] = useState(calculatePricing(services[0], 40, 'intermediate', 'north-america'));
  const [aiSuggestion, setAiSuggestion] = useState('');

  useEffect(() => {
    const newCalculation = calculatePricing(selectedService, hours, skillLevel, location);
    setCalculation(newCalculation);
    setAiSuggestion(generateAISuggestion(selectedService.name, hours, newCalculation.adjustedPrice));
  }, [selectedService, hours, skillLevel, location]);

  const locations = [
    { value: 'north-america', label: 'North America' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia', label: 'Asia' },
    { value: 'africa', label: 'Africa' },
    { value: 'south-america', label: 'South America' },
    { value: 'oceania', label: 'Oceania' }
  ];

  return (
    <section id="calculator" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Smart Pricing Calculator</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get personalized pricing recommendations based on your skills, location, and market data
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Input Form */}
          <div className="bg-gray-50 p-8 rounded-2xl">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Calculator className="inline h-4 w-4 mr-2" />
                  Service Type
                </label>
                <select
                  value={selectedService.id}
                  onChange={(e) => setSelectedService(services.find(s => s.id === e.target.value) || services[0])}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({service.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Clock className="inline h-4 w-4 mr-2" />
                  Estimated Hours: {hours}
                </label>
                <input
                  type="range"
                  min="1"
                  max="200"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 hour</span>
                  <span>200+ hours</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <User className="inline h-4 w-4 mr-2" />
                  Skill Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['beginner', 'intermediate', 'expert'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setSkillLevel(level)}
                      className={`p-3 rounded-lg font-medium transition-all ${
                        skillLevel === level
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-300'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Location/Market
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {locations.map(loc => (
                    <option key={loc.value} value={loc.value}>
                      {loc.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Main Pricing Card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-2xl text-white">
              <h4 className="text-lg font-semibold mb-6">Recommended Pricing</h4>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-blue-100">Hourly Rate</div>
                  <div className="text-3xl font-bold">{formatCurrency(calculation.hourlyRate)}</div>
                </div>
                <div className="border-t border-blue-500 pt-4">
                  <div className="text-sm text-blue-100">Total Project Value</div>
                  <div className="text-4xl font-bold">{formatCurrency(calculation.adjustedPrice)}</div>
                </div>
              </div>
            </div>

            {/* Market Comparison */}
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h5 className="font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Market Range
              </h5>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Low End</span>
                  <span className="font-medium">{formatCurrency(calculation.marketRange.min)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average</span>
                  <span className="font-medium">{formatCurrency(calculation.marketRange.average)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">High End</span>
                  <span className="font-medium">{formatCurrency(calculation.marketRange.max)}</span>
                </div>
              </div>
            </div>

            {/* AI Suggestion */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <h5 className="font-semibold text-green-900 mb-3">💡 AI Insight</h5>
              <p className="text-green-800 text-sm leading-relaxed">{aiSuggestion}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};