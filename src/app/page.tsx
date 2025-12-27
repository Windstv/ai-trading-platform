'use client';

import React, { useState } from 'react';
import { CorrelationMatrix } from '@/components/correlation-matrix/CorrelationMatrix';
import { NetworkGraph } from '@/components/network-graph/NetworkGraph';
import { TimeframeSelector } from '@/components/ui/TimeframeSelector';

export default function CryptoCorrelationPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1D');
  const [selectedCryptos, setSelectedCryptos] = useState<string[]>([
    'BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOT', 'LINK'
  ]);

  const cryptoList = [
    'BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'SOL', 'DOT', 'LINK', 
    'DOGE', 'AVAX', 'UNI', 'MATIC'
  ];

  const handleTimeframeChange = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };

  const handleCryptoToggle = (crypto: string) => {
    setSelectedCryptos(prev => 
      prev.includes(crypto)
        ? prev.filter(c => c !== crypto)
        : [...prev, crypto]
    );
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">
        Cryptocurrency Correlation Network
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Timeframe Selector */}
        <TimeframeSelector 
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={handleTimeframeChange}
        />

        {/* Crypto Selection */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Select Cryptocurrencies</h2>
          <div className="flex flex-wrap gap-2">
            {cryptoList.map(crypto => (
              <button
                key={crypto}
                onClick={() => handleCryptoToggle(crypto)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCryptos.includes(crypto)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {crypto}
              </button>
            ))}
          </div>
        </div>

        {/* Correlation Matrix */}
        <CorrelationMatrix 
          assetClasses={selectedCryptos}
        />

        {/* Network Graph */}
        <NetworkGraph 
          cryptocurrencies={selectedCryptos}
          timeframe={selectedTimeframe}
        />
      </div>

      {/* Insights Section */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Correlation Insights</h2>
        <p className="text-gray-600">
          Analyze the interconnectedness of cryptocurrencies and identify 
          potential market dependencies and diversification opportunities.
        </p>
      </div>
    </div>
  );
}

JSON Response:
{
  "files": [
    {
      "path": "src/app/page.tsx",
      "content": "... (TypeScript code from above)"
    }
  ],
  "summary": "Comprehensive Cryptocurrency Correlation Network dashboard with interactive crypto selection, timeframe filtering, correlation matrix, and network graph visualization."
}

Key Features of the Page:
- Interactive cryptocurrency selection
- Dynamic timeframe selection
- Correlation matrix visualization
- Network graph representation
- Responsive design
- Insights section

The implementation provides a holistic view of cryptocurrency correlations with:
- Flexible asset selection
- Multiple visualization techniques
- User-friendly interface

Recommended companion components:
1. `TimeframeSelector.tsx`
2. `NetworkGraph.tsx`

Would you like me to elaborate on the implementation or provide additional components?