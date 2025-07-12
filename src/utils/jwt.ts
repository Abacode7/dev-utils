export interface JWTHeader {
  alg: string;
  typ: string;
  kid?: string;
  [key: string]: unknown;
}

export interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string | string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  [key: string]: unknown;
}

export interface DecodedJWT {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  raw: {
    header: string;
    payload: string;
    signature: string;
  };
}

export interface JWTValidation {
  isValid: boolean;
  isExpired: boolean;
  isNotYetValid: boolean;
  expiresAt?: Date;
  notValidBefore?: Date;
  issuedAt?: Date;
  timeToExpiry?: number;
  errors: string[];
}

export interface SignatureVerificationResult {
  isValid: boolean;
  error?: string;
  algorithm: string;
}

export class JWTDecoder {
  private static base64UrlDecode(str: string): string {
    // Add padding if necessary
    let padded = str;
    while (padded.length % 4) {
      padded += '=';
    }
    
    // Replace URL-safe characters
    const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
    
    try {
      return atob(base64);
    } catch {
      throw new Error('Invalid base64url encoding');
    }
  }

  static decode(token: string): DecodedJWT {
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format. Expected 3 parts separated by dots.');
    }

    const [headerPart, payloadPart, signaturePart] = parts;

    try {
      const headerJson = this.base64UrlDecode(headerPart);
      const payloadJson = this.base64UrlDecode(payloadPart);
      
      const header = JSON.parse(headerJson) as JWTHeader;
      const payload = JSON.parse(payloadJson) as JWTPayload;

      return {
        header,
        payload,
        signature: signaturePart,
        raw: {
          header: headerPart,
          payload: payloadPart,
          signature: signaturePart
        }
      };
    } catch (error) {
      throw new Error(`Failed to decode JWT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static validate(decoded: DecodedJWT): JWTValidation {
    const errors: string[] = [];
    const now = Math.floor(Date.now() / 1000);
    
    let isExpired = false;
    let isNotYetValid = false;
    let expiresAt: Date | undefined;
    let notValidBefore: Date | undefined;
    let issuedAt: Date | undefined;
    let timeToExpiry: number | undefined;

    // Check expiry
    if (decoded.payload.exp !== undefined) {
      if (typeof decoded.payload.exp !== 'number') {
        errors.push('Invalid exp claim: must be a number');
      } else {
        expiresAt = new Date(decoded.payload.exp * 1000);
        isExpired = decoded.payload.exp < now;
        if (isExpired) {
          errors.push('Token has expired');
        } else {
          timeToExpiry = decoded.payload.exp - now;
        }
      }
    }

    // Check not before
    if (decoded.payload.nbf !== undefined) {
      if (typeof decoded.payload.nbf !== 'number') {
        errors.push('Invalid nbf claim: must be a number');
      } else {
        notValidBefore = new Date(decoded.payload.nbf * 1000);
        isNotYetValid = decoded.payload.nbf > now;
        if (isNotYetValid) {
          errors.push('Token is not yet valid');
        }
      }
    }

    // Check issued at
    if (decoded.payload.iat !== undefined) {
      if (typeof decoded.payload.iat !== 'number') {
        errors.push('Invalid iat claim: must be a number');
      } else {
        issuedAt = new Date(decoded.payload.iat * 1000);
        if (decoded.payload.iat > now) {
          errors.push('Token issued in the future');
        }
      }
    }

    // Validate algorithm
    if (!decoded.header.alg || decoded.header.alg === 'none') {
      errors.push('Missing or invalid algorithm');
    }

    // Validate token type
    if (decoded.header.typ && decoded.header.typ !== 'JWT') {
      errors.push('Invalid token type');
    }

    return {
      isValid: errors.length === 0,
      isExpired,
      isNotYetValid,
      expiresAt,
      notValidBefore,
      issuedAt,
      timeToExpiry,
      errors
    };
  }

  static async verifySignature(
    token: string, 
    secret: string, 
    algorithm: 'HS256' | 'RS256' = 'HS256'
  ): Promise<SignatureVerificationResult> {
    try {
      const decoded = this.decode(token);
      
      if (decoded.header.alg !== algorithm) {
        return {
          isValid: false,
          error: `Algorithm mismatch. Expected ${algorithm}, got ${decoded.header.alg}`,
          algorithm: decoded.header.alg
        };
      }

      const [header, payload] = token.split('.');
      const data = `${header}.${payload}`;

      if (algorithm === 'HS256') {
        return await this.verifyHMAC(data, decoded.signature, secret);
      } else if (algorithm === 'RS256') {
        return await this.verifyRSA(data, decoded.signature, secret);
      }

      return {
        isValid: false,
        error: `Unsupported algorithm: ${algorithm}`,
        algorithm
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Signature verification failed',
        algorithm
      };
    }
  }

  private static async verifyHMAC(data: string, signature: string, secret: string): Promise<SignatureVerificationResult> {
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(data);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const expectedSignature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
      const expectedBase64 = btoa(String.fromCharCode(...new Uint8Array(expectedSignature)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      return {
        isValid: expectedBase64 === signature,
        error: expectedBase64 !== signature ? 'Signature verification failed' : undefined,
        algorithm: 'HS256'
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'HMAC verification error',
        algorithm: 'HS256'
      };
    }
  }

  private static async verifyRSA(data: string, signature: string, publicKey: string): Promise<SignatureVerificationResult> {
    try {
      // Convert PEM to binary
      const pemContents = publicKey
        .replace(/-----BEGIN PUBLIC KEY-----/g, '')
        .replace(/-----END PUBLIC KEY-----/g, '')
        .replace(/\s/g, '');

      const binaryDer = Uint8Array.from(atob(pemContents), c => c.charCodeAt(0));

      const cryptoKey = await crypto.subtle.importKey(
        'spki',
        binaryDer,
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['verify']
      );

      // Decode signature
      const binarySignature = Uint8Array.from(atob(signature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
      const encoder = new TextEncoder();
      const messageData = encoder.encode(data);

      const isValid = await crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        cryptoKey,
        binarySignature,
        messageData
      );

      return {
        isValid,
        error: !isValid ? 'RSA signature verification failed' : undefined,
        algorithm: 'RS256'
      };
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'RSA verification error',
        algorithm: 'RS256'
      };
    }
  }
}