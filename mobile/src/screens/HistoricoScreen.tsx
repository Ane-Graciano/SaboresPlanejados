import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../services/firebaseConfig';
import { getHistoryFromCloud, clearUserHistory } from '../services/firestoreSync';
import { buscarReceitaPorId } from '../services/receitaApiService';

export default function HistoricoScreen({ navigation, theme }: any) {
  const [historico, setHistorico] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isDark = theme === 'dark';

  const carregarHistorico = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) return;

      const dadosCloud = await getHistoryFromCloud(user.uid);
      
      // Busca os detalhes das receitas associadas ao histórico
      const itensComDetalhes = await Promise.all(
        dadosCloud.map(async (item) => {
          const receita = await buscarReceitaPorId(item.recipeId);
          return { ...item, receita };
        })
      );

      setHistorico(itensComDetalhes.filter((i) => i.receita !== null));
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', carregarHistorico);
    return unsubscribe;
  }, [navigation]);

  const handleClear = async () => {
    const user = auth.currentUser;
    if (!user) return;
    await clearUserHistory(user.uid);
    setHistorico([]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1912' : '#FBF8F3' }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={isDark ? '#FAF6F0' : '#2C2016'} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>Histórico de Receitas</Text>
        {historico.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Ionicons name="trash-outline" size={20} color="#C46B3E" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2E4A2E" />
        </View>
      ) : historico.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="time-outline" size={48} color={isDark ? '#506356' : '#94A398'} />
          <Text style={[styles.emptyText, { color: isDark ? '#A2B3A7' : '#6B5B50' }]}>
            Ainda não tens histórico registado.
          </Text>
        </View>
      ) : (
        <FlatList
          data={historico}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: isDark ? '#15251C' : '#FFFFFF', borderColor: isDark ? '#2D4536' : '#E0D7CC' }]}
              onPress={() => navigation.navigate('Detalhes', { receita: item.receita })}
            >
              <View style={styles.cardInfo}>
                <Text style={[styles.recipeTitle, { color: isDark ? '#FAF6F0' : '#2C2016' }]} numberOfLines={1}>
                  {item.receita?.titulo || 'Receita'}
                </Text>
                <Text style={[styles.tipoBadge, { color: item.tipo === 'PREPARADA' ? '#6B8C6B' : '#3E6A8A' }]}>
                  {item.tipo === 'PREPARADA' ? '🍳 Preparada' : '👀 Visualizada'}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={isDark ? '#A2B3A7' : '#8A7A6C'} />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyText: { marginTop: 12, fontSize: 14, textAlign: 'center' },
  listContent: { padding: 20, gap: 12 },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 16, borderWidth: 1.5 },
  cardInfo: { flex: 1, gap: 4 },
  recipeTitle: { fontSize: 16, fontWeight: '600' },
  tipoBadge: { fontSize: 12, fontWeight: '700' },
});