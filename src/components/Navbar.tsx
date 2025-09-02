import React from 'react';
import { Shield, Wallet, LogOut, Eye, EyeOff } from 'lucide-react';

interface NavbarProps {
  wallet: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  wallet,
  onConnect,
  onDisconnect,
  privacyMode,
  onTogglePrivacy,
}) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-400" />
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-md"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Private world 
              </h1>
              <p className="text-xs text-slate-400">Powered by Private world</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            {/* Privacy Toggle */}
            <button
              onClick={onTogglePrivacy}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                privacyMode
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
              }`}
            >
              {privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-sm hidden sm:inline">
                {privacyMode ? 'Private' : 'Public'}
              </span>
            </button>

            {/* Wallet Connection */}
            {wallet ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-slate-300 font-mono">
                    {formatAddress(wallet)}
                  </span>
                </div>
                <button
                  onClick={onDisconnect}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onConnect}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-300 shadow-lg shadow-purple-500/25"
              >
                <Wallet className="w-4 h-4" />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;