import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../theme';

interface DigilockerAadhaarScreenProps {
  onBack: () => void;
  onNext: () => void;
  onTryAnotherWay: () => void;
}

export const DigilockerAadhaarScreen: React.FC<DigilockerAadhaarScreenProps> = ({
  onBack,
  onNext,
  onTryAnotherWay,
}) => {
  const [aadhaar1, setAadhaar1] = useState('');
  const [aadhaar2, setAadhaar2] = useState('');
  const [aadhaar3, setAadhaar3] = useState('');

  const isButtonEnabled =
    aadhaar1.length === 4 && aadhaar2.length === 4 && aadhaar3.length === 4;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FB" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={ThemeColors.gray900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>KYC and Verification</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Text style={styles.flagEmoji}>&#x1F1EE;&#x1F1F3;</Text>
            <View style={styles.logoTextContainer}>
              <Text style={styles.logoTitle}>DigiLocker</Text>
              <Text style={styles.logoSubtitle}>
                Document Wallet to Empower Citizens
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Sign up</Text>
            <Text style={styles.cardSubtitle}>It takes just a minute</Text>

            <View style={styles.aadhaarSection}>
              <Text style={styles.aadhaarLabel}>Enter your Aadhaar Number</Text>
              <View style={styles.aadhaarLogo}>
                <Text style={styles.idEmoji}>&#x1F194;</Text>
              </View>
            </View>

            <View style={styles.aadhaarInputs}>
              <TextInput
                style={styles.aadhaarInput}
                value={aadhaar1}
                onChangeText={(text) => {
                  if (text.length <= 4 && /^\d*$/.test(text)) {
                    setAadhaar1(text);
                  }
                }}
                placeholder="----"
                placeholderTextColor={ThemeColors.gray500}
                keyboardType="number-pad"
                maxLength={4}
              />
              <TextInput
                style={styles.aadhaarInput}
                value={aadhaar2}
                onChangeText={(text) => {
                  if (text.length <= 4 && /^\d*$/.test(text)) {
                    setAadhaar2(text);
                  }
                }}
                placeholder="----"
                placeholderTextColor={ThemeColors.gray500}
                keyboardType="number-pad"
                maxLength={4}
              />
              <TextInput
                style={styles.aadhaarInput}
                value={aadhaar3}
                onChangeText={(text) => {
                  if (text.length <= 4 && /^\d*$/.test(text)) {
                    setAadhaar3(text);
                  }
                }}
                placeholder="----"
                placeholderTextColor={ThemeColors.gray500}
                keyboardType="number-pad"
                maxLength={4}
              />
            </View>

            <Text style={styles.digilockerNote}>
              DigiLocker uses Aadhaar to enable authentic document access
            </Text>

            <TouchableOpacity
              style={[
                styles.button,
                !isButtonEnabled && styles.buttonDisabled,
              ]}
              onPress={onNext}
              disabled={!isButtonEnabled}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.tryAnotherWay}
            onPress={onTryAnotherWay}
          >
            <Text style={styles.tryAnotherWayText}>Try another way</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
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
  headerTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: ThemeColors.gray900,
  },
  headerSpacer: {
    width: 48,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
  },
  flagEmoji: {
    fontSize: 32,
  },
  logoTextContainer: {
    marginLeft: 8,
  },
  logoTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  logoSubtitle: {
    fontSize: 8,
    color: 'gray',
  },
  card: {
    width: '100%',
    backgroundColor: ThemeColors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 24,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: ThemeColors.gray900,
  },
  cardSubtitle: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  aadhaarSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
  },
  aadhaarLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  aadhaarLogo: {
    marginLeft: 8,
  },
  idEmoji: {
    fontSize: 16,
  },
  aadhaarInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  aadhaarInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlign: 'center',
    color: ThemeColors.gray900,
    marginHorizontal: 4,
  },
  digilockerNote: {
    fontSize: 12,
    color: 'gray',
    marginTop: 24,
  },
  button: {
    backgroundColor: ThemeColors.primary,
    height: 56,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: ThemeColors.primary,
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: ThemeColors.white,
  },
  tryAnotherWay: {
    marginTop: 32,
  },
  tryAnotherWayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },
});
