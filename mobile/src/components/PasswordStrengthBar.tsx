import React from 'react';
import { StyleSheet, View } from 'react-native';

interface PasswordStrengthBarProps {
  password?: string;
}

export const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({ password = '' }) => {
  if (!password) return null;

  const getStrengthLevel = () => {
    if (password.length < 4) return 1;
    if (password.length < 8) return 2;
    if (/[A-Z]/.test(password) && /[0-9]/.test(password)) return 4;
    return 3;
  };

  const strength = getStrengthLevel();

  const getColor = (lvl: number) => {
    if (lvl > strength) return '#EDE8DF';
    if (strength <= 1) return '#C46B3E';
    if (strength <= 2) return '#D4944A';
    if (strength <= 3) return '#6B8C6B';
    return '#2E4A2E';
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4].map((lvl) => (
        <View
          key={lvl}
          style={[styles.bar, { backgroundColor: getColor(lvl) }]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    marginTop: -6,
    marginBottom: 14,
  },
  bar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
});