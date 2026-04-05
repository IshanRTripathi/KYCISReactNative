import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../theme';
import * as Kycis from '../kycis';

interface UploadAadhaarScreenProps {
  isFront: boolean;
  onBack: () => void;
  onNext: () => void;
}

export const UploadAadhaarScreen: React.FC<UploadAadhaarScreenProps> = ({
  isFront,
  onBack,
  onNext,
}) => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const stepText = isFront ? 'Upload Aadhaar Card(1/2)' : 'Upload Aadhaar Card(2/2)';
  const sideText = isFront ? 'Front side' : 'Back side';
  const buttonText = isFront ? 'Next' : 'Submit';

  useEffect(() => {
    if (isFileUploaded) {
      Kycis.reportComponentInput({
        componentId: isFront ? 'aadhaar_front_upload' : 'aadhaar_back_upload',
        hint: 'file_uploaded',
        screen: isFront ? 'UPLOAD_AADHAAR_FRONT' : 'UPLOAD_AADHAAR_BACK',
        componentType: 'file_upload',
      });
    }
  }, [isFileUploaded]);

  const handleNext = () => {
    if (!isFileUploaded) {
      Kycis.trackValidationFailure({
        failureReasonCode: 'document_not_uploaded',
        componentId: isFront ? 'aadhaar_front_upload' : 'aadhaar_back_upload',
        componentType: 'file_upload',
        businessStep: 'AADHAAR_UPLOAD',
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
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={ThemeColors.gray900} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>KYC and Verification</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.title}>{stepText}</Text>
            <Text style={styles.subtitle}>
              Upload Clear image of {sideText} of your Aadhaar Card
            </Text>

            <TouchableOpacity
              style={styles.uploadBox}
              onPress={() => setIsFileUploaded(true)}
            >
              <View style={styles.uploadContent}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={48}
                  color={ThemeColors.primaryLight}
                />
                <Text style={styles.uploadText}>Click to upload</Text>
                <Text style={styles.uploadHint}>
                  SVG, PNG, JPG or GIF (max.{'\n'}800x400px)
                </Text>
              </View>
            </TouchableOpacity>

            {isFileUploaded && (
              <View style={styles.uploadedFile}>
                <Ionicons
                  name="document-outline"
                  size={24}
                  color={ThemeColors.gray700}
                />
                <View style={styles.fileInfo}>
                  <Text style={styles.fileName}>
                    Aadhaar_{sideText}.png
                  </Text>
                  <Text style={styles.fileSize}>200 KB</Text>
                  <View style={styles.progressBar}>
                    <View style={styles.progressFill} />
                  </View>
                </View>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={ThemeColors.primary}
                />
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.button,
              !isFileUploaded && styles.buttonDisabled,
            ]}
            onPress={handleNext}
            disabled={!isFileUploaded}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
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
  headerTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: ThemeColors.gray900,
  },
  headerSpacer: {
    width: 48,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: ThemeColors.gray900,
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: ThemeColors.gray700,
    marginTop: 16,
  },
  uploadBox: {
    height: 200,
    borderWidth: 1,
    borderColor: ThemeColors.gray300,
    borderRadius: 12,
    marginTop: 32,
    backgroundColor: ThemeColors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: ThemeColors.primary,
    marginTop: 8,
  },
  uploadHint: {
    fontSize: 12,
    color: ThemeColors.gray700,
    textAlign: 'center',
    marginTop: 4,
  },
  uploadedFile: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ThemeColors.gray300,
    borderRadius: 8,
    padding: 16,
    marginTop: 24,
  },
  fileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: ThemeColors.gray900,
  },
  fileSize: {
    fontSize: 12,
    color: ThemeColors.gray700,
  },
  progressBar: {
    height: 4,
    backgroundColor: ThemeColors.gray300,
    borderRadius: 2,
    marginTop: 8,
  },
  progressFill: {
    height: 4,
    backgroundColor: ThemeColors.primary,
    borderRadius: 2,
    width: '100%',
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
