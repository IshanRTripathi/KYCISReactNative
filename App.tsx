import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Screens from './src/screens';
import { RootStackParamList } from './src/navigation/types';
import { ThemeColors } from './src/theme';
import * as Kycis from './src/kycis';
import { SCREEN_SCHEMAS } from './src/kycis/schemas';

const Stack = createNativeStackNavigator<RootStackParamList>();

const stepMap: Record<string, string> = {
  Home: 'HOME',
  PhoneEntry: 'PHONE_ENTRY',
  PhoneOtp: 'PHONE_OTP',
  EmailEntry: 'EMAIL_ENTRY',
  EmailOtp: 'EMAIL_OTP',
  PanDetails: 'PAN_DETAILS',
  PersonalDetails: 'PERSONAL_DETAILS',
  VerifyDocuments: 'VERIFY_DOCUMENTS',
  DigilockerAadhaar: 'DIGILOCKER_AADHAAR',
  UploadAadhaarFront: 'UPLOAD_AADHAAR_FRONT',
  UploadAadhaarBack: 'UPLOAD_AADHAAR_BACK',
  SelfieCapture: 'SELFIE_CAPTURE',
  Signature: 'SIGNATURE',
};

export default function App() {
  const initialized = useRef(false);
  const navigationRef = useRef(null);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Schema registration - temporarily disabled due to native bridge issue
    // Kycis.registerScreenSchemas(SCREEN_SCHEMAS).catch((err) => {
    //   console.error('KYCIS schema registration failed:', err);
    // });

    // Prod: api.kycis.zynnex.in (Cloudflare → Cloud Run). Local emulator: http://10.0.2.2:8000/v1
    const backendBaseUrl =
      process.env.EXPO_PUBLIC_KYCIS_BACKEND_URL ??
      'https://api.kycis.zynnex.in/v1';
    const apiKey =
      process.env.EXPO_PUBLIC_KYCIS_API_KEY ?? 'your-api-key';

    Kycis.initialize({
      apiKey,
      userId: 'demo-user',
      policy: {
        backendBaseUrl,
        triggerStartMode: 'IMMEDIATE',
        kycStepStrategy: 'HINT_THEN_INFER',
        passiveEvalEnabled: false,
        passiveEvalIntervalSeconds: 10,
      },
    }).catch((err) => {
      console.error('KYCIS init failed:', err);
    });
  }, []);

  const trackRoute = () => {
    const route = navigationRef.current?.getCurrentRoute();
    if (route && stepMap[route.name]) {
      Kycis.setKycStep(stepMap[route.name]);
    }
  };

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer
        ref={navigationRef}
        onReady={trackRoute}
        onStateChange={trackRoute}
      >
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: ThemeColors.lightBackground },
          }}
        >
          <Stack.Screen name="Home">
            {({ navigation }) => (
              <Screens.HomeScreen
                onStartFlow={() => navigation.navigate('PhoneEntry')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="PhoneEntry">
            {({ navigation }) => (
              <Screens.PhoneEntryScreen
                onBack={() => navigation.goBack()}
                onGetOtp={(phone) =>
                  navigation.navigate('PhoneOtp', { phone })
                }
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="PhoneOtp">
            {({ route, navigation }) => (
              <Screens.PhoneOtpScreen
                phoneNumber={route.params.phone}
                onBack={() => navigation.goBack()}
                onVerify={() => navigation.navigate('EmailEntry')}
                onResendProvider={() => {}}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="EmailEntry">
            {({ navigation }) => (
              <Screens.EmailEntryScreen
                onBack={() => navigation.goBack()}
                onGetOtp={(email) =>
                  navigation.navigate('EmailOtp', { email })
                }
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="EmailOtp">
            {({ route, navigation }) => (
              <Screens.EmailOtpScreen
                email={route.params.email}
                onBack={() => navigation.goBack()}
                onVerify={() => navigation.navigate('PanDetails')}
                onResendProvider={() => {}}
                onSkip={() => navigation.navigate('PanDetails')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="PanDetails">
            {({ navigation }) => (
              <Screens.PanDetailsScreen
                onBack={() => navigation.goBack()}
                onNext={() => navigation.navigate('PersonalDetails')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="PersonalDetails">
            {({ navigation }) => (
              <Screens.PersonalDetailsScreen
                onBack={() => navigation.goBack()}
                onProceed={() => navigation.navigate('VerifyDocuments')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="VerifyDocuments">
            {({ navigation }) => (
              <Screens.VerifyDocumentsScreen
                onBack={() => navigation.goBack()}
                onProceedWithAadhaar={() =>
                  navigation.navigate('DigilockerAadhaar')
                }
                onOfflineProcess={() =>
                  navigation.navigate('UploadAadhaarFront')
                }
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="DigilockerAadhaar">
            {({ navigation }) => (
              <Screens.DigilockerAadhaarScreen
                onBack={() => navigation.goBack()}
                onNext={() => navigation.navigate('SelfieCapture')}
                onTryAnotherWay={() =>
                  navigation.navigate('UploadAadhaarFront')
                }
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="UploadAadhaarFront">
            {({ navigation }) => (
              <Screens.UploadAadhaarScreen
                isFront={true}
                onBack={() => navigation.goBack()}
                onNext={() => navigation.navigate('UploadAadhaarBack')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="UploadAadhaarBack">
            {({ navigation }) => (
              <Screens.UploadAadhaarScreen
                isFront={false}
                onBack={() => navigation.goBack()}
                onNext={() => navigation.navigate('SelfieCapture')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="SelfieCapture">
            {({ navigation }) => (
              <Screens.SelfieCaptureScreen
                onCaptured={() => navigation.navigate('Signature')}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Signature">
            {({ navigation }) => (
              <Screens.SignatureScreen
                onBack={() => navigation.goBack()}
                onSubmit={() => navigation.navigate('Home')}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      <Kycis.FloatingAssistantButton
        position="bottom-end"
        assistantName="KYC Assistant"
      />
    </>
  );
}