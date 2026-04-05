import { useEffect, useRef, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { NativeModules, NativeEventEmitter } from 'react-native';
import type { VoiceSessionResult, AgentEvent, SdkStatus, TranscriptEntry } from './types';

const { KycisModule } = NativeModules;
const eventEmitter = new NativeEventEmitter(KycisModule);

export interface UseVoiceAssistantReturn {
  isAssistantActive: boolean;
  isConnecting: boolean;
  callDuration: number;
  lastError: string | null;
  voiceActivity: 'idle' | 'user_speaking' | 'agent_speaking';
  transcripts: TranscriptEntry[];
  startAssistant: () => void;
  stopAssistant: () => void;
}

export function useVoiceAssistant(): UseVoiceAssistantReturn {
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [lastError, setLastError] = useState<string | null>(null);
  const [voiceActivity, setVoiceActivity] = useState<'idle' | 'user_speaking' | 'agent_speaking'>('idle');
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);

  const voiceSessionRef = useRef<VoiceSessionResult | null>(null);
  const callStartRef = useRef<number>(0);
  const durationTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startAssistantNative = useCallback(async (): Promise<boolean> => {
    return KycisModule.startAssistant();
  }, []);

  const stopAssistantNative = useCallback(async (): Promise<boolean> => {
    return KycisModule.stopAssistant();
  }, []);

  useEffect(() => {
    const statusSub = eventEmitter.addListener('onStatusChange', (status: SdkStatus) => {
      if (status.code === 'ERROR') {
        setLastError(status.message);
      }
    });

    const voiceSub = eventEmitter.addListener('onVoiceSession', (result: VoiceSessionResult) => {
      voiceSessionRef.current = result;
      setIsConnecting(false);
      setIsAssistantActive(true);
      callStartRef.current = Date.now();
      setVoiceActivity('idle');

      durationTimerRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - callStartRef.current) / 1000));
      }, 1000);

      console.log('[KYCIS] Voice session started:', {
        livekitUrl: result.livekitUrl,
        room: result.livekitRoom,
      });
    });

    const agentSub = eventEmitter.addListener('onAgentEvent', (event: AgentEvent) => {
      switch (event.type) {
        case 'CONNECTED':
          setIsConnecting(false);
          setIsAssistantActive(true);
          setVoiceActivity('idle');
          break;
        case 'DISCONNECTED':
          setIsAssistantActive(false);
          setVoiceActivity('idle');
          setTranscripts([]);
          if (event.metadata.callDuration) {
            setCallDuration(event.metadata.callDuration);
          }
          if (durationTimerRef.current) {
            clearInterval(durationTimerRef.current);
            durationTimerRef.current = null;
          }
          break;
        case 'POPUP_VISIBLE':
          if (event.metadata.message) {
            Alert.alert('KYCIS', event.metadata.message);
          }
          break;
        case 'TRANSCRIPTION_RECEIVED':
          if (event.metadata.transcript) {
            const { role, text, time, segmentId, isFinal } = event.metadata.transcript;
            setTranscripts(prev => {
              if (segmentId) {
                const existingIdx = prev.findIndex(t => t.segmentId === segmentId);
                if (existingIdx >= 0) {
                  const updated = [...prev];
                  updated[existingIdx] = { role, text, time, segmentId };
                  return updated;
                }
                return [...prev, { role, text, time, segmentId }];
              }
              
              if (isFinal) {
                const lastWithRole = prev.findLastIndex(t => t.role === role);
                if (lastWithRole >= 0 && prev[lastWithRole].segmentId) {
                  const updated = [...prev];
                  updated[lastWithRole] = { role, text, time, segmentId: undefined };
                  return updated;
                }
                if (lastWithRole < 0) {
                  return [...prev, { role, text, time, segmentId: undefined }];
                }
                return prev;
              }
              
              return prev;
            });
          }
          break;
      }
    });

    return () => {
      statusSub.remove();
      voiceSub.remove();
      agentSub.remove();
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current);
      }
    };
  }, []);

  const startAssistant = useCallback(() => {
    setIsConnecting(true);
    setLastError(null);
    startAssistantNative().catch((err: Error) => {
      setIsConnecting(false);
      setLastError(err.message || 'Failed to start assistant');
    });
  }, [startAssistantNative]);

  const stopAssistant = useCallback(() => {
    stopAssistantNative().catch(() => {});
    setIsAssistantActive(false);
    setIsConnecting(false);
    setVoiceActivity('idle');
    setTranscripts([]);
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current);
      durationTimerRef.current = null;
    }
  }, [stopAssistantNative]);

  return {
    isAssistantActive,
    isConnecting,
    callDuration,
    lastError,
    voiceActivity,
    transcripts,
    startAssistant,
    stopAssistant,
  };
}
