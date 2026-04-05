import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../theme';
import * as Kycis from '../kycis';

interface SignatureScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

export const SignatureScreen: React.FC<SignatureScreenProps> = ({
  onBack,
  onSubmit,
}) => {
  const handleSubmit = () => {
    Kycis.trackAnalytics('kyc_flow_completed');
    onSubmit();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ThemeColors.lightBackground} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={ThemeColors.gray900} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Submit Your Signature</Text>
        <Text style={styles.subtitle}>
          The Signature will be affixed on account{'\n'}opening form and is
          mandatory
        </Text>

        <View style={styles.signaturePad}>
          <Text style={styles.signaturePlaceholder}>Draw your sign here</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.lightBackground,
    paddingTop: StatusBar.currentHeight || 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: ThemeColors.gray900,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: ThemeColors.gray700,
    marginTop: 8,
    textAlign: 'center',
  },
  signaturePad: {
    width: '100%',
    height: 300,
    borderWidth: 1,
    borderColor: ThemeColors.gray300,
    borderRadius: 8,
    backgroundColor: ThemeColors.white,
    marginTop: 32,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 24,
  },
  signaturePlaceholder: {
    fontSize: 14,
    color: ThemeColors.gray700,
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
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: ThemeColors.white,
  },
});
