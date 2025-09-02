import React from 'react';
import { Wifi, Zap, Shield, TrendingUp } from 'lucide-react';

interface NetworkStatusProps {
  isConnected: boolean;
  proofCount: number;
  verificationStatus: string;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({
  isConnected,
  proofCount,
  verificationStatus,
}) => {
  const networks = [
    { name: 'zkVerify', status: 'online', latency: '12ms', color: 'green' },
    { name: 'Horizen L3', status: 'online', latency: '8ms', color: 'cyan' },
    { name: 'EDUChain', status: 'online', latency: '15ms', color: 'purple' },
    { name: 'Apechain', status: 'online', latency: '18ms', color: 'orange' },
    { name: 'Arbitrum Sepolia', status: 'online', latency: '22ms', color: 'blue' },
  ];

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border-b border-slate-700/50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
              <span className="text-sm text-slate-300">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-slate-300">{proofCount} Proofs</span>
            </div>

            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-slate-300">Fast Verification</span>
            </div>
          </div>

          {/* Network Status */}
          <div className="flex items-center gap-4 overflow-x-auto">
            {networks.map((network) => (
              <div
                key={network.name}
                className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-full border border-slate-600/50 whitespace-nowrap"
              >
                <div className={`w-1.5 h-1.5 rounded-full bg-${network.color}-400 animate-pulse`}></div>
                <span className="text-xs text-slate-300">{network.name}</span>
                <span className="text-xs text-slate-400">{network.latency}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;