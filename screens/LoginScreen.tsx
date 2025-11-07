import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { authService, LoginRequest } from '../services/authService';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  navigation?: any;
  onLoginSuccess?: (token: string, userId: string) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  navigation,
  onLoginSuccess,
}) => {
  const { setAuth } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Registration form fields
  const [registerData, setRegisterData] = useState({
    name: '',
    profileInfo: '',
    fitnessLevel: '',
    goals: '',
  });

  const handleLogin = async () => {
    // For now, just navigate to home - we'll add auth later
    if (navigation) {
      navigation.replace('MainTabs');
    } else if (onLoginSuccess) {
      // Mock login for testing
      await setAuth('mock-token', 'mock-user-id');
      onLoginSuccess('mock-token', 'mock-user-id');
    }
    
    // TODO: Uncomment when ready to connect to backend
    /*
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const loginRequest: LoginRequest = {
        email: email.trim(),
        password: password,
      };

      const response = await authService.login(loginRequest);
      
      // Save token and user ID using auth context
      await setAuth(response.accessToken, response.userId);

      // Call success callback or navigate
      if (onLoginSuccess) {
        onLoginSuccess(response.accessToken, response.userId);
      } else if (navigation) {
        navigation.replace('MainTabs');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
    */
  };

  const handleRegister = async () => {
    // For now, just navigate to home - we'll add auth later
    if (navigation) {
      navigation.replace('MainTabs');
    } else if (onLoginSuccess) {
      // Mock registration for testing
      await setAuth('mock-token', 'mock-user-id');
      onLoginSuccess('mock-token', 'mock-user-id');
    }
    
    // TODO: Uncomment when ready to connect to backend
    /*
    if (!email.trim() || !password.trim() || !registerData.name.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.register({
        email: email.trim(),
        password: password,
        name: registerData.name.trim(),
        profileInfo: registerData.profileInfo.trim() || undefined,
        fitnessLevel: registerData.fitnessLevel.trim() || undefined,
        goals: registerData.goals.trim() || undefined,
      });

      // Save token and user ID using auth context
      await setAuth(response.accessToken, response.userId);

      // Call success callback or navigate
      if (onLoginSuccess) {
        onLoginSuccess(response.accessToken, response.userId);
      } else if (navigation) {
        navigation.replace('Home');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.hero}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>BUILD YOUR STREAK</Text>
            </View>
            <Text style={styles.heroTitle}>
              {showRegister ? 'Join PulseFit' : 'Welcome Back'}
            </Text>
            <Text style={styles.heroSubtitle}>
              Track every rep, recover smarter, and stay consistent with your goals.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <TouchableOpacity
                style={[styles.segment, !showRegister && styles.segmentActive]}
                onPress={() => {
                  setShowRegister(false);
                  setError(null);
                }}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.segmentText,
                    !showRegister && styles.segmentTextActive,
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segment, showRegister && styles.segmentActive]}
                onPress={() => {
                  setShowRegister(true);
                  setError(null);
                }}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.segmentText,
                    showRegister && styles.segmentTextActive,
                  ]}
                >
                  Register
                </Text>
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.errorContainer}>
                <Ionicons
                  name="alert-circle"
                  size={18}
                  color={theme.colors.error}
                />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.colors.text.secondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={theme.colors.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError(null);
                  }}
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.colors.text.secondary}
                />
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={theme.colors.text.muted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    setError(null);
                  }}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={theme.colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {showRegister && (
              <View style={styles.registerFields}>
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Name</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="person-circle-outline"
                      size={20}
                      color={theme.colors.text.secondary}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Your full name"
                      placeholderTextColor={theme.colors.text.muted}
                      value={registerData.name}
                      onChangeText={(text) =>
                        setRegisterData({ ...registerData, name: text })
                      }
                    />
                  </View>
                </View>

                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Profile Info</Text>
                  <View style={[styles.inputWrapper, styles.multilineWrapper]}>
                    <Ionicons
                      name="chatbox-ellipses-outline"
                      size={20}
                      color={theme.colors.text.secondary}
                      style={styles.multilineIcon}
                    />
                    <TextInput
                      style={[styles.input, styles.multilineInput]}
                      placeholder="Tell us about yourself"
                      placeholderTextColor={theme.colors.text.muted}
                      multiline
                      textAlignVertical="top"
                      numberOfLines={3}
                      value={registerData.profileInfo}
                      onChangeText={(text) =>
                        setRegisterData({ ...registerData, profileInfo: text })
                      }
                    />
                  </View>
                </View>

                <View style={styles.inlineFields}>
                  <View style={[styles.fieldGroup, styles.inlineField]}>
                    <Text style={styles.label}>Fitness Level</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="barbell-outline"
                        size={20}
                        color={theme.colors.text.secondary}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Intermediate"
                        placeholderTextColor={theme.colors.text.muted}
                        value={registerData.fitnessLevel}
                        onChangeText={(text) =>
                          setRegisterData({
                            ...registerData,
                            fitnessLevel: text,
                          })
                        }
                      />
                    </View>
                  </View>
                  <View style={[styles.fieldGroup, styles.inlineField]}>
                    <Text style={styles.label}>Goals</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="flag-outline"
                        size={20}
                        color={theme.colors.text.secondary}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Build strength"
                        placeholderTextColor={theme.colors.text.muted}
                        value={registerData.goals}
                        onChangeText={(text) =>
                          setRegisterData({ ...registerData, goals: text })
                        }
                      />
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.ctaSection}>
              <Button
                title={showRegister ? 'Create Account' : 'Log In'}
                onPress={showRegister ? handleRegister : handleLogin}
                variant="primary"
                loading={loading}
              />
              <TouchableOpacity activeOpacity={0.8}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomNote}>
            <Text style={styles.bottomNoteText}>
              By continuing you agree to our{' '}
              <Text style={styles.link}>Terms</Text> and{' '}
              <Text style={styles.link}>Privacy Policy</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    gap: theme.spacing.xl,
  },
  hero: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.accent + '25',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.lg,
  },
  heroBadgeText: {
    ...theme.typography.caption,
    color: theme.colors.accent,
    letterSpacing: 1,
  },
  heroTitle: {
    ...theme.typography.h1,
    color: theme.colors.text.primary,
  },
  heroSubtitle: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    lineHeight: 22,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xs,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.error + '20',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.error,
    flex: 1,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.xl,
  },
  segmentActive: {
    backgroundColor: theme.colors.background,
  },
  segmentText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: theme.colors.text.primary,
  },
  label: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
  },
  fieldGroup: {
    gap: theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    minHeight: 56,
  },
  input: {
    flex: 1,
    ...theme.typography.body,
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  eyeButton: {
    marginLeft: theme.spacing.sm,
  },
  registerFields: {
    gap: theme.spacing.lg,
  },
  multilineWrapper: {
    alignItems: 'flex-start',
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  multilineIcon: {
    marginTop: theme.spacing.xs,
  },
  multilineInput: {
    minHeight: 80,
  },
  inlineFields: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  inlineField: {
    flex: 1,
    minWidth: '48%',
  },
  ctaSection: {
    gap: theme.spacing.md,
  },
  forgotText: {
    ...theme.typography.body,
    color: theme.colors.accent,
    fontWeight: '600',
    textAlign: 'center',
  },
  bottomNote: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  bottomNoteText: {
    ...theme.typography.caption,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: theme.colors.accent,
  },
});

