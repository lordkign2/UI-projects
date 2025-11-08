import React from 'react';
import { motion } from 'framer-motion';

const AuthTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'login', label: 'Sign In' },
    { id: 'register', label: 'Create Account' }
  ];

  return (
    <div className="flex bg-muted rounded-lg p-1 mb-6">
      {tabs?.map((tab) => (
        <button
          key={tab?.id}
          onClick={() => onTabChange(tab?.id)}
          className={`
            relative flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200
            ${activeTab === tab?.id 
              ? 'text-text-primary' :'text-text-secondary hover:text-text-primary'
            }
          `}
        >
          {activeTab === tab?.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-card border border-border rounded-md shadow-soft"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab?.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AuthTabs;