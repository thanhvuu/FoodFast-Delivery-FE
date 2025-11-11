import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import { useAuth } from '../context/AuthContext';

const AuthScreen: React.FC = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetMessages = useCallback(() => {
    setError(null);
    setSuccess(null);
  }, []);

  const handleToggleMode = useCallback(
    (nextMode: 'login' | 'register') => {
      setMode(nextMode);
      resetMessages();
      if (nextMode === 'login') {
        setConfirmPassword('');
      }
    },
    [resetMessages]
  );

  const handleSubmit = useCallback(async () => {
    resetMessages();
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        setSuccess('Đăng nhập thành công');
      } else {
        if (password !== confirmPassword) {
          throw new Error('Mật khẩu xác nhận không khớp');
        }
        await register({ username: username.trim(), email, password });
        setMode('login');
        setSuccess('Đăng ký thành công — hãy đăng nhập');
        setEmail('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Đã xảy ra lỗi không mong muốn';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [confirmPassword, email, login, mode, password, register, resetMessages, username]);

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 32 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <Text style={styles.title}>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</Text>
            <View style={styles.switcher}>
              <TouchableOpacity
                style={[styles.switchButton, mode === 'login' && styles.switchButtonActive]}
                onPress={() => handleToggleMode('login')}
                activeOpacity={0.85}
              >
                <Text style={[styles.switchLabel, mode === 'login' && styles.switchLabelActive]}>Đăng nhập</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.switchButton, mode === 'register' && styles.switchButtonActive]}
                onPress={() => handleToggleMode('register')}
                activeOpacity={0.85}
              >
                <Text style={[styles.switchLabel, mode === 'register' && styles.switchLabelActive]}>Đăng ký</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.form}>
              {mode === 'register' && (
                <View style={styles.field}>
                  <Text style={styles.label}>Tên người dùng</Text>
                  <TextInput
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Nhập tên người dùng"
                    style={styles.input}
                    placeholderTextColor={colors.muted}
                  />
                </View>
              )}

              <View style={styles.field}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Nhập email"
                  style={styles.input}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholderTextColor={colors.muted}
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Mật khẩu</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Nhập mật khẩu"
                  style={styles.input}
                  secureTextEntry
                  placeholderTextColor={colors.muted}
                />
              </View>

              {mode === 'register' && (
                <View style={styles.field}>
                  <Text style={styles.label}>Xác nhận mật khẩu</Text>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Nhập lại mật khẩu"
                    style={styles.input}
                    secureTextEntry
                    placeholderTextColor={colors.muted}
                  />
                </View>
              )}

              {error && <Text style={styles.error}>{error}</Text>}
              {success && <Text style={styles.success}>{success}</Text>}

              <TouchableOpacity
                style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitLabel}>{mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 32,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
  },
  switcher: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    backgroundColor: '#F4F5FC',
    borderRadius: 24,
    padding: 4,
  },
  switchButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    alignItems: 'center',
  },
  switchButtonActive: {
    backgroundColor: colors.primary,
  },
  switchLabel: {
    fontWeight: '600',
    color: colors.muted,
  },
  switchLabelActive: {
    color: '#fff',
  },
  form: {
    marginTop: spacing.lg,
  },
  field: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    fontWeight: '600',
    color: colors.muted,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: '#F9FAFF',
    color: colors.text,
  },
  error: {
    color: '#D64545',
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  success: {
    color: colors.success,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: 24,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitLabel: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default AuthScreen;
