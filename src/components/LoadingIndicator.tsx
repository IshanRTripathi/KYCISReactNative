import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { ThemeColors } from '../theme';

interface LoadingIndicatorProps {
  message?: string;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={ThemeColors.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ThemeColors.lightBackground,
  },
  message: {
    marginTop: 16,
    fontSize: 14,
    color: ThemeColors.gray700,
  },
});
