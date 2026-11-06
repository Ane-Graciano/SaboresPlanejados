import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/authService';

import TabNavigator from './TabNavigator';
import DetalhesScreen from '../screens/DetalhesScreen';
import FavoritosScreen from '../screens/FavoritosScreen';
import ReadingModeScreen from '../screens/ReadingModeScreen';
import PantryScreen from '../screens/PantryScreen'; // <-- Importando a tela da despensa
import { LoginScreen } from '../screens/LoginScreen';
import { SignupScreen } from '../screens/SignupScreen';
import SearchScreen from '../screens/SearchScreen';
import PlannerScreen from '../screens/PlannerScreen';

const Stack = createNativeStackNavigator();

interface AppNavigatorProps {
  theme: 'light' | 'dark';
  toggleTheme?: () => void;
}

export default function AppNavigator({
  theme,
  toggleTheme,
}: AppNavigatorProps) {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="MainTabs">
              {(props) => (
                <TabNavigator
                  {...props}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Buscar">
              {(props) => (
                <SearchScreen
                  {...props}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Planner">
              {(props) => (
                <PlannerScreen
                  {...props}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />
              )}
            </Stack.Screen>

            {/* Rota da Despensa acionada via Perfil */}
            <Stack.Screen name="Pantry">
              {(props) => (
                <PantryScreen
                  {...props}
                  theme={theme}
                  onNavigate={(screenName, params) => props.navigation.navigate(screenName, params)}
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="Detalhes"
              component={DetalhesScreen}
            />

            <Stack.Screen
              name="ReadingMode"
              component={ReadingModeScreen}
            />

            <Stack.Screen name="Favoritos">
              {(props) => (
                <FavoritosScreen
                  {...props}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Login">
              {(props) => (
                <LoginScreen
                  {...props}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="SignUp">
              {(props) => (
                <SignupScreen
                  {...props}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}