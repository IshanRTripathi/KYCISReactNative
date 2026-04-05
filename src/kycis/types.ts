export interface ValidationRule {
  ruleId: string;
  intent?: string;
  pattern?: string;
  errorCodes?: string[];
  recoveryPlaybookId?: string;
  description?: string;
}

export interface ComponentSchema {
  id: string;
  type: string;
  displayName?: string;
  required?: boolean;
  validations?: ValidationRule[];
}

export interface ScreenSchema {
  screenId: string;
  displayName?: string;
  components?: ComponentSchema[];
  nextScreenId?: string;
  flowOrder?: number;
}

export interface KycisOptions {
  apiKey: string;
  userId: string;
  policy?: {
    backendBaseUrl?: string;
    clientId?: string;
    mappingVersion?: string;
    appVersion?: string;
    triggerStartMode?: 'IMMEDIATE' | 'COOLDOWN' | 'CONFIRM_UI';
    kycStepStrategy?: 'HINT_THEN_INFER' | 'INFER_ONLY';
    passiveEvalEnabled?: boolean;
    passiveEvalIntervalSeconds?: number;
  };
}

export interface VoiceSessionResult {
  token: string;
  livekitUrl: string;
  livekitRoom: string;
  assistantInvocationId: string;
}

export interface TranscriptEntry {
  role: 'user' | 'agent';
  text: string;
  time: string;
  segmentId?: string;
}

export interface AgentEvent {
  type: 'CONNECTED' | 'DISCONNECTED' | 'POPUP_VISIBLE' | 'TRANSCRIPTION_RECEIVED';
  metadata: {
    callDuration?: number;
    message?: string;
    trigger?: string;
    transcript?: {
      role: 'user' | 'agent';
      text: string;
      time: string;
      segmentId?: string;
      isFinal?: boolean;
    };
  };
}

export interface SdkStatus {
  code: 'REDUCED_TRACKING_MODE' | 'LIFECYCLE_ATTACHED' | 'ERROR';
  message: string;
}

export type KycisEventName = 'onStatusChange' | 'onVoiceSession' | 'onAgentEvent';
