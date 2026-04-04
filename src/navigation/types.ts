export type RootStackParamList = {
  Home: undefined;
  PhoneEntry: undefined;
  PhoneOtp: { phone: string };
  EmailEntry: undefined;
  EmailOtp: { email: string };
  PanDetails: undefined;
  PersonalDetails: undefined;
  VerifyDocuments: undefined;
  DigilockerAadhaar: undefined;
  UploadAadhaarFront: undefined;
  UploadAadhaarBack: undefined;
  SelfieCapture: undefined;
  Signature: undefined;
};

export const Routes = {
  HOME: 'Home',
  PHONE_ENTRY: 'PhoneEntry',
  PHONE_OTP: 'PhoneOtp',
  EMAIL_ENTRY: 'EmailEntry',
  EMAIL_OTP: 'EmailOtp',
  PAN_DETAILS: 'PanDetails',
  PERSONAL_DETAILS: 'PersonalDetails',
  VERIFY_DOCUMENTS: 'VerifyDocuments',
  DIGILOCKER_AADHAAR: 'DigilockerAadhaar',
  UPLOAD_AADHAAR_FRONT: 'UploadAadhaarFront',
  UPLOAD_AADHAAR_BACK: 'UploadAadhaarBack',
  SELFIE_CAPTURE: 'SelfieCapture',
  SIGNATURE: 'Signature',
} as const;