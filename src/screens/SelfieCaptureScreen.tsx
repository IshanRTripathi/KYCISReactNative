import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { ThemeColors } from '../theme';

interface SelfieCaptureScreenProps {
  onCaptured: () => void;
}

export const SelfieCaptureScreen: React.FC<SelfieCaptureScreenProps> = ({
  onCaptured,
}) => {
  const [instruction, setInstruction] = useState('Turn your head to the right');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(0.3);
    }, 1000);

    const timer2 = setTimeout(() => {
      setInstruction('Blink your eyes');
      setProgress(0.6);
    }, 2000);

    const timer3 = setTimeout(() => {
      setInstruction('Smile for the camera');
      setProgress(1.0);
    }, 3000);

    const timer4 = setTimeout(() => {
      onCaptured();
    }, 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onCaptured]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E1E2C" />
      <View style={styles.content}>
        <Text style={styles.instruction}>
          Place your face inside the frame & follow instructions below
        </Text>

        <View style={styles.frameContainer}>
          <View style={styles.frame}>
            <View style={styles.frameInner}>
              <Text style={styles.cameraPlaceholder}>Camera Feed Placeholder</Text>
            </View>
          </View>
        </View>

        <Text style={styles.instructionText}>{instruction}</Text>

        <View style={styles.analyzingContainer}>
          <Text style={styles.analyzingText}>Analyzing...</Text>
          <View style={styles.progressContainer}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2C',
    paddingTop: StatusBar.currentHeight || 0,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 16,
    fontWeight: '500',
    color: ThemeColors.white,
    textAlign: 'center',
    marginTop: 24,
  },
  frameContainer: {
    marginTop: 64,
    alignItems: 'center',
  },
  frame: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 4,
    borderColor: ThemeColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameInner: {
    width: 266,
    height: 266,
    borderRadius: 133,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholder: {
    fontSize: 14,
    color: ThemeColors.white,
  },
  instructionText: {
    fontSize: 24,
    fontWeight: '700',
    color: ThemeColors.white,
    marginTop: 64,
    textAlign: 'center',
  },
  analyzingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  analyzingText: {
    fontSize: 14,
    color: '#D0D0D0',
  },
  progressContainer: {
    width: 20,
    height: 20,
    marginLeft: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: ThemeColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressFill: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: ThemeColors.primary,
  },
});
