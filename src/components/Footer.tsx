import React from 'react';
import { Calculator, Github, Linkedin, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">PriceWise</h3>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Empowering freelancers and service providers with intelligent pricing tools 
              and market insights to build successful businesses.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/lordkign2" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="www.linkedin.com/in/umeh-kingsley-43a322369" target="_blank" className="hover:text-blue-400 transition cursor-target">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="mailto:lordkign1@gmail.com" target="_blank" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#calculator" className="hover:text-white transition-colors">Pricing Calculator</a></li>
              <li><a href="#scope" className="hover:text-white transition-colors">Scope Builder</a></li>
              <li><a href="#analytics" className="hover:text-white transition-colors">Market Analytics</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Quote Generator</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Pricing Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Best Practices</a></li>
              <li><a href="mailto:lordkign1@gmail.com" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 PriceWise. Built with ❤️ for freelancers everywhere.</p>
        </div>
      </div>
    </footer>
  );
};