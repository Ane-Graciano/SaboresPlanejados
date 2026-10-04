import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SocialButtonProps extends TouchableOpacityProps {
  title: string;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ title, ...props }) => {
  return (
    <TouchableOpacity style={styles.button} activeOpacity={0.85} {...props}>
      <Ionicons name="logo-google" size={18} color="#4285F4" style={styles.icon} />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#EFEAE4',
    borderRadius: 16,
    height: 48,
    width: '100%',
    gap: 10,
  },
  icon: {
    marginRight: 4,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2C2016',
  },
});