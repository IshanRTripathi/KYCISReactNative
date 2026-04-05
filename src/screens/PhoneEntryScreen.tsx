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
import phoneImage from '../assets/phoneinput2.png';

interface PhoneEntryScreenProps {
  onBack: () => void;
  onGetOtp: (phone: string) => void;
}

export const PhoneEntryScreen: React.FC<PhoneEntryScreenProps> = ({
  onBack,
  onGetOtp,
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const isPhoneValid = phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);

  useEffect(() => {
    if (phoneNumber.length > 0) {
      Kycis.reportComponentInput({
        componentId: 'phone_number',
        hint: phoneNumber.length > 4 ? phoneNumber.slice(0, 4) + '****' : phoneNumber,
        screen: 'PHONE_ENTRY',
        componentType: 'text_input',
      });
    }
  }, [phoneNumber]);

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
          <TouchableOpacity onPress={() => onGetOtp('9999999999')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.title}>Please enter your Phone Number</Text>
            <Text style={styles.subtitle}>Enter your phone number</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={(text) => {
                  if (text.length <= 10 && /^\d*$/.test(text)) {
                    setPhoneNumber(text);
                  }
                }}
                placeholder="10-digit mobile number"
                placeholderTextColor={ThemeColors.gray500}
                keyboardType="phone-pad"
                maxLength={10}
              />
              {phoneNumber.length > 0 && phoneNumber.length < 10 && (
                <Text style={styles.errorText}>Enter a valid 10-digit number</Text>
              )}
            </View>

            <View style={styles.illustrationContainer}>
              <Image
                source={phoneImage}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.termsText}>
            By Proceeding, you agree with Zynnex terms and conditions
          </Text>

          <TouchableOpacity
            style={[styles.button, !isPhoneValid && styles.buttonDisabled]}
            onPress={() => onGetOtp(phoneNumber)}
            disabled={!isPhoneValid}
          >
            <Text style={styles.buttonText}>Get OTP</Text>
          </TouchableOpacity>

          <View style={styles.trustedContainer}>
            <Ionicons
              name="shield-checkmark"
              size={16}
              color={ThemeColors.primary}
            />
            <Text style={styles.trustedText}>Trusted By 1.5Cr+ Indians</Text>
          </View>
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
  subtitle: {
    fontSize: 14,
    color: ThemeColors.gray700,
    marginTop: 8,
  },
  inputContainer: {
    marginTop: 32,
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
    marginTop: 16,
  },
  illustration: {
    width: '100%',
    height: 220,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  termsText: {
    fontSize: 11,
    color: ThemeColors.gray700,
    textAlign: 'center',
    marginBottom: 12,
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
  trustedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  trustedText: {
    fontSize: 12,
    fontWeight: '600',
    color: ThemeColors.gray900,
    marginLeft: 4,
  },
});
