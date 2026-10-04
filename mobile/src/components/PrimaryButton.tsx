import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, loading, style, ...props }) => {
  return (
    <TouchableOpacity
      style={[styles.button, loading && styles.buttonDisabled, style]}
      activeOpacity={0.85}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#FAF6F0" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2E4A2E',
    borderRadius: 16,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#2E4A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#FAF6F0',
    fontSize: 16,
    fontWeight: '800',
  },
});