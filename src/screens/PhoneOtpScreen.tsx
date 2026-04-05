import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../theme';
import * as Kycis from '../kycis';
import { OtpInputField } from '../components/OtpInputField';

interface PhoneOtpScreenProps {
  phoneNumber: string;
  onBack: () => void;
  onVerify: (otp: string) => void;
  onResendProvider: () => void;
}

export const PhoneOtpScreen: React.FC<PhoneOtpScreenProps> = ({
  phoneNumber,
  onBack,
  onVerify,
  onResendProvider,
}) => {
  const [otpValue, setOtpValue] = useState('');
  const otpLength = 4;
  const isOtpValid = otpValue.length === otpLength;

  useEffect(() => {
    if (otpValue.length > 0) {
      Kycis.reportComponentInput({
        componentId: 'phone_otp',
        hint: otpValue.length > 1 ? otpValue[0] + '*'.repeat(otpValue.length - 1) : otpValue,
        screen: 'PHONE_OTP',
        componentType: 'otp_input',
      });
    }
  }, [otpValue]);

  const handleVerify = () => {
    Kycis.setUser(phoneNumber, phoneNumber);
    Kycis.trackAnalytics('phone_verified', { phone: phoneNumber });
    onVerify(otpValue);
  };

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
          <TouchableOpacity onPress={() => onVerify('0000')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Please check your phone.</Text>
          <Text style={styles.subtitle}>
            We've sent a code to {phoneNumber}
          </Text>

          <View style={styles.otpContainer}>
            <OtpInputField
              value={otpValue}
              onChange={setOtpValue}
              length={otpLength}
            />
          </View>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't get a code? </Text>
            <TouchableOpacity onPress={onResendProvider}>
              <Text style={styles.resendLink}>Click to resend.</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, !isOtpValid && styles.buttonDisabled]}
            onPress={() => handleVerify()}
            disabled={!isOtpValid}
          >
            <Text style={styles.buttonText}>Verify</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: ThemeColors.gray900,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: ThemeColors.gray700,
    marginTop: 8,
  },
  otpContainer: {
    marginTop: 32,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    color: ThemeColors.gray700,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    color: ThemeColors.primary,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
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