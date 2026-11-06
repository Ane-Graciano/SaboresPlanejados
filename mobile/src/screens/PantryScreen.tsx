import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { usePantry } from '../context/PantryContext';
import { buscarTodasReceitas } from '../services/receitaApiService';
import { Receita } from '../model/receita';
import { CategoriaIngrediente } from '../types/shopping';
import { ItemDespensa } from '../types/pantry';
import { ModalAdicionarEditarDespensa } from '../components/ModalAdicionarEditarDespensa';

type ThemeType = 'light' | 'dark';

interface PantryScreenProps {
  theme?: ThemeType;
  onNavigate?: (screenName: string, params?: any) => void;
  navigation?: any;
}

const CONFIG_CATEGORIAS: Record<CategoriaIngrediente, { emoji: string; color: string; bg: string }> = {
  Hortifruti: { emoji: '🥦', color: '#4A7A4A', bg: '#EEF5EE' },
  Carnes: { emoji: '🥩', color: '#9A4A2E', bg: '#F9EEE9' },
  Laticínios: { emoji: '🧀', color: '#8A7A2E', bg: '#F8F5E6' },
  Mercearia: { emoji: '🌾', color: '#7A5C3E', bg: '#F5EDE2' },
  Bebidas: { emoji: '🥤', color: '#3E6A8A', bg: '#E6EFF5' },
  Outros: { emoji: '📦', color: '#6B5744', bg: '#F0EAE0' },
};

const CATEGORIAS: CategoriaIngrediente[] = [
  'Hortifruti',
  'Carnes',
  'Laticínios',
  'Mercearia',
  'Bebidas',
  'Outros',
];

const TABS_FILTRO = ['Todos', ...CATEGORIAS];

