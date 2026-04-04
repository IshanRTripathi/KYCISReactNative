import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Screens from './src/screens';
import { RootStackParamList } from './src/navigation/types';
import { ThemeColors } from './src/theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
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
    </>
  );
}