import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useShoppingList } from '../context/ShoppingListContext';
import { usePlanner } from '../context/PlannerContext';
import { CategoriaIngrediente, ItemListaCompras } from '../types/shopping';
import { ModalAdicionarEditarItem } from '../components/ModalAdicionarEditarItem';

type ThemeType = 'light' | 'dark';

interface ShoppingListScreenProps {
  theme?: ThemeType;
  toggleTheme?: () => void;
  onNavigate?: (s: any) => void;
}

const CONFIG_CATEGORIAS: Record<CategoriaIngrediente, { emoji: string; color: string; bg: string }> = {
  Hortifruti: { emoji: '🥦', color: '#4A7A4A', bg: '#EEF5EE' },
  Carnes: { emoji: '🥩', color: '#9A4A2E', bg: '#F9EEE9' },
  Laticínios: { emoji: '🧀', color: '#8A7A2E', bg: '#F8F5E6' },
  Mercearia: { emoji: '🌾', color: '#7A5C3E', bg: '#F5EDE2' },
  Bebidas: { emoji: '🥤', color: '#3E6A8A', bg: '#E6EFF5' },
  Outros: { emoji: '🛒', color: '#6B5744', bg: '#F0EAE0' },
};

const CATEGORIAS: CategoriaIngrediente[] = [
  'Hortifruti',
  'Carnes',
  'Laticínios',
  'Mercearia',
  'Bebidas',
  'Outros',
];

