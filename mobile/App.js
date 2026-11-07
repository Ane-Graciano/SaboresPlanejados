import React, { useState } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { PlannerProvider } from './src/context/PlannerContext';
import { ShoppingListProvider } from './src/context/ShoppingListContext';
import { PantryProvider } from './src/context/PantryContext';
import { TimerProvider } from './src/context/TimerContext'; 

export default function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <PantryProvider>
      <PlannerProvider>
        <ShoppingListProvider>
          <TimerProvider>
            <AppNavigator theme={theme} toggleTheme={toggleTheme} />
          </TimerProvider>
        </ShoppingListProvider>
      </PlannerProvider>
    </PantryProvider>
  );
}