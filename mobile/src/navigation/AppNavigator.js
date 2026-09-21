import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import TabNavigator from './TabNavigator';
import DetalhesScreen from '../screens/DetalhesScreen';
import FavoritosScreen from '../screens/FavoritosScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator({ theme, toggleTheme }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Tela com a barra de abas no rodapé */}
        <Stack.Screen name="MainTabs">
          {(props) => <TabNavigator {...props} theme={theme} toggleTheme={toggleTheme} />}
        </Stack.Screen>

        {/* Telas que abrem por cima ou navegam internamente */}
        <Stack.Screen name="Detalhes" component={DetalhesScreen} />
        <Stack.Screen name="Favoritos">
          {(props) => <FavoritosScreen {...props} theme={theme} toggleTheme={toggleTheme} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}