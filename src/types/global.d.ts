// Global type definitions for the zkVerify dApp

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

export interface ZkProofSystem {
  name: string;
  type: 'plonk' | 'groth16' | 'stark' | 'bulletproofs';
  description: string;
  verificationTime: number;
  proofSize: number;
}

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

export interface ProofMetadata {
  id: string;
  type: 'identity' | 'transaction' | 'data_integrity';
  status: 'pending' | 'generating' | 'verifying' | 'verified' | 'failed';
  createdAt: Date;
  verifiedAt?: Date;
  proofSystem: string;
  gasUsed?: number;
  blockNumber?: number;
  transactionHash?: string;
}

export interface PrivacySettings {
  encryptLocalStorage: boolean;
  hideTransactionAmounts: boolean;
  anonymizeIdentity: boolean;
  enablePrivateMode: boolean;
}

export interface UserProfile {
  id: string;
  address: string;
  verificationLevel: 'none' | 'basic' | 'advanced' | 'premium';
  totalProofs: number;
  joinedAt: Date;
  preferences: PrivacySettings;
}

export {};