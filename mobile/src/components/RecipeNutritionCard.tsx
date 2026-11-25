import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RecipeNutritionCardProps {
  nutrition?: {
    calories?: string | number;
    protein?: string | number;
    carbs?: string | number;
    fat?: string | number;
    fiber?: string | number;
    sodium?: string | number;
  };
  servingsMultiplier: number; 
}

export function RecipeNutritionCard({ nutrition, servingsMultiplier }: RecipeNutritionCardProps) {
  // Se o objeto nutrition não existir ou estiver totalmente vazio, não renderiza o card
  if (!nutrition || Object.keys(nutrition).length === 0) return null;

  // Função auxiliar segura para formatar e calcular
  const calc = (val: string | number | undefined) => {
    if (val === undefined || val === null || val === 'N/D' || val === '') return '--';
    if (typeof val === 'number') return `${Math.round(val * servingsMultiplier)}`;
    
    // Extrai apenas os números da string (ex: "420 kcal" -> 420)
    const match = String(val).match(/(\d+)/);
    if (!match) return val; // Se for algum texto personalizado válido, mantém
    
    const numeroCalculado = Math.round(Number(match[1]) * servingsMultiplier);
    return `${numeroCalculado}`;
  };

  // Verifica se todos os principais macros e calorias estão ausentes
  const temDados = nutrition.calories || nutrition.protein || nutrition.carbs || nutrition.fat;
  if (!temDados) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RESUMO NUTRICIONAL (APROXIMADO)</Text>
      
      <View style={styles.calorieCard}>
        <View style={styles.calorieIconBox}>
          <Ionicons name="flame" size={24} color="#FAF6F0" />
        </View>
        <View>
          <Text style={styles.calorieLabel}>Calorias Totais</Text>
          <Text style={styles.calorieValue}>
            {calc(nutrition.calories)}{' '}
            {calc(nutrition.calories) !== '--' && <Text style={styles.unit}>kcal</Text>}
          </Text>
        </View>
      </View>

      <View style={styles.macrosGrid}>
        <MacroBox label="Proteínas" value={calc(nutrition.protein)} unit="g" color="#4A7A4A" />
        <MacroBox label="Carboidratos" value={calc(nutrition.carbs)} unit="g" color="#C46B3E" />
        <MacroBox label="Gorduras" value={calc(nutrition.fat)} unit="g" color="#8A7560" />
      </View>

      <Text style={styles.disclaimer}>
        - Valores calculados proporcionalmente com base na quantidade de porções selecionada. Podem variar conforme os ingredientes.
      </Text>
    </View>
  );
}

function MacroBox({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  const isNa = value === '--';

  return (
    <View style={styles.macroBox}>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={[styles.macroValue, { color }]}>
        {value}
        {!isNa && <Text style={styles.macroUnit}>{unit}</Text>}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAF6F0',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E0D0BC',
    marginBottom: 16,
  },
  title: {
    fontWeight: '700',
    fontSize: 12,
    color: '#8A7560',
    marginBottom: 12,
    letterSpacing: 0.8,
  },
  calorieCard: {
    backgroundColor: '#4A7A4A',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  calorieIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  calorieLabel: {
    fontSize: 11,
    color: 'rgba(250,246,240,0.8)',
    textTransform: 'uppercase',
  },
  calorieValue: {
    fontWeight: '700',
    fontSize: 24,
    color: '#FAF6F0',
  },
  unit: {
    fontSize: 14,
  },
  macrosGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  macroBox: {
    flex: 1,
    backgroundColor: '#F5EDE2',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0D0BC',
  },
  macroLabel: {
    fontSize: 11,
    color: '#8A7560',
    marginBottom: 2,
  },
  macroValue: {
    fontWeight: '700',
    fontSize: 16,
  },
  macroUnit: {
    fontSize: 10,
  },
  disclaimer: {
    fontSize: 10.5,
    color: '#A08F7E',
    fontStyle: 'italic',
  },
});