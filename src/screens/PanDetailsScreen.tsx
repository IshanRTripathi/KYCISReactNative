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
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../theme';
import * as Kycis from '../kycis';

interface PanDetailsScreenProps {
  onBack: () => void;
  onNext: () => void;
}

export const PanDetailsScreen: React.FC<PanDetailsScreenProps> = ({
  onBack,
  onNext,
}) => {
  const [panNumber, setPanNumber] = useState('');
  const [dob, setDob] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const isPanValid = panRegex.test(panNumber);
  const isDobValid = dob.length > 0;
  const canProceed = isPanValid && isDobValid && agreedToTerms;

  useEffect(() => {
    if (panNumber.length > 0) {
      Kycis.reportComponentInput({
        componentId: 'pan_number',
        hint: panNumber.length > 4 ? panNumber.slice(0, 4) + '****' : panNumber,
        screen: 'PAN_DETAILS',
        componentType: 'text_input',
      });
    }
  }, [panNumber]);

  useEffect(() => {
    if (dob.length > 0) {
      Kycis.reportComponentInput({
        componentId: 'dob',
        hint: 'redacted',
        screen: 'PAN_DETAILS',
        componentType: 'text_input',
      });
    }
  }, [dob]);

  useEffect(() => {
    Kycis.reportComponentInput({
      componentId: 'terms_accepted',
      hint: agreedToTerms ? 'true' : 'false',
      screen: 'PAN_DETAILS',
      componentType: 'switch',
    });
  }, [agreedToTerms]);

  const handleNext = () => {
    if (!isPanValid) {
      Kycis.trackValidationFailure({
        failureReasonCode: 'invalid_pan_format',
        componentId: 'pan_number',
        componentType: 'text_input',
        expectedPattern: '[A-Z]{5}[0-9]{4}[A-Z]',
        businessStep: 'PAN_ENTRY',
      });
    }
    if (!isDobValid) {
      Kycis.trackValidationFailure({
        failureReasonCode: 'empty_dob',
        componentId: 'dob',
        componentType: 'text_input',
        businessStep: 'PAN_ENTRY',
      });
    }
    if (!agreedToTerms) {
      Kycis.trackValidationFailure({
        failureReasonCode: 'terms_not_accepted',
        componentId: 'terms',
        componentType: 'switch',
        businessStep: 'PAN_ENTRY',
      });
    }
    onNext();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ThemeColors.lightBackground} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={ThemeColors.gray900} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>PAN Details</Text>
          </View>
          <TouchableOpacity onPress={onNext}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.fieldLabel}>Enter PAN number</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={panNumber}
                onChangeText={(text) => setPanNumber(text.toUpperCase())}
                placeholder="ABCDE1234F"
                placeholderTextColor={ThemeColors.gray500}
                autoCapitalize="characters"
                maxLength={10}
              />
              {panNumber.length > 0 && !isPanValid && (
                <Text style={styles.errorText}>Enter a valid 10-character PAN</Text>
              )}
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 24 }]}>Enter DOB</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={dob}
                onChangeText={setDob}
                placeholder="DD/MM/YYYY"
                placeholderTextColor={ThemeColors.gray500}
              />
            </View>

            <View style={styles.panPlaceholder}>
              <Ionicons name="card-outline" size={80} color={ThemeColors.gray300} />
              <Text style={styles.panPlaceholderText}>PAN Card Image</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.checkboxContainer}>
            <Switch
              value={agreedToTerms}
              onValueChange={setAgreedToTerms}
              trackColor={{ false: ThemeColors.gray300, true: ThemeColors.primary }}
              thumbColor={ThemeColors.white}
            />
            <Text style={styles.termsText}>
              I agree with Zynnex T&C and Privacy Policy
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, !canProceed && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!canProceed}
          >
            <Text style={styles.buttonText}>Next</Text>
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ThemeColors.gray900,
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
  fieldLabel: {
    fontSize: 14,
    color: ThemeColors.gray700,
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
  panPlaceholder: {
    height: 200,
    backgroundColor: ThemeColors.gray100,
    borderRadius: 12,
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  panPlaceholderText: {
    fontSize: 14,
    color: ThemeColors.gray500,
    marginTop: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  termsText: {
    fontSize: 12,
    color: ThemeColors.gray900,
    marginLeft: 8,
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
