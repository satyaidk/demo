// Client-side encryption utilities for privacy preservation

export class PrivacyManager {
  private static instance: PrivacyManager;
  private encryptionKey: CryptoKey | null = null;

  private constructor() {}

  static getInstance(): PrivacyManager {
    if (!PrivacyManager.instance) {
      PrivacyManager.instance = new PrivacyManager();
    }
    return PrivacyManager.instance;
  }

  async initialize(): Promise<void> {
    // Generate or retrieve encryption key
    const savedKey = localStorage.getItem('privacy_key');
    if (savedKey) {
      this.encryptionKey = await this.importKey(savedKey);
    } else {
      this.encryptionKey = await this.generateKey();
      const exportedKey = await this.exportKey(this.encryptionKey);
      localStorage.setItem('privacy_key', exportedKey);
    }
  }

  private async generateKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private async exportKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('raw', key);
    return Array.from(new Uint8Array(exported))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private async importKey(keyData: string): Promise<CryptoKey> {
    const keyBytes = new Uint8Array(
      keyData.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );
    
    return await crypto.subtle.importKey(
      'raw',
      keyBytes,
      { name: 'AES-GCM' },
      true,
      ['encrypt', 'decrypt']
    );
  }

  async encryptData(data: string): Promise<string> {
    if (!this.encryptionKey) {
      await this.initialize();
    }

    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey!,
      dataBytes
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    return Array.from(combined)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  async decryptData(encryptedData: string): Promise<string> {
    if (!this.encryptionKey) {
      await this.initialize();
    }

    const dataBytes = new Uint8Array(
      encryptedData.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );

    const iv = dataBytes.slice(0, 12);
    const encrypted = dataBytes.slice(12);

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey!,
      encrypted
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  generateCommitment(data: string): string {
    // Generate a commitment (hash) for zero-knowledge proofs
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);
    
    return crypto.subtle.digest('SHA-256', dataBytes).then(hash => 
      Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
    ).then(hash => '0x' + hash);
  }

  async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBytes = encoder.encode(data);
    const hash = await crypto.subtle.digest('SHA-256', dataBytes);
    
    return '0x' + Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Secure storage for sensitive data
  secureStore(key: string, data: any): void {
    const encrypted = this.encryptData(JSON.stringify(data));
    localStorage.setItem(`secure_${key}`, JSON.stringify(encrypted));
  }

  async secureRetrieve(key: string): Promise<any> {
    const stored = localStorage.getItem(`secure_${key}`);
    if (!stored) return null;

    try {
      const encrypted = JSON.parse(stored);
      const decrypted = await this.decryptData(encrypted);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Failed to decrypt stored data:', error);
      return null;
    }
  }

  clearSecureStorage(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('secure_'));
    keys.forEach(key => localStorage.removeItem(key));
    localStorage.removeItem('privacy_key');
    this.encryptionKey = null;
  }
}

export const privacyManager = PrivacyManager.getInstance();