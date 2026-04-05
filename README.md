# KYCIS React Native SDK - Integration Guide

## Overview

The KYCIS React Native SDK provides a cross-platform solution for integrating voice-assisted KYC flows into React Native (Expo) applications. It mirrors the functionality of the native Android SDK while providing React Native-specific components and hooks.

## Installation

```bash
npm install lottie-react-native
```

## Quick Start

```tsx
import { useEffect } from 'react';
import { View } from 'react-native';
import * as Kycis from 'kycis';

export default function App() {
  useEffect(() => {
    Kycis.initialize({
      apiKey: 'your-api-key',
      userId: 'user-123',
      policy: {
        backendBaseUrl: 'http://localhost:8000/v1',
      },
    }).catch(err => console.error('KYCIS init failed:', err));
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* Your app content */}
      <Kycis.FloatingAssistantButton
        position="bottom-end"
        assistantName="KYC Assistant"
        fabType="premium"
      />
    </View>
  );
}
```

## API Reference

### FloatingAssistantButton

A draggable floating action button that provides voice assistant functionality. Supports both idle and active states, with expand/collapse animations for transcript display.

```tsx
import { FloatingAssistantButton } from 'kycis';
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-end'` | Initial position of the FAB on screen |
| `assistantName` | `string` | `'AI Assistant'` | Display name shown in the active header |
| `fabType` | `'basic' \| 'premium'` | `'premium'` | Visual style of the FAB |
| `lottieSource` | `any` | `undefined` | Lottie animation source for idle/active states |
| `lottieAutoPlay` | `boolean` | `true` | Whether to auto-play Lottie animation |
| `lottieLoop` | `boolean` | `true` | Whether to loop Lottie animation |

#### Basic FAB

```tsx
<Kycis.FloatingAssistantButton
  fabType="basic"
  position="bottom-start"
  assistantName="Help Agent"
/>
```

#### Premium FAB with Lottie

```tsx
<Kycis.FloatingAssistantButton
  fabType="premium"
  position="bottom-end"
  assistantName="KYC Assistant"
  lottieSource={require('./assets/assistant-animation.json')}
  lottieAutoPlay={true}
  lottieLoop={true}
/>
```

### useVoiceAssistant

Hook for managing voice assistant state and controlling the session programmatically.

```tsx
import { useVoiceAssistant } from 'kycis';

function MyComponent() {
  const {
    isAssistantActive,  // Whether voice session is active
    isConnecting,       // Whether connection is in progress
    callDuration,       // Duration in seconds
    lastError,          // Last error message if any
    voiceActivity,      // 'idle' | 'user_speaking' | 'agent_speaking'
    transcripts,        // Array of transcript entries
    startAssistant,     // Function to start voice session
    stopAssistant,      // Function to stop voice session
  } = useVoiceAssistant();

  return (
    <View>
      <Text>Transcripts: {transcripts.length}</Text>
    </View>
  );
}
```

#### Return Type

```ts
interface UseVoiceAssistantReturn {
  isAssistantActive: boolean;
  isConnecting: boolean;
  callDuration: number;
  lastError: string | null;
  voiceActivity: 'idle' | 'user_speaking' | 'agent_speaking';
  transcripts: TranscriptEntry[];
  startAssistant: () => void;
  stopAssistant: () => void;
}

interface TranscriptEntry {
  role: 'user' | 'agent';
  text: string;
  time: string;       // Format: HH:mm:ss
  segmentId?: string;
}
```

### initialize

Initialize the KYCIS SDK with configuration.

```tsx
import { initialize } from 'kycis';

await initialize({
  apiKey: 'your-api-key',
  userId: 'user-123',
  policy: {
    backendBaseUrl: 'http://localhost:8000/v1',
    clientId: 'my-client',
    appVersion: '1.0.0',
    triggerStartMode: 'IMMEDIATE' | 'COOLDOWN' | 'CONFIRM_UI',
    kycStepStrategy: 'HINT_THEN_INFER' | 'INFER_ONLY',
    passiveEvalEnabled: true,
    passiveEvalIntervalSeconds: 10,
  },
});
```

### setKycStep

Report the current KYC step to the SDK for triggering decisions.

```tsx
import { setKycStep } from 'kycis';

await setKycStep('PHONE_ENTRY');
// Other steps: NAME_ENTRY, EMAIL_ENTRY, AADHAR_VERIFICATION, etc.
```

### trackValidationFailure

Track when a user fails validation on a field.

```tsx
import { trackValidationFailure } from 'kycis';

await trackValidationFailure({
  failureReasonCode: 'INVALID_FORMAT',
  componentId: 'phone_input',
  componentType: 'text',
  expectedPattern: '\\d{10}',
  hint: 'Please enter a valid 10-digit phone number',
  businessStep: 'PHONE_ENTRY',
});
```

### reportComponentInput

Report user input on a component for passive evaluation.

```tsx
import { reportComponentInput } from 'kycis';

await reportComponentInput({
  componentId: 'phone_input',
  hint: 'User entered phone number',
  screen: 'PHONE_ENTRY',
});
```

## Configuration

### Backend Connection

For development with Android emulator, ensure the backend is accessible:

1. Use `http://10.0.2.2:8000/v1` (Android emulator maps to host localhost)
2. Configure network security config to allow cleartext traffic (debug only)

### Voice Session Events

The SDK emits events that can be listened to:

```tsx
import { onVoiceSession, onAgentEvent } from 'kycis';

// Listen for voice session started
const voiceSub = onVoiceSession((result) => {
  console.log('Voice session:', result.livekitRoom);
});

// Listen for agent events (transcripts, popups, etc.)
const agentSub = onAgentEvent((event) => {
  if (event.type === 'TRANSCRIPTION_RECEIVED') {
    console.log('Transcript:', event.metadata.transcript?.text);
  }
});
```

## Android-Specific Notes

### Native Module

The React Native SDK requires native code integration via `KycisModule`. The module is automatically linked when using the Expo managed workflow with prebuild.

### Required Permissions

The following permissions are requested automatically:
- `RECORD_AUDIO` - For voice input during assistant session
- `INTERNET` - For backend and LiveKit communication

### Network Configuration

For development builds targeting Android emulator, add this to `android/app/src/main/AndroidManifest.xml`:

```xml
<application android:networkSecurityConfig="@xml/network_security_config">
```

Create `android/app/src/main/res/xml/network_security_config.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="false" />
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">10.0.2.2</domain>
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config>
```

## TypeScript Types

```ts
interface KycisOptions {
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

interface VoiceSessionResult {
  token: string;
  livekitUrl: string;
  livekitRoom: string;
  assistantInvocationId: string;
}

interface AgentEvent {
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
```

## Troubleshooting

### No transcripts appearing

1. Ensure the backend is running and accessible from the emulator
2. Check logcat for `Transcription` log messages
3. Verify LiveKit credentials are being received

### FAB not responding to drag

1. Check that no other view has higher z-index
2. Ensure the component is rendered at root level

### Voice session fails to connect

1. Verify backend URL is accessible
2. Check network security config allows cleartext (development)
3. Ensure `RECORD_AUDIO` permission is granted
