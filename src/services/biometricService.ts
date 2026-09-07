/**
 * Native Phone / Device Biometric Authentication Service (WebAuthn)
 * Little Roses Academy - Teacher Device Association
 */

export interface BiometricStatus {
  isSupported: boolean;
  hasEnrolledAuthenticator: boolean;
  type: 'fingerprint_or_face' | 'device_pin' | 'none';
}

/**
 * Derives the active Relying Party ID from the real deployed browser origin.
 * Never uses hardcoded or placeholder domains.
 */
function getActiveRelyingPartyId(): string | undefined {
  if (typeof window === 'undefined' || !window.location?.hostname) {
    return undefined;
  }
  const host = window.location.hostname.toLowerCase();
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'localhost';
  }
  // Use the exact active deployed host (e.g. your custom domain or cloud run app)
  if (host.includes('.')) {
    return host;
  }
  return undefined;
}

/**
 * Check if the user's device/phone supports native biometric verification
 * (Android Fingerprint / Face Unlock / Screen Lock PIN)
 */
export async function checkBiometricSupport(): Promise<BiometricStatus> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    return {
      isSupported: false,
      hasEnrolledAuthenticator: false,
      type: 'none'
    };
  }

  try {
    const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
    return {
      isSupported: isAvailable,
      hasEnrolledAuthenticator: isAvailable,
      type: isAvailable ? 'fingerprint_or_face' : 'none'
    };
  } catch (err) {
    console.warn('Biometric support check error:', err);
    return {
      isSupported: false,
      hasEnrolledAuthenticator: false,
      type: 'none'
    };
  }
}

/**
 * Register biometric credentials for the teacher on this phone
 */
export async function registerBiometrics(
  teacherId: string, 
  teacherName: string
): Promise<{ success: boolean; credentialId?: string; error?: string }> {
  const support = await checkBiometricSupport();
  if (!support.isSupported) {
    return { success: false, error: 'Biometrics not supported on this device' };
  }

  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const userIdBytes = new Uint8Array(teacherId.split('').map(c => c.charCodeAt(0)));

    const rpId = getActiveRelyingPartyId();
    const rpEntity: PublicKeyCredentialRpEntity = {
      name: 'Little Roses Academy EduHub'
    };
    if (rpId) {
      rpEntity.id = rpId;
    }

    const createOptions: PublicKeyCredentialCreationOptions = {
      challenge,
      rp: rpEntity,
      user: {
        id: userIdBytes,
        name: teacherId,
        displayName: teacherName
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },  // ES256
        { type: 'public-key', alg: -257 } // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Native phone fingerprint/face/PIN
        userVerification: 'required',
        residentKey: 'discouraged'
      },
      timeout: 60000
    };

    const credential = await navigator.credentials.create({
      publicKey: createOptions
    }) as PublicKeyCredential | null;

    if (credential) {
      const rawId = credential.id;
      return { success: true, credentialId: rawId };
    }

    return { success: false, error: 'Biometric registration was cancelled.' };
  } catch (err: any) {
    console.warn('Biometric enrollment exception:', err);
    return { 
      success: false, 
      error: err.name === 'NotAllowedError' 
        ? 'Biometric setup cancelled or timed out.' 
        : (err.message || 'Failed to register biometrics.')
    };
  }
}

/**
 * Authenticate the teacher using the device's native biometric prompt
 */
export async function authenticateWithBiometrics(
  credentialId?: string
): Promise<{ success: boolean; error?: string }> {
  if (typeof window === 'undefined' || !window.PublicKeyCredential) {
    return { success: false, error: 'Biometric API not supported in this browser' };
  }

  try {
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);

    const rpId = getActiveRelyingPartyId();
    const requestOptions: PublicKeyCredentialRequestOptions = {
      challenge,
      userVerification: 'required',
      timeout: 60000
    };
    if (rpId) {
      requestOptions.rpId = rpId;
    }

    if (credentialId) {
      let base64 = credentialId.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }
      try {
        requestOptions.allowCredentials = [
          {
            type: 'public-key',
            id: Uint8Array.from(atob(base64), c => c.charCodeAt(0)),
            transports: ['internal']
          }
        ];
      } catch (decodeErr) {
        console.warn('Could not decode credentialId, continuing without allowCredentials:', decodeErr);
      }
    }

    const assertion = await navigator.credentials.get({
      publicKey: requestOptions
    });

    if (assertion) {
      return { success: true };
    }
    return { success: false, error: 'Authentication not verified' };
  } catch (err: any) {
    console.warn('Biometric verification error:', err);
    return { 
      success: false, 
      error: err.name === 'NotAllowedError' 
        ? 'Biometric scan cancelled or not recognized' 
        : (err.message || 'Biometric authentication failed')
    };
  }
}
