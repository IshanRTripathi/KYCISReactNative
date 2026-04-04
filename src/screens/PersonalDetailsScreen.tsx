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
  ScrollView,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../theme';
import personalDetailsImage from '../assets/personaldetails2.png';

const GENDER_OPTIONS = ['Male', 'Female', 'Other', 'Prefer not to say'];
const MARITAL_STATUS_OPTIONS = ['Single', 'Married', 'Divorced', 'Widowed'];
const RESIDENCY_STATUS_OPTIONS = ['Resident Indian', 'NRI', 'PIO', 'OCI'];

interface PersonalDetailsScreenProps {
  onBack: () => void;
  onProceed: () => void;
}

export const PersonalDetailsScreen: React.FC<PersonalDetailsScreenProps> = ({
  onBack,
  onProceed,
}) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [residencyStatus, setResidencyStatus] = useState('');
  const [fatherName, setFatherName] = useState('');

  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showMaritalPicker, setShowMaritalPicker] = useState(false);
  const [showResidencyPicker, setShowResidencyPicker] = useState(false);

  const isFormValid =
    name.length > 0 &&
    gender.length > 0 &&
    maritalStatus.length > 0 &&
    residencyStatus.length > 0 &&
    fatherName.length > 0;

  const DropdownField = ({
    label,
    value,
    placeholder,
    onPress,
    isOpen,
    onClose,
  }: {
    label: string;
    value: string;
    placeholder: string;
    onPress: () => void;
    isOpen: boolean;
    onClose: () => void;
  }) => (
    <View>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TouchableOpacity style={styles.dropdown} onPress={onPress}>
        <Text style={[styles.dropdownText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={ThemeColors.gray500} />
      </TouchableOpacity>
    </View>
  );

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
            <Text style={styles.headerTitle}>Personal Details</Text>
          </View>
          <TouchableOpacity onPress={onProceed}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <View style={styles.inputContainer}>
              <Text style={styles.fieldLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter Your Name"
                placeholderTextColor={ThemeColors.gray500}
              />
            </View>

            <View style={styles.dropdownContainer}>
              <DropdownField
                label="Gender"
                value={gender}
                placeholder="Select Gender"
                onPress={() => setShowGenderPicker(true)}
                isOpen={showGenderPicker}
                onClose={() => setShowGenderPicker(false)}
              />
            </View>

            <View style={styles.dropdownContainer}>
              <DropdownField
                label="Marital Status"
                value={maritalStatus}
                placeholder="Select Marital Status"
                onPress={() => setShowMaritalPicker(true)}
                isOpen={showMaritalPicker}
                onClose={() => setShowMaritalPicker(false)}
              />
            </View>

            <View style={styles.dropdownContainer}>
              <DropdownField
                label="Residency Status"
                value={residencyStatus}
                placeholder="Select Residency Status"
                onPress={() => setShowResidencyPicker(true)}
                isOpen={showResidencyPicker}
                onClose={() => setShowResidencyPicker(false)}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.fieldLabel}>Father Name</Text>
              <TextInput
                style={styles.input}
                value={fatherName}
                onChangeText={setFatherName}
                placeholder="Enter Father's name"
                placeholderTextColor={ThemeColors.gray500}
              />
            </View>

            <View style={styles.illustrationContainer}>
              <Image
                source={personalDetailsImage}
                style={styles.illustration}
                resizeMode="contain"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            onPress={onProceed}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>Proceed</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal visible={showGenderPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Gender</Text>
            <FlatList
              data={GENDER_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setGender(item);
                    setShowGenderPicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowGenderPicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showMaritalPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Marital Status</Text>
            <FlatList
              data={MARITAL_STATUS_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setMaritalStatus(item);
                    setShowMaritalPicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowMaritalPicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showResidencyPicker} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Residency Status</Text>
            <FlatList
              data={RESIDENCY_STATUS_OPTIONS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setResidencyStatus(item);
                    setShowResidencyPicker(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setShowResidencyPicker(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: ThemeColors.gray500,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: ThemeColors.gray900,
    backgroundColor: ThemeColors.white,
    marginTop: 8,
  },
  dropdownContainer: {
    marginTop: 16,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ThemeColors.gray500,
    borderRadius: 12,
    padding: 16,
    backgroundColor: ThemeColors.white,
    marginTop: 8,
  },
  dropdownText: {
    fontSize: 16,
    color: ThemeColors.gray900,
  },
  placeholderText: {
    color: ThemeColors.gray500,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  illustration: {
    width: '100%',
    height: 240,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: ThemeColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: ThemeColors.gray900,
    marginBottom: 16,
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: ThemeColors.gray100,
  },
  modalItemText: {
    fontSize: 16,
    color: ThemeColors.gray900,
  },
  modalClose: {
    padding: 16,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: ThemeColors.primary,
    fontWeight: '600',
  },
});
