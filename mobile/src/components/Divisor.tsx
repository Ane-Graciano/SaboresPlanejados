import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface DivisorProps {
  texto?: string;
}

export default function Divisor({ texto }: DivisorProps) {
  if (!texto) {
    return <View style={styles.divider} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{texto}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#E8E2D9',
    marginHorizontal: 22,
    marginVertical: 18,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    width: '100%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E2D9',
  },
  text: {
    marginHorizontal: 14,
    fontSize: 13,
    color: '#B8A898',
    fontWeight: '500',
  },
});