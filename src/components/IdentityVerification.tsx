import React, { useState } from 'react';
import { User, Shield, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useZkVerify } from '../hooks/useZkVerify';

interface IdentityData {
  name: string;
  age: string;
  country: string;
  document: string;
}

const IdentityVerification: React.FC = () => {
  const [identityData, setIdentityData] = useState<IdentityData>({
    name: '',
    age: '',
    country: '',
    document: '',
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'error' | null>(null);
  const [proofHash, setProofHash] = useState<string>('');

  const { generateProof, verifyProof } = useZkVerify();

  const handleInputChange = (field: keyof IdentityData, value: string) => {
    setIdentityData(prev => ({ ...prev, [field]: value }));
  };

  const handleVerification = async () => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Simulate ZK proof generation for identity verification
      const proof = await generateProof({
        type: 'identity',
        data: identityData,
        privateInputs: ['name', 'age', 'document'],
        publicInputs: ['country'],
      });

      // Verify the proof
      const isValid = await verifyProof(proof);
      
      if (isValid) {
        setVerificationResult('success');
        setProofHash(proof.hash);
      } else {
        setVerificationResult('error');
      }
    } catch (error) {
      setVerificationResult('error');
    } finally {
      setIsVerifying(false);
    }
  };

  const isFormValid = Object.values(identityData).every(value => value.trim() !== '');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Identity Verification</h2>
        <p className="text-slate-300">
          Verify your identity using zero-knowledge proofs. Your sensitive information remains private.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-purple-400" />
            Personal Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name (Private)
              </label>
              <input
                type="text"
                value={identityData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Age (Private)
              </label>
              <input
                type="number"
                value={identityData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your age"
                min="18"
                max="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Country (Public)
              </label>
              <select
                value={identityData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select your country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="UK">United Kingdom</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="JP">Japan</option>
                <option value="AU">Australia</option>
                <option value="SG">Singapore</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Document ID (Private)
              </label>
              <input
                type="text"
                value={identityData.document}
                onChange={(e) => handleInputChange('document', e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter document ID"
              />
            </div>

            <button
              onClick={handleVerification}
              disabled={!isFormValid || isVerifying}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-purple-500/25"
            >
              {isVerifying ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Generating ZK Proof...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  Verify Identity
                </>
              )}
            </button>
          </div>
        </div>

        {/* Verification Status */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            Verification Status
          </h3>

          {verificationResult === null && !isVerifying && (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">Complete the form to start verification</p>
            </div>
          )}

          {isVerifying && (
            <div className="text-center py-12">
              <Loader className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
              <p className="text-white font-medium mb-2">Generating Zero-Knowledge Proof</p>
              <p className="text-slate-400 text-sm">
                Creating cryptographic proof without revealing your data...
              </p>
            </div>
          )}

          {verificationResult === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Identity Verified!</h4>
              <p className="text-slate-300 mb-4">
                Your identity has been successfully verified using zero-knowledge proofs.
              </p>
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                <p className="text-sm text-slate-400 mb-2">Proof Hash:</p>
                <p className="text-xs font-mono text-cyan-400 break-all">{proofHash}</p>
              </div>
            </div>
          )}

          {verificationResult === 'error' && (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Verification Failed</h4>
              <p className="text-slate-300">
                Unable to verify identity. Please check your information and try again.
              </p>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="mt-6 p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
            <h4 className="text-sm font-medium text-purple-300 mb-2">Privacy Guarantee</h4>
            <p className="text-xs text-slate-400">
              Your personal information is never stored or transmitted. Only cryptographic proofs 
              are generated and verified on-chain, ensuring complete privacy.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-semibold text-white mb-6">How Zero-Knowledge Identity Verification Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-purple-400 font-bold">1</span>
            </div>
            <h4 className="text-white font-medium mb-2">Input Data</h4>
            <p className="text-slate-400 text-sm">
              Enter your personal information locally. Data never leaves your device.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-cyan-400 font-bold">2</span>
            </div>
            <h4 className="text-white font-medium mb-2">Generate Proof</h4>
            <p className="text-slate-400 text-sm">
              Create a cryptographic proof that validates your identity without revealing it.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 font-bold">3</span>
            </div>
            <h4 className="text-white font-medium mb-2">Verify On-Chain</h4>
            <p className="text-slate-400 text-sm">
              Submit proof to zkVerify for fast, trustless verification on the blockchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdentityVerification;