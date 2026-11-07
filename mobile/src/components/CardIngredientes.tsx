import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import {
  Ingrediente,
} from '../model/receita';

interface CardIngredientesProps {
  ingredientes?: Ingrediente[];
  porcoesBase?: number;
  porcoesAtuais?: number;
}

function simplificarFracao(
  numerador: number,
  denominador: number,
): string {
  const mdc = (a: number, b: number): number => {
    while (b !== 0) {
      const resto = a % b;
      a = b;
      b = resto;
    }

    return Math.abs(a);
  };

  const divisor = mdc(numerador, denominador);

  return `${numerador / divisor}/${denominador / divisor}`;
}

function formatarQuantidade(valor: number): string {
  if (Number.isInteger(valor)) {
    return String(valor);
  }

  const fracoes = [
    { valor: 0.125, texto: '1/8' },
    { valor: 0.25, texto: '1/4' },
    { valor: 0.333, texto: '1/3' },
    { valor: 0.375, texto: '3/8' },
    { valor: 0.5, texto: '1/2' },
    { valor: 0.625, texto: '5/8' },
    { valor: 0.667, texto: '2/3' },
    { valor: 0.75, texto: '3/4' },
    { valor: 0.875, texto: '7/8' },
  ];

  const parteInteira = Math.floor(valor);
  const parteDecimal = valor - parteInteira;

  const fracao = fracoes.find(
    (item) =>
      Math.abs(item.valor - parteDecimal) < 0.03,
  );

  if (fracao) {
    if (parteInteira === 0) {
      return fracao.texto;
    }

    return `${parteInteira} ${fracao.texto}`;
  }

  const denominador = 8;
  const numerador = Math.round(valor * denominador);

  return simplificarFracao(
    numerador,
    denominador,
  );
}

export default function CardIngredientes({
  ingredientes = [],
  porcoesBase = 1,
  porcoesAtuais = 1,
}: CardIngredientesProps) {
  const calcularQtd = (
    qtd: number | string | undefined,
  ): string => {
    if (qtd === undefined || qtd === '') {
      return '';
    }

    let valorNumerico: number;

    if (typeof qtd === 'string') {
      const texto = qtd.trim();

      // Aceita frações como "1/2".
      const fracao = texto.match(/^(\d+)\s*\/\s*(\d+)$/);

      if (fracao) {
        const numerador = Number(fracao[1]);
        const denominador = Number(fracao[2]);

        if (denominador === 0) {
          return qtd;
        }

        valorNumerico = numerador / denominador;
      } else {
        // Aceita números como "500", "1.5" e "1,5".
        valorNumerico = Number(texto.replace(',', '.'));
      }

      // Mantém textos que não representam quantidades numéricas.
      if (!Number.isFinite(valorNumerico)) {
        return qtd;
      }
    } else {
      valorNumerico = qtd;
    }

    const base = porcoesBase > 0 ? porcoesBase : 1;

    const valorCalculado =
      (valorNumerico / base) * porcoesAtuais;

    return formatarQuantidade(valorCalculado);
  };

  return (
    <View style={styles.cardContainer}>
      {ingredientes.map((ing, i) => (
        <View
          key={i}
          style={[
            styles.ingredientItem,
            i < ingredientes.length - 1 &&
            styles.borderBottom,
          ]}
        >
          <Text style={styles.ingredientName}>
            {ing.nome}
          </Text>

          <Text style={styles.ingredientQty}>
            {calcularQtd(ing.qtd)}
            {ing.unidade
              ? ` ${ing.unidade}`
              : ''}
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