export default function PantryScreen({ onNavigate, navigation, theme = 'dark' }: PantryScreenProps) {
  const isDark = theme === 'dark';
  const { itens, adicionarItem, editarItem, removerItem, calcularMatchReceita } = usePantry();

  const [listaReceitas, setListaReceitas] = useState<Receita[]>([]);
  const [carregandoReceitas, setCarregandoReceitas] = useState(true);
  const [busca, setBusca] = useState('');
  const [tabAtiva, setTabAtiva] = useState('Todos');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [itemEditando, setItemEditando] = useState<ItemDespensa | null>(null);
  const [mostrarReceitas, setMostrarReceitas] = useState(false);

  useEffect(() => {
    async function carregarReceitasDoBackend() {
      try {
        setCarregandoReceitas(true);
        const dados = await buscarTodasReceitas();
        setListaReceitas(dados);
      } catch (error) {
        console.error('Erro ao buscar receitas para a despensa:', error);
      } finally {
        setCarregandoReceitas(false);
      }
    }
    carregarReceitasDoBackend();
  }, []);

  const visiveis = useMemo(() => {
    return itens.filter((ing) => {
      const matchCat = tabAtiva === 'Todos' || ing.categoria === tabAtiva;
      const matchBusca = ing.nome.toLowerCase().includes(busca.toLowerCase());
      return matchCat && matchBusca;
    });
  }, [itens, tabAtiva, busca]);

  const agrupados = useMemo(() => {
    return CATEGORIAS.reduce<Record<CategoriaIngrediente, ItemDespensa[]>>((acc, cat) => {
      acc[cat] = visiveis.filter((i) => i.categoria === cat);
      return acc;
    }, {} as Record<CategoriaIngrediente, ItemDespensa[]>);
  }, [visiveis]);

  const matchesReceitas = useMemo(() => {
    return listaReceitas.map((r: Receita) => ({
      receita: r,
      match: calcularMatchReceita(r),
    })).sort((a: any, b: any) => b.match.percentualMatch - a.match.percentualMatch);
  }, [itens, listaReceitas, calcularMatchReceita]);

  const prontasParaFazer = matchesReceitas.filter((m: any) => m.match.podeCozinharIntegralmente);
  const quaseProntas = matchesReceitas.filter((m: any) => !m.match.podeCozinharIntegralmente && m.match.itensPossuidos > 0);

  const handleSalvar = (dados: Omit<ItemDespensa, 'id'>) => {
    if (itemEditando) {
      editarItem(itemEditando.id, dados);
    } else {
      adicionarItem(dados);
    }
    setItemEditando(null);
  };

  const navegarParaDetalhes = (receita: Receita) => {
    if (onNavigate) {
      onNavigate('Detalhes', { receita });
    } else if (navigation) {
      navigation.navigate('Detalhes', { receita });
    }
  };

  const estaVazio = itens.length === 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1912' : '#FAF8F5' }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.subtitulo, { color: isDark ? '#A2B3A7' : '#6B8C6B' }]}>Sabores Planejados</Text>
          <Text style={[styles.titulo, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>Minha despensa</Text>
          <Text style={[styles.descricao, { color: isDark ? '#A2B3A7' : '#8C7A6B' }]}>
            Veja o que você já tem em casa e descubra o que pode preparar.
          </Text>
        </View>

        {!estaVazio && (
          <View style={[styles.badgeContador, { backgroundColor: isDark ? '#15251C' : '#F0EAE0', borderColor: isDark ? '#2D4536' : '#DDD4C8' }]}>
            <Text style={[styles.textoBadgeContador, { color: isDark ? '#FAF6F0' : '#6B5744' }]}>{itens.length} itens</Text>
          </View>
        )}
      </View>

      {/* Busca */}
      {!estaVazio && (
        <View style={styles.containerBusca}>
          <View style={[styles.caixaInput, { backgroundColor: isDark ? '#15251C' : '#FFFFFF', borderColor: isDark ? '#2D4536' : '#DDD4C8' }]}>
            <Feather name="search" size={15} color={isDark ? '#8A9E90' : '#9B8574'} />
            <TextInput
              style={[styles.inputBusca, { color: isDark ? '#FAF6F0' : '#2C2016' }]}
              placeholder="Buscar ingrediente"
              placeholderTextColor={isDark ? '#687B6E' : '#B8A898'}
              value={busca}
              onChangeText={setBusca}
            />
            {busca !== '' && (
              <TouchableOpacity onPress={() => setBusca('')}>
                <Feather name="x" size={15} color={isDark ? '#8A9E90' : '#9B8574'} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Tabs Filtro Compactos */}
      {!estaVazio && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollTabs}>
          {TABS_FILTRO.map((tab) => {
            const ativa = tab === tabAtiva;
            return (
              <TouchableOpacity
                key={tab}
                onPress={() => setTabAtiva(tab)}
                style={[
                  styles.tabChip,
                  ativa && styles.tabChipAtiva,
                  {
                    backgroundColor: ativa ? '#2E4A2E' : isDark ? '#15251C' : '#FFFFFF',
                    borderColor: ativa ? '#2E4A2E' : isDark ? '#2D4536' : '#DDD4C8',
                  },
                ]}
              >
                <Text numberOfLines={1} style={[styles.textoTabChip, ativa && styles.textoTabChipAtivo, { color: ativa ? '#FAF6F0' : isDark ? '#A2B3A7' : '#6B5744' }]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Conteúdo */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {estaVazio ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.iconeVazio, { backgroundColor: isDark ? '#15251C' : '#F0EAE0' }]}>
              <Feather name="box" size={36} color={isDark ? '#A2B3A7' : '#8C7A6B'} />
            </View>
            <Text style={[styles.tituloVazio, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>Sua despensa está vazia</Text>
            <Text style={[styles.textoVazio, { color: isDark ? '#A2B3A7' : '#8C7A6B' }]}>
              Adicione os ingredientes que você já tem em casa para descobrir novas receitas.
            </Text>
            <TouchableOpacity
              style={styles.botaoVazioAdicionar}
              onPress={() => {
                setItemEditando(null);
                setModalVisivel(true);
              }}
            >
              <Text style={styles.textoVazioAdicionar}>Adicionar ingrediente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.botaoAdicionar}
              onPress={() => {
                setItemEditando(null);
                setModalVisivel(true);
              }}
            >
              <Feather name="plus" size={15} color="#FAF6F0" />
              <Text style={styles.textoBotaoAdicionar}>Adicionar ingrediente</Text>
            </TouchableOpacity>

            {/* Categorias */}
            {CATEGORIAS.map((cat) => {
              const itensCat = agrupados[cat];
              if (!itensCat || itensCat.length === 0) return null;
              const config = CONFIG_CATEGORIAS[cat];

              return (
                <View key={cat} style={styles.secaoCategoria}>
                  <View style={styles.cabecalhoCategoria}>
                    <View style={[styles.boxEmoji, { backgroundColor: isDark ? '#1B2E22' : config.bg }]}>
                      <Text style={{ fontSize: 13 }}>{config.emoji}</Text>
                    </View>
                    <Text style={[styles.tituloCategoria, { color: config.color }]}>{cat}</Text>
                    <View style={[styles.linhaDivisoraCat, { backgroundColor: isDark ? '#233A2C' : '#DDD4C8' }]} />
                    <Text style={[styles.contadorCat, { color: isDark ? '#8A9E90' : '#8C7A6B' }]}>
                      {itensCat.length} {itensCat.length === 1 ? 'item' : 'itens'}
                    </Text>
                  </View>

                  <View style={[styles.cardCategoria, { backgroundColor: isDark ? '#15251C' : '#FFFFFF', borderColor: isDark ? '#233A2C' : '#DDD4C8' }]}>
                    {itensCat.map((item, idx) => (
                      <View
                        key={item.id}
                        style={[
                          styles.linhaItem,
                          idx < itensCat.length - 1 && [styles.borderBottomItem, { borderBottomColor: isDark ? '#233A2C' : '#EFEBE4' }],
                        ]}
                      >
                        <View style={[styles.dotCategoria, { backgroundColor: config.color }]} />

                        <View style={{ flex: 1 }}>
                          <Text style={[styles.nomeItem, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>{item.nome}</Text>
                          <Text style={[styles.qtdItem, { color: isDark ? '#A2B3A7' : '#8C7A6B' }]}>{item.quantidade} {item.unidade}</Text>
                        </View>

                        <View style={styles.acoesItem}>
                          <TouchableOpacity
                            style={[styles.botaoAcao, { backgroundColor: isDark ? '#1F3427' : '#F0EAE0' }]}
                            onPress={() => {
                              setItemEditando(item);
                              setModalVisivel(true);
                            }}
                          >
                            <Feather name="edit-2" size={12} color={isDark ? '#A2B3A7' : '#6B5744'} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[styles.botaoAcao, { backgroundColor: isDark ? '#38221B' : '#FDF0EB' }]}
                            onPress={() => removerItem(item.id)}
                          >
                            <Feather name="trash-2" size={12} color="#C46B3E" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}

            {/* Seção "O que posso cozinhar?" */}
            {tabAtiva === 'Todos' && busca === '' && (
              <View style={styles.secaoSugestao}>
                <View style={styles.cabecalhoSugestao}>
                  <View>
                    <Text style={[styles.tituloSugestao, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>O que posso cozinhar?</Text>
                    <Text style={[styles.subtituloSugestao, { color: isDark ? '#A2B3A7' : '#8C7A6B' }]}>Com o que você tem em casa agora</Text>
                  </View>
                  <TouchableOpacity onPress={() => setMostrarReceitas(!mostrarReceitas)}>
                    <Text style={styles.textoToggleSugestao}>
                      {mostrarReceitas ? 'Fechar' : 'Ver receitas'}
                    </Text>
                  </TouchableOpacity>
                </View>

                {carregandoReceitas ? (
                  <ActivityIndicator size="small" color="#6B8C6B" style={{ marginVertical: 20 }} />
                ) : !mostrarReceitas ? (
                  <TouchableOpacity
                    style={[styles.bannerCozinhar, { backgroundColor: isDark ? '#15251C' : '#EEF4EE', borderColor: isDark ? '#233A2C' : '#C8DFCA' }]}
                    onPress={() => setMostrarReceitas(true)}
                  >
                    <View style={styles.boxIconeBanner}>
                      <Text style={{ fontSize: 18 }}>🍳</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.tituloBanner, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>
                        {prontasParaFazer.length} receitas prontas para fazer
                      </Text>
                      <Text style={[styles.descBanner, { color: isDark ? '#82B382' : '#4A7A4A' }]}>
                        + {quaseProntas.length} quase completas
                      </Text>
                    </View>
                    <Feather name="chevron-right" size={18} color={isDark ? '#82B382' : '#6B8C6B'} />
                  </TouchableOpacity>
                ) : (
                  <View style={styles.listaSugestoes}>
                    {matchesReceitas.map(({ receita, match }: { receita: Receita; match: any }) => (
                      <TouchableOpacity
                        key={receita.id}
                        style={[
                          styles.cardReceitaSugestao,
                          {
                            backgroundColor: isDark ? '#15251C' : '#FFFFFF',
                            borderColor: match.podeCozinharIntegralmente
                              ? (isDark ? '#2D4536' : '#C8DFCA')
                              : (isDark ? '#233A2C' : '#DDD4C8'),
                          },
                          match.podeCozinharIntegralmente && { backgroundColor: isDark ? '#13221A' : '#EEF4EE' },
                        ]}
                        onPress={() => navegarParaDetalhes(receita)}
                      >
                        <Feather
                          name={match.podeCozinharIntegralmente ? 'check-circle' : 'alert-circle'}
                          size={17}
                          color={match.podeCozinharIntegralmente ? '#6B8C6B' : '#C46B3E'}
                        />

                        <View style={{ flex: 1 }}>
                          <Text style={[styles.nomeReceitaSugestao, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>{receita.titulo}</Text>
                          <Text style={[styles.statusReceitaSugestao, { color: match.podeCozinharIntegralmente ? '#6B8C6B' : '#C46B3E' }]}>
                            {match.podeCozinharIntegralmente
                              ? 'Você tem todos os ingredientes ✓'
                              : `Faltam ${match.faltandoCount} ingredientes`}
                          </Text>
                        </View>

                        <View style={styles.barraProgressoContainer}>
                          <View style={[styles.trilhoProgresso, { backgroundColor: isDark ? '#233A2C' : '#DDD4C8' }]}>
                            <View
                              style={[
                                styles.preenchimentoProgresso,
                                {
                                  width: `${match.percentualMatch}%`,
                                  backgroundColor: match.podeCozinharIntegralmente ? '#6B8C6B' : '#C46B3E',
                                },
                              ]}
                            />
                          </View>
                          <Text style={[styles.textoProgresso, { color: match.podeCozinharIntegralmente ? '#6B8C6B' : '#C46B3E' }]}>
                            {match.itensPossuidos}/{match.totalItens}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Modal Adicionar/Editar */}
      <ModalAdicionarEditarDespensa
        visivel={modalVisivel}
        itemParaEditar={itemEditando}
        onFechar={() => setModalVisivel(false)}
        onSalvar={handleSalvar}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTextContainer: { flexShrink: 1, marginRight: 12 },
  subtitulo: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' },
  titulo: { fontSize: 22, fontWeight: 'bold' },
  descricao: { fontSize: 12.5, marginTop: 2 },
  badgeContador: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 3, marginTop: 4 },
  textoBadgeContador: { fontSize: 11.5, fontWeight: 'bold' },
  containerBusca: { paddingHorizontal: 20, marginTop: 12 },
  caixaInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1.2,
  },
  inputBusca: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 2,
  },
  scrollTabs: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 6,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1.2,
    alignSelf: 'flex-start',
    flexShrink: 0,
    marginRight: 6,
  },
  textoTabChip: {
    fontSize: 12.5,
    fontWeight: '500'
  },
  tabChipAtiva: {
    borderWidth: 0,
  },
  textoTabChipAtivo: {
    fontWeight: '700',
  },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  botaoAdicionar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#2E4A2E', borderRadius: 12, paddingVertical: 11, marginBottom: 16 },
  textoBotaoAdicionar: { color: '#FAF6F0', fontSize: 13.5, fontWeight: 'bold' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 50 },
  iconeVazio: { width: 70, height: 70, borderRadius: 35, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  tituloVazio: { fontSize: 17, fontWeight: 'bold' },
  textoVazio: { fontSize: 12.5, textAlign: 'center', maxWidth: 250, marginTop: 6, lineHeight: 18 },
  botaoVazioAdicionar: { backgroundColor: '#2E4A2E', borderRadius: 18, paddingHorizontal: 20, paddingVertical: 10, marginTop: 14 },
  textoVazioAdicionar: { color: '#FAF6F0', fontSize: 13.5, fontWeight: 'bold' },
  secaoCategoria: { marginBottom: 16 },
  cabecalhoCategoria: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 },
  boxEmoji: { width: 26, height: 26, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  tituloCategoria: { fontSize: 11.5, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  linhaDivisoraCat: { flex: 1, height: 1 },
  contadorCat: { fontSize: 11 },
  cardCategoria: { borderRadius: 14, borderWidth: 1.2, overflow: 'hidden' },
  linhaItem: { flexDirection: 'row', alignItems: 'center', padding: 10, gap: 10 },
  borderBottomItem: { borderBottomWidth: 1 },
  dotCategoria: { width: 7, height: 7, borderRadius: 3.5, opacity: 0.8 },
  nomeItem: { fontSize: 13.5, fontWeight: '600' },
  qtdItem: { fontSize: 11.5, marginTop: 2 },
  acoesItem: { flexDirection: 'row', gap: 5 },
  botaoAcao: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  secaoSugestao: { marginTop: 8, marginBottom: 20 },
  cabecalhoSugestao: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  tituloSugestao: { fontSize: 16, fontWeight: 'bold' },
  subtituloSugestao: { fontSize: 11.5, marginTop: 1 },
  textoToggleSugestao: { fontSize: 12.5, fontWeight: 'bold', color: '#C46B3E' },
  bannerCozinhar: { borderWidth: 1.2, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10 },
  boxIconeBanner: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#2E4A2E', alignItems: 'center', justifyContent: 'center' },
  tituloBanner: { fontSize: 13.5, fontWeight: 'bold' },
  descBanner: { fontSize: 11.5, marginTop: 1 },
  listaSugestoes: { gap: 8 },
  cardReceitaSugestao: { borderWidth: 1.2, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  nomeReceitaSugestao: { fontSize: 13.5, fontWeight: 'bold' },
  statusReceitaSugestao: { fontSize: 11.5, marginTop: 2 },
  barraProgressoContainer: { width: 42, alignItems: 'center' },
  trilhoProgresso: { width: '100%', height: 3.5, borderRadius: 2, overflow: 'hidden' },
  preenchimentoProgresso: { height: '100%', borderRadius: 2 },
  textoProgresso: { fontSize: 9.5, fontWeight: 'bold', marginTop: 3 },
});