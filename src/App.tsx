import React from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PricingCalculator } from './components/PricingCalculator';
import { ScopeBuilder } from './components/ScopeBuilder';
import { Analytics } from './components/Analytics';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <PricingCalculator />
      <ScopeBuilder />
      <Analytics />
      <Footer />
    </div>
  );
}

export default App;