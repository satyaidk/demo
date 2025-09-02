import React, { useState, useEffect } from 'react';
import { Eye, Layers, Zap, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface ProofStep {
  id: number;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  duration?: number;
}

interface ProofData {
  id: string;
  type: 'identity' | 'transaction' | 'data_integrity';
  status: 'generating' | 'verifying' | 'verified' | 'failed';
  progress: number;
  steps: ProofStep[];
  proofSize: number;
  verificationTime: number;
}

const ProofVisualization: React.FC = () => {
  const [activeProof, setActiveProof] = useState<ProofData | null>(null);
  const [proofHistory, setProofHistory] = useState<ProofData[]>([]);

  const proofTypes = [
    { id: 'identity', name: 'Identity Verification', color: 'purple' },
    { id: 'transaction', name: 'Private Transaction', color: 'cyan' },
    { id: 'data_integrity', name: 'Data Integrity', color: 'green' },
  ];

  const generateMockProof = (type: 'identity' | 'transaction' | 'data_integrity') => {
    const steps: ProofStep[] = [
      { id: 1, name: 'Input Validation', description: 'Validating input parameters', status: 'pending' },
      { id: 2, name: 'Circuit Compilation', description: 'Compiling ZK circuit', status: 'pending' },
      { id: 3, name: 'Witness Generation', description: 'Generating cryptographic witness', status: 'pending' },
      { id: 4, name: 'Proof Generation', description: 'Creating zero-knowledge proof', status: 'pending' },
      { id: 5, name: 'Proof Verification', description: 'Verifying proof on zkVerify', status: 'pending' },
    ];

    const newProof: ProofData = {
      id: Date.now().toString(),
      type,
      status: 'generating',
      progress: 0,
      steps,
      proofSize: Math.floor(Math.random() * 1000) + 500, // KB
      verificationTime: 0,
    };

    setActiveProof(newProof);
    simulateProofGeneration(newProof);
  };

  const simulateProofGeneration = async (proof: ProofData) => {
    const updatedProof = { ...proof };
    
    for (let i = 0; i < updatedProof.steps.length; i++) {
      // Update step status
      updatedProof.steps[i].status = 'processing';
      updatedProof.progress = ((i + 0.5) / updatedProof.steps.length) * 100;
      setActiveProof({ ...updatedProof });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Complete step
      updatedProof.steps[i].status = 'completed';
      updatedProof.steps[i].duration = Math.floor(Math.random() * 3000) + 500;
      updatedProof.progress = ((i + 1) / updatedProof.steps.length) * 100;
      setActiveProof({ ...updatedProof });
    }

    // Finalize proof
    updatedProof.status = 'verified';
    updatedProof.verificationTime = updatedProof.steps.reduce((total, step) => total + (step.duration || 0), 0);
    setActiveProof({ ...updatedProof });

    // Add to history after a delay
    setTimeout(() => {
      setProofHistory(prev => [updatedProof, ...prev.slice(0, 9)]);
      setActiveProof(null);
    }, 2000);
  };

  const getStepIcon = (status: ProofStep['status']) => {
    switch (status) {
      case 'pending':
        return <div className="w-4 h-4 rounded-full border-2 border-slate-500"></div>;
      case 'processing':
        return <Loader className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'identity':
        return 'from-purple-500 to-purple-600';
      case 'transaction':
        return 'from-cyan-500 to-cyan-600';
      case 'data_integrity':
        return 'from-green-500 to-green-600';
      default:
        return 'from-slate-500 to-slate-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Proof Visualization</h2>
        <p className="text-slate-300">
          Watch zero-knowledge proofs being generated and verified in real-time.
        </p>
      </div>

      {/* Proof Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {proofTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => generateMockProof(type.id as any)}
            disabled={activeProof !== null}
            className={`p-6 bg-gradient-to-r ${getTypeColor(type.id)} rounded-xl text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <h3 className="font-semibold mb-2">{type.name}</h3>
            <p className="text-sm opacity-90">Generate {type.name.toLowerCase()} proof</p>
          </button>
        ))}
      </div>

      {/* Active Proof Generation */}
      {activeProof && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              Generating {proofTypes.find(p => p.id === activeProof.type)?.name} Proof
            </h3>
            <span className="text-cyan-400 font-mono text-sm">
              {Math.round(activeProof.progress)}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${activeProof.progress}%` }}
              ></div>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-4">
            {activeProof.steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                  step.status === 'completed'
                    ? 'bg-green-900/20 border-green-500/30'
                    : step.status === 'processing'
                    ? 'bg-yellow-900/20 border-yellow-500/30'
                    : 'bg-slate-700/30 border-slate-600/30'
                }`}
              >
                <div className="flex-shrink-0">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-grow">
                  <p className="text-white font-medium text-sm">{step.name}</p>
                  <p className="text-slate-400 text-xs">{step.description}</p>
                </div>
                {step.duration && (
                  <div className="text-right">
                    <p className="text-cyan-400 text-xs">{step.duration}ms</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Proof Details */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <p className="text-slate-400 text-xs">Proof Size</p>
              <p className="text-white font-mono text-sm">{activeProof.proofSize} KB</p>
            </div>
            <div className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <p className="text-slate-400 text-xs">Verification Time</p>
              <p className="text-white font-mono text-sm">
                {activeProof.verificationTime > 0 ? `${activeProof.verificationTime}ms` : 'Calculating...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Proof History */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Proof History
        </h3>

        {proofHistory.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No proofs generated yet. Create your first proof above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {proofHistory.map((proof) => (
              <div
                key={proof.id}
                className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getTypeColor(proof.type)} text-white`}>
                    {proofTypes.find(p => p.id === proof.type)?.name}
                  </span>
                  <CheckCircle className="w-4 h-4 text-green-400" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">Size:</span>
                    <span className="text-white text-xs">{proof.proofSize} KB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">Time:</span>
                    <span className="text-white text-xs">{proof.verificationTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 text-xs">Steps:</span>
                    <span className="text-white text-xs">{proof.steps.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProofVisualization;