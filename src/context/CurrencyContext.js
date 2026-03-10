"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('CAD'); // Default currency
  const exchangeRate = 450; // 1 CAD = 450 FCFA (Hardcoded as requested)

  // Load preference from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('amal-currency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
  }, []);

  const toggleCurrency = () => {
    const newCurrency = currency === 'CAD' ? 'FCFA' : 'CAD';
    setCurrency(newCurrency);
    localStorage.setItem('amal-currency', newCurrency);
  };

  const formatPrice = (price) => {
    if (currency === 'FCFA') {
      const converted = Math.round(price * exchangeRate);
      return `${converted.toLocaleString()} FCFA`;
    }
    return `${price.toFixed(2)} $`;
  };

  const value = {
    currency,
    setCurrency,
    toggleCurrency,
    formatPrice,
    exchangeRate
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
