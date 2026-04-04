import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../theme';
import aadhaarImage from '../assets/aadhaarinput2.png';

interface VerifyDocumentsScreenProps {
  onBack: () => void;
  onProceedWithAadhaar: () => void;
  onOfflineProcess: () => void;
}

export const VerifyDocumentsScreen: React.FC<VerifyDocumentsScreenProps> = ({
  onBack,
  onProceedWithAadhaar,
  onOfflineProcess,
}) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={ThemeColors.lightBackground} />
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={ThemeColors.gray900} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Documents</Text>
        <Text style={styles.subtitle}>
          Complete your fully Digital verification process by verifying your
          aadhaar
        </Text>

        <View style={styles.illustrationContainer}>
          <Image
            source={aadhaarImage}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.button}
          onPress={onProceedWithAadhaar}
        >
          <Text style={styles.buttonText}>Proceed with Aadhaar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlinedButton}
          onPress={onOfflineProcess}
        >
          <Text style={styles.outlinedButtonText}>Offline Process</Text>
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
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
  },
  illustration: {
    width: 280,
    height: 280,
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
  outlinedButton: {
    backgroundColor: 'transparent',
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: ThemeColors.gray500,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  outlinedButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: ThemeColors.gray900,
  },
});
