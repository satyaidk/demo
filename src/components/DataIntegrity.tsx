import React, { useState } from 'react';
import { FileCheck, Upload, Download, Shield, Hash, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useZkVerify } from '../hooks/useZkVerify';

interface DataFile {
  id: string;
  name: string;
  size: number;
  hash: string;
  proofHash: string;
  verified: boolean;
  timestamp: Date;
}

const DataIntegrity: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<'success' | 'error' | null>(null);
  const [dataFiles, setDataFiles] = useState<DataFile[]>([
    {
      id: '1',
      name: 'contract_agreement.pdf',
      size: 2048576,
      hash: '0xa1b2c3d4e5f6789012345678901234567890abcd',
      proofHash: '0x1234567890abcdef1234567890abcdef12345678',
      verified: true,
      timestamp: new Date(Date.now() - 3600000),
    },
    {
      id: '2',
      name: 'identity_document.jpg',
      size: 1024768,
      hash: '0xb2c3d4e5f6789012345678901234567890abcdef1',
      proofHash: '0x234567890abcdef1234567890abcdef123456789',
      verified: true,
      timestamp: new Date(Date.now() - 7200000),
    },
  ]);

  const { generateProof, verifyProof } = useZkVerify();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setVerificationResult(null);
    }
  };

  const calculateFileHash = async (file: File): Promise<string> => {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleVerifyIntegrity = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setVerificationResult(null);

    try {
      // Calculate file hash
      const fileHash = await calculateFileHash(selectedFile);

      // Generate ZK proof for data integrity
      const proof = await generateProof({
        type: 'data_integrity',
        data: {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileHash,
          timestamp: new Date().toISOString(),
        },
        privateInputs: ['fileHash'],
        publicInputs: ['fileName', 'fileSize', 'timestamp'],
      });

      // Verify the proof
      const isValid = await verifyProof(proof);

      if (isValid) {
        setVerificationResult('success');
        
        // Add to verified files list
        const newFile: DataFile = {
          id: Date.now().toString(),
          name: selectedFile.name,
          size: selectedFile.size,
          hash: fileHash,
          proofHash: proof.hash,
          verified: true,
          timestamp: new Date(),
        };

        setDataFiles(prev => [newFile, ...prev]);
      } else {
        setVerificationResult('error');
      }
    } catch (error) {
      setVerificationResult('error');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    } else {
      return `${hours} hours ago`;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Data Integrity Verification</h2>
        <p className="text-slate-300">
          Prove data authenticity and integrity using zero-knowledge proofs without revealing file contents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* File Upload & Verification */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Upload className="w-5 h-5 text-purple-400" />
            Upload & Verify
          </h3>

          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block w-full">
              <div className="border-2 border-dashed border-slate-600/50 rounded-lg p-8 text-center hover:border-purple-500/50 transition-all duration-300 cursor-pointer group">
                <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4 group-hover:text-purple-400 transition-colors duration-300" />
                <p className="text-slate-300 mb-2">
                  {selectedFile ? selectedFile.name : 'Click to upload file'}
                </p>
                <p className="text-slate-500 text-sm">
                  {selectedFile 
                    ? `${formatFileSize(selectedFile.size)} • ${selectedFile.type || 'Unknown type'}`
                    : 'Any file type supported'
                  }
                </p>
              </div>
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="*/*"
              />
            </label>
          </div>

          {/* Verification Button */}
          <button
            onClick={handleVerifyIntegrity}
            disabled={!selectedFile || isProcessing}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-purple-500/25"
          >
            {isProcessing ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating Proof...
              </>
            ) : (
              <>
                <FileCheck className="w-4 h-4" />
                Verify Integrity
              </>
            )}
          </button>

          {/* Verification Result */}
          {verificationResult && (
            <div className={`mt-6 p-4 rounded-lg border ${
              verificationResult === 'success'
                ? 'bg-green-900/30 border-green-500/30'
                : 'bg-red-900/30 border-red-500/30'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {verificationResult === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={`font-medium ${
                  verificationResult === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {verificationResult === 'success' ? 'Integrity Verified!' : 'Verification Failed'}
                </span>
              </div>
              <p className="text-slate-300 text-sm">
                {verificationResult === 'success'
                  ? 'File integrity has been cryptographically proven using zero-knowledge proofs.'
                  : 'Unable to verify file integrity. Please try again.'
                }
              </p>
            </div>
          )}

          {/* How It Works */}
          <div className="mt-6 p-4 bg-cyan-900/30 rounded-lg border border-cyan-500/30">
            <h4 className="text-sm font-medium text-cyan-300 mb-2">Privacy-Preserving Verification</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• File content never leaves your device</li>
              <li>• Only cryptographic hash is used for proof generation</li>
              <li>• ZK proof validates integrity without revealing data</li>
              <li>• Verification happens on zkVerify blockchain</li>
            </ul>
          </div>
        </div>

        {/* Verification Statistics */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Hash className="w-5 h-5 text-green-400" />
            Integrity Statistics
          </h3>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <p className="text-2xl font-bold text-green-400">{dataFiles.length}</p>
              <p className="text-slate-400 text-sm">Files Verified</p>
            </div>
            <div className="text-center p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <p className="text-2xl font-bold text-cyan-400">100%</p>
              <p className="text-slate-400 text-sm">Success Rate</p>
            </div>
          </div>

          {/* File List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {dataFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <FileCheck className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{file.name}</p>
                    <p className="text-slate-400 text-xs">
                      {formatFileSize(file.size)} • {formatTimestamp(file.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 text-xs">Verified</span>
                  </div>
                  <p className="text-slate-500 text-xs font-mono">
                    {file.proofHash.slice(0, 12)}...
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Technical Details */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
        <h3 className="text-xl font-semibold text-white mb-6">Technical Implementation</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hash className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-white font-medium mb-2">SHA-256 Hashing</h4>
            <p className="text-slate-400 text-sm">
              Generate cryptographic fingerprints of files for integrity verification.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="text-white font-medium mb-2">ZK Proof Generation</h4>
            <p className="text-slate-400 text-sm">
              Create zero-knowledge proofs that validate data without exposing content.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="text-white font-medium mb-2">On-Chain Verification</h4>
            <p className="text-slate-400 text-sm">
              Verify proofs on zkVerify blockchain for trustless data integrity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataIntegrity;