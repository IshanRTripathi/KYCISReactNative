import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../theme';

interface OtpInputFieldProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
}

export const OtpInputField: React.FC<OtpInputFieldProps> = ({
  value,
  onChange,
  length = 4,
  autoFocus = true,
}) => {
  const handleChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= length) {
      onChange(numericValue);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.digitsContainer}>
        {Array.from({ length }, (_, index) => {
          const digit = value[index] || '';
          const isFocused = value.length === index;
          
          return (
            <View
              key={index}
              style={[
                styles.digitBox,
                isFocused && styles.digitBoxFocused,
              ]}
            >
              <Text style={styles.digitText}>{digit}</Text>
            </View>
          );
        })}
      </View>
      <TextInput
        style={styles.hiddenInput}
        value={value}
        onChangeText={handleChange}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        caretHidden
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  digitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  digitBox: {
    width: 64,
    height: 64,
    borderWidth: 1,
    borderColor: ThemeColors.gray300,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ThemeColors.white,
  },
  digitBoxFocused: {
    borderColor: ThemeColors.primary,
  },
  digitText: {
    fontSize: 24,
    fontWeight: '600',
    color: ThemeColors.primary,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    height: 0,
  },
});
