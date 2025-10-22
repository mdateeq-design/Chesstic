import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface SettingsContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
}

export const SettingsContext = createContext<SettingsContextType>({
  isSoundEnabled: true,
  toggleSound: () => {},
});

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    try {
      const item = window.localStorage.getItem('gamehub-sound');
      return item ? JSON.parse(item) : true;
    } catch (error) {
      console.error(error);
      return true;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('gamehub-sound', JSON.stringify(isSoundEnabled));
    } catch (error) {
      console.error(error);
    }
  }, [isSoundEnabled]);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled(prev => !prev);
  }, []);

  return (
    <SettingsContext.Provider value={{ isSoundEnabled, toggleSound }}>
      {children}
    </SettingsContext.Provider>
  );
};
