import React, { useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return <AppNavigator theme={theme} toggleTheme={toggleTheme} />;
}