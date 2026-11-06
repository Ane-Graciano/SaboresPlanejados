import React, { useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { PlannerProvider } from './src/context/PlannerContext';
import { ShoppingListProvider } from './src/context/ShoppingListContext';
import { PantryProvider } from './src/context/PantryContext';

export default function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <PantryProvider>
      <PlannerProvider>
        <ShoppingListProvider>
          <AppNavigator theme={theme} toggleTheme={toggleTheme} />
        </ShoppingListProvider>
      </PlannerProvider>
    </PantryProvider>
  );
}