import React from 'react';
import { Calculator, Zap } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">PriceWise</h1>
            </div>
            <div className="ml-6 flex items-center">
              <Zap className="h-4 w-4 text-blue-600 mr-1" />
              <span className="text-sm text-gray-600">Smart Pricing Assistant</span>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#calculator" className="text-gray-700 hover:text-blue-600 transition-colors">Calculator</a>
            <a href="#scope" className="text-gray-700 hover:text-blue-600 transition-colors">Scope Builder</a>
            <a href="#analytics" className="text-gray-700 hover:text-blue-600 transition-colors">Analytics</a>
          </nav>
        </div>
      </div>
    </header>
  );
};