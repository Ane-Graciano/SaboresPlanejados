import React, { useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { PlannerProvider } from './src/context/PlannerContext';

export default function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <PlannerProvider> 
      <AppNavigator theme={theme} toggleTheme={toggleTheme} />
    </PlannerProvider>
  );
}