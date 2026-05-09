import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/common/Button';
import { Header } from '../components/common/Header';
import { Input } from '../components/common/Input';
import { useRegisterMutation } from '../redux/api/authApi';
import { setAuth } from '../redux/slices/authSlice';
import { AuthStackParamList } from '../navigation/types';
import { useTranslate } from '../locales';
import { getApiErrorMessage, normalizeEmail, validateRegisterForm } from '../utils/auth';
import { colors, spacing, radius } from '../theme';
import { useTheme } from '../hooks/useTheme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const t = useTranslate();
  const dispatch = useDispatch();
  const { colors: themeColors } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [register, { isLoading }] = useRegisterMutation();

  const clearError = () => {
    if (errorText) {
      setErrorText(null);
    }
  };

  const updateFullName = (value: string) => {
    setFullName(value);
    clearError();
  };

  const updateEmail = (value: string) => {
    setEmail(value);
    clearError();
  };

  const updatePassword = (value: string) => {
    setPassword(value);
    clearError();
  };

  const updateConfirmPassword = (value: string) => {
    setConfirmPassword(value);
    clearError();
  };

  const handleRegister = async () => {
    const normalizedEmail = normalizeEmail(email);
    const validationError = validateRegisterForm({
      fullName,
      email: normalizedEmail,
      password,
      confirmPassword,
    });

    if (validationError) {
      setErrorText(validationError);
      return;
    }

    try {
      setErrorText(null);
      const payload = await register({
        fullName: fullName.trim(),
        email: normalizedEmail,
        password,
      }).unwrap();
      dispatch(setAuth(payload));
    } catch (error) {
      setErrorText(getApiErrorMessage(error, t('errors.unableToCreateAccount')));
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: themeColors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={[styles.card, { backgroundColor: themeColors.card, borderColor: themeColors.border }]}>
            <Header
              title={t('auth.createAccount')}
              subtitle={t('auth.registerNewUser')}
            />
            <Input
              placeholder={t('auth.fullName')}
              value={fullName}
              onChangeText={updateFullName}
              autoCapitalize="words"
            />
            <Input
              placeholder={t('auth.email')}
              value={email}
              onChangeText={updateEmail}
              autoCapitalize="none"
              autoCorrect={false}
              editable={true}
              keyboardType="email-address"
              textContentType="emailAddress"
            />
            <Input
              placeholder={t('auth.password')}
              secureTextEntry={true}
              value={password}
              onChangeText={updatePassword}
              textContentType="newPassword"
            />
            <Input
              placeholder={t('auth.confirmPassword')}
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={updateConfirmPassword}
              textContentType="password"
            />
            {errorText ? <Text style={[styles.errorText, { color: themeColors.danger }]}>{errorText}</Text> : null}
            <Button
              label={isLoading ? t('auth.registering') : t('auth.createAccount')}
              onPress={handleRegister}
              disabled={isLoading}
            />
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.link, { color: themeColors.primary }]}>
                {t('auth.alreadyHaveAccount')}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    borderRadius: radius.lg,
    borderWidth: 1,
    padding: spacing.lg,
  },
  errorText: {
    marginBottom: spacing.md,
    fontSize: 13,
  },
  link: {
    marginTop: spacing.lg,
    textAlign: 'center',
    fontWeight: '600',
  },
});
