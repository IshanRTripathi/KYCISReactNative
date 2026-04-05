import { NativeModules, NativeEventEmitter } from 'react-native';
import type {
  KycisOptions,
  VoiceSessionResult,
  AgentEvent,
  SdkStatus,
  KycisEventName,
  ScreenSchema,
} from './types';

const { KycisModule } = NativeModules;

const eventEmitter = new NativeEventEmitter(KycisModule);

export function initialize(options: KycisOptions): Promise<boolean> {
  return KycisModule.initialize(
    options.apiKey,
    options.userId,
    options.policy || null,
  );
}

export function setUser(id: string, phone?: string): Promise<boolean> {
  return KycisModule.setUser(id, phone || null);
}

export function setKycStep(step: string): Promise<boolean> {
  return KycisModule.setKycStep(step);
}

export function setFlow(flowName?: string): Promise<boolean> {
  return KycisModule.setFlow(flowName || null);
}

export function clearFlow(): Promise<boolean> {
  return KycisModule.clearFlow();
}

export function trackError(
  code: string,
  properties?: Record<string, string | number | boolean>,
): Promise<boolean> {
  return KycisModule.trackError(code, properties || null);
}

export function trackAnalytics(
  eventName: string,
  data?: Record<string, string | number | boolean>,
): Promise<boolean> {
  return KycisModule.trackAnalytics(eventName, data || null);
}

export function trackValidationFailure(params: {
  failureReasonCode: string;
  componentId?: string;
  componentType?: string;
  expectedPattern?: string;
  validationRuleId?: string;
  hint?: string;
  businessStep?: string;
  validationIntent?: string;
  recoveryPlaybookId?: string;
}): Promise<boolean> {
  return KycisModule.trackValidationFailure(
    params.failureReasonCode,
    params.componentId || null,
    params.componentType || null,
    params.expectedPattern || null,
    params.validationRuleId || null,
    params.hint || null,
    params.businessStep || null,
    params.validationIntent || null,
    params.recoveryPlaybookId || null,
  );
}

export function reportComponentInput(params: {
  componentId: string;
  hint: string;
  screen?: string;
  componentType?: string;
}): Promise<boolean> {
  return KycisModule.reportComponentInput(
    params.componentId,
    params.hint,
    params.screen || null,
    params.componentType || null,
  );
}

export function registerScreenSchemas(
  schemas: ScreenSchema[],
): Promise<boolean> {
  return KycisModule.registerScreenSchemas(schemas);
}

export function startAssistant(): Promise<boolean> {
  return KycisModule.startAssistant();
}

export function stopAssistant(): Promise<boolean> {
  return KycisModule.stopAssistant();
}

export function isFeatureEnabled(featureName: string): Promise<boolean> {
  return KycisModule.isFeatureEnabled(featureName);
}

export function onStatusChange(
  callback: (status: SdkStatus) => void,
) {
  return eventEmitter.addListener('onStatusChange', callback);
}

export function onVoiceSession(
  callback: (result: VoiceSessionResult) => void,
) {
  return eventEmitter.addListener('onVoiceSession', callback);
}

export function onAgentEvent(
  callback: (event: AgentEvent) => void,
) {
  return eventEmitter.addListener('onAgentEvent', callback);
}

export function addListener(
  eventName: KycisEventName,
  callback: (data: unknown) => void,
) {
  return eventEmitter.addListener(eventName, callback);
}

export { KycisModule };
export { useVoiceAssistant } from './useVoiceAssistant';
export type { UseVoiceAssistantReturn } from './useVoiceAssistant';
export type { 
  TranscriptEntry, 
  VoiceSessionResult, 
  AgentEvent, 
  SdkStatus,
  KycisOptions,
  ScreenSchema,
  ComponentSchema,
  ValidationRule,
  KycisEventName,
} from './types';
export { FloatingAssistantButton } from '../components/FloatingAssistantButton';
export type { FabPosition } from '../components/FloatingAssistantButton';
