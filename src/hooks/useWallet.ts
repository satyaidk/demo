import { useState, useEffect } from 'react';

interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnecting: boolean;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnecting: false,
  });

  useEffect(() => {
    // Check if wallet was previously connected
    const savedAddress = localStorage.getItem('wallet_address');
    if (savedAddress) {
      setWallet(prev => ({ ...prev, address: savedAddress }));
    }

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          setWallet(prev => ({ ...prev, address: accounts[0] }));
          localStorage.setItem('wallet_address', accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', (chainId: string) => {
        setWallet(prev => ({ ...prev, chainId: parseInt(chainId, 16) }));
      });
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('Please install MetaMask or another Web3 wallet');
      return;
    }

    setWallet(prev => ({ ...prev, isConnecting: true }));

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const chainId = await window.ethereum.request({
        method: 'eth_chainId',
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWallet({
          address,
          chainId: parseInt(chainId, 16),
          isConnecting: false,
        });
        localStorage.setItem('wallet_address', address);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      setWallet(prev => ({ ...prev, isConnecting: false }));
    }
  };

  const disconnectWallet = () => {
    setWallet({
      address: null,
      chainId: null,
      isConnecting: false,
    });
    localStorage.removeItem('wallet_address');
  };

  const switchNetwork = async (chainId: number) => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      console.error('Failed to switch network:', error);
    }
  };

  return {
    wallet: wallet.address,
    chainId: wallet.chainId,
    isConnecting: wallet.isConnecting,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };
};