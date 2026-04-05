import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../theme';
import * as Kycis from '../kycis';
import emailImage from '../assets/emailinput2.png';

interface EmailEntryScreenProps {
  onBack: () => void;
  onGetOtp: (email: string) => void;
}

export const EmailEntryScreen: React.FC<EmailEntryScreenProps> = ({
  onBack,
  onGetOtp,
}) => {
  const [email, setEmail] = useState('');
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}$/;
  const isEmailValid = emailRegex.test(email);

  useEffect(() => {
    if (email.length > 0) {
      Kycis.reportComponentInput({
        componentId: 'email',
        hint: email.includes('@') ? email.split('@')[0].slice(0, 3) + '***@' + email.split('@')[1] : email,
        screen: 'EMAIL_ENTRY',
        componentType: 'text_input',
      });
    }
  }, [email]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ThemeColors.lightBackground} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={ThemeColors.gray900} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onGetOtp('demo@example.com')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.title}>Verify email via OTP</Text>
            
            <Text style={styles.fieldLabel}>Enter your Email id</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email id"
                placeholderTextColor={ThemeColors.gray500}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {email.length > 0 && !isEmailValid && (
                <Text style={styles.errorText}>Enter a valid email address</Text>
              )}
            </View>

            <View style={styles.illustrationContainer}>
              <Image
                source={emailImage}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.trustedContainer}>
            <Ionicons
              name="shield-checkmark"
              size={16}
              color={ThemeColors.primary}
            />
            <Text style={styles.trustedText}>Your Data is 100% safe</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, !isEmailValid && styles.buttonDisabled]}
            onPress={() => onGetOtp(email)}
            disabled={!isEmailValid}
          >
            <Text style={styles.buttonText}>Get OTP</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.lightBackground,
    paddingTop: StatusBar.currentHeight || 0,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  skipText: {
    color: ThemeColors.primary,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: ThemeColors.gray900,
    marginTop: 16,
  },
  fieldLabel: {
    fontSize: 14,
    color: ThemeColors.gray700,
    marginTop: 32,
  },
  inputContainer: {
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: ThemeColors.gray500,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: ThemeColors.gray900,
    backgroundColor: ThemeColors.white,
  },
  errorText: {
    fontSize: 12,
    color: ThemeColors.red500,
    marginTop: 4,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  illustration: {
    width: '100%',
    height: 240,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  trustedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  trustedText: {
    fontSize: 12,
    fontWeight: '600',
    color: ThemeColors.gray700,
    marginLeft: 4,
  },
  button: {
    backgroundColor: ThemeColors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: ThemeColors.primary,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: ThemeColors.white,
  },
});
