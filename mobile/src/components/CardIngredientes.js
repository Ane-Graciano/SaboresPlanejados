import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function CardIngredientes({
  ingredientes = [],
  porcoesBase = 1,
  porcoesAtuais = 1,
}) {
  const calcularQtd = (qtd) => {
    if (typeof qtd === 'string') return qtd;
    const v = (qtd / porcoesBase) * porcoesAtuais;
    return Number.isInteger(v) ? v : parseFloat(v.toFixed(1));
  };

  return (
    <View style={styles.cardContainer}>
      {ingredientes.map((ing, i) => (
        <View
          key={i}
          style={[
            styles.ingredientItem,
            i < ingredientes.length - 1 && styles.borderBottom,
          ]}
        >
          <Text style={styles.ingredientName}>{ing.nome}</Text>
          <Text style={styles.ingredientQty}>
            {calcularQtd(ing.qtd)}
            {ing.unidade ? ` ${ing.unidade}` : ''}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#EFEBE4',
    overflow: 'hidden',
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2ECE4',
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C2016',
  },
  ingredientQty: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#6B8C6B',
  },
});