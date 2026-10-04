import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileMenuListProps {
  onNavigateFavoritos: () => void;
  onOpenLogoutModal: () => void;
  onDirectLogout: () => void;
  isDark: boolean;
  toggleTheme?: () => void;
}

export default function ProfileMenuList({
  onNavigateFavoritos,
  onOpenLogoutModal,
  onDirectLogout,
  isDark,
  toggleTheme,
}: ProfileMenuListProps) {
  const [notifs, setNotifs] = useState(true);

  return (
    <View style={styles.container}>
      {/* Seção Meu Aplicativo */}
      <Text style={styles.sectionTitle}>MEU APLICATIVO</Text>
      <View style={[styles.sectionBox, isDark && styles.sectionBoxDark]}>
        <TouchableOpacity style={styles.row} onPress={onNavigateFavoritos}>
          <View style={[styles.rowIcon, { backgroundColor: isDark ? '#2A3C30' : '#F0EAE1' }]}>
            <Ionicons name="heart-outline" size={18} color={isDark ? '#E0E7E1' : '#2C2016'} />
          </View>
          <View style={styles.rowTextContainer}>
            <Text style={[styles.rowLabel, isDark && styles.textDark]}>Favoritos</Text>
            <Text style={styles.rowSub}>Suas receitas salvas</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C4B4A4" />
        </TouchableOpacity>
      </View>

      {/* Seção Preferências */}
      <Text style={styles.sectionTitle}>PREFERÊNCIAS</Text>
      <View style={[styles.sectionBox, isDark && styles.sectionBoxDark]}>
        <View style={styles.row}>
          <View style={[styles.rowIcon, { backgroundColor: isDark ? '#2A3C30' : '#F0EAE1' }]}>
            <Ionicons name="notifications-outline" size={18} color={isDark ? '#E0E7E1' : '#2C2016'} />
          </View>
          <View style={styles.rowTextContainer}>
            <Text style={[styles.rowLabel, isDark && styles.textDark]}>Notificações</Text>
            <Text style={styles.rowSub}>{notifs ? 'Ativadas' : 'Desativadas'}</Text>
          </View>
          <Switch
            value={notifs}
            onValueChange={setNotifs}
            trackColor={{ false: '#D8CFBF', true: '#2E4A2E' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={[styles.row, { borderBottomWidth: 0 }]}>
          <View style={[styles.rowIcon, { backgroundColor: isDark ? '#2A3C30' : '#F0EAE1' }]}>
            <Ionicons name="moon-outline" size={18} color={isDark ? '#E0E7E1' : '#2C2016'} />
          </View>
          <View style={styles.rowTextContainer}>
            <Text style={[styles.rowLabel, isDark && styles.textDark]}>Modo escuro</Text>
            <Text style={styles.rowSub}>{isDark ? 'Ativado' : 'Desativado'}</Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#D8CFBF', true: '#2E4A2E' }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      {/* Botão Sair da Conta */}
      <View style={[styles.sectionBox, { borderColor: '#F0C4AC', marginTop: 12 }]}>
        <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]} onPress={onOpenLogoutModal}>
          <View style={[styles.rowIcon, { backgroundColor: '#FEF5F0' }]}>
            <Ionicons name="log-out-outline" size={18} color="#C46B3E" />
          </View>
          <View style={styles.rowTextContainer}>
            <Text style={[styles.rowLabel, { color: '#C46B3E' }]}>Sair da conta</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C4B4A4" />
        </TouchableOpacity>
      </View>

      {/* Botão Entrar / Trocar Conta */}
      <View style={[styles.sectionBox, isDark && styles.sectionBoxDark, { marginTop: 12 }]}>
        <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]} onPress={onDirectLogout}>
          <View style={[styles.rowIcon, { backgroundColor: isDark ? '#2A3C30' : '#F0EAE1' }]}>
            <Ionicons name="key-outline" size={18} color={isDark ? '#E0E7E1' : '#2C2016'} />
          </View>
          <View style={styles.rowTextContainer}>
            <Text style={[styles.rowLabel, isDark && styles.textDark]}>Entrar / Trocar conta</Text>
            <Text style={styles.rowSub}>Acesse a tela de login</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#C4B4A4" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#8C7A6B',
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#EFEAE4',
    overflow: 'hidden',
    marginBottom: 16,
  },
  sectionBoxDark: {
    backgroundColor: '#16251C',
    borderColor: '#2A3C30',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F4EFEA',
    gap: 12,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowTextContainer: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2016',
  },
  textDark: {
    color: '#E0E7E1',
  },
  rowSub: {
    fontSize: 12,
    color: '#8C7A6B',
    marginTop: 2,
  },
});