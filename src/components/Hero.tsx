import React from 'react';
import { TrendingUp, Users, Clock, DollarSign } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Price Your Services
            <span className="block text-blue-600">with Confidence</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Get fair, data-driven pricing recommendations for your freelance services. 
            Compare market rates, build professional scopes, and create winning quotes.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Market Analysis</h3>
              <p className="text-gray-600 text-sm">Real-time pricing data from top platforms</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">AI Insights</h3>
              <p className="text-gray-600 text-sm">Smart suggestions based on project scope</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Time Tracking</h3>
              <p className="text-gray-600 text-sm">Accurate hour estimates for any project</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Quote Builder</h3>
              <p className="text-gray-600 text-sm">Professional proposals in minutes</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};