import React, { useState } from 'react';
import { Send, Shield, Eye, EyeOff, Loader, CheckCircle, AlertTriangle } from 'lucide-react';
import { useZkVerify } from '../hooks/useZkVerify';

interface Transaction {
  id: string;
  recipient: string;
  amount: string;
  status: 'pending' | 'verified' | 'failed';
  proofHash: string;
  timestamp: Date;
  isPrivate: boolean;
}

const SecureTransactions: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      recipient: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      amount: '0.5',
      status: 'verified',
      proofHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      timestamp: new Date(Date.now() - 300000),
      isPrivate: true,
    },
    {
      id: '2',
      recipient: '0x8D4C0532925a3b8D4C0532925a3b8D4C05329254',
      amount: '1.2',
      status: 'verified',
      proofHash: '0x2b3c4d5e6f7890abcdef1234567890abcdef1234',
      timestamp: new Date(Date.now() - 600000),
      isPrivate: false,
    },
  ]);

  const { generateProof, verifyProof } = useZkVerify();

  const handleTransaction = async () => {
    if (!recipient || !amount) return;

    setIsProcessing(true);

    try {
      // Generate ZK proof for the transaction
      const proof = await generateProof({
        type: 'transaction',
        data: {
          recipient: isPrivate ? 'hidden' : recipient,
          amount: isPrivate ? 'hidden' : amount,
          sender: 'current_user',
        },
        privateInputs: isPrivate ? ['recipient', 'amount'] : [],
        publicInputs: isPrivate ? [] : ['recipient', 'amount'],
      });

      // Create new transaction
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        recipient,
        amount,
        status: 'pending',
        proofHash: proof.hash,
        timestamp: new Date(),
        isPrivate,
      };

      setTransactions(prev => [newTransaction, ...prev]);

      // Simulate verification process
      setTimeout(async () => {
        const isValid = await verifyProof(proof);
        setTransactions(prev =>
          prev.map(tx =>
            tx.id === newTransaction.id
              ? { ...tx, status: isValid ? 'verified' : 'failed' }
              : tx
          )
        );
      }, 3000);

      // Reset form
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return <Loader className="w-4 h-4 text-yellow-400 animate-spin" />;
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'verified':
        return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'failed':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Secure Transactions</h2>
        <p className="text-slate-300">
          Send transactions with complete privacy using zero-knowledge proofs on zkVerify.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transaction Form */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Send className="w-5 h-5 text-cyan-400" />
            New Transaction
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 font-mono text-sm"
                placeholder="0x742d35Cc6634C0532925a3b8D4C05329..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Amount (ETH)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                placeholder="0.0"
                step="0.001"
                min="0"
              />
            </div>

            {/* Privacy Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30">
              <div className="flex items-center gap-3">
                {isPrivate ? <EyeOff className="w-5 h-5 text-green-400" /> : <Eye className="w-5 h-5 text-slate-400" />}
                <div>
                  <p className="text-white font-medium">Private Transaction</p>
                  <p className="text-slate-400 text-sm">
                    {isPrivate ? 'Amount and recipient hidden' : 'Transaction details public'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPrivate(!isPrivate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                  isPrivate ? 'bg-green-500' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    isPrivate ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={handleTransaction}
              disabled={!recipient || !amount || isProcessing}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg hover:from-purple-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-purple-500/25"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Transaction
                </>
              )}
            </button>
          </div>

          {/* Transaction Info */}
          <div className="mt-6 p-4 bg-purple-900/30 rounded-lg border border-purple-500/30">
            <h4 className="text-sm font-medium text-purple-300 mb-2">How It Works</h4>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• ZK proofs hide transaction details while proving validity</li>
              <li>• Fast verification on zkVerify blockchain (~2-3 seconds)</li>
              <li>• Ultra-low gas costs compared to mainnet</li>
              <li>• Compatible with EVM testnets and Horizen L3</li>
            </ul>
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Transaction History
            </h3>

            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(tx.status)}
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {tx.isPrivate ? (
                          <span className="flex items-center gap-2">
                            <EyeOff className="w-4 h-4 text-green-400" />
                            Private Transaction
                          </span>
                        ) : (
                          `${tx.amount} ETH to ${tx.recipient.slice(0, 10)}...`
                        )}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {tx.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Proof Hash:</p>
                    <p className="text-cyan-400 text-xs font-mono">
                      {tx.proofHash.slice(0, 12)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureTransactions;