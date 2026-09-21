import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen'; // <--- Import da nova tela

const Tab = createBottomTabNavigator();

const TEMAS = {
  dark: {
    border: '#1A2B20',
    tabBg: '#0A140F',
    activeTab: '#E0E7E1',
    inactiveTab: '#506356',
  },
  light: {
    border: '#E1E8E2',
    tabBg: '#FFFFFF',
    activeTab: '#1C2820',
    inactiveTab: '#94A398',
  },
};

export default function TabNavigator({ theme, toggleTheme }) {
  const t = TEMAS[theme] || TEMAS.dark;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: t.tabBg,
          borderTopColor: t.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: t.activeTab,
        tabBarInactiveTintColor: t.inactiveTab,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '500' },
      }}
    >
      <Tab.Screen
        name="InicioTab"
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size - 2} color={color} />,
        }}
      >
        {(props) => <HomeScreen {...props} theme={theme} toggleTheme={toggleTheme} />}
      </Tab.Screen>

      <Tab.Screen
        name="Buscar"
        options={{
          tabBarLabel: 'Buscar',
          tabBarIcon: ({ color, size }) => <Feather name="search" size={size - 2} color={color} />,
        }}
      >
        {(props) => <HomeScreen {...props} theme={theme} toggleTheme={toggleTheme} />}
      </Tab.Screen>

      <Tab.Screen
        name="Perfil"
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => <Feather name="user" size={size - 2} color={color} />,
        }}
      >
        {(props) => <PerfilScreen {...props} theme={theme} toggleTheme={toggleTheme} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}