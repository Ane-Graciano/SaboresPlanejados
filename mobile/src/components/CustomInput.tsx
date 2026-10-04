import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CustomInputProps extends TextInputProps {
  label: string;
  iconName: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  error?: string;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  iconName,
  isPassword = false,
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(!isPassword);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, !!error && styles.inputWrapperError]}>
        <Ionicons
          name={iconName}
          size={18}
          color={error ? '#C46B3E' : '#9B8574'}
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#C4B4A4"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={18}
              color="#9B8574"
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color="#C46B3E" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    width: '100%',
  },
  label: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#8C7A6B',
    letterSpacing: 0.8,
    marginBottom: 7,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#EFEAE4',
    paddingHorizontal: 14,
    height: 48,
  },
  inputWrapperError: {
    borderColor: '#C46B3E',
    backgroundColor: '#FEF5F0',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#2C2016',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 5,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C46B3E',
  },
});