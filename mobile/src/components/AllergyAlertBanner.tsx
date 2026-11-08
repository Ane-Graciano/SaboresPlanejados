
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { IngredienteIncompativel } from '../utils/restrictionUtils';

interface AllergyAlertBannerProps {
  ingredientesIncompativeis: IngredienteIncompativel[];
}

export default function AllergyAlertBanner({
  ingredientesIncompativeis,
}: AllergyAlertBannerProps) {
  if (ingredientesIncompativeis.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="warning-outline"
            size={22}
            color="#B45C32"
          />
        </View>

        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>
            Atenção às suas restrições
          </Text>

          <Text style={styles.description}>
            Encontramos ingredientes que podem ser incompatíveis
            com suas preferências alimentares.
          </Text>
        </View>
      </View>

      {ingredientesIncompativeis.map((item, index) => (
        <View
          key={`${item.ingrediente.nome}-${index}`}
          style={styles.ingredientCard}
        >
          <Text style={styles.ingredientName}>
            {item.ingrediente.nome}
          </Text>

          <View style={styles.restrictionsContainer}>
            {item.restricoes.map((restricao) => (
              <View
                key={restricao}
                style={styles.restrictionBadge}
              >
                <Text style={styles.restrictionText}>
                  {restricao}
                </Text>
              </View>
            ))}
          </View>

          {item.substitutos.length > 0 && (
            <View style={styles.substitutesContainer}>
              <View style={styles.substitutesHeader}>
                <Ionicons
                  name="swap-horizontal-outline"
                  size={16}
                  color="#47734D"
                />

                <Text style={styles.substitutesTitle}>
                  Possíveis substitutos
                </Text>
              </View>

              {item.substitutos.map((substituto) => (
                <View
                  key={substituto}
                  style={styles.substituteRow}
                >
                  <Ionicons
                    name="leaf-outline"
                    size={14}
                    color="#6B8C6B"
                  />

                  <Text style={styles.substituteText}>
                    {substituto}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      <View style={styles.disclaimerContainer}>
        <Ionicons
          name="information-circle-outline"
          size={16}
          color="#8A6B4D"
        />

        <Text style={styles.disclaimer}>
          Confira os rótulos e a composição dos produtos.
          Esta análise considera apenas os nomes dos ingredientes
          e não identifica contaminação cruzada.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF8F1',
    borderWidth: 1,
    borderColor: '#F0D8C4',
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FBE8D9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTextContainer: {
    flex: 1,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8D492D',
  },

  description: {
    fontSize: 12.5,
    color: '#785E4D',
    lineHeight: 19,
    marginTop: 4,
  },

  ingredientCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0E5DA',
    padding: 12,
    marginTop: 8,
  },

  ingredientName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#382B23',
  },

  restrictionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },

  restrictionBadge: {
    backgroundColor: '#FBE8D9',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },

  restrictionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#A05232',
  },

  substitutesContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0EAE3',
  },

  substitutesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 7,
  },

  substitutesTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#47734D',
  },

  substituteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 5,
  },

  substituteText: {
    fontSize: 12,
    color: '#5C6658',
  },

  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginTop: 12,
  },

  disclaimer: {
    flex: 1,
    fontSize: 10.5,
    color: '#8A6B4D',
    lineHeight: 16,
  },
});
