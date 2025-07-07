export interface EncryptionResult {
  encrypted: string;
  algorithm: string;
  salt?: string;
  iv?: string;
  iterations?: number;
}

export interface DecryptionResult {
  decrypted: string;
  isValid: boolean;
  error?: string;
}

export interface PasswordStrength {
  score: number; // 0-4
  feedback: string[];
  isStrong: boolean;
}

export type SupportedAlgorithm = 'AES-256-GCM' | 'PBEWithHmacSHA256AndAES_256';

export class JasyptEncryption {
  private static readonly DEFAULT_ITERATIONS = 10000;
  private static readonly MIN_PASSWORD_LENGTH = 12;
  private static readonly SALT_LENGTH = 16;
  private static readonly IV_LENGTH = 12; // GCM standard

  static validatePassword(password: string): PasswordStrength {
    const feedback: string[] = [];
    let score = 0;

    if (password.length < this.MIN_PASSWORD_LENGTH) {
      feedback.push(`Password must be at least ${this.MIN_PASSWORD_LENGTH} characters`);
    } else {
      score += 1;
    }

    if (!/[a-z]/.test(password)) {
      feedback.push('Password must contain lowercase letters');
    } else {
      score += 1;
    }

    if (!/[A-Z]/.test(password)) {
      feedback.push('Password must contain uppercase letters');
    } else {
      score += 1;
    }

    if (!/[0-9]/.test(password)) {
      feedback.push('Password must contain numbers');
    } else {
      score += 1;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push('Password must contain special characters');
    } else {
      score += 1;
    }

    if (password.length >= 16) {
      score += 1;
    }

    const isStrong = score >= 4 && password.length >= this.MIN_PASSWORD_LENGTH;
    
    if (isStrong && feedback.length === 0) {
      feedback.push('Strong password');
    }

    return {
      score: Math.min(score, 4),
      feedback,
      isStrong
    };
  }

  static generateSecurePassword(length: number = 16): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*(),.?":{}|<>';
    const allChars = uppercase + lowercase + numbers + symbols;
    
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    let password = '';
    
    // Ensure at least one character from each category
    password += uppercase[array[0] % uppercase.length];
    password += lowercase[array[1] % lowercase.length];
    password += numbers[array[2] % numbers.length];
    password += symbols[array[3] % symbols.length];
    
    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += allChars[array[i] % allChars.length];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  static async encrypt(
    plaintext: string,
    password: string,
    algorithm: SupportedAlgorithm = 'AES-256-GCM'
  ): Promise<EncryptionResult> {
    if (!plaintext) {
      throw new Error('Plaintext cannot be empty');
    }

    const passwordValidation = this.validatePassword(password);
    if (!passwordValidation.isStrong) {
      throw new Error(`Weak password: ${passwordValidation.feedback.join(', ')}`);
    }

    try {
      if (algorithm === 'AES-256-GCM') {
        return await this.encryptAESGCM(plaintext, password);
      } else if (algorithm === 'PBEWithHmacSHA256AndAES_256') {
        return await this.encryptPBEWithHmacSHA256AndAES256(plaintext, password);
      } else {
        throw new Error(`Unsupported algorithm: ${algorithm}`);
      }
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async decrypt(
    encryptedData: string,
    password: string,
    algorithm: SupportedAlgorithm = 'AES-256-GCM'
  ): Promise<DecryptionResult> {
    if (!encryptedData || !password) {
      return {
        decrypted: '',
        isValid: false,
        error: 'Encrypted data and password are required'
      };
    }

    try {
      let decrypted: string;
      
      if (algorithm === 'AES-256-GCM') {
        decrypted = await this.decryptAESGCM(encryptedData, password);
      } else if (algorithm === 'PBEWithHmacSHA256AndAES_256') {
        decrypted = await this.decryptPBEWithHmacSHA256AndAES256(encryptedData, password);
      } else {
        throw new Error(`Unsupported algorithm: ${algorithm}`);
      }

      return {
        decrypted,
        isValid: true
      };
    } catch (error) {
      return {
        decrypted: '',
        isValid: false,
        error: error instanceof Error ? error.message : 'Decryption failed'
      };
    }
  }

  private static async encryptAESGCM(plaintext: string, password: string): Promise<EncryptionResult> {
    const salt = crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));
    
    // Derive key using PBKDF2
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: this.DEFAULT_ITERATIONS,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      new TextEncoder().encode(plaintext)
    );

