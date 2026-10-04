import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { CustomInput } from '../components/CustomInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { SocialButton } from '../components/SocialButton';
import Divisor from '../components/Divisor';
import { PasswordStrengthBar } from '../components/PasswordStrengthBar';
import { entrarComEmailESenha, recuperarSenha, entrarComGoogle } from '../services/authService';

interface LoginScreenProps {
  navigation: any;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}
export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, theme = 'light' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const isDark = theme === 'dark';

  const colors = {
    bg: isDark ? '#121212' : '#FAF8F5',
    textPrimary: isDark ? '#F3EFEA' : '#2C2016',
    textSecondary: isDark ? '#A09388' : '#8C7A6B',
    brand: isDark ? '#82B382' : '#6B8C6B',
    logoBg: isDark ? '#1E331E' : '#2E4A2E',
    link: isDark ? '#82B382' : '#2E4A2E',
  };

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const emailError = submitted && !email
    ? 'E-mail obrigatório'
    : submitted && !isValidEmail(email)
      ? 'E-mail inválido'
      : '';

  const passwordError = submitted && !password
    ? 'Senha obrigatória'
    : submitted && password.length < 8
      ? 'Senha muito curta'
      : '';

  const handleSubmit = async () => {
    setSubmitted(true);
    setGlobalError('');

    if (
      !email ||
      !isValidEmail(email) ||
      !password ||
      password.length < 8
    ) {
      return;
    }

    setLoading(true);

    try {
      await entrarComEmailESenha(
        email.trim(),
        password,
      );
    } catch (error: any) {
      console.log('Erro ao fazer login:', error);

      if (error.code === 'auth/invalid-credential') {
        setGlobalError('E-mail ou senha incorretos.');
      } else if (error.code === 'auth/invalid-email') {
        setGlobalError('E-mail inválido.');
      } else {
        setGlobalError('Não foi possível entrar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setGlobalError('');

    if (!email || !isValidEmail(email)) {
      setGlobalError('Digite um e-mail válido para recuperar sua senha.');
      return;
    }

    try {
      await recuperarSenha(email);

      setGlobalError(
        'Se esse e-mail estiver cadastrado, enviaremos as instruções para redefinir sua senha.',
      );
    } catch (error: any) {
      console.log('Erro ao recuperar senha:', error);

      if (error.code === 'auth/invalid-email') {
        setGlobalError('E-mail inválido.');
      } else {
        setGlobalError(
          'Não foi possível enviar o e-mail de recuperação.',
        );
      }
    }
  };

  const handleGoogleLogin = async () => {
    setGlobalError('');
    setLoading(true);

    try {
      await entrarComGoogle();
    } catch (error: any) {
      console.log('Erro ao fazer login com Google:', error);

      if (error.code === 'SIGN_IN_CANCELLED') {
        return;
      }

      setGlobalError('Não foi possível entrar com o Google. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF8F5" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Cabeçalho / Logo */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons name="leaf-outline" size={20} color="#FAF6F0" />
          </View>
          <Text style={styles.brandTitle}>SABORES PLANEJADOS</Text>
          <Text style={styles.welcomeTitle}>Que bom ter você{'\n'}de volta!</Text>
          <Text style={styles.subtitle}>Entre para continuar planejando suas receitas.</Text>
        </View>

        {/* Erro Global */}
        {!!globalError && (
          <View style={styles.globalErrorBox}>
            <Ionicons name="alert-circle-outline" size={16} color="#C46B3E" />
            <Text style={styles.globalErrorText}>{globalError}</Text>
          </View>
        )}

        {/* Formulário */}
        <View style={styles.form}>
          <CustomInput
            label="E-MAIL"
            iconName="mail-outline"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
          />

          <CustomInput
            label="SENHA"
            iconName="lock-closed-outline"
            placeholder="Sua senha"
            isPassword
            value={password}
            onChangeText={setPassword}
            error={passwordError}
          />

          {/* Barra de Força da Senha */}
          <PasswordStrengthBar password={password} />

          <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassword}>
            <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <PrimaryButton
            title={loading ? 'Entrando...' : 'Entrar'}
            loading={loading}
            onPress={handleSubmit}
          />

          <Divisor texto="ou" />

          <SocialButton
            title="Continuar com Google"
            onPress={handleGoogleLogin}
            disabled={loading}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Ainda não tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpText}>Criar conta</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  scrollContent: {
    paddingHorizontal: 26,
    paddingTop: 44,
    paddingBottom: 40,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2E4A2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  brandTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B8C6B',
    letterSpacing: 1.8,
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2C2016',
    textAlign: 'center',
    lineHeight: 31,
  },
  subtitle: {
    fontSize: 14,
    color: '#8C7A6B',
    marginTop: 8,
    textAlign: 'center',
  },
  globalErrorBox: {
    backgroundColor: '#FEF5F0',
    borderWidth: 1.5,
    borderColor: '#F0C4AC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
  },
  globalErrorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C46B3E',
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 28,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#C46B3E',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 28,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#8C7A6B',
  },
  signUpText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E4A2E',
  },
});