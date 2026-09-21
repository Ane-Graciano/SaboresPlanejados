import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ProfileHeaderCard from '../components/ProfileHeaderCard';
import ProfileStatsRow from '../components/ProfileStatsRow';
import ProfileMenuList from '../components/ProfileMenuList';

import { getFavoritos } from '../utils/storage';

const USER_DATA = {
  nome: 'Ana Elize',
  email: 'ana@example.com',
  avatarLetra: 'A',
  planejadasCount: 0,
  salvasCount: 0,
};

export default function PerfilScreen({ navigation, theme }) {
  const [favoritosCount, setFavoritosCount] = useState(0);
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1912' : '#FBF8F3' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <ProfileHeaderCard user={USER_DATA} isDark={isDark} />

        <ProfileStatsRow
          favoritosCount={favoritosCount}
          planejadasCount={USER_DATA.planejadasCount}
          salvasCount={USER_DATA.salvasCount}
          onNavigateFavoritos={handleNavigateFavoritos}
          isDark={isDark}
        />

        <ProfileMenuList onNavigateFavoritos={handleNavigateFavoritos} isDark={isDark} />
      </ScrollView>
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