    // Combine salt + iv + encrypted data
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);

    return {
      encrypted: btoa(String.fromCharCode(...combined)),
      algorithm: 'AES-256-GCM',
      salt: btoa(String.fromCharCode(...salt)),
      iv: btoa(String.fromCharCode(...iv)),
      iterations: this.DEFAULT_ITERATIONS
    };
  }

  private static async decryptAESGCM(encryptedData: string, password: string): Promise<string> {
    try {
      const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
      
      const salt = combined.slice(0, this.SALT_LENGTH);
      const iv = combined.slice(this.SALT_LENGTH, this.SALT_LENGTH + this.IV_LENGTH);
      const encrypted = combined.slice(this.SALT_LENGTH + this.IV_LENGTH);

      // Derive key
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: this.DEFAULT_ITERATIONS,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
      );

      // Decrypt
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      throw new Error('Invalid encrypted data or wrong password');
    }
  }

  private static async encryptPBEWithHmacSHA256AndAES256(
    plaintext: string, 
    password: string
  ): Promise<EncryptionResult> {
    const salt = crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(16)); // AES block size
    
    // Derive key using PBKDF2 with HMAC-SHA256
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );

    const key = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: this.DEFAULT_ITERATIONS,
        hash: 'SHA-256'
      },
      keyMaterial,
      { name: 'AES-CBC', length: 256 },
      false,
      ['encrypt']
    );

    // Encrypt using AES-CBC
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-CBC', iv },
      key,
      new TextEncoder().encode(plaintext)
    );

    // Combine salt + iv + encrypted data (Jasypt format)
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);

    return {
      encrypted: btoa(String.fromCharCode(...combined)),
      algorithm: 'PBEWithHmacSHA256AndAES_256',
      salt: btoa(String.fromCharCode(...salt)),
      iv: btoa(String.fromCharCode(...iv)),
      iterations: this.DEFAULT_ITERATIONS
    };
  }

  private static async decryptPBEWithHmacSHA256AndAES256(
    encryptedData: string, 
    password: string
  ): Promise<string> {
    try {
      const combined = new Uint8Array(atob(encryptedData).split('').map(c => c.charCodeAt(0)));
      
      const salt = combined.slice(0, this.SALT_LENGTH);
      const iv = combined.slice(this.SALT_LENGTH, this.SALT_LENGTH + 16);
      const encrypted = combined.slice(this.SALT_LENGTH + 16);

      // Derive key
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(password),
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
      );

      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations: this.DEFAULT_ITERATIONS,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-CBC', length: 256 },
        false,
        ['decrypt']
      );

      // Decrypt
      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv },
        key,
        encrypted
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      throw new Error('Invalid encrypted data or wrong password');
    }
  }

  static compareTexts(text1: string, text2: string): boolean {
    if (text1.length !== text2.length) return false;
    
    let result = 0;
    for (let i = 0; i < text1.length; i++) {
      result |= text1.charCodeAt(i) ^ text2.charCodeAt(i);
    }
    return result === 0;
  }

  static exportConfiguration(algorithm: SupportedAlgorithm, iterations: number = this.DEFAULT_ITERATIONS): string {
    const config = {
      algorithm,
      iterations,
      keyDerivation: 'PBKDF2',
      hashFunction: 'SHA-256',
      saltLength: this.SALT_LENGTH,
      ivLength: algorithm === 'AES-256-GCM' ? this.IV_LENGTH : 16,
      format: 'base64',
      timestamp: new Date().toISOString()
    };
    
    return JSON.stringify(config, null, 2);
  }

  static clearMemory(sensitiveData: string[]): void {
    // In a real-world scenario, this would clear memory more thoroughly
    // For now, we'll just overwrite the references
    sensitiveData.forEach((_, index) => {
      sensitiveData[index] = '';
    });
  }
}