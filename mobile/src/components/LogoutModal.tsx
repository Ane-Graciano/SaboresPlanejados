import React from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LogoutModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDark?: boolean;
}

export default function LogoutModal({ visible, onClose, onConfirm, isDark }: LogoutModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.content, isDark && styles.contentDark]}>
          <View style={styles.handle} />
          
          <View style={styles.iconBox}>
            <Ionicons name="log-out-outline" size={28} color="#C46B3E" />
          </View>

          <Text style={[styles.title, isDark && styles.textDark]}>Sair da conta?</Text>
          <Text style={styles.subText}>
            Você precisará entrar novamente para acessar suas receitas e planejamentos salvos.
          </Text>

          <TouchableOpacity style={styles.confirmBtn} onPress={onConfirm} activeOpacity={0.85}>
            <Ionicons name="log-out-outline" size={18} color="#FAF6F0" />
            <Text style={styles.confirmText}>Confirmar saída</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.cancelBtn, isDark && styles.cancelBtnDark]} onPress={onClose}>
            <Text style={[styles.cancelText, isDark && styles.cancelTextDark]}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FAF8F5',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 36,
    alignItems: 'center',
  },
  contentDark: {
    backgroundColor: '#16251C',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#EFEAE4',
    borderRadius: 2,
    marginBottom: 20,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF5F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C2016',
    marginBottom: 6,
  },
  textDark: {
    color: '#E0E7E1',
  },
  subText: {
    fontSize: 13,
    color: '#8C7A6B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 18,
  },
  confirmBtn: {
    width: '100%',
    backgroundColor: '#C46B3E',
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  confirmText: {
    color: '#FAF6F0',
    fontSize: 15,
    fontWeight: '700',
  },
  cancelBtn: {
    width: '100%',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#EFEAE4',
  },
  cancelBtnDark: {
    borderColor: '#2A3C30',
  },
  cancelText: {
    color: '#8C7A6B',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelTextDark: {
    color: '#94A398',
  },
});