import React from 'react';
import { motion } from 'framer-motion';

const AuthCard = ({ children, title, subtitle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md mx-auto bg-card border border-border rounded-xl shadow-soft-lg p-8"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-sm"></div>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-text-primary mb-2">{title}</h1>
        {subtitle && (
          <p className="text-text-secondary text-sm">{subtitle}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
};

export default AuthCard;