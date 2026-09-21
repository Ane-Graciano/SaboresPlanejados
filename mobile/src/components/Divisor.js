import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Divisor() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#E8E2D9',
    marginHorizontal: 22,
    marginVertical: 18,
  },
});