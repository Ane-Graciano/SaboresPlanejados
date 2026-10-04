import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ItemPasso({ index, textoPasso, isConcluido, onToggle }) {
  return (
    <View style={[styles.stepCard, isConcluido && styles.stepCardDone]}>
      <View style={styles.stepNumberCol}>
        <View style={[styles.stepBadge, isConcluido && styles.stepBadgeDone]}>
          {isConcluido ? (
            <Ionicons name="checkmark" size={14} color="#FAF6F0" />
          ) : (
            <Text style={styles.stepNumberText}>{index + 1}</Text>
          )}
        </View>
      </View>

      <View style={styles.stepContent}>
        <Text style={[styles.stepText, isConcluido && styles.stepTextDone]}>
          {textoPasso}
        </Text>
        <TouchableOpacity
          style={styles.checkToggle}
          onPress={onToggle}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isConcluido ? 'checkbox' : 'square-outline'}
            size={18}
            color={isConcluido ? '#6B8C6B' : '#A39385'}
          />
          <Text
            style={[
              styles.checkToggleText,
              isConcluido && styles.checkToggleTextDone,
            ]}
          >
            {isConcluido ? 'Concluído' : 'Marcar como concluído'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stepCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EFEBE4',
    borderRadius: 16,
    padding: 14,
  },
  stepCardDone: {
    backgroundColor: '#F5F9F5',
    borderColor: '#D2E3D2',
  },
  stepNumberCol: {
    alignItems: 'center',
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F0EAE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeDone: {
    backgroundColor: '#2E4A2E',
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5C4E43',
  },
  stepContent: {
    flex: 1,
  },
  stepText: {
    fontSize: 14,
    color: '#2C2016',
    lineHeight: 20,
  },
  stepTextDone: {
    color: '#8A7B70',
    textDecorationLine: 'line-through',
  },
  checkToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  checkToggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8A7B70',
  },
  checkToggleTextDone: {
    color: '#6B8C6B',
  },
});