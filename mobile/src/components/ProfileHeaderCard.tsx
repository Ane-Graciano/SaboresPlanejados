import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface UserData {
  nome: string;
  email: string;
  avatarLetra: string;
  planejadasCount?: number;
  salvasCount?: number;
}

interface ProfileHeaderCardProps {
  user: UserData;
  onEdit?: () => void; // Prop opcional
  isDark?: boolean;
}

export default function ProfileHeaderCard({ user, onEdit, isDark }: ProfileHeaderCardProps) {
  return (
    <View
      style={[
        styles.profileCard,
        {
          backgroundColor: isDark ? '#15251C' : '#FFFFFF',
          borderColor: isDark ? '#233A2C' : '#E8DFD3',
        },
      ]}
    >
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarText}>{user.avatarLetra}</Text>
      </View>

      <Text style={[styles.userName, { color: isDark ? '#FAF6F0' : '#2C2016' }]}>
        {user.nome}
      </Text>
      <Text style={[styles.userEmail, { color: isDark ? '#8A9E90' : '#8A7A6C' }]}>
        {user.email}
      </Text>

      <TouchableOpacity style={styles.editButton} onPress={onEdit} activeOpacity={0.7}>
        <Feather name="edit-2" size={12} color="#5A4E43" />
        <Text style={styles.editButtonText}>Editar perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
    paddingVertical: 20,
    borderRadius: 24,
    borderWidth: 1.5,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3E5C43',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EAE3D9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  editButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5A4E43',
  },
});