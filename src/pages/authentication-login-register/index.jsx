import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import AuthCard from './components/AuthCard';
import AuthTabs from './components/AuthTabs';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SocialAuth from './components/SocialAuth';
import ForgotPasswordForm from './components/ForgotPasswordForm';

const AuthenticationPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowForgotPassword(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setActiveTab('login');
  };

  const handleAuthSuccess = () => {
    // Success handling is done in individual forms
    console.log('Authentication successful');
  };

  const getCardTitle = () => {
    if (showForgotPassword) return 'Reset Password';
    return activeTab === 'login' ? 'Welcome Back' : 'Join Palette Pigeon';
  };

  const getCardSubtitle = () => {
    if (showForgotPassword) return 'Recover your account access';
    return activeTab === 'login' ?'Sign in to your collaborative workspace' :'Create your team workspace';
  };

  return (
    <>
      <Helmet>
        <title>Authentication - Palette Pigeon</title>
        <meta name="description" content="Sign in or create your account to access collaborative color palette design tools with real-time team collaboration and accessibility validation." />
      </Helmet>
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-accent rounded-full blur-2xl"></div>
          <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-success rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-warning rounded-full blur-2xl"></div>
        </div>

        {/* Main Authentication Card */}
        <div className="w-full max-w-md relative z-10">
          <AuthCard 
            title={getCardTitle()} 
            subtitle={getCardSubtitle()}
          >
            <AnimatePresence mode="wait">
              {showForgotPassword ? (
                <motion.div
                  key="forgot-password"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ForgotPasswordForm
                    onBack={handleBackToLogin}
                    onSuccess={handleAuthSuccess}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="auth-forms"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <AuthTabs 
                    activeTab={activeTab} 
                    onTabChange={handleTabChange} 
                  />

                  <AnimatePresence mode="wait">
                    {activeTab === 'login' ? (
                      <motion.div
                        key="login"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <LoginForm
                          onForgotPassword={handleForgotPassword}
                          onSuccess={handleAuthSuccess}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="register"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <RegisterForm onSuccess={handleAuthSuccess} />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <SocialAuth onSuccess={handleAuthSuccess} />
                </motion.div>
              )}
            </AnimatePresence>
          </AuthCard>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center mt-8 text-xs text-text-secondary"
          >
            <p>
              © {new Date()?.getFullYear()} Palette Pigeon. All rights reserved.
            </p>
            <p className="mt-1">
              Collaborative color design made accessible.
            </p>
          </motion.div>
        </div>

        {/* Mobile Optimization */}
        <style jsx>{`
          @media (max-width: 640px) {
            .min-h-screen {
              padding: 1rem;
            }
          }
          
          @media (max-height: 700px) {
            .min-h-screen {
              padding: 0.5rem;
              align-items: flex-start;
              padding-top: 2rem;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default AuthenticationPage;