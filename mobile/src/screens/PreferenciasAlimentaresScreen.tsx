
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import {
  buscarPreferenciasAlimentares,
  salvarPreferenciasAlimentares,
} from '../services/preferenciasAlimentaresService';

interface PreferenciasAlimentaresScreenProps {
  navigation: any;
  theme: 'light' | 'dark';
  toggleTheme?: () => void;
}

const RESTRICOES_DISPONIVEIS = [
  'Glúten',
  'Lactose',
  'Amendoim',
  'Castanhas',
  'Ovo',
  'Peixes',
  'Frutos do mar',
  'Soja',
  'Vegetariano',
  'Vegano',
];

export default function PreferenciasAlimentaresScreen({
  navigation,
  theme,
}: PreferenciasAlimentaresScreenProps) {
  const isDark = theme === 'dark';

  const [restricoes, setRestricoes] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erroCarregamento, setErroCarregamento] = useState(false);

  const colors = {
    background: isDark ? '#171D19' : '#F7F5EC',
    card: isDark ? '#222C25' : '#FFFFFF',
    text: isDark ? '#F2F3ED' : '#29372D',
    secondary: isDark ? '#B5C1B6' : '#778477',
    primary: isDark ? '#A8C99A' : '#5B8060',
    selectedBackground: isDark ? '#344C39' : '#E8F0E5',
    border: isDark ? '#405044' : '#E2E8DE',
    iconBackground: isDark ? '#344C39' : '#EDF3E9',
  };

  useEffect(() => {
    carregarPreferencias();
  }, []);

  const carregarPreferencias = async () => {
    try {
      setCarregando(true);
      setErroCarregamento(false);

      const dados = await buscarPreferenciasAlimentares();

      setRestricoes(
        Array.isArray(dados.restricoes) ? dados.restricoes : []
      );
    } catch (error) {
      console.error('Erro ao carregar preferências alimentares:', error);

      setErroCarregamento(true);

      Alert.alert(
        'Não foi possível carregar',
        'Suas preferências não puderam ser carregadas. Verifique sua conexão e tente novamente.'
      );
    } finally {
      setCarregando(false);
    }
  };

  const alternarRestricao = (restricao: string) => {
    setRestricoes((atuais) =>
      atuais.includes(restricao)
        ? atuais.filter((item) => item !== restricao)
        : [...atuais, restricao]
    );
  };

  const salvar = async () => {
    try {
      setSalvando(true);

      const resposta = await salvarPreferenciasAlimentares(restricoes);

      setRestricoes(resposta.restricoes);

      Alert.alert(
        'Preferências atualizadas!',
        'Suas restrições alimentares foram salvas com sucesso.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Erro ao salvar preferências alimentares:', error);

      Alert.alert(
        'Erro ao salvar',
        'Não foi possível atualizar suas preferências. Tente novamente.'
      );
    } finally {
      setSalvando(false);
    }
  };

  const renderRestricao = (restricao: string) => {
    const selecionada = restricoes.includes(restricao);

    return (
      <TouchableOpacity
        key={restricao}
        style={[
          styles.opcao,
          {
            backgroundColor: selecionada
              ? colors.selectedBackground
              : colors.card,
            borderColor: selecionada
              ? colors.primary
              : colors.border,
          },
        ]}
        onPress={() => alternarRestricao(restricao)}
        activeOpacity={0.75}
        disabled={carregando || salvando || erroCarregamento}
      >
        <View style={styles.opcaoConteudo}>
          <Text
            style={[
              styles.opcaoTexto,
              { color: colors.text },
            ]}
          >
            {restricao}
          </Text>

          <Ionicons
            name={
              selecionada
                ? 'checkmark-circle'
                : 'ellipse-outline'
            }
            size={23}
            color={selecionada ? colors.primary : colors.secondary}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            { backgroundColor: colors.card },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={colors.text}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Preferências alimentares
        </Text>

        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.introCard,
            { backgroundColor: colors.card },
          ]}
        >
          <View
            style={[
              styles.introIcon,
              { backgroundColor: colors.iconBackground },
            ]}
          >
            <Ionicons
              name="nutrition-outline"
              size={30}
              color={colors.primary}
            />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            Sua alimentação, suas escolhas
          </Text>

          <Text style={[styles.description, { color: colors.secondary }]}>
            Conte quais ingredientes você precisa evitar ou quais
            hábitos alimentares segue. Vamos considerar essas
            informações ao apresentar receitas e sugestões.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Restrições e preferências
          </Text>

          <Text style={[styles.sectionSubtitle, { color: colors.secondary }]}>
            Selecione todas as opções que se aplicam a você.
          </Text>
        </View>

        {carregando ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.secondary }]}>
              Carregando suas preferências...
            </Text>
          </View>
        ) : erroCarregamento ? (
          <View
            style={[
              styles.errorCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name="cloud-offline-outline"
              size={30}
              color={colors.secondary}
            />

            <Text style={[styles.errorText, { color: colors.text }]}>
              Não foi possível carregar suas preferências.
            </Text>

            <TouchableOpacity
              onPress={carregarPreferencias}
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.retryButtonText}>Tentar novamente</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.opcoesContainer}>
            {RESTRICOES_DISPONIVEIS.map(renderRestricao)}
          </View>
        )}

        {!carregando && !erroCarregamento && (
          <View
            style={[
              styles.selectionInfo,
              { backgroundColor: colors.iconBackground },
            ]}
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={colors.primary}
            />

            <Text style={[styles.selectionText, { color: colors.secondary }]}>
              {restricoes.length === 0
                ? 'Nenhuma preferência selecionada.'
                : `${restricoes.length} ${
                    restricoes.length === 1
                      ? 'opção selecionada'
                      : 'opções selecionadas'
                  }.`}
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: colors.primary },
            (carregando || salvando || erroCarregamento) &&
              styles.disabledButton,
          ]}
          onPress={salvar}
          disabled={carregando || salvando || erroCarregamento}
          activeOpacity={0.8}
        >
          {salvando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={21}
                color="#FFFFFF"
              />
              <Text style={styles.saveButtonText}>
                Salvar preferências
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerPlaceholder: {
    width: 42,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  introCard: {
    padding: 22,
    borderRadius: 22,
    alignItems: 'center',
    marginBottom: 28,
  },
  introIcon: {
    width: 62,
    height: 62,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 13,
    lineHeight: 19,
  },
  opcoesContainer: {
    gap: 10,
  },
  opcao: {
    borderWidth: 1.3,
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  opcaoConteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  opcaoTexto: {
    fontSize: 15,
    fontWeight: '600',
  },
  selectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 14,
    borderRadius: 13,
    marginTop: 20,
  },
  selectionText: {
    fontSize: 13,
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  errorCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    gap: 14,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  saveButton: {
    minHeight: 54,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
