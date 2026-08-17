# KYCIS React Native SDK

**Package:** `@kycis/react-native`  
**Docs:** https://docs.kycis.zynnex.in/docs/react-native/overview  
**E2E guide:** https://docs.kycis.zynnex.in/docs/examples/react-native-end-to-end

## Platform support

| Platform | Status |
| --- | --- |
| **Android** | Supported — bridges to `in.zynnex.kycis:kycis-sdk` |
| **iOS** | Not supported yet |

Voice, triggers, and popup evaluation run in **native Android `SdkRuntime`**, not in JavaScript.

## Installation

```bash
npm install @kycis/react-native lottie-react-native
```

`android/app/build.gradle`:

```gradle
implementation("in.zynnex.kycis:kycis-sdk:1.0.0")
```

Versions must match [SDK_COMPATIBILITY.md](https://github.com/zynnex/KYCIS/blob/main/SDK_COMPATIBILITY.md).

## Quick start

```tsx
import React, { useEffect } from 'react';
import { View } from 'react-native';
import {
  initialize,
  bindCurrentActivity,
  setUser,
  setKycStep,
  FloatingAssistantButton,
  onAgentEvent,
} from '@kycis/react-native';

export default function App() {
  useEffect(() => {
    (async () => {
      await initialize({ apiKey: 'YOUR_KEY', userId: 'user-123' });
      await bindCurrentActivity();
      onAgentEvent((event) => {
        if (event.type === 'POPUP_VISIBLE' && event.metadata.message) {
          console.log(event.metadata.message);
        }
      });
    })();
  }, []);

  useEffect(() => {
    setKycStep('home');
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* your screens */}
      <FloatingAssistantButton position="bottom-end" assistantName="KYC Assistant" />
    </View>
  );
}
```

After login: `await setUser('user-123', '+919876543210')`.

## API reference

- [Feature index](https://docs.kycis.zynnex.in/docs/react-native/api-reference-index)
- [Full catalog](https://docs.kycis.zynnex.in/docs/react-native/sdk-api) (auto-generated)

Key exports: `initialize`, `setUser`, `setKycStep`, `setFlow`, `clearFlow`, `track*`, `report*`, `getMergedConfig`, `checkForDynamicPopup`, `completeKycFlow`, `onVoiceSession`, `onAgentEvent`, `useVoiceAssistant`, `FloatingAssistantButton`.

## Integration kit

Copy `templates/integration-kit/react-native/` from the [KYCIS repo](https://github.com/zynnex/KYCIS) into `src/kycis/` — do not call `@kycis/react-native` from every screen.

## Agent events

```typescript
onAgentEvent((event) => {
  // event.type: CONNECTED | DISCONNECTED | POPUP_VISIBLE | TRANSCRIPTION_RECEIVED
  // POPUP_VISIBLE: event.metadata.message, event.metadata.popupReasonCode
});
```

## Requirements

- React Native 0.70+ (tested on 0.86)
- Android minSdk 24
- `FragmentActivity` for automatic LiveKit connect in the reference bridge

## Related

- [Android demo app](https://github.com/zynnex/KYCISDemo-kotlin) — native Compose reference
- [Callbacks & listeners](https://docs.kycis.zynnex.in/docs/guides/callbacks-and-listeners)
