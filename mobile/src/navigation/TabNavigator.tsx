import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import PerfilScreen from '../screens/PerfilScreen';
import SearchScreen from '../screens/SearchScreen';

const Tab = createBottomTabNavigator();

type ThemeType = 'light' | 'dark';

const TEMAS: Record<ThemeType, { border: string; tabBg: string; activeTab: string; inactiveTab: string }> = {
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

// 2. Interface de props para o TabNavigator
interface TabNavigatorProps {
  theme?: ThemeType;
  toggleTheme?: () => void;
}

export default function TabNavigator({ theme = 'dark', toggleTheme }: TabNavigatorProps) {
  // Acesso seguro ao objeto TEMAS
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
        {(props) => <SearchScreen {...props} theme={theme} toggleTheme={toggleTheme} />}
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