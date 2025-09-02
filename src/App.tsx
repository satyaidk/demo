import React, { useState, useEffect } from 'react';
import { Shield, Zap, Lock, Eye, EyeOff } from 'lucide-react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import IdentityVerification from './components/IdentityVerification';
import SecureTransactions from './components/SecureTransactions';
import DataIntegrity from './components/DataIntegrity';
import ProofVisualization from './components/ProofVisualization';
import NetworkStatus from './components/NetworkStatus';
import { useZkVerify } from './hooks/useZkVerify';
import { useWallet } from './hooks/useWallet';

type TabType = 'dashboard' | 'identity' | 'transactions' | 'integrity' | 'proofs';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [privacyMode, setPrivacyMode] = useState(true);
  const { isConnected, proofCount, verificationStatus } = useZkVerify();
  const { wallet, connectWallet, disconnectWallet } = useWallet();

  useEffect(() => {
    // Initialize privacy settings from localStorage
    const savedPrivacyMode = localStorage.getItem('privacyMode');
    if (savedPrivacyMode !== null) {
      setPrivacyMode(JSON.parse(savedPrivacyMode));
    }
  }, []);

  const togglePrivacyMode = () => {
    const newMode = !privacyMode;
    setPrivacyMode(newMode);
    localStorage.setItem('privacyMode', JSON.stringify(newMode));
  };

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: Shield },
    { id: 'identity' as TabType, label: 'Identity', icon: Lock },
    { id: 'transactions' as TabType, label: 'Transactions', icon: Zap },
    { id: 'integrity' as TabType, label: 'Data Integrity', icon: Shield },
    { id: 'proofs' as TabType, label: 'Proof Visualization', icon: Eye },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'identity':
        return <IdentityVerification />;
      case 'transactions':
        return <SecureTransactions />;
      case 'integrity':
        return <DataIntegrity />;
      case 'proofs':
        return <ProofVisualization />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        <Navbar 
          wallet={wallet}
          onConnect={connectWallet}
          onDisconnect={disconnectWallet}
          privacyMode={privacyMode}
          onTogglePrivacy={togglePrivacyMode}
        />

        {/* Network Status Bar */}
        <NetworkStatus 
          isConnected={isConnected}
          proofCount={proofCount}
          verificationStatus={verificationStatus}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 p-1 bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow-lg shadow-purple-500/25'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Privacy Mode Indicator */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
              <span className="text-slate-300 text-sm">
                {isConnected ? 'zkVerify Connected' : 'Connecting to zkVerify...'}
              </span>
            </div>
            
            <button
              onClick={togglePrivacyMode}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700/50 text-slate-300 hover:text-white transition-all duration-300 hover:bg-slate-700/50"
            >
              {privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm">
                {privacyMode ? 'Privacy Mode: ON' : 'Privacy Mode: OFF'}
              </span>
            </button>
          </div>

          {/* Content Area */}
          <div className="relative">
            {renderContent()}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">zkVerify Privacy dApp</h3>
                <p className="text-slate-400 text-sm">
                  Leveraging zero-knowledge proofs for ultimate privacy and security in decentralized applications.
                </p>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Supported Networks</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• zkVerify Blockchain</li>
                  <li>• Horizen L3</li>
                  <li>• EDUChain Testnet</li>
                  <li>• Apechain Testnet</li>
                  <li>• Arbitrum Sepolia</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-4">Privacy Features</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>• Zero-Knowledge Proofs</li>
                  <li>• Encrypted Data Storage</li>
                  <li>• Anonymous Transactions</li>
                  <li>• Trustless Verification</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-slate-700/50 text-center text-slate-400 text-sm">
              <p>Built with zkVerify & Horizen • Privacy-First • Zero-Knowledge</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;