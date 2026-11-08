
import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type UnitConverterModalProps = {
  visible: boolean;
  onClose: () => void;
  highContrast?: boolean;
};

type Unit = 'g' | 'kg' | 'xicara' | 'ml' | 'l' | 'sopa' | 'cha';

type Ingredient = {
  label: string;
  gramsPerCup: number;
};

const UNITS: {
  value: Unit;
  label: string;
  dimension: 'weight' | 'volume';
}[] = [
  { value: 'g', label: 'Gramas (g)', dimension: 'weight' },
  { value: 'kg', label: 'Quilogramas (kg)', dimension: 'weight' },
  { value: 'xicara', label: 'Xícara', dimension: 'volume' },
  { value: 'ml', label: 'Mililitros (ml)', dimension: 'volume' },
  { value: 'l', label: 'Litros (L)', dimension: 'volume' },
  { value: 'sopa', label: 'Colher de sopa', dimension: 'volume' },
  { value: 'cha', label: 'Colher de chá', dimension: 'volume' },
];

// Valores aproximados para uma xícara de 240 ml.
// A densidade varia conforme o ingrediente e a forma de medição.
const INGREDIENTS: Ingredient[] = [
  { label: 'Água', gramsPerCup: 240 },
  { label: 'Leite', gramsPerCup: 245 },
  { label: 'Óleo', gramsPerCup: 218 },
  { label: 'Farinha de trigo', gramsPerCup: 120 },
  { label: 'Açúcar refinado', gramsPerCup: 200 },
  { label: 'Açúcar mascavo', gramsPerCup: 180 },
  { label: 'Arroz cru', gramsPerCup: 185 },
  { label: 'Aveia', gramsPerCup: 90 },
  { label: 'Chocolate em pó', gramsPerCup: 100 },
  { label: 'Manteiga', gramsPerCup: 227 },
  { label: 'Sal', gramsPerCup: 288 },
];

const ML_PER_CUP = 240;
const ML_PER_TABLESPOON = 15;
const ML_PER_TEASPOON = 5;

function obterUnidade(unit: Unit) {
  return UNITS.find((item) => item.value === unit)!;
}

// Converte peso para gramas ou volume para mililitros.
function converterParaBase(valor: number, unidade: Unit): number {
  switch (unidade) {
    case 'g':
      return valor;

    case 'kg':
      return valor * 1000;

    case 'xicara':
      return valor * ML_PER_CUP;

    case 'ml':
      return valor;

    case 'l':
      return valor * 1000;

    case 'sopa':
      return valor * ML_PER_TABLESPOON;

    case 'cha':
      return valor * ML_PER_TEASPOON;

    default:
      return valor;
  }
}

// Converte gramas ou mililitros para a unidade desejada.
function converterDaBase(valor: number, unidade: Unit): number {
  switch (unidade) {
    case 'g':
      return valor;

    case 'kg':
      return valor / 1000;

    case 'xicara':
      return valor / ML_PER_CUP;

    case 'ml':
      return valor;

    case 'l':
      return valor / 1000;

    case 'sopa':
      return valor / ML_PER_TABLESPOON;

    case 'cha':
      return valor / ML_PER_TEASPOON;

    default:
      return valor;
  }
}

function formatarResultado(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    maximumFractionDigits: 3,
  });
}

