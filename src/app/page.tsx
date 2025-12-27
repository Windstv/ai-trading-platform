'use client';

import React, { useState, useEffect } from 'react';
import QuantumSignalAggregator from '@/lib/quantumSignalAggregator';

// Color mapping for signal directions
const SIGNAL_COLORS = {
  BUY: 'text-green-600',
  SELL: 'text-red-600', 
  HOLD: 'text-yellow-600'
};

// Confidence level descriptions
const CONFIDENCE_LEVELS = {
  LOW: 'Low Confidence',
  MEDIUM: 'Medium Confidence', 
  HIGH: 'High Confidence'
};

export default function TradingSignalDashboard() {
  const [asset, setAsset] = useState('');
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(false);

  const aggregator = new QuantumSignalAggregator();

  const fetchSignal = async () => {
    if (!asset) return;
    
    setLoading(true);
    try {
      const result = await aggregator.aggregateSignals(asset);
      setSignal(result);
    } catch (error) {
      console.error('Signal fetch error', error);
    } finally {
      setLoading(false);
    }
  };

  const renderConfidenceIndicator = (confidence) => {
    const getConfidenceLevel = () => {
      if (confidence < 0.3) return 'LOW';
      if (confidence < 0.7) return 'MEDIUM';
      return 'HIGH';
    };

    const level = getConfidenceLevel();

    return (
      <div 
        className="tooltip" 
        data-tip={CONFIDENCE_LEVELS[level]}
      >
        <div className="flex items-center">
          <span className="mr-2">Confidence:</span>
          <div className={`w-full bg-gray-200 h-2.5 rounded-full`}>
            <div 
              className={`h-2.5 rounded-full ${
                level === 'LOW' ? 'bg-red-400' : 
                level === 'MEDIUM' ? 'bg-yellow-400' : 
                'bg-green-400'
              }`} 
              style={{ width: `${confidence * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Quantum Trading Signal Analyzer
      </h1>

      <div className="flex mb-4">
        <input 
          type="text" 
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
          placeholder="Enter Asset Symbol"
          className="input input-bordered w-full max-w-xs mr-2"
        />
        <button 
          onClick={fetchSignal} 
          disabled={!asset || loading}
          className="btn btn-primary"
        >
          {loading ? 'Analyzing...' : 'Get Signal'}
        </button>
      </div>

      {signal && (
        <div className="card bg-base-100 shadow-xl p-6">
          <h2 className={`text-xl font-bold ${SIGNAL_COLORS[signal.direction]}`}>
            {signal.direction} Signal
          </h2>

          {renderConfidenceIndicator(signal.confidence)}

          <div className="mt-4">
            <h3 className="font-semibold">Signal Sources:</h3>
            <ul className="list-disc pl-5">
              {signal.sources.map((source, index) => (
                <li key={index}>{source}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Signal Strength: {(signal.strength * 100).toFixed(2)}%
          </div>
        </div>
      )}
    </div>
  );
}
`}
  ],
  "summary": "Enhanced trading signal interface with user-friendly visualization, confidence indicators, and simplified signal presentation to reduce technical complexity for average users."
}

Key UX Improvements:
1. Color-coded signal directions
2. Confidence level visualization
3. Tooltips for technical metrics
4. Simple, intuitive interface
5. Loading states
6. Clear source attribution
7. Progressive disclosure of complexity

The implementation addresses the original UX concern by:
- Simplifying technical signal presentation
- Using color-coding for immediate understanding
- Providing clear, contextual information
- Creating an intuitive user experience

Technologies:
- Next.js 14
- TypeScript
- TailwindCSS
- DaisyUI (for some utility classes)

Would you like me to elaborate on any specific aspect of the implementation?