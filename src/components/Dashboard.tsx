import React from 'react';
import { Shield, Zap, Lock, TrendingUp, Users, Clock } from 'lucide-react';
import { useZkVerify } from '../hooks/useZkVerify';

const Dashboard: React.FC = () => {
  const { proofCount, verificationStatus, networkStats } = useZkVerify();

  const stats = [
    {
      label: 'Total Proofs Generated',
      value: proofCount.toString(),
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      change: '+12%',
    },
    {
      label: 'Verification Success Rate',
      value: '99.8%',
      icon: Zap,
      color: 'from-cyan-500 to-cyan-600',
      change: '+0.2%',
    },
    {
      label: 'Privacy Score',
      value: '100%',
      icon: Lock,
      color: 'from-green-500 to-green-600',
      change: '0%',
    },
    {
      label: 'Active Users',
      value: networkStats.activeUsers.toString(),
      icon: Users,
      color: 'from-indigo-500 to-indigo-600',
      change: '+8%',
    },
  ];

  const recentActivity = [
    {
      type: 'Identity Verification',
      status: 'Verified',
      time: '2 minutes ago',
      proofHash: '0x1a2b3c...',
    },
    {
      type: 'Secure Transaction',
      status: 'Confirmed',
      time: '5 minutes ago',
      proofHash: '0x4d5e6f...',
    },
    {
      type: 'Data Integrity Check',
      status: 'Valid',
      time: '8 minutes ago',
      proofHash: '0x7g8h9i...',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
          Privacy-First dApp
        </h1>
        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
          Experience the future of privacy-preserving applications with zkVerify's fast, 
          trustless proof verification and Horizen's scalable infrastructure.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-400 text-sm font-medium">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Network Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* zkVerify Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" />
            zkVerify Network
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Network Status</span>
              <span className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Proof Verification Time</span>
              <span className="text-cyan-400">~2.3s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Gas Cost</span>
              <span className="text-green-400">Ultra Low</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Supported Proof Systems</span>
              <span className="text-purple-400">PLONK, Groth16, STARK</span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30"
              >
                <div>
                  <p className="text-white text-sm font-medium">{activity.type}</p>
                  <p className="text-slate-400 text-xs">{activity.time}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === 'Verified' || activity.status === 'Confirmed' || activity.status === 'Valid'
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {activity.status}
                  </span>
                  <p className="text-slate-500 text-xs font-mono mt-1">{activity.proofHash}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <Shield className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Zero-Knowledge Proofs</h3>
          <p className="text-slate-300 text-sm">
            Verify identity and transactions without revealing sensitive information using advanced ZK cryptography.
          </p>
        </div>

        <div className="bg-gradient-to-br from-cyan-900/50 to-cyan-800/50 backdrop-blur-sm rounded-xl p-6 border border-cyan-500/30">
          <Zap className="w-8 h-8 text-cyan-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Fast Verification</h3>
          <p className="text-slate-300 text-sm">
            Lightning-fast proof verification with zkVerify's optimized infrastructure and low gas costs.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
          <TrendingUp className="w-8 h-8 text-green-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Scalable Infrastructure</h3>
          <p className="text-slate-300 text-sm">
            Built on Horizen's L3 solution for unlimited scalability and seamless user experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;