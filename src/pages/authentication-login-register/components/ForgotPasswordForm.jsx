import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ForgotPasswordForm = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/?.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setIsSuccess(true);
      setIsLoading(false);
      onSuccess?.();
    }, 2000);
  };

  const handleChange = (e) => {
    setEmail(e?.target?.value);
    if (error) {
      setError('');
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
          <Icon name="CheckCircle" size={32} color="var(--color-success)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Check your email
          </h3>
          <p className="text-text-secondary text-sm">
            We've sent a password reset link to{' '}
            <span className="font-medium text-text-primary">{email}</span>
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onBack}
          iconName="ArrowLeft"
          iconPosition="left"
          className="mt-6"
        >
          Back to Sign In
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Key" size={24} color="var(--color-primary)" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Forgot your password?
        </h3>
        <p className="text-text-secondary text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm"
            >
              <div className="flex items-center space-x-2">
                <Icon name="AlertCircle" size={16} />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleChange}
          error={error}
          required
          disabled={isLoading}
        />

        <div className="space-y-3">
          <Button
            type="submit"
            variant="default"
            size="lg"
            fullWidth
            loading={isLoading}
            iconName="Send"
            iconPosition="left"
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="lg"
            fullWidth
            onClick={onBack}
            iconName="ArrowLeft"
            iconPosition="left"
            disabled={isLoading}
          >
            Back to Sign In
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ForgotPasswordForm;