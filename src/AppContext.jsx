import React, { createContext, useState, useContext } from 'react';
import { translations } from './translations';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');
  
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    phone: '',
    foodPreference: '', // Default to empty to enforce selection
    photoFrame: 'No',
    photoFrameName: '',
    photoFramePhone: '',
    photoFrameAddress: '',
    adults: 0, // Default to 0
    children: 0,
  });

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const t = (key) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <AppContext.Provider value={{ formData, updateFormData, language, setLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
