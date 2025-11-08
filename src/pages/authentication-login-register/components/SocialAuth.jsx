import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../../components/ui/Button';


const SocialAuth = ({ onSuccess }) => {
  const [loadingProvider, setLoadingProvider] = useState(null);

  const socialProviders = [
    {
      id: 'google',
      name: 'Google',
      icon: 'Chrome',
      color: 'hover:bg-red-50 hover:border-red-200',
      textColor: 'text-red-600'
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: 'Github',
      color: 'hover:bg-gray-50 hover:border-gray-200',
      textColor: 'text-gray-700'
    }
  ];

  const handleSocialLogin = async (providerId) => {
    setLoadingProvider(providerId);
    
    // Simulate OAuth flow
    setTimeout(() => {
      onSuccess?.();
      setLoadingProvider(null);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-card text-text-secondary">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {socialProviders?.map((provider) => (
          <motion.div
            key={provider?.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              size="lg"
              fullWidth
              loading={loadingProvider === provider?.id}
              iconName={provider?.icon}
              iconPosition="left"
              onClick={() => handleSocialLogin(provider?.id)}
              className={`${provider?.color} transition-all duration-200`}
            >
              <span className={provider?.textColor}>
                Continue with {provider?.name}
              </span>
            </Button>
          </motion.div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-xs text-text-secondary">
          By signing up, you agree to our{' '}
          <button className="text-primary hover:text-primary/80 transition-colors duration-200">
            Terms of Service
          </button>{' '}
          and{' '}
          <button className="text-primary hover:text-primary/80 transition-colors duration-200">
            Privacy Policy
          </button>
        </p>
      </div>
    </div>
  );
};

export default SocialAuth;