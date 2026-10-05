import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';

import ProfileHeaderCard from '../components/ProfileHeaderCard';
import ProfileStatsRow from '../components/ProfileStatsRow';
import ProfileMenuList from '../components/ProfileMenuList';
import LogoutModal from '../components/LogoutModal';

import { getFavoritos } from '../utils/storage';
import {
  auth,
  atualizarNomeUsuario,
} from '../services/authService';

export default function PerfilScreen({
  navigation,
  theme,
  toggleTheme,
}: any) {
  const [favoritosCount, setFavoritosCount] = useState(0);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [avatarLetra, setAvatarLetra] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [nomeEditado, setNomeEditado] = useState('');
  const [salvandoNome, setSalvandoNome] = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    carregarUsuario();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener(
      'focus',
      () => {
        carregarTotalFavoritos();
        carregarUsuario();
      },
    );

    return unsubscribe;
  }, [navigation]);

  const carregarUsuario = () => {
    const usuario = auth.currentUser;

    if (!usuario) {
      setNome('');
      setEmail('');
      setAvatarLetra('');
      return;
    }

    const nomeUsuario =
      usuario.displayName ||
      usuario.email?.split('@')[0] ||
      'Usuário';

    setNome(nomeUsuario);
    setEmail(usuario.email || '');

    setAvatarLetra(
      nomeUsuario.charAt(0).toUpperCase(),
    );
  };

  const carregarTotalFavoritos = async () => {
    try {
      const favs = await getFavoritos();
      setFavoritosCount(favs ? favs.length : 0);
    } catch (error) {
      console.error(
        'Erro ao carregar favoritos:',
        error,
      );

      setFavoritosCount(0);
    }
  };

  const handleNavigateFavoritos = () => {
    navigation.navigate('Favoritos');
  };

  const handleAbrirEdicao = () => {
    setNomeEditado(nome);
    setShowEditModal(true);
  };

  const handleSalvarNome = async () => {
    const novoNome = nomeEditado.trim();

    if (!novoNome) {
      return;
    }

    try {
      setSalvandoNome(true);

      await atualizarNomeUsuario(novoNome);

      setNome(novoNome);
      setAvatarLetra(
        novoNome.charAt(0).toUpperCase(),
      );

      setShowEditModal(false);
    } catch (error) {
      console.error(
        'Erro ao atualizar nome:',
        error,
      );
    } finally {
      setSalvandoNome(false);
    }
  };

  const handleConfirmLogout = async () => {
    try {
      await signOut(auth);
      setShowLogoutModal(false);
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  const userData = {
    nome,
    email,
    avatarLetra,
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? '#0D1912'
            : '#FBF8F3',
        },
      ]}
    >
      <StatusBar
        barStyle={
          isDark
            ? 'light-content'
            : 'dark-content'
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeaderCard
          user={userData}
          isDark={isDark}
          onEdit={handleAbrirEdicao}
        />

        <ProfileStatsRow
          favoritosCount={favoritosCount}
          planejadasCount={0}
          salvasCount={0}
          onNavigateFavoritos={
            handleNavigateFavoritos
          }
          isDark={isDark}
        />

        <ProfileMenuList
          onNavigateFavoritos={
            handleNavigateFavoritos
          }
          onOpenLogoutModal={() =>
            setShowLogoutModal(true)
          }
          onDirectLogout={handleConfirmLogout}
          isDark={isDark}
          toggleTheme={toggleTheme}
        />
      </ScrollView>

      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowEditModal(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.editModal,
              {
                backgroundColor: isDark
                  ? '#15251C'
                  : '#FFFFFF',
              },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                {
                  color: isDark
                    ? '#FAF6F0'
                    : '#2C2016',
                },
              ]}
            >
              Editar perfil
            </Text>

            <Text
              style={[
                styles.inputLabel,
                {
                  color: isDark
                    ? '#A2B3A7'
                    : '#6B5B50',
                },
              ]}
            >
              Nome
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark
                    ? '#0D1912'
                    : '#FBF8F3',
                  borderColor: isDark
                    ? '#2D4536'
                    : '#E0D7CC',
                  color: isDark
                    ? '#FAF6F0'
                    : '#2C2016',
                },
              ]}
              value={nomeEditado}
              onChangeText={setNomeEditado}
              placeholder="Digite seu nome"
              placeholderTextColor={
                isDark
                  ? '#687B6E'
                  : '#A8998D'
              }
              autoCapitalize="words"
              maxLength={50}
            />

            <Text
              style={[
                styles.inputLabel,
                styles.emailLabel,
                {
                  color: isDark
                    ? '#A2B3A7'
                    : '#6B5B50',
                },
              ]}
            >
              E-mail
            </Text>

            <View
              style={[
                styles.emailBox,
                {
                  backgroundColor: isDark
                    ? '#101E16'
                    : '#F3EFE9',
                  borderColor: isDark
                    ? '#233A2C'
                    : '#E0D7CC',
                },
              ]}
            >
              <Text
                style={[
                  styles.emailText,
                  {
                    color: isDark
                      ? '#7F9185'
                      : '#8A7A6C',
                  },
                ]}
              >
                {email}
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  {
                    borderColor: isDark
                      ? '#354C3C'
                      : '#D8CEC2',
                  },
                ]}
                onPress={() =>
                  setShowEditModal(false)
                }
                disabled={salvandoNome}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    {
                      color: isDark
                        ? '#D9E5DB'
                        : '#5A4E43',
                    },
                  ]}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  {
                    opacity: salvandoNome
                      ? 0.6
                      : 1,
                  },
                ]}
                onPress={handleSalvarNome}
                disabled={
                  salvandoNome ||
                  !nomeEditado.trim()
                }
              >
                <Text style={styles.saveButtonText}>
                  {salvandoNome
                    ? 'Salvando...'
                    : 'Salvar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <LogoutModal
        visible={showLogoutModal}
        onClose={() =>
          setShowLogoutModal(false)
        }
        onConfirm={handleConfirmLogout}
        isDark={isDark}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 30,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  editModal: {
    borderRadius: 24,
    padding: 22,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 7,
  },

  emailLabel: {
    marginTop: 16,
  },

  input: {
    height: 48,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 15,
  },

  emailBox: {
    minHeight: 48,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },

  emailText: {
    fontSize: 14,
  },

  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },

  cancelButton: {
    flex: 1,
    height: 46,
    borderWidth: 1.5,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  saveButton: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#2E4A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    color: '#FAF6F0',
    fontSize: 14,
    fontWeight: '700',
  },
});