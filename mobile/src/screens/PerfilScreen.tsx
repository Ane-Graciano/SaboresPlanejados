import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';

import ProfileHeaderCard from '../components/ProfileHeaderCard';
import ProfileStatsRow from '../components/ProfileStatsRow';
import ProfileMenuList from '../components/ProfileMenuList';
import LogoutModal from '../components/LogoutModal';

import { getFavoritos } from '../utils/storage';
import { auth } from '../services/authService';

const USER_DATA = {
  nome: 'Ana Elize',
  email: 'ana@example.com',
  avatarLetra: 'A',
  planejadasCount: 0,
  salvasCount: 0,
};

export default function PerfilScreen({
  navigation,
  theme,
  toggleTheme,
}: any) {
  const [favoritosCount, setFavoritosCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarTotalFavoritos();
    });

    return unsubscribe;
  }, [navigation]);

  const carregarTotalFavoritos = async () => {
    const favs = await getFavoritos();
    setFavoritosCount(favs ? favs.length : 0);
  };

  const handleNavigateFavoritos = () => {
    navigation.navigate('Favoritos');
  };

  const handleConfirmLogout = async () => {
    try {
      await signOut(auth);
      setShowLogoutModal(false);
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#0D1912' : '#FBF8F3',
        },
      ]}
    >
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeaderCard
          user={USER_DATA}
          isDark={isDark}
          onEdit={() => console.log('Editar perfil')}
        />

        <ProfileStatsRow
          favoritosCount={favoritosCount}
          planejadasCount={USER_DATA.planejadasCount}
          salvasCount={USER_DATA.salvasCount}
          onNavigateFavoritos={handleNavigateFavoritos}
          isDark={isDark}
        />

        <ProfileMenuList
          onNavigateFavoritos={handleNavigateFavoritos}
          onOpenLogoutModal={() => setShowLogoutModal(true)}
          onDirectLogout={handleConfirmLogout}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      </ScrollView>

      <LogoutModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isDark={isDark}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },
});