export default function ShoppingListScreen({ theme = 'dark', toggleTheme }: ShoppingListScreenProps) {
  const isDark = theme === 'dark';
  const {
    itens,
    alternarComprado,
    removerItem,
    limparComprados,
    removerSelecionadosApenas,
    adicionarItemManual,
    editarItemManual,
    gerarDoPlanejamentoSemanal,
    alternarSelecionarTodos,
  } = useShoppingList();

  const { plano } = usePlanner();

  const [modalVisivel, setModalVisivel] = useState(false);
  const [itemEditando, setItemEditando] = useState<ItemListaCompras | null>(null);

  const total = itens.length;
  const comprados = itens.filter((i) => i.comprado).length;
  const pendentes = total - comprados;
  const estaVazio = total === 0;
  const todosSelecionados = total > 0 && comprados === total;

  const handleSalvarItem = (dados: Omit<ItemListaCompras, 'id' | 'comprado'>) => {
    if (itemEditando) {
      editarItemManual(itemEditando.id, dados);
    } else {
      adicionarItemManual(dados);
    }
    setItemEditando(null);
  };

  const agrupados = React.useMemo(() => {
    return CATEGORIAS.reduce<Record<CategoriaIngrediente, ItemListaCompras[]>>((acc, cat) => {
      acc[cat] = itens.filter((i) => i.categoria === cat);
      return acc;
    }, {} as Record<CategoriaIngrediente, ItemListaCompras[]>);
  }, [itens]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#0D1912' : '#FAF8F5' }]}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.subtitulo, { color: isDark ? '#A2B3A7' : '#6B8C6B' }]}>Sabores Planejados</Text>
          <Text style={[styles.titulo, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>Lista de compras</Text>
          <Text style={[styles.descricao, { color: isDark ? '#A2B3A7' : '#8C7A6B' }]}>Organize os ingredientes das suas receitas.</Text>
        </View>

        {!estaVazio && (
          <View style={[styles.badgePendentes, { backgroundColor: pendentes > 0 ? '#2E4A2E' : '#6B8C6B' }]}>
            <Text style={styles.textoBadgePendentes}>
              {pendentes} {pendentes === 1 ? 'item' : 'itens'} para comprar
            </Text>
          </View>
        )}
      </View>

      <View style={styles.linhaAcoes}>
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={() => {
            setItemEditando(null);
            setModalVisivel(true);
          }}
        >
          <Feather name="plus" size={16} color="#FAF6F0" />
          <Text style={styles.textoBotaoAdicionar}>Adicionar item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoGerarSemana, { backgroundColor: isDark ? '#15251C' : '#FFFFFF', borderColor: isDark ? '#2D4536' : '#DDD4C8' }]}
          onPress={() => gerarDoPlanejamentoSemanal(plano)}
        >
          <Feather name="zap" size={16} color={isDark ? '#FAF6F0' : '#2C2016'} />
          <Text style={[styles.textoBotaoGerar, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>Gerar da semana</Text>
        </TouchableOpacity>
      </View>

      {!estaVazio && (
        <View style={[styles.caixaResumo, { backgroundColor: isDark ? '#15251C' : '#FFFFFF', borderColor: isDark ? '#2D4536' : '#DDD4C8' }]}>
          <View style={styles.itemResumo}>
            <Text style={[styles.numResumo, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>{total}</Text>
            <Text style={[styles.labelResumo, { color: isDark ? '#A2B3A7' : '#8C7A6B' }]}>itens</Text>
          </View>
          <View style={[styles.divisorVertical, { backgroundColor: isDark ? '#2D4536' : '#DDD4C8' }]} />
          <View style={styles.itemResumo}>
            <Text style={[styles.numResumo, { color: '#6B8C6B' }]}>{comprados}</Text>
            <Text style={[styles.labelResumo, { color: isDark ? '#A2B3A7' : '#8C7A6B' }]}>comprados</Text>
          </View>
          <View style={[styles.divisorVertical, { backgroundColor: isDark ? '#2D4536' : '#DDD4C8' }]} />
          <View style={styles.itemResumo}>
            <Text style={[styles.numResumo, { color: '#C46B3E' }]}>{pendentes}</Text>
            <Text style={[styles.labelResumo, { color: isDark ? '#A2B3A7' : '#8C7A6B' }]}>pendentes</Text>
          </View>

          <View style={styles.acoesEmMassa}>
            <TouchableOpacity 
              style={[styles.botaoSelecionarTodos, { backgroundColor: isDark ? '#1F3427' : '#EEF5EE' }]} 
              onPress={() => alternarSelecionarTodos(!todosSelecionados)}
            >
              <Text style={[styles.textoSelecionarTodos, { color: isDark ? '#A2B3A7' : '#2E4A2E' }]}>
                {todosSelecionados ? 'Desmarcar' : 'Marcar todos'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Barra de Ações para Itens Marcados (Comprados) */}
      {comprados > 0 && (
        <View style={[styles.barraAcoesSelecionados, { backgroundColor: isDark ? '#16281D' : '#EEF4EE', borderColor: isDark ? '#2D4536' : '#C8DFCA' }]}>
          <Text style={[styles.textoSelecionadosCount, { color: isDark ? '#A2B3A7' : '#2E4A2E' }]}>
            {comprados} {comprados === 1 ? 'item marcado' : 'itens marcados'}
          </Text>
          
          <View style={styles.grupoBotoesAcao}>
            {/* Botão 1: Envia para a despensa e limpa da lista */}
            <TouchableOpacity 
              style={styles.botaoConfirmarComprados} 
              onPress={limparComprados}
            >
              <Feather name="box" size={13} color="#FAF6F0" />
              <Text style={styles.textoBotaoAcao}>Enviar para despensa</Text>
            </TouchableOpacity>

            {/* Botão 2 (Lixeira): Apenas remove da lista sem mandar para a despensa */}
            <TouchableOpacity 
              style={[styles.botaoLixeira, { backgroundColor: isDark ? '#38221B' : '#FDF0EB' }]} 
              onPress={removerSelecionadosApenas}
            >
              <Feather name="trash-2" size={15} color="#C46B3E" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Lista de Itens */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollLista}>
        {estaVazio ? (
          <View style={styles.emptyContainer}>
            <View style={[styles.iconeVazio, { backgroundColor: isDark ? '#15251C' : '#F0EAE0' }]}>
              <Feather name="shopping-bag" size={40} color={isDark ? '#A2B3A7' : '#8C7A6B'} />
            </View>
            <Text style={[styles.tituloVazio, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>Lista vazia</Text>
            <Text style={[styles.textoVazio, { color: isDark ? '#A2B3A7' : '#8C7A6B' }]}>
              Adicione itens manualmente ou gere uma lista a partir das suas receitas planejadas.
            </Text>
            <TouchableOpacity
              style={styles.botaoVazioAdicionar}
              onPress={() => {
                setItemEditando(null);
                setModalVisivel(true);
              }}
            >
              <Text style={styles.textoVazioAdicionar}>Adicionar item</Text>
            </TouchableOpacity>
          </View>
        ) : (
          CATEGORIAS.map((cat) => {
            const itensCat = agrupados[cat];
            if (!itensCat || itensCat.length === 0) return null;
            const config = CONFIG_CATEGORIAS[cat];

            return (
              <View key={cat} style={styles.secaoCategoria}>
                <View style={styles.cabecalhoCategoria}>
                  <View style={[styles.boxEmoji, { backgroundColor: isDark ? '#1B2E22' : config.bg }]}>
                    <Text style={{ fontSize: 14 }}>{config.emoji}</Text>
                  </View>
                  <Text style={[styles.tituloCategoria, { color: config.color }]}>{cat}</Text>
                  <View style={[styles.linhaDivisoraCat, { backgroundColor: isDark ? '#233A2C' : '#DDD4C8' }]} />
                  <Text style={[styles.contadorCat, { color: isDark ? '#8A9E90' : '#8C7A6B' }]}>
                    {itensCat.filter((i) => i.comprado).length}/{itensCat.length}
                  </Text>
                </View>

                <View style={[styles.cardCategoria, { backgroundColor: isDark ? '#15251C' : '#FFFFFF', borderColor: isDark ? '#233A2C' : '#DDD4C8' }]}>
                  {itensCat.map((item, idx) => (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      onPress={() => alternarComprado(item.id)}
                      style={[
                        styles.linhaItem,
                        idx < itensCat.length - 1 && [styles.borderBottomItem, { borderBottomColor: isDark ? '#233A2C' : '#EFEBE4' }],
                        item.comprado && { backgroundColor: isDark ? '#101E16' : '#FAFAF8' },
                      ]}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          { borderColor: isDark ? '#3E5446' : '#C4B4A4' },
                          item.comprado && { backgroundColor: '#6B8C6B', borderColor: '#6B8C6B' },
                        ]}
                      >
                        {item.comprado && <Feather name="check" size={12} color="#FAF6F0" />}
                      </View>

                      <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={() => {
                          setItemEditando(item);
                          setModalVisivel(true);
                        }}
                      >
                        <Text
                          style={[
                            styles.nomeItem,
                            { color: isDark ? '#FAF6F0' : '#2C2016' },
                            item.comprado && [styles.textoRiscado, { color: isDark ? '#687B6E' : '#B8A898' }],
                          ]}
                        >
                          {item.nome}
                        </Text>
                        <Text style={[styles.qtdItem, { color: isDark ? '#A2B3A7' : '#8C7A6B' }]}>
                          {item.quantidade} {item.unidade}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        onPress={() => removerItem(item.id)} 
                        style={[styles.botaoLixo, { backgroundColor: isDark ? '#1F3427' : '#F5F0EB' }]}
                      >
                        <Feather name="trash-2" size={14} color="#C46B3E" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Modal */}
      <ModalAdicionarEditarItem
        visivel={modalVisivel}
        itemParaEditar={itemEditando}
        onFechar={() => setModalVisivel(false)}
        onSalvar={handleSalvarItem}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 22, paddingTop: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTextContainer: {
    flexShrink: 1, 
    marginRight: 12,
  },
  subtitulo: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase' },
  titulo: { fontSize: 24, fontWeight: 'bold' },
  descricao: { fontSize: 13, marginTop: 2 },
  badgePendentes: { 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    borderRadius: 16, 
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  textoBadgePendentes: { color: '#FAF6F0', fontSize: 12, fontWeight: 'bold' },
  linhaAcoes: { flexDirection: 'row', gap: 10, paddingHorizontal: 22, marginTop: 14 },
  botaoAdicionar: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: '#2E4A2E', borderRadius: 14, paddingVertical: 12 },
  textoBotaoAdicionar: { color: '#FAF6F0', fontSize: 14, fontWeight: 'bold' },
  botaoGerarSemana: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderRadius: 14, paddingVertical: 12 },
  textoBotaoGerar: { fontSize: 14, fontWeight: 'bold' },
  caixaResumo: { marginHorizontal: 22, marginTop: 14, borderWidth: 1.5, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  itemResumo: { alignItems: 'center' },
  numResumo: { fontSize: 18, fontWeight: 'bold' },
  labelResumo: { fontSize: 11 },
  divisorVertical: { width: 1, height: 24 },
  acoesEmMassa: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  botaoSelecionarTodos: { paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8 },
  textoSelecionarTodos: { fontSize: 10, fontWeight: 'bold' },
  barraAcoesSelecionados: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 22,
    marginTop: 12,
    borderWidth: 1.2,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  textoSelecionadosCount: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  grupoBotoesAcao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  botaoConfirmarComprados: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2E4A2E',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  textoBotaoAcao: {
    color: '#FAF6F0',
    fontSize: 11.5,
    fontWeight: 'bold',
  },
  botaoLixeira: {
    padding: 7,
    borderRadius: 10,
  },
  scrollLista: { paddingHorizontal: 22, paddingTop: 16, paddingBottom: 40 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  iconeVazio: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  tituloVazio: { fontSize: 18, fontWeight: 'bold' },
  textoVazio: { fontSize: 13, textAlign: 'center', maxWidth: 260, marginTop: 6 },
  botaoVazioAdicionar: { backgroundColor: '#2E4A2E', borderRadius: 20, paddingHorizontal: 24, paddingVertical: 12, marginTop: 16 },
  textoVazioAdicionar: { color: '#FAF6F0', fontSize: 14, fontWeight: 'bold' },
  secaoCategoria: { marginBottom: 18 },
  cabecalhoCategoria: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  boxEmoji: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  tituloCategoria: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  linhaDivisoraCat: { flex: 1, height: 1 },
  contadorCat: { fontSize: 11 },
  cardCategoria: { borderRadius: 16, borderWidth: 1.5, overflow: 'hidden' },
  linhaItem: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  borderBottomItem: { borderBottomWidth: 1 },
  checkbox: { width: 22, height: 22, borderRadius: 6, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  nomeItem: { fontSize: 14, fontWeight: '600' },
  textoRiscado: { textDecorationLine: 'line-through' },
  qtdItem: { fontSize: 12, marginTop: 2 },
  botaoLixo: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
});