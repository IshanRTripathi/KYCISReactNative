import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { useVoiceAssistant } from '../kycis';

export type FabPosition = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

interface FloatingAssistantButtonProps {
  position?: FabPosition;
  assistantName?: string;
  fabType?: 'basic' | 'premium';
  lottieSource?: any;
  lottieAutoPlay?: boolean;
  lottieLoop?: boolean;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DRAG_THRESHOLD = 10;
const FAB_SIZE = 72;
const EDGE_PADDING = 8;
const EXPANDED_WIDTH = 280;
const HEADER_HEIGHT = 56;
const TRANSCRIPT_MAX_HEIGHT = 260;

export const FloatingAssistantButton: React.FC<FloatingAssistantButtonProps> = ({
  position = 'bottom-end',
  assistantName = 'AI Assistant',
  fabType = 'premium',
  lottieSource,
  lottieAutoPlay = true,
  lottieLoop = true,
}) => {
  const {
    isAssistantActive,
    isConnecting,
    callDuration,
    lastError,
    voiceActivity,
    transcripts,
    startAssistant,
    stopAssistant,
  } = useVoiceAssistant();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const panX = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;
  const currentX = useRef(0);
  const currentY = useRef(0);
  
  const expandAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const lottieRef = useRef<LottieView>(null);
  
  const containerRef = useRef<View>(null);
  const [containerLayout, setContainerLayout] = useState({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });

  const getInitialPosition = useCallback(() => {
    const edgePadding = 20;
    switch (position) {
      case 'bottom-start':
        return { x: edgePadding, y: SCREEN_HEIGHT - FAB_SIZE - 100 };
      case 'bottom-end':
        return { x: SCREEN_WIDTH - FAB_SIZE - edgePadding, y: SCREEN_HEIGHT - FAB_SIZE - 100 };
      case 'top-start':
        return { x: edgePadding, y: 100 };
      case 'top-end':
        return { x: SCREEN_WIDTH - FAB_SIZE - edgePadding, y: 100 };
      default:
        return { x: SCREEN_WIDTH - FAB_SIZE - edgePadding, y: SCREEN_HEIGHT - FAB_SIZE - 100 };
    }
  }, [position]);

  useEffect(() => {
    const initial = getInitialPosition();
    panX.setValue(initial.x);
    panY.setValue(initial.y);
  }, [getInitialPosition]);

  useEffect(() => {
    if (!isAssistantActive) {
      setIsExpanded(false);
    }
  }, [isAssistantActive]);

  useEffect(() => {
    if ((isAssistantActive || isConnecting) && !lottieSource) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isAssistantActive, isConnecting, lottieSource]);

  useEffect(() => {
    Animated.timing(expandAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  const handleContainerLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerLayout({ width, height });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderGrant: () => {
        currentX.current = panX._value;
        currentY.current = panY._value;
        panX.stopAnimation();
        panY.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        const newX = currentX.current + gestureState.dx;
        const newY = currentY.current + gestureState.dy;
        
        panX.setValue(newX);
        panY.setValue(newY);
      },
      onPanResponderRelease: (_, gestureState) => {
        const totalDragX = gestureState.dx;
        const totalDragY = gestureState.dy;
        
        if (Math.abs(totalDragX) < DRAG_THRESHOLD && Math.abs(totalDragY) < DRAG_THRESHOLD) {
          return;
        }

        let endX = currentX.current + totalDragX;
        let endY = currentY.current + totalDragY;

        if (endY < containerLayout.height / 3) {
          endY = EDGE_PADDING;
        } else if (endY > containerLayout.height * 2 / 3) {
          endY = containerLayout.height - FAB_SIZE - EDGE_PADDING;
        }

        if (isExpanded) {
          endX = (containerLayout.width - EXPANDED_WIDTH) / 2;
        } else {
          const screenCenterX = containerLayout.width / 2;
          const fabCenterX = endX + FAB_SIZE / 2;
          if (fabCenterX < screenCenterX) {
            endX = EDGE_PADDING;
          } else {
            endX = containerLayout.width - FAB_SIZE - EDGE_PADDING;
          }
        }

        Animated.parallel([
          Animated.spring(panX, {
            toValue: endX,
            useNativeDriver: false,
            friction: 7,
          }),
          Animated.spring(panY, {
            toValue: endY,
            useNativeDriver: false,
            friction: 7,
          }),
        ]).start();
      },
    })
  ).current;

  const handlePress = () => {
    if (isAssistantActive) {
      setIsExpanded(!isExpanded);
    } else {
      startAssistant();
    }
  };

  const handleEndCall = () => {
    stopAssistant();
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getActivityColor = () => {
    switch (voiceActivity) {
      case 'user_speaking': return '#22C55E';
      case 'agent_speaking': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const animatedContainerHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [FAB_SIZE, FAB_SIZE + TRANSCRIPT_MAX_HEIGHT + 8],
  });

  const renderLottie = (size: number = FAB_SIZE - 8) => {
    if (!lottieSource) return null;
    
    return (
      <LottieView
        ref={lottieRef}
        source={lottieSource}
        autoPlay={lottieAutoPlay && (isConnecting || isAssistantActive)}
        loop={lottieLoop}
        style={{ width: size, height: size }}
      />
    );
  };

  const renderIdleFab = () => {
    if (fabType === 'premium') {
      return (
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handlePress}
          style={styles.premiumIdleFab}
        >
          {lottieSource ? (
            renderLottie(FAB_SIZE - 8)
          ) : (
            <Animated.View
              style={[
                styles.premiumFabInner,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              {isConnecting ? (
                <Ionicons name="reload" size={24} color="#FFFFFF" />
              ) : (
                <View style={styles.premiumIconContainer}>
                  <Ionicons name="headset" size={28} color="#FFFFFF" />
                </View>
              )}
            </Animated.View>
          )}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.basicIdleFab}
      >
        <Animated.View
          style={[
            styles.fabInner,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          {isConnecting ? (
            <Ionicons name="reload" size={24} color="#FFFFFF" />
          ) : (
            <Ionicons name="call-outline" size={24} color="#FFFFFF" />
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderActiveOverlay = () => {
    if (fabType === 'premium') {
      return (
        <View style={styles.premiumActiveContainer}>
          {/* Header Pill */}
          <View style={styles.premiumPill} {...panResponder.panHandlers}>
            <View style={styles.premiumAvatar}>
              {lottieSource ? (
                <LottieView
                  source={lottieSource}
                  autoPlay={lottieAutoPlay && isAssistantActive}
                  loop={lottieLoop}
                  style={{ width: 40, height: 40 }}
                />
              ) : (
                <Ionicons name="person" size={20} color="#FFFFFF" />
              )}
            </View>
            <View style={styles.premiumHeaderContent}>
              <Text style={styles.premiumName} numberOfLines={1}>{assistantName}</Text>
              <Text style={styles.premiumDuration}>
                {formatDuration(callDuration)}
              </Text>
            </View>
            <TouchableOpacity onPress={handleMuteToggle} style={styles.premiumIconButton}>
              <Ionicons
                name={isMuted ? 'mic-off' : 'mic'}
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExpandToggle} style={styles.premiumIconButton}>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEndCall} style={styles.premiumEndButton}>
              <Ionicons name="call" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Transcript Panel - Toggle with expand button */}
          {isExpanded && (
            <View style={styles.premiumTranscriptPanel}>
              <ScrollView 
                style={styles.transcriptScrollView} 
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {transcripts.length === 0 ? (
                  <View style={styles.emptyTranscripts}>
                    <Text style={styles.emptyText}>No transcripts yet...</Text>
                  </View>
                ) : (
                  <View style={styles.premiumTranscriptContent}>
                    {transcripts.map((entry, index) => (
                      <View
                        key={`${entry.role}-${entry.time}-${index}`}
                        style={[
                          styles.premiumTranscriptLine,
                          entry.role === 'user' ? styles.premiumTranscriptUserBg : styles.premiumTranscriptAgentBg,
                        ]}
                      >
                        <View style={styles.transcriptHeader}>
                          <Text style={styles.transcriptRole}>
                            {entry.role === 'user' ? 'You' : assistantName}
                          </Text>
                          <Text style={styles.transcriptTime}>{entry.time}</Text>
                        </View>
                        <Text style={styles.transcriptText}>{entry.text}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>
            </View>
          )}
        </View>
      );
    }

    return (
      <View style={styles.basicActiveContainer}>
        <View style={styles.basicHeaderRow} {...panResponder.panHandlers}>
          <View style={styles.headerLeft}>
            <View style={[styles.activityDot, { backgroundColor: getActivityColor() }]} />
            <Text style={styles.headerName}>{assistantName}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleMuteToggle} style={styles.iconButton}>
              <Ionicons
                name={isMuted ? 'mic-off' : 'mic'}
                size={18}
                color={isMuted ? '#EF4444' : '#FFFFFF'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExpandToggle} style={styles.iconButton}>
              <Ionicons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEndCall} style={[styles.iconButton, styles.endCallButton]}>
              <Ionicons name="call" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View
          style={[
            styles.transcriptPanel,
            {
              opacity: expandAnim,
              maxHeight: expandAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, TRANSCRIPT_MAX_HEIGHT],
              }),
            },
          ]}
        >
          <Text style={styles.transcriptTitle}>Transcripts</Text>
          {transcripts.length === 0 ? (
            <View style={styles.emptyTranscripts}>
              <Text style={styles.emptyText}>No transcripts yet...</Text>
            </View>
          ) : (
            <ScrollView style={styles.transcriptList} showsVerticalScrollIndicator={true} contentContainerStyle={styles.transcriptListContent}>
              {transcripts.map((entry, index) => (
                <View
                  key={`${entry.segmentId || index}-${index}`}
                  style={[
                    styles.transcriptLine,
                    entry.role === 'user' ? styles.transcriptUserBg : styles.transcriptAgentBg,
                  ]}
                >
                  <View style={styles.transcriptHeader}>
                    <Text style={styles.transcriptRole}>
                      {entry.role === 'user' ? 'You' : assistantName}
                    </Text>
                    <Text style={styles.transcriptTime}>{entry.time}</Text>
                  </View>
                  <Text style={styles.transcriptText}>{entry.text}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </Animated.View>
      </View>
    );
  };

  return (
    <Animated.View
      ref={containerRef}
      onLayout={handleContainerLayout}
      style={[
        styles.container,
        {
          width: isAssistantActive ? EXPANDED_WIDTH : FAB_SIZE,
          transform: [
            { translateX: panX },
            { translateY: panY },
          ],
          height: isExpanded && isAssistantActive ? FAB_SIZE + TRANSCRIPT_MAX_HEIGHT + 8 : FAB_SIZE,
        },
      ]}
      {...(!isAssistantActive ? panResponder.panHandlers : {})}
    >
      {isAssistantActive ? renderActiveOverlay() : renderIdleFab()}

      {isConnecting && !isAssistantActive && (
        <View style={styles.connectingBadge}>
          <Text style={styles.connectingText}>Connecting...</Text>
        </View>
      )}

      {lastError && (
        <View style={styles.errorBadge}>
          <Text style={styles.errorText}>{lastError}</Text>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
    width: FAB_SIZE,
  },
  
  /* Basic FAB Styles */
  basicIdleFab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  fabInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  basicActiveContainer: {
    width: FAB_SIZE,
    backgroundColor: '#1F2937',
    borderRadius: 28,
    overflow: 'hidden',
  },
  basicHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#374151',
    borderRadius: 28,
    minWidth: FAB_SIZE,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headerName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallButton: {
    backgroundColor: '#EF4444',
  },
  transcriptPanel: {
    width: EXPANDED_WIDTH,
    height: TRANSCRIPT_MAX_HEIGHT,
    backgroundColor: '#374151',
    borderRadius: 16,
    padding: 12,
    marginTop: 8,
    marginLeft: -FAB_SIZE + 16,
    overflow: 'hidden',
  },
  
  /* Premium FAB Styles */
  premiumIdleFab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: '#0EAD69',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  premiumFabInner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumActiveContainer: {
    width: EXPANDED_WIDTH,
    alignItems: 'center',
  },
  premiumPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 28,
    paddingHorizontal: 12,
    paddingVertical: 8,
    width: EXPANDED_WIDTH,
    minHeight: HEADER_HEIGHT,
  },
  premiumAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0EAD69',
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumHeaderContent: {
    flex: 1,
    marginLeft: 10,
    marginRight: 4,
  },
  premiumName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  premiumDuration: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 2,
  },
  premiumIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  premiumEndButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  premiumTranscriptPanel: {
    width: EXPANDED_WIDTH,
    height: TRANSCRIPT_MAX_HEIGHT,
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    marginTop: 8,
    overflow: 'hidden',
  },
  transcriptScrollView: {
    flex: 1,
  },
  transcriptScrollContent: {
    flexGrow: 1,
    minHeight: TRANSCRIPT_MAX_HEIGHT,
  },
  premiumTranscriptContent: {
    padding: 12,
    paddingBottom: 8,
    flexGrow: 1,
  },
  premiumTranscriptLine: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  premiumTranscriptUserBg: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  premiumTranscriptAgentBg: {
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
  },

  /* Shared Transcript Styles */
  transcriptTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  transcriptList: {
    flex: 1,
  },
  transcriptListContent: {
    flexGrow: 1,
    minHeight: 100,
  },
  emptyTranscripts: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 12,
  },
  transcriptLine: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  transcriptUserBg: {
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
  },
  transcriptAgentBg: {
    backgroundColor: 'rgba(59, 130, 246, 0.12)',
  },
  transcriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  transcriptRole: {
    color: '#9CA3AF',
    fontSize: 11,
    fontWeight: '600',
  },
  transcriptTime: {
    color: '#6B7280',
    fontSize: 10,
  },
  transcriptText: {
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 18,
  },
  connectingBadge: {
    position: 'absolute',
    bottom: -24,
    left: '50%',
    marginLeft: -45,
    backgroundColor: '#4B5563',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectingText: {
    color: '#FFFFFF',
    fontSize: 11,
  },
  errorBadge: {
    position: 'absolute',
    bottom: -24,
    left: '50%',
    marginLeft: -45,
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 11,
  },
});

export default FloatingAssistantButton;
