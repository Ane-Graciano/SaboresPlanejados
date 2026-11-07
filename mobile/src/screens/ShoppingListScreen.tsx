
import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useShoppingList } from '../context/ShoppingListContext';
import { usePlanner } from '../context/PlannerContext';
import {
  CategoriaIngrediente,
  ItemListaCompras,
} from '../types/shopping';
import { ModalAdicionarEditarItem } from '../components/ModalAdicionarEditarItem';
import { ModalSelecionarEstabelecimento } from '../components/ModalSelecionarEstabelecimento';

type ThemeType = 'light' | 'dark';

interface ShoppingListScreenProps {
  theme?: ThemeType;
  toggleTheme?: () => void;
  onNavigate?: (s: any) => void;
}

const CONFIG_CATEGORIAS: Record<
  CategoriaIngrediente,
  { emoji: string; color: string; bg: string }
> = {
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

export default function ShoppingListScreen({
  theme = 'dark',
}: ShoppingListScreenProps) {
  const isDark = theme === 'dark';

  const {
    itens,
    estabelecimentos,
    estabelecimentoSelecionadoId,
    selecionarEstabelecimento,
    adicionarEstabelecimento,
    excluirEstabelecimento,
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
  const [modalSelecionarEstabelecimento, setModalSelecionarEstabelecimento] =
    useState(false);
  const [itemEditando, setItemEditando] =
    useState<ItemListaCompras | null>(null);

  const [modalEstabelecimento, setModalEstabelecimento] = useState(false);
  const [nomeEstabelecimento, setNomeEstabelecimento] = useState('');
  const [concluidosExpandidos, setConcluidosExpandidos] = useState(false);

  const total = itens.length;
  const comprados = itens.filter((item) => item.comprado);
  const pendentes = itens.filter((item) => !item.comprado);

  const quantidadeComprados = comprados.length;
  const quantidadePendentes = pendentes.length;

  const estaVazio = total === 0;
  const todosSelecionados = total > 0 && quantidadeComprados === total;
  const [modalGerenciarEstabelecimentos, setModalGerenciarEstabelecimentos] =
    useState(false);

  const agrupados = useMemo(() => {
    return CATEGORIAS.reduce<
      Record<CategoriaIngrediente, ItemListaCompras[]>
    >(
      (acc, categoria) => {
        acc[categoria] = pendentes.filter(
          (item) => item.categoria === categoria
        );
        return acc;
      },
      {} as Record<CategoriaIngrediente, ItemListaCompras[]>
    );
  }, [pendentes]);

  const handleSalvarItem = (
    dados: Omit<ItemListaCompras, 'id' | 'comprado' | 'lojaId'>
  ) => {
    if (itemEditando) {
      editarItemManual(itemEditando.id, dados);
    } else {
      adicionarItemManual(dados);
    }

    setItemEditando(null);
  };

  const handleGerarSemana = (lojaId: string) => {
    gerarDoPlanejamentoSemanal(plano, lojaId);
    setModalSelecionarEstabelecimento(false);
  };

  const handleAdicionarEstabelecimento = () => {
    const nome = nomeEstabelecimento.trim();

    if (!nome) {
      Alert.alert('Nome obrigatório', 'Informe o nome do estabelecimento.');
      return;
    }

    const novoEstabelecimento = adicionarEstabelecimento(nome);

    if (!novoEstabelecimento) {
      Alert.alert(
        'Estabelecimento já cadastrado',
        'Já existe uma lista com esse nome.'
      );
      return;
    }

    setNomeEstabelecimento('');
    setModalEstabelecimento(false);
  };

  const confirmarExclusaoEstabelecimento = (id: string, nome: string) => {
    Alert.alert(
      'Excluir estabelecimento',
      `O que deseja fazer com os itens da lista "${nome}"?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Transferir para Meu mercado',
          onPress: () => {
            const sucesso = excluirEstabelecimento(id, true);

            if (sucesso) {
              Alert.alert(
                'Lista excluída',
                'Os itens foram transferidos para Meu mercado.'
              );
            }
          },
        },
        {
          text: 'Excluir lista e itens',
          style: 'destructive',
          onPress: () => {
            const sucesso = excluirEstabelecimento(id, false);

            if (sucesso) {
              Alert.alert(
                'Lista excluída',
                'O estabelecimento e seus itens foram removidos.'
              );
            }
          },
        },
      ]
    );
  };

  const abrirModalAdicionar = () => {
    setItemEditando(null);
    setModalVisivel(true);
  };

  const abrirModalEditar = (item: ItemListaCompras) => {
    setItemEditando(item);
    setModalVisivel(true);
  };

  const renderItem = (item: ItemListaCompras, index: number, lista: ItemListaCompras[]) => (
    <View
      key={item.id}
      style={[
        styles.linhaItem,
        index < lista.length - 1 && [
          styles.borderBottomItem,
          {
            borderBottomColor: isDark ? '#233A2C' : '#EFEBE4',
          },
        ],
        item.comprado && {
          backgroundColor: isDark ? '#101E16' : '#FAFAF8',
        },
      ]}
    >
      <TouchableOpacity
        style={styles.areaCheckbox}
        onPress={() => alternarComprado(item.id)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.checkbox,
            { borderColor: isDark ? '#3E5446' : '#C4B4A4' },
            item.comprado && {
              backgroundColor: '#6B8C6B',
              borderColor: '#6B8C6B',
            },
          ]}
        >
          {item.comprado && (
            <Feather name="check" size={12} color="#FAF6F0" />
          )}
        </View>
      </TouchableOpacity>

      {item.imagemUri ? (
        <TouchableOpacity onPress={() => abrirModalEditar(item)}>
          <Image
            source={{ uri: item.imagemUri }}
            style={styles.imagemItem}
          />
        </TouchableOpacity>
      ) : null}

      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => abrirModalEditar(item)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.nomeItem,
            { color: isDark ? '#FAF6F0' : '#2C2016' },
            item.comprado && [
              styles.textoRiscado,
              { color: isDark ? '#687B6E' : '#B8A898' },
            ],
          ]}
        >
          {item.nome}
        </Text>

        <Text
          style={[
            styles.qtdItem,
            { color: isDark ? '#A2B3A7' : '#8C7A6B' },
          ]}
        >
          {item.quantidade} {item.unidade}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => removerItem(item.id)}
        style={[
          styles.botaoLixo,
          { backgroundColor: isDark ? '#1F3427' : '#F5F0EB' },
        ]}
      >
        <Feather name="trash-2" size={14} color="#C46B3E" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#0D1912' : '#FAF8F5' },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text
            style={[
              styles.subtitulo,
              { color: isDark ? '#A2B3A7' : '#6B8C6B' },
            ]}
          >
            Sabores Planejados
          </Text>

          <Text
            style={[
              styles.titulo,
              { color: isDark ? '#FAF6F0' : '#2C2016' },
            ]}
          >
            Lista de compras
          </Text>

          <Text
            style={[
              styles.descricao,
              { color: isDark ? '#A2B3A7' : '#8C7A6B' },
            ]}
          >
            Organize os ingredientes das suas receitas.
          </Text>
        </View>

        {!estaVazio && (
          <View
            style={[
              styles.badgePendentes,
              {
                backgroundColor:
                  quantidadePendentes > 0 ? '#2E4A2E' : '#6B8C6B',
              },
            ]}
          >
            <Text style={styles.textoBadgePendentes}>
              {quantidadePendentes}{' '}
              {quantidadePendentes === 1 ? 'item' : 'itens'} para comprar
            </Text>
          </View>
        )}
      </View>

      {/* Seleção de estabelecimentos */}
      <View style={styles.areaEstabelecimentos}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listaEstabelecimentos}
        >
          {estabelecimentos.map((estabelecimento) => {
            const selecionado =
              estabelecimento.id === estabelecimentoSelecionadoId;

            return (
              <TouchableOpacity
                key={estabelecimento.id}
                onPress={() =>
                  selecionarEstabelecimento(estabelecimento.id)
                }
                style={[
                  styles.chipEstabelecimento,
                  {
                    backgroundColor: selecionado
                      ? '#2E4A2E'
                      : isDark
                        ? '#15251C'
                        : '#FFFFFF',
                    borderColor: selecionado
                      ? '#2E4A2E'
                      : isDark
                        ? '#2D4536'
                        : '#DDD4C8',
                  },
                ]}
              >
                <Feather
                  name="shopping-bag"
                  size={13}
                  color={selecionado ? '#FAF6F0' : isDark ? '#A2B3A7' : '#6B5744'}
                />

                <Text
                  style={[
                    styles.textoEstabelecimento,
                    {
                      color: selecionado
                        ? '#FAF6F0'
                        : isDark
                          ? '#FAF6F0'
                          : '#2C2016',
                    },
                  ]}
                >
                  {estabelecimento.nome}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            style={[
              styles.botaoNovoEstabelecimento,
              {
                borderColor: isDark ? '#3E5446' : '#B9AA98',
              },
            ]}
            onPress={() => setModalEstabelecimento(true)}
          >
            <Feather
              name="plus"
              size={15}
              color={isDark ? '#FAF6F0' : '#2E4A2E'}
            />
            <Text
              style={[
                styles.textoNovoEstabelecimento,
                { color: isDark ? '#FAF6F0' : '#2E4A2E' },
              ]}
            >
              Nova lista
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.botaoNovoEstabelecimento,
              {
                borderColor: isDark ? '#3E5446' : '#B9AA98',
              },
            ]}
            onPress={() => setModalGerenciarEstabelecimentos(true)}
          >
            <Feather
              name="settings"
              size={14}
              color={isDark ? '#FAF6F0' : '#2E4A2E'}
            />
            <Text
              style={[
                styles.textoNovoEstabelecimento,
                { color: isDark ? '#FAF6F0' : '#2E4A2E' },
              ]}
            >
              Gerenciar
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.linhaAcoes}>
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={abrirModalAdicionar}
        >
          <Feather name="plus" size={16} color="#FAF6F0" />
          <Text style={styles.textoBotaoAdicionar}>Adicionar item</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.botaoGerarSemana,
            {
              backgroundColor: isDark ? '#15251C' : '#FFFFFF',
              borderColor: isDark ? '#2D4536' : '#DDD4C8',
            },
          ]}
          onPress={() => setModalSelecionarEstabelecimento(true)}
        >
          <Feather
            name="zap"
            size={16}
            color={isDark ? '#FAF6F0' : '#2C2016'}
          />
          <Text
            style={[
              styles.textoBotaoGerar,
              { color: isDark ? '#FAF6F0' : '#2C2016' },
            ]}
          >
            Gerar da semana
          </Text>
        </TouchableOpacity>
      </View>

      {!estaVazio && (
        <View
          style={[
            styles.caixaResumo,
            {
              backgroundColor: isDark ? '#15251C' : '#FFFFFF',
              borderColor: isDark ? '#2D4536' : '#DDD4C8',
            },
          ]}
        >
          <View style={styles.itemResumo}>
            <Text
              style={[
                styles.numResumo,
                { color: isDark ? '#FAF6F0' : '#2C2016' },
              ]}
            >
              {total}
            </Text>
            <Text
              style={[
                styles.labelResumo,
                { color: isDark ? '#A2B3A7' : '#8C7A6B' },
              ]}
            >
              itens
            </Text>
          </View>

          <View
            style={[
              styles.divisorVertical,
              { backgroundColor: isDark ? '#2D4536' : '#DDD4C8' },
            ]}
          />

          <View style={styles.itemResumo}>
            <Text style={[styles.numResumo, { color: '#6B8C6B' }]}>
              {quantidadeComprados}
            </Text>
            <Text
              style={[
                styles.labelResumo,
                { color: isDark ? '#A2B3A7' : '#8C7A6B' },
              ]}
            >
              comprados
            </Text>
          </View>

          <View
            style={[
              styles.divisorVertical,
              { backgroundColor: isDark ? '#2D4536' : '#DDD4C8' },
            ]}
          />

          <View style={styles.itemResumo}>
            <Text style={[styles.numResumo, { color: '#C46B3E' }]}>
              {quantidadePendentes}
            </Text>
            <Text
              style={[
                styles.labelResumo,
                { color: isDark ? '#A2B3A7' : '#8C7A6B' },
              ]}
            >
              pendentes
            </Text>
          </View>

          <View style={styles.acoesEmMassa}>
            <TouchableOpacity
              style={[
                styles.botaoSelecionarTodos,
                { backgroundColor: isDark ? '#1F3427' : '#EEF5EE' },
              ]}
              onPress={() => alternarSelecionarTodos(!todosSelecionados)}
            >
              <Text
                style={[
                  styles.textoSelecionarTodos,
                  { color: isDark ? '#A2B3A7' : '#2E4A2E' },
                ]}
              >
                {todosSelecionados ? 'Desmarcar' : 'Marcar todos'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollLista}
      >
        {estaVazio ? (
          <View style={styles.emptyContainer}>
            <View
              style={[
                styles.iconeVazio,
                { backgroundColor: isDark ? '#15251C' : '#F0EAE0' },
              ]}
            >
              <Feather
                name="shopping-bag"
                size={40}
                color={isDark ? '#A2B3A7' : '#8C7A6B'}
              />
            </View>

            <Text
              style={[
                styles.tituloVazio,
                { color: isDark ? '#FAF6F0' : '#2C2016' },
              ]}
            >
              Lista vazia
            </Text>

            <Text
              style={[
                styles.textoVazio,
                { color: isDark ? '#A2B3A7' : '#8C7A6B' },
              ]}
            >
              Adicione itens manualmente ou gere uma lista a partir das suas
              receitas planejadas.
            </Text>

            <TouchableOpacity
              style={styles.botaoVazioAdicionar}
              onPress={abrirModalAdicionar}
            >
              <Text style={styles.textoVazioAdicionar}>
                Adicionar item
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Itens pendentes agrupados por categoria */}
            {CATEGORIAS.map((categoria) => {
              const itensCategoria = agrupados[categoria];

              if (!itensCategoria || itensCategoria.length === 0) {
                return null;
              }

              const config = CONFIG_CATEGORIAS[categoria];

              return (
                <View key={categoria} style={styles.secaoCategoria}>
                  <View style={styles.cabecalhoCategoria}>
                    <View
                      style={[
                        styles.boxEmoji,
                        {
                          backgroundColor: isDark ? '#1B2E22' : config.bg,
                        },
                      ]}
                    >
                      <Text style={{ fontSize: 14 }}>{config.emoji}</Text>
                    </View>

                    <Text
                      style={[
                        styles.tituloCategoria,
                        { color: config.color },
                      ]}
                    >
                      {categoria}
                    </Text>

                    <View
                      style={[
                        styles.linhaDivisoraCat,
                        {
                          backgroundColor: isDark ? '#233A2C' : '#DDD4C8',
                        },
                      ]}
                    />

                    <Text
                      style={[
                        styles.contadorCat,
                        { color: isDark ? '#8A9E90' : '#8C7A6B' },
                      ]}
                    >
                      {itensCategoria.length} pendentes
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.cardCategoria,
                      {
                        backgroundColor: isDark ? '#15251C' : '#FFFFFF',
                        borderColor: isDark ? '#233A2C' : '#DDD4C8',
                      },
                    ]}
                  >
                    {itensCategoria.map((item, index) =>
                      renderItem(item, index, itensCategoria)
                    )}
                  </View>
                </View>
              );
            })}

            {/* Seção expansível de itens concluídos */}
            {quantidadeComprados > 0 && (
              <View style={styles.secaoConcluidos}>
                <TouchableOpacity
                  style={[
                    styles.cabecalhoConcluidos,
                    {
                      backgroundColor: isDark ? '#15251C' : '#EEF5EE',
                      borderColor: isDark ? '#2D4536' : '#C8DFCA',
                    },
                  ]}
                  onPress={() =>
                    setConcluidosExpandidos(!concluidosExpandidos)
                  }
                >
                  <View style={styles.tituloConcluidosArea}>
                    <Feather
                      name="check-circle"
                      size={18}
                      color="#6B8C6B"
                    />
                    <Text
                      style={[
                        styles.tituloConcluidos,
                        { color: isDark ? '#FAF6F0' : '#2E4A2E' },
                      ]}
                    >
                      Itens já no carrinho
                    </Text>
                    <View style={styles.contadorConcluidos}>
                      <Text style={styles.textoContadorConcluidos}>
                        {quantidadeComprados}
                      </Text>
                    </View>
                  </View>

                  <Feather
                    name={concluidosExpandidos ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={isDark ? '#A2B3A7' : '#6B8C6B'}
                  />
                </TouchableOpacity>

                {concluidosExpandidos && (
                  <View
                    style={[
                      styles.cardCategoria,
                      {
                        backgroundColor: isDark ? '#15251C' : '#FFFFFF',
                        borderColor: isDark ? '#233A2C' : '#DDD4C8',
                      },
                    ]}
                  >
                    {comprados.map((item, index) =>
                      renderItem(item, index, comprados)
                    )}

                    <View
                      style={[
                        styles.acoesConcluidos,
                        {
                          borderTopColor: isDark ? '#233A2C' : '#EFEBE4',
                        },
                      ]}
                    >
                      <TouchableOpacity
                        style={styles.botaoConfirmarComprados}
                        onPress={limparComprados}
                      >
                        <Feather name="box" size={14} color="#FAF6F0" />
                        <Text style={styles.textoBotaoAcao}>
                          Enviar para despensa
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[
                          styles.botaoRemoverComprados,
                          {
                            backgroundColor: isDark ? '#38221B' : '#FDF0EB',
                          },
                        ]}
                        onPress={removerSelecionadosApenas}
                      >
                        <Feather
                          name="trash-2"
                          size={14}
                          color="#C46B3E"
                        />
                        <Text style={styles.textoRemoverComprados}>
                          Remover
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Modal de adicionar/editar produto */}
      <ModalAdicionarEditarItem
        visivel={modalVisivel}
        itemParaEditar={itemEditando}
        onFechar={() => {
          setModalVisivel(false);
          setItemEditando(null);
        }}
        onSalvar={handleSalvarItem}
      />

      {/* Modal de novo estabelecimento */}
      <Modal
        visible={modalEstabelecimento}
        transparent
        animationType="fade"
        onRequestClose={() => setModalEstabelecimento(false)}
      >
        <View style={styles.overlayModal}>
          <View
            style={[
              styles.modalEstabelecimento,
              { backgroundColor: isDark ? '#15251C' : '#FAF8F5' },
            ]}
          >
            <View style={styles.headerModalEstabelecimento}>
              <Text
                style={[
                  styles.tituloModalEstabelecimento,
                  { color: isDark ? '#FAF6F0' : '#2C2016' },
                ]}
              >
                Nova lista de compras
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setModalEstabelecimento(false);
                  setNomeEstabelecimento('');
                }}
              >
                <Feather
                  name="x"
                  size={20}
                  color={isDark ? '#FAF6F0' : '#6B5744'}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.labelModal,
                { color: isDark ? '#A2B3A7' : '#8C7A6B' },
              ]}
            >
              NOME DO ESTABELECIMENTO
            </Text>

            <TextInput
              style={[
                styles.inputEstabelecimento,
                {
                  backgroundColor: isDark ? '#0D1912' : '#FFFFFF',
                  borderColor: isDark ? '#2D4536' : '#DDD4C8',
                  color: isDark ? '#FAF6F0' : '#2C2016',
                },
              ]}
              placeholder="Ex: Supermercado, Feira..."
              placeholderTextColor={isDark ? '#8A9E90' : '#A09386'}
              value={nomeEstabelecimento}
              onChangeText={setNomeEstabelecimento}
              autoFocus
              maxLength={40}
            />

            <TouchableOpacity
              style={[
                styles.botaoSalvarEstabelecimento,
                !nomeEstabelecimento.trim() && styles.botaoDesabilitado,
              ]}
              onPress={handleAdicionarEstabelecimento}
              disabled={!nomeEstabelecimento.trim()}
            >
              <Text style={styles.textoSalvarEstabelecimento}>
                Criar lista
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={modalGerenciarEstabelecimentos}
        transparent
        animationType="fade"
        onRequestClose={() => setModalGerenciarEstabelecimentos(false)}
      >
        <View style={styles.overlayModal}>
          <View
            style={[
              styles.modalEstabelecimento,
              { backgroundColor: isDark ? '#15251C' : '#FAF8F5' },
            ]}
          >
            <View style={styles.headerModalEstabelecimento}>
              <Text
                style={[
                  styles.tituloModalEstabelecimento,
                  { color: isDark ? '#FAF6F0' : '#2C2016' },
                ]}
              >
                Gerenciar listas
              </Text>

              <TouchableOpacity
                onPress={() => setModalGerenciarEstabelecimentos(false)}
              >
                <Feather
                  name="x"
                  size={20}
                  color={isDark ? '#FAF6F0' : '#6B5744'}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.descricao,
                {
                  color: isDark ? '#A2B3A7' : '#8C7A6B',
                  marginBottom: 16,
                },
              ]}
            >
              Você pode excluir listas criadas por você. Meu mercado não pode ser
              excluído.
            </Text>

            {estabelecimentos.map((estabelecimento) => {
              const padrao = estabelecimento.id === 'meu-mercado';

              return (
                <View
                  key={estabelecimento.id}
                  style={[
                    styles.linhaItem,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: isDark ? '#2D4536' : '#DDD4C8',
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.nomeItem,
                        { color: isDark ? '#FAF6F0' : '#2C2016' },
                      ]}
                    >
                      {estabelecimento.nome}
                    </Text>

                    {padrao && (
                      <Text
                        style={[
                          styles.qtdItem,
                          { color: isDark ? '#A2B3A7' : '#8C7A6B' },
                        ]}
                      >
                        Lista padrão
                      </Text>
                    )}
                  </View>

                  {padrao ? (
                    <Feather
                      name="lock"
                      size={16}
                      color={isDark ? '#8A9E90' : '#A09386'}
                    />
                  ) : (
                    <TouchableOpacity
                      style={[
                        styles.botaoLixo,
                        { backgroundColor: isDark ? '#38221B' : '#FDF0EB' },
                      ]}
                      onPress={() =>
                        confirmarExclusaoEstabelecimento(
                          estabelecimento.id,
                          estabelecimento.nome
                        )
                      }
                    >
                      <Feather name="trash-2" size={15} color="#C46B3E" />
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </Modal>
      <ModalSelecionarEstabelecimento
        visivel={modalSelecionarEstabelecimento}
        estabelecimentos={estabelecimentos}
        tema={theme}
        onCancelar={() => setModalSelecionarEstabelecimento(false)}
        onConfirmar={handleGerarSemana}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: 22,
    paddingTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    flexShrink: 1,
    marginRight: 12,
  },
  subtitulo: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  titulo: { fontSize: 24, fontWeight: 'bold' },
  descricao: { fontSize: 13, marginTop: 2 },
  badgePendentes: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  textoBadgePendentes: {
    color: '#FAF6F0',
    fontSize: 12,
    fontWeight: 'bold',
  },

  areaEstabelecimentos: {
    marginTop: 14,
  },
  listaEstabelecimentos: {
    paddingHorizontal: 22,
    gap: 8,
    alignItems: 'center',
  },
  chipEstabelecimento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1.3,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  textoEstabelecimento: {
    fontSize: 12,
    fontWeight: '600',
  },
  botaoNovoEstabelecimento: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1.3,
    borderStyle: 'dashed',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  textoNovoEstabelecimento: {
    fontSize: 12,
    fontWeight: '600',
  },

  linhaAcoes: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 22,
    marginTop: 14,
  },
  botaoAdicionar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#2E4A2E',
    borderRadius: 14,
    paddingVertical: 12,
  },
  textoBotaoAdicionar: {
    color: '#FAF6F0',
    fontSize: 14,
    fontWeight: 'bold',
  },
  botaoGerarSemana: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 12,
  },
  textoBotaoGerar: {
    fontSize: 14,
    fontWeight: 'bold',
  },

  caixaResumo: {
    marginHorizontal: 22,
    marginTop: 14,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemResumo: { alignItems: 'center' },
  numResumo: { fontSize: 18, fontWeight: 'bold' },
  labelResumo: { fontSize: 11 },
  divisorVertical: { width: 1, height: 24 },
  acoesEmMassa: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  botaoSelecionarTodos: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  textoSelecionarTodos: {
    fontSize: 10,
    fontWeight: 'bold',
  },

  scrollLista: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  iconeVazio: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  tituloVazio: { fontSize: 18, fontWeight: 'bold' },
  textoVazio: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 260,
    marginTop: 6,
  },
  botaoVazioAdicionar: {
    backgroundColor: '#2E4A2E',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 16,
  },
  textoVazioAdicionar: {
    color: '#FAF6F0',
    fontSize: 14,
    fontWeight: 'bold',
  },

  secaoCategoria: { marginBottom: 18 },
  cabecalhoCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  boxEmoji: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tituloCategoria: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  linhaDivisoraCat: { flex: 1, height: 1 },
  contadorCat: { fontSize: 11 },
  cardCategoria: {
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  linhaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  borderBottomItem: { borderBottomWidth: 1 },
  areaCheckbox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagemItem: {
    width: 44,
    height: 44,
    borderRadius: 9,
    backgroundColor: '#F0EAE0',
  },
  nomeItem: { fontSize: 14, fontWeight: '600' },
  textoRiscado: { textDecorationLine: 'line-through' },
  qtdItem: { fontSize: 12, marginTop: 2 },
  botaoLixo: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  secaoConcluidos: {
    marginTop: 4,
    marginBottom: 20,
  },
  cabecalhoConcluidos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.2,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  tituloConcluidosArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  tituloConcluidos: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  contadorConcluidos: {
    backgroundColor: '#6B8C6B',
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  textoContadorConcluidos: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  acoesConcluidos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#EFEBE4',
    gap: 8,
  },
  botaoConfirmarComprados: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2E4A2E',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  textoBotaoAcao: {
    color: '#FAF6F0',
    fontSize: 11,
    fontWeight: 'bold',
  },
  botaoRemoverComprados: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
  },
  textoRemoverComprados: {
    color: '#C46B3E',
    fontSize: 11,
    fontWeight: '600',
  },

  overlayModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modalEstabelecimento: {
    borderRadius: 20,
    padding: 20,
  },
  headerModalEstabelecimento: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tituloModalEstabelecimento: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  labelModal: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 7,
  },
  inputEstabelecimento: {
    borderWidth: 1.3,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 12,
    fontSize: 14,
  },
  botaoSalvarEstabelecimento: {
    backgroundColor: '#2E4A2E',
    borderRadius: 13,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 16,
  },
  botaoDesabilitado: {
    backgroundColor: '#A9B5AA',
  },
  textoSalvarEstabelecimento: {
    color: '#FAF6F0',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
