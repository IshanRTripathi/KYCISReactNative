import type { ScreenSchema } from './types';

export const SCREEN_SCHEMAS: ScreenSchema[] = [
  {
    screenId: 'PHONE_ENTRY',
    displayName: 'Phone Number Entry',
    flowOrder: 1,
    nextScreenId: 'PHONE_OTP',
    components: [
      {
        id: 'phone_number',
        type: 'text_input',
        displayName: 'Phone Number',
        required: true,
        validations: [
          {
            ruleId: 'phone_format',
            intent: 'PHONE_FORMAT',
            pattern: '^\\d{10}$',
            errorCodes: ['invalid_length_or_format'],
          },
        ],
      },
    ],
  },
  {
    screenId: 'PHONE_OTP',
    displayName: 'Phone OTP Verification',
    flowOrder: 2,
    nextScreenId: 'EMAIL_ENTRY',
    components: [
      {
        id: 'phone_otp',
        type: 'otp_input',
        displayName: 'Phone OTP',
        required: true,
        validations: [
          {
            ruleId: 'otp_length',
            intent: 'OTP_FORMAT',
            errorCodes: ['incomplete_otp'],
          },
        ],
      },
    ],
  },
  {
    screenId: 'EMAIL_ENTRY',
    displayName: 'Email Entry',
    flowOrder: 3,
    nextScreenId: 'EMAIL_OTP',
    components: [
      {
        id: 'email',
        type: 'text_input',
        displayName: 'Email Address',
        required: true,
        validations: [
          {
            ruleId: 'email_format',
            intent: 'EMAIL_FORMAT',
            pattern: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$',
            errorCodes: ['invalid_email_format'],
          },
        ],
      },
    ],
  },
  {
    screenId: 'EMAIL_OTP',
    displayName: 'Email OTP Verification',
    flowOrder: 4,
    nextScreenId: 'PAN_DETAILS',
    components: [
      {
        id: 'email_otp',
        type: 'otp_input',
        displayName: 'Email OTP',
        required: true,
        validations: [
          {
            ruleId: 'otp_length',
            intent: 'OTP_FORMAT',
            errorCodes: ['incomplete_otp'],
          },
        ],
      },
    ],
  },
  {
    screenId: 'PAN_DETAILS',
    displayName: 'PAN Details',
    flowOrder: 5,
    nextScreenId: 'PERSONAL_DETAILS',
    components: [
      {
        id: 'pan_number',
        type: 'text_input',
        displayName: 'PAN Number',
        required: true,
        validations: [
          {
            ruleId: 'pan_format',
            intent: 'PAN_FORMAT',
            pattern: '^[A-Z]{5}[0-9]{4}[A-Z]$',
            errorCodes: ['invalid_pan_format'],
          },
        ],
      },
      {
        id: 'dob',
        type: 'text_input',
        displayName: 'Date of Birth',
        required: true,
        validations: [
          {
            ruleId: 'dob_required',
            intent: 'DOB_REQUIRED',
            errorCodes: ['empty_dob'],
          },
        ],
      },
      {
        id: 'terms_accepted',
        type: 'checkbox',
        displayName: 'Terms & Conditions',
        required: true,
        validations: [
          {
            ruleId: 'terms_required',
            intent: 'TERMS_ACCEPTANCE',
            errorCodes: ['terms_not_accepted'],
          },
        ],
      },
    ],
  },
  {
    screenId: 'PERSONAL_DETAILS',
    displayName: 'Personal Details',
    flowOrder: 6,
    nextScreenId: 'VERIFY_DOCUMENTS',
    components: [
      {
        id: 'name',
        type: 'text_input',
        displayName: 'Full Name',
        required: true,
      },
      {
        id: 'gender',
        type: 'dropdown',
        displayName: 'Gender',
        required: true,
      },
      {
        id: 'marital_status',
        type: 'dropdown',
        displayName: 'Marital Status',
        required: true,
      },
      {
        id: 'residency_status',
        type: 'dropdown',
        displayName: 'Residency Status',
        required: true,
      },
      {
        id: 'father_name',
        type: 'text_input',
        displayName: "Father's Name",
        required: true,
      },
    ],
  },
  {
    screenId: 'VERIFY_DOCUMENTS',
    displayName: 'Document Verification Choice',
    flowOrder: 7,
    components: [],
  },
  {
    screenId: 'DIGILOCKER_AADHAAR',
    displayName: 'DigiLocker Aadhaar',
    flowOrder: 8,
    nextScreenId: 'SELFIE_CAPTURE',
    components: [
      {
        id: 'aadhaar_number',
        type: 'text_input',
        displayName: 'Aadhaar Number',
        required: true,
        validations: [
          {
            ruleId: 'aadhaar_format',
            intent: 'AADHAAR_FORMAT',
            pattern: '^\\d{12}$',
            errorCodes: ['incomplete_aadhaar'],
          },
        ],
      },
    ],
  },
  {
    screenId: 'UPLOAD_AADHAAR_FRONT',
    displayName: 'Upload Aadhaar Front',
    flowOrder: 9,
    nextScreenId: 'UPLOAD_AADHAAR_BACK',
    components: [
      {
        id: 'aadhaar_front_upload',
        type: 'file_upload',
        displayName: 'Aadhaar Front Image',
        required: true,
        validations: [
          {
            ruleId: 'file_required',
            intent: 'FILE_UPLOAD',
            errorCodes: ['document_not_uploaded'],
          },
        ],
      },
    ],
  },
  {
    screenId: 'UPLOAD_AADHAAR_BACK',
    displayName: 'Upload Aadhaar Back',
    flowOrder: 10,
    nextScreenId: 'SELFIE_CAPTURE',
    components: [
      {
        id: 'aadhaar_back_upload',
        type: 'file_upload',
        displayName: 'Aadhaar Back Image',
        required: true,
        validations: [
          {
            ruleId: 'file_required',
            intent: 'FILE_UPLOAD',
            errorCodes: ['document_not_uploaded'],
          },
        ],
      },
    ],
  },
  {
    screenId: 'SELFIE_CAPTURE',
    displayName: 'Selfie Capture',
    flowOrder: 11,
    nextScreenId: 'SIGNATURE',
    components: [
      {
        id: 'selfie',
        type: 'camera',
        displayName: 'Selfie',
        required: true,
      },
    ],
  },
  {
    screenId: 'SIGNATURE',
    displayName: 'Signature',
    flowOrder: 12,
    components: [
      {
        id: 'signature',
        type: 'text_input',
        displayName: 'Signature',
        required: true,
      },
    ],
  },
];
