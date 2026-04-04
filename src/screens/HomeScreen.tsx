import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../theme';

interface HomeScreenProps {
  onStartFlow: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStartFlow }) => {
  const [selectedFlow, setSelectedFlow] = useState('kyc');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Zynnex Demo</Text>
          <Text style={styles.subtitle}>Welcome to Zynnex demo</Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity
            style={[
              styles.card,
              selectedFlow === 'kyc' && styles.cardSelected,
            ]}
            onPress={() => setSelectedFlow('kyc')}
            activeOpacity={0.7}
          >
            <View style={styles.cardIconContainer}>
              <View style={styles.hexagonIcon}>
                <Text style={styles.hexagonText}>⬡</Text>
              </View>
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>KYC Flow</Text>
              <Text style={styles.cardSubtitle}>
                Help increase KYC Conversion
              </Text>
            </View>
            <Ionicons
              name={selectedFlow === 'kyc' ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={selectedFlow === 'kyc' ? ThemeColors.primary : ThemeColors.gray500}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.card,
              selectedFlow === 'mfd' && styles.cardSelected,
            ]}
            onPress={() => setSelectedFlow('mfd')}
            activeOpacity={0.7}
          >
            <View style={styles.cardIconContainer}>
              <Ionicons
                name="flash-outline"
                size={24}
                color={
                  selectedFlow === 'mfd'
                    ? ThemeColors.primary
                    : ThemeColors.gray700
                }
              />
            </View>
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>MFD Support</Text>
              <Text style={styles.cardSubtitle}>
                Helping MFD to create orders through call
              </Text>
            </View>
            <Ionicons
              name={selectedFlow === 'mfd' ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={selectedFlow === 'mfd' ? ThemeColors.primary : ThemeColors.gray500}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={onStartFlow}>
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.lightBackground,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    marginTop: 32,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: ThemeColors.gray900,
  },
  subtitle: {
    fontSize: 14,
    color: ThemeColors.gray700,
    marginTop: 8,
  },
  cardsContainer: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ThemeColors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: ThemeColors.gray300,
  },
  cardSelected: {
    backgroundColor: ThemeColors.primaryLight,
    borderColor: ThemeColors.primary,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: ThemeColors.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexagonIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  hexagonText: {
    fontSize: 24,
    color: ThemeColors.primary,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: 16,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: ThemeColors.gray900,
  },
  cardSubtitle: {
    fontSize: 12,
    color: ThemeColors.gray700,
    marginTop: 4,
  },
  startButton: {
    backgroundColor: ThemeColors.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: ThemeColors.white,
  },
});
