import React, { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

interface AdvancedFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    maxTime: number;
    ingredient: string;
    chef: string;
    tipoPrato: string;
    culinaria: string;
  }) => void;
  onClearFilters: () => void;
  isDark?: boolean;
}

const INGREDIENTES = [
  'Todos',
  'Frango',
  'Carne',
  'Cogumelos',
  'Massa',
  'Legumes',
];

const CHEFS = [
  'Todos',
  'Chef Paola',
  'Chef Jacquin',
  'Chef Fogaça',
];

const TIPOS_PRATO = [
  'Todos',
  'Massa',
  'Carne',
  'Risoto',
  'Peixe',
  'Salada',
];

const CULINARIAS = [
  'Todos',
  'Italiana',
  'Francesa',
  'Mediterrânea',
  'Contemporânea',
];

export const AdvancedFilterModal: React.FC<
  AdvancedFilterModalProps
> = ({
  visible,
  onClose,
  onApplyFilters,
  onClearFilters,
  isDark = false,
}) => {
  const [maxTime, setMaxTime] = useState<number>(60);
  const [selectedIngredient, setSelectedIngredient] =
    useState<string>('Todos');
  const [selectedChef, setSelectedChef] =
    useState<string>('Todos');
  const [selectedTipoPrato, setSelectedTipoPrato] =
    useState<string>('Todos');
  const [selectedCulinaria, setSelectedCulinaria] =
    useState<string>('Todos');

  const handleApply = () => {
    onApplyFilters({
      maxTime,
      ingredient: selectedIngredient,
      chef: selectedChef,
      tipoPrato: selectedTipoPrato,
      culinaria: selectedCulinaria,
    });

    onClose();
  };

  const handleClear = () => {
    setMaxTime(60);
    setSelectedIngredient('Todos');
    setSelectedChef('Todos');
    setSelectedTipoPrato('Todos');
    setSelectedCulinaria('Todos');

    onClearFilters();
    onClose();
  };

  const themeBg = isDark ? '#15251C' : '#FFFFFF';
  const themeText = isDark ? '#FAF6F0' : '#2C2016';
  const themeBorder = isDark
    ? '#233A2C'
    : '#DDD4C8';

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: themeBg },
          ]}
        >
          <View
            style={[
              styles.header,
              { borderBottomColor: themeBorder },
            ]}
          >
            <Text
              style={[
                styles.title,
                { color: themeText },
              ]}
            >
              Filtros Avançados
            </Text>

            <TouchableOpacity onPress={onClose}>
              <Feather
                name="x"
                size={22}
                color={themeText}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: themeText },
                ]}
              >
                Tempo máximo:{' '}
                <Text style={styles.highlightText}>
                  {maxTime} min
                </Text>
              </Text>

              <View style={styles.chipRow}>
                {[15, 30, 45, 60].map((time) => (
                  <TouchableOpacity
                    key={time}
                    onPress={() => setMaxTime(time)}
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          maxTime === time
                            ? '#2E4A2E'
                            : 'transparent',
                        borderColor:
                          maxTime === time
                            ? 'transparent'
                            : themeBorder,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          maxTime === time
                            ? '#FAF6F0'
                            : themeText,
                        fontWeight: '600',
                      }}
                    >
                      Até {time}m
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: themeText },
                ]}
              >
                Ingrediente Principal
              </Text>

              <View style={styles.chipRow}>
                {INGREDIENTES.map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() =>
                      setSelectedIngredient(item)
                    }
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          selectedIngredient === item
                            ? '#2E4A2E'
                            : 'transparent',
                        borderColor:
                          selectedIngredient === item
                            ? 'transparent'
                            : themeBorder,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          selectedIngredient === item
                            ? '#FAF6F0'
                            : themeText,
                        fontWeight: '600',
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: themeText },
                ]}
              >
                Chef / Autor
              </Text>

              <View style={styles.chipRow}>
                {CHEFS.map((chef) => (
                  <TouchableOpacity
                    key={chef}
                    onPress={() =>
                      setSelectedChef(chef)
                    }
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          selectedChef === chef
                            ? '#2E4A2E'
                            : 'transparent',
                        borderColor:
                          selectedChef === chef
                            ? 'transparent'
                            : themeBorder,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          selectedChef === chef
                            ? '#FAF6F0'
                            : themeText,
                        fontWeight: '600',
                      }}
                    >
                      {chef}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: themeText },
                ]}
              >
                Tipo de prato
              </Text>

              <View style={styles.chipRow}>
                {TIPOS_PRATO.map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() =>
                      setSelectedTipoPrato(item)
                    }
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          selectedTipoPrato === item
                            ? '#2E4A2E'
                            : 'transparent',
                        borderColor:
                          selectedTipoPrato === item
                            ? 'transparent'
                            : themeBorder,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          selectedTipoPrato === item
                            ? '#FAF6F0'
                            : themeText,
                        fontWeight: '600',
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: themeText },
                ]}
              >
                Culinária
              </Text>

              <View style={styles.chipRow}>
                {CULINARIAS.map((item) => (
                  <TouchableOpacity
                    key={item}
                    onPress={() =>
                      setSelectedCulinaria(item)
                    }
                    style={[
                      styles.chip,
                      {
                        backgroundColor:
                          selectedCulinaria === item
                            ? '#2E4A2E'
                            : 'transparent',
                        borderColor:
                          selectedCulinaria === item
                            ? 'transparent'
                            : themeBorder,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          selectedCulinaria === item
                            ? '#FAF6F0'
                            : themeText,
                        fontWeight: '600',
                      }}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View
            style={[
              styles.footer,
              { borderTopColor: themeBorder },
            ]}
          >
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={handleClear}
            >
              <Text style={styles.clearBtnText}>
                Limpar Filtros
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyBtn}
              onPress={handleApply}
            >
              <Text style={styles.applyBtnText}>
                Aplicar Filtros
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  container: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
  },

  content: {
    padding: 20,
  },

  section: {
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },

  highlightText: {
    color: '#C46B3E',
    fontWeight: '800',
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },

  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
  },

  clearBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#C46B3E',
    alignItems: 'center',
  },

  clearBtnText: {
    color: '#C46B3E',
    fontWeight: '700',
    fontSize: 14,
  },

  applyBtn: {
    flex: 1.5,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#2E4A2E',
    alignItems: 'center',
  },

  applyBtnText: {
    color: '#FAF6F0',
    fontWeight: '700',
    fontSize: 14,
  },
});