export default function UnitConverterModal({
  visible,
  onClose,
  highContrast = false,
}: UnitConverterModalProps) {
  const [inputValue, setInputValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<Unit>('g');
  const [toUnit, setToUnit] = useState<Unit>('xicara');
  const [ingredient, setIngredient] = useState('Farinha de trigo');

  const colors = {
    background: highContrast ? '#1C2C1C' : '#FFFFFF',
    text: highContrast ? '#F0F5F0' : '#2C2016',
    muted: highContrast ? '#B8C8B8' : '#8A7B70',
    border: highContrast ? '#3A5A3A' : '#E8E2D9',
    field: highContrast ? '#263A26' : '#FAF8F5',
    accent: '#2E4A2E',

    selectedIngredientBackground: highContrast
      ? '#355535'
      : '#E5EFE3',

    selectedIngredientBorder: highContrast
      ? '#8EAD8D'
      : '#8EAD8D',

    selectedIngredientText: highContrast
      ? '#FFFFFF'
      : '#2E4A2E',

    resultBackground: highContrast
      ? '#263A26'
      : '#EBF2EB',

    resultText: highContrast
      ? '#F0F5F0'
      : '#2E4A2E',

    resultMuted: highContrast
      ? '#B8D4B8'
      : '#64866A',
  };

  // Verifica se as unidades selecionadas pertencem a dimensões diferentes.
  const precisaIngrediente = useMemo(() => {
    return (
      obterUnidade(fromUnit).dimension !==
      obterUnidade(toUnit).dimension
    );
  }, [fromUnit, toUnit]);

  // Calcula o resultado sempre que algum dado da conversão muda.
  const resultado = useMemo(() => {
    const valor = Number(inputValue.replace(',', '.'));

    if (
      !inputValue.trim() ||
      !Number.isFinite(valor) ||
      valor < 0
    ) {
      return null;
    }

    const origem = obterUnidade(fromUnit);
    const destino = obterUnidade(toUnit);

    const valorBase = converterParaBase(valor, fromUnit);

    // Conversão entre unidades da mesma dimensão.
    if (origem.dimension === destino.dimension) {
      return converterDaBase(valorBase, toUnit);
    }

    // Conversão entre peso e volume depende do ingrediente.
    const ingredienteSelecionado = INGREDIENTS.find(
      (item) => item.label === ingredient
    );

    if (!ingredienteSelecionado) {
      return null;
    }

    const gramasPorMl =
      ingredienteSelecionado.gramsPerCup / ML_PER_CUP;

    // Peso para volume.
    if (origem.dimension === 'weight') {
      const gramas = valorBase;
      const mililitros = gramas / gramasPorMl;

      return converterDaBase(mililitros, toUnit);
    }

    // Volume para peso.
    const mililitros = valorBase;
    const gramas = mililitros * gramasPorMl;

    return converterDaBase(gramas, toUnit);
  }, [inputValue, fromUnit, toUnit, ingredient]);

  // Seleciona a unidade de origem ou destino.
  // Se as duas ficarem iguais, troca a outra pela unidade anterior.
  const selecionarUnidade = (
    unidade: Unit,
    lado: 'origem' | 'destino'
  ) => {
    if (lado === 'origem') {
      if (unidade === toUnit) {
        setToUnit(fromUnit);
      }

      setFromUnit(unidade);
      return;
    }

    if (unidade === fromUnit) {
      setFromUnit(toUnit);
    }

    setToUnit(unidade);
  };

  // Inverte origem e destino.
  const inverterUnidades = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  // Renderiza as opções de unidade.
  const renderUnitOptions = (lado: 'origem' | 'destino') => {
    const selecionada =
      lado === 'origem' ? fromUnit : toUnit;

    return (
      <View style={styles.unitOptions}>
        {UNITS.map((unit) => (
          <TouchableOpacity
            key={`${lado}-${unit.value}`}
            style={[
              styles.unitOption,
              {
                backgroundColor:
                  selecionada === unit.value
                    ? colors.accent
                    : colors.field,

                borderColor:
                  selecionada === unit.value
                    ? colors.accent
                    : colors.border,
              },
            ]}
            onPress={() => selecionarUnidade(unit.value, lado)}
            accessibilityRole="button"
            accessibilityState={{
              selected: selecionada === unit.value,
            }}
          >
            <Text
              style={[
                styles.unitOptionText,
                {
                  color:
                    selecionada === unit.value
                      ? '#FFFFFF'
                      : colors.text,
                },
              ]}
            >
              {unit.value === 'xicara'
                ? 'Xícara'
                : unit.value === 'sopa'
                  ? 'Colher sopa'
                  : unit.value === 'cha'
                    ? 'Colher chá'
                    : unit.value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
          accessibilityLabel="Fechar conversor"
        />

        <View
          style={[
            styles.modal,
            { backgroundColor: colors.background },
          ]}
        >
          {/* Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons
                name="calculator-outline"
                size={23}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.headerText}>
              <Text style={[styles.title, { color: colors.text }]}>
                Conversor de medidas
              </Text>

              <Text style={[styles.subtitle, { color: colors.muted }]}>
                Medidas práticas para sua receita
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel="Fechar conversor"
            >
              <Ionicons
                name="close"
                size={23}
                color={colors.muted}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Quantidade */}
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>
              QUERO CONVERTER
            </Text>

            <TextInput
              style={[
                styles.valueInput,
                {
                  color: colors.text,
                  backgroundColor: colors.field,
                  borderColor: colors.border,
                },
              ]}
              value={inputValue}
              onChangeText={setInputValue}
              keyboardType="decimal-pad"
              placeholder="Digite uma quantidade"
              placeholderTextColor={colors.muted}
              selectTextOnFocus
            />

            {/* Unidade de origem */}
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>
              DE
            </Text>

            {renderUnitOptions('origem')}

            {/* Inverter unidades */}
            <TouchableOpacity
              style={styles.swapButton}
              onPress={inverterUnidades}
              accessibilityLabel="Inverter unidades"
            >
              <Ionicons
                name="swap-vertical"
                size={22}
                color="#FFFFFF"
              />

              <Text style={styles.swapText}>
                Inverter medidas
              </Text>
            </TouchableOpacity>

            {/* Unidade de destino */}
            <Text style={[styles.sectionLabel, { color: colors.muted }]}>
              PARA
            </Text>

            {renderUnitOptions('destino')}

            {/* Ingrediente para conversões entre peso e volume */}
            {precisaIngrediente && (
              <>
                <Text
                  style={[
                    styles.sectionLabel,
                    { color: colors.muted },
                  ]}
                >
                  INGREDIENTE
                </Text>

                <View style={styles.ingredientOptions}>
                  {INGREDIENTS.map((item) => {
                    const selecionado = ingredient === item.label;

                    return (
                      <TouchableOpacity
                        key={item.label}
                        style={[
                          styles.ingredientOption,
                          {
                            backgroundColor: selecionado
                              ? colors.selectedIngredientBackground
                              : colors.field,

                            borderColor: selecionado
                              ? colors.selectedIngredientBorder
                              : colors.border,
                          },
                        ]}
                        onPress={() => setIngredient(item.label)}
                        accessibilityRole="button"
                        accessibilityState={{
                          selected: selecionado,
                        }}
                      >
                        <Text
                          style={[
                            styles.ingredientText,
                            {
                              color: selecionado
                                ? colors.selectedIngredientText
                                : colors.text,
                            },
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}

            {/* Resultado */}
            <View
              style={[
                styles.resultCard,
                { backgroundColor: colors.resultBackground },
              ]}
            >
              <Text
                style={[
                  styles.resultLabel,
                  { color: colors.resultMuted },
                ]}
              >
                RESULTADO
              </Text>

              <Text
                style={[
                  styles.resultValue,
                  { color: colors.resultText },
                ]}
              >
                {resultado === null
                  ? '—'
                  : formatarResultado(resultado)}
              </Text>

              <Text
                style={[
                  styles.resultUnit,
                  { color: colors.resultMuted },
                ]}
              >
                {obterUnidade(toUnit).label}
              </Text>
            </View>

            {precisaIngrediente && (
              <Text
                style={[
                  styles.note,
                  { color: colors.muted },
                ]}
              >
                Conversão aproximada. O resultado depende da densidade
                do ingrediente e de como ele é medido.
              </Text>
            )}

            {/* Fechar */}
            <TouchableOpacity
              style={styles.closeAction}
              onPress={onClose}
            >
              <Text style={styles.closeActionText}>
                Voltar ao preparo
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.48)',
  },

  modal: {
    maxHeight: '90%',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 28,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#2E4A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: '800',
  },

  subtitle: {
    fontSize: 12,
    marginTop: 3,
  },

  closeButton: {
    padding: 6,
  },

  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 9,
    marginTop: 12,
  },

  valueInput: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 22,
    fontWeight: '700',
  },

  unitOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  unitOption: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  unitOptionText: {
    fontSize: 12,
    fontWeight: '700',
  },

  swapButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#64866A',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 9,
    marginTop: 15,
    marginBottom: 3,
  },

  swapText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  ingredientOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  ingredientOption: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 9,
  },

  ingredientText: {
    fontSize: 12,
    fontWeight: '600',
  },

  resultCard: {
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginTop: 22,
  },

  resultLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },

  resultValue: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 5,
  },

  resultUnit: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },

  note: {
    fontSize: 11,
    lineHeight: 17,
    marginTop: 10,
  },

  closeAction: {
    backgroundColor: '#2E4A2E',
    borderRadius: 14,
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 18,
  },

  closeActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
