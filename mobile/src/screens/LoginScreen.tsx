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
import { useDispatch } from 'react-redux';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Header } from '../components/common/Header';
import { useLoginMutation } from '../redux/api/authApi';
import { setAuth } from '../redux/slices/authSlice';
import { AuthStackParamList } from '../navigation/types';
import { useTranslate } from '../locales';
import { getApiErrorMessage, normalizeEmail, validateLoginForm } from '../utils/auth';
import { colors, spacing, radius } from '../theme';
import { useTheme } from '../hooks/useTheme';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const t = useTranslate();
  const dispatch = useDispatch();
  const { colors: themeColors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);
  const [login, { isLoading }] = useLoginMutation();

  const updateEmail = (value: string) => {
    setEmail(value);
    if (errorText) {
      setErrorText(null);
    }
  };

  const updatePassword = (value: string) => {
    setPassword(value);
    if (errorText) {
      setErrorText(null);
    }
  };

  const handleLogin = async () => {
    const normalizedEmail = normalizeEmail(email);
    const validationError = validateLoginForm({
      email: normalizedEmail,
      password,
    });

    if (validationError) {
      setErrorText(validationError);
      return;
    }

    try {
      setErrorText(null);
      const payload = await login({ email: normalizedEmail, password }).unwrap();
      dispatch(setAuth(payload));
    } catch (error) {
      setErrorText(getApiErrorMessage(error, t('errors.unableToSignIn')));
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
              title="Smart AC"
              subtitle={t('auth.signInToAccount')}
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
              textContentType="password"
            />
            {errorText ? <Text style={[styles.errorText, { color: themeColors.danger }]}>{errorText}</Text> : null}
            <Button
              label={isLoading ? t('auth.signingIn') : t('auth.signIn')}
              onPress={handleLogin}
              disabled={isLoading}
            />
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.link, { color: themeColors.primary }]}>
                {t('auth.noAccount')}
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
