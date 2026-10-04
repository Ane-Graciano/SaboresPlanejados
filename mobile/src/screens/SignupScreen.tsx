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

import { cadastrarUsuario } from '../services/authService';

export const SignupScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [terms, setTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const isValidEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // Validações
  const nameError =
    submitted && !name.trim()
      ? 'Nome obrigatório'
      : '';

  const emailError =
    submitted && !email
      ? 'E-mail obrigatório'
      : submitted && !isValidEmail(email)
        ? 'E-mail inválido'
        : '';

  const passwordError =
    submitted && !password
      ? 'Senha obrigatória'
      : submitted && password.length < 8
        ? 'Mínimo de 8 caracteres'
        : '';

  const confirmError =
    submitted && !confirmPassword
      ? 'Confirme a senha'
      : submitted && confirmPassword !== password
        ? 'As senhas não conferem'
        : '';

  const termsError =
    submitted && !terms
      ? 'Aceite os termos para continuar'
      : '';

  const handleSubmit = async () => {
    setSubmitted(true);
    setGlobalError('');

    if (
      !name.trim() ||
      !isValidEmail(email) ||
      password.length < 8 ||
      confirmPassword !== password ||
      !terms
    ) {
      return;
    }

    setLoading(true);

    try {
      await cadastrarUsuario(
        name.trim(),
        email.trim(),
        password,
      );

      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error: any) {
      console.log('Erro ao cadastrar:', error);

      if (error.code === 'auth/email-already-in-use') {
        setGlobalError(
          'Este e-mail já está cadastrado.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FAF8F5"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo / Header */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <Ionicons
              name="leaf-outline"
              size={20}
              color="#FAF6F0"
            />
          </View>

          <Text style={styles.brandTitle}>
            SABORES PLANEJADOS
          </Text>

          <Text style={styles.welcomeTitle}>
            Crie sua conta
          </Text>

          <Text style={styles.subtitle}>
            Comece a planejar suas refeições com prazer.
          </Text>
        </View>

        {/* Erro global */}
        {!!globalError && (
          <View style={styles.globalErrorBox}>
            <Ionicons
              name="alert-circle-outline"
              size={16}
              color="#C46B3E"
            />

            <Text style={styles.globalErrorText}>
              {globalError}
            </Text>
          </View>
        )}

        {/* Formulário */}
        <View style={styles.form}>
          <CustomInput
            label="NOME"
            iconName="person-outline"
            placeholder="Seu nome"
            value={name}
            onChangeText={setName}
            error={nameError}
          />

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
            placeholder="Mínimo 8 caracteres"
            isPassword
            value={password}
            onChangeText={setPassword}
            error={passwordError}
          />

          {/* Barra indicador de força de senha */}
          <PasswordStrengthBar
            password={password}
          />

          <CustomInput
            label="CONFIRMAR SENHA"
            iconName="lock-closed-outline"
            placeholder="Repita a senha"
            isPassword
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            error={confirmError}
          />

          {/* Checkbox Termos */}
          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setTerms(!terms)}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.checkbox,
                  terms && styles.checkboxActive,
                  !!termsError &&
                    styles.checkboxError,
                ]}
              >
                {terms && (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color="#FAF6F0"
                  />
                )}
              </View>

              <Text style={styles.termsText}>
                Li e aceito os{' '}
                <Text style={styles.termsBold}>
                  Termos de Uso
                </Text>{' '}
                e a{' '}
                <Text style={styles.termsBold}>
                  Política de Privacidade
                </Text>
              </Text>
            </TouchableOpacity>

            {!!termsError && (
              <View style={styles.errorRow}>
                <Ionicons
                  name="alert-circle-outline"
                  size={14}
                  color="#C46B3E"
                />

                <Text style={styles.errorText}>
                  {termsError}
                </Text>
              </View>
            )}
          </View>

          <PrimaryButton
            title={
              loading
                ? 'Criando conta...'
                : 'Criar conta'
            }
            loading={loading}
            onPress={handleSubmit}
          />

          <Divisor texto="ou" />

          <SocialButton
            title="Continuar com Google"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Já tem uma conta?{' '}
          </Text>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Login')
            }
          >
            <Text style={styles.signInText}>
              Entrar
            </Text>
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
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },

  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2E4A2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  brandTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B8C6B',
    letterSpacing: 1.8,
    marginBottom: 12,
    textTransform: 'uppercase',
  },

  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2C2016',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#8C7A6B',
    marginTop: 6,
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

  termsContainer: {
    marginBottom: 20,
    marginTop: 4,
  },

  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#C4B4A4',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    backgroundColor: '#FFFFFF',
  },

  checkboxActive: {
    backgroundColor: '#2E4A2E',
    borderColor: '#2E4A2E',
  },

  checkboxError: {
    borderColor: '#C46B3E',
  },

  termsText: {
    flex: 1,
    fontSize: 13,
    color: '#6B5744',
    lineHeight: 18,
  },

  termsBold: {
    fontWeight: '700',
    color: '#2E4A2E',
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },

  errorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#C46B3E',
  },

  footer: {
    flexDirection: 'row',
    marginTop: 24,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 14,
    color: '#8C7A6B',
  },

  signInText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E4A2E',
  },
});