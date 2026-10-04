import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function SeletorPorcoes({ porcoes, onAumentar, onDiminuir }) {
  return (
    <View style={styles.servingsSelector}>
      <TouchableOpacity onPress={onDiminuir} style={styles.stepBtn}>
        <Text style={styles.stepBtnText}>−</Text>
      </TouchableOpacity>
      <Text style={styles.servingsValue}>{porcoes} porç.</Text>
      <TouchableOpacity onPress={onAumentar} style={styles.stepBtn}>
        <Text style={styles.stepBtnText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  servingsSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EFEBE4',
    borderRadius: 20,
    height: 34,
  },
  stepBtn: {
    width: 32,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E4A2E',
  },
  servingsValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2C2016',
    paddingHorizontal: 4,
  },
});