
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Estabelecimento } from '../types/shopping';

type ThemeType = 'light' | 'dark';

interface ModalSelecionarEstabelecimentoProps {
  visivel: boolean;
  estabelecimentos: Estabelecimento[];
  tema?: ThemeType;
  onCancelar: () => void;
  onConfirmar: (lojaId: string) => void;
}

export function ModalSelecionarEstabelecimento({
  visivel,
  estabelecimentos,
  tema = 'dark',
  onCancelar,
  onConfirmar,
}: ModalSelecionarEstabelecimentoProps) {
  const isDark = tema === 'dark';
  const [lojaSelecionadaId, setLojaSelecionadaId] =
    useState<string | null>(null);

  const confirmar = () => {
    if (!lojaSelecionadaId) return;

    onConfirmar(lojaSelecionadaId);
    setLojaSelecionadaId(null);
  };

  const cancelar = () => {
    setLojaSelecionadaId(null);
    onCancelar();
  };

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="fade"
      onRequestClose={cancelar}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            { backgroundColor: isDark ? '#15251C' : '#FAF8F5' },
          ]}
        >
          <View style={styles.cabecalho}>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.titulo,
                  { color: isDark ? '#FAF6F0' : '#2C2016' },
                ]}
              >
                Onde deseja adicionar?
              </Text>

              <Text
                style={[
                  styles.descricao,
                  { color: isDark ? '#A2B3A7' : '#8C7A6B' },
                ]}
              >
                Escolha o estabelecimento para esta lista de compras.
              </Text>
            </View>

            <TouchableOpacity onPress={cancelar}>
              <Feather
                name="x"
                size={21}
                color={isDark ? '#FAF6F0' : '#6B5744'}
              />
            </TouchableOpacity>
          </View>

          {estabelecimentos.map((estabelecimento) => {
            const selecionado =
              lojaSelecionadaId === estabelecimento.id;

            return (
              <TouchableOpacity
                key={estabelecimento.id}
                style={[
                  styles.opcao,
                  {
                    backgroundColor: selecionado
                      ? isDark
                        ? '#263F2D'
                        : '#EEF5EE'
                      : isDark
                        ? '#0D1912'
                        : '#FFFFFF',
                    borderColor: selecionado
                      ? '#6B8C6B'
                      : isDark
                        ? '#2D4536'
                        : '#DDD4C8',
                  },
                ]}
                onPress={() => setLojaSelecionadaId(estabelecimento.id)}
                activeOpacity={0.75}
              >
                <Feather
                  name="shopping-bag"
                  size={17}
                  color={isDark ? '#A2B3A7' : '#6B8C6B'}
                />

                <Text
                  style={[
                    styles.nomeEstabelecimento,
                    { color: isDark ? '#FAF6F0' : '#2C2016' },
                  ]}
                >
                  {estabelecimento.nome}
                </Text>

                <View style={{ flex: 1 }} />

                {selecionado && (
                  <Feather
                    name="check-circle"
                    size={19}
                    color="#6B8C6B"
                  />
                )}
              </TouchableOpacity>
            );
          })}

          <View style={styles.acoes}>
            <TouchableOpacity
              style={[
                styles.botaoCancelar,
                {
                  borderColor: isDark ? '#3E5446' : '#DDD4C8',
                },
              ]}
              onPress={cancelar}
            >
              <Text
                style={[
                  styles.textoCancelar,
                  { color: isDark ? '#FAF6F0' : '#6B5744' },
                ]}
              >
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.botaoConfirmar,
                !lojaSelecionadaId && styles.botaoDesabilitado,
              ]}
              onPress={confirmar}
              disabled={!lojaSelecionadaId}
            >
              <Text style={styles.textoConfirmar}>
                Confirmar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    borderRadius: 20,
    padding: 20,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    gap: 12,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  descricao: {
    fontSize: 13,
    marginTop: 5,
    lineHeight: 19,
  },
  opcao: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.3,
    borderRadius: 12,
    padding: 14,
    marginBottom: 9,
    gap: 11,
  },
  nomeEstabelecimento: {
    fontSize: 14,
    fontWeight: '600',
  },
  acoes: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  botaoCancelar: {
    flex: 1,
    borderWidth: 1.3,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  textoCancelar: {
    fontSize: 14,
    fontWeight: '600',
  },
  botaoConfirmar: {
    flex: 1,
    backgroundColor: '#2E4A2E',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  botaoDesabilitado: {
    opacity: 0.45,
  },
  textoConfirmar: {
    color: '#FAF6F0',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
