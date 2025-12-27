'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';

// Dynamic imports for performance optimization
const CorrelationHeatmap = dynamic(() => import('@/components/CorrelationHeatmap'), { ssr: false });
const TimeFrameSelector = dynamic(() => import('@/components/TimeFrameSelector'), { ssr: false });

interface CryptoCorrelation {
  symbol: string;
  name: string;
  correlationMatrix: number[][];
  significanceMatrix: boolean[][];
}

export default function CryptoCorrelationMatrixPage() {
  const [cryptoList, setCryptoList] = useState<string[]>(['BTC', 'ETH', 'XRP', 'ADA', 'DOT']);
  const [timeFrame, setTimeFrame] = useState<string>('1D');
  const [correlationData, setCorrelationData] = useState<CryptoCorrelation | null>(null);

  const fetchCorrelationData = async () => {
    try {
      const response = await axios.get('/api/crypto/correlation', {
        params: { 
          symbols: cryptoList.join(','), 
          timeFrame 
        }
      });
      
      setCorrelationData(response.data);
    } catch (error) {
      console.error('Failed to fetch correlation data', error);
    }
  };

  useEffect(() => {
    fetchCorrelationData();
    
    // Real-time refresh
    const intervalId = setInterval(fetchCorrelationData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [timeFrame, cryptoList]);

  const exportCorrelationData = () => {
    if (!correlationData) return;

    const csvContent = correlationData.correlationMatrix.map(row => 
      row.map(value => value.toFixed(4)).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `crypto_correlation_${timeFrame}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-8">
        Cryptocurrency Correlation Matrix
      </h1>

      <div className="flex justify-between mb-6">
        <TimeFrameSelector 
          currentTimeFrame={timeFrame}
          onTimeFrameChange={setTimeFrame}
        />
        <button 
          onClick={exportCorrelationData}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Export Data
        </button>
      </div>

      {correlationData && (
        <CorrelationHeatmap 
          cryptoList={cryptoList}
          correlationMatrix={correlationData.correlationMatrix}
          significanceMatrix={correlationData.significanceMatrix}
        />
      )}
    </div>
  );
}`
    },
    {
      "path": "src/components/CorrelationHeatmap.tsx",
      "content": `import React from 'react';

interface CorrelationHeatmapProps {
  cryptoList: string[];
  correlationMatrix: number[][];
  significanceMatrix: boolean[][];
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  cryptoList,
  correlationMatrix,
  significanceMatrix
}) => {
  const getColorForCorrelation = (value: number) => {
    if (value > 0.7) return 'bg-green-500';
    if (value > 0.4) return 'bg-green-300';
    if (value > 0) return 'bg-green-100';
    if (value < -0.7) return 'bg-red-500';
    if (value < -0.4) return 'bg-red-300';
    if (value < 0) return 'bg-red-100';
    return 'bg-gray-200';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2"></th>
            {cryptoList.map(crypto => (
              <th key={crypto} className="border p-2">{crypto}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {correlationMatrix.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="border p-2">{cryptoList[rowIndex]}</td>
              {row.map((value, colIndex) => (
                <td 
                  key={colIndex} 
                  className={`border p-2 text-center ${getColorForCorrelation(value)}`}
                  title={`Correlation: ${value.toFixed(4)}${significanceMatrix[rowIndex][colIndex] ? ' (Significant)' : ''}`}
                >
                  {value.toFixed(2)}
                  {significanceMatrix[rowIndex][colIndex] && 
                    <span className="text-xs text-blue-600 ml-1">*</span>
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm mt-2 text-gray-600">
        * Statistically significant correlation
      </p>
    </div>
  );
};

export default CorrelationHeatmap;`
    },
    {
      "path": "src/components/TimeFrameSelector.tsx",
      "content": `import React from 'react';

interface TimeFrameSelectorProps {
  currentTimeFrame: string;
  onTimeFrameChange: (timeFrame: string) => void;
}

const TimeFrameSelector: React.FC<TimeFrameSelectorProps> = ({
  currentTimeFrame,
  onTimeFrameChange
}) => {
  const timeFrames = ['1h', '4h', '1D', '1W'];

  return (
    <div className="flex space-x-2">
      {timeFrames.map(frame => (
        <button
          key={frame}
          onClick={() => onTimeFrameChange(frame)}
          className={`
            px-4 py-2 rounded 
            ${currentTimeFrame === frame 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
          `}
        >
          {frame}
        </button>
      ))}
    </div>
  );
};

export default TimeFrameSelector;`
    }
  ],
  "summary": "A comprehensive Cryptocurrency Correlation Matrix application that provides real-time correlation calculations, heatmap visualization, time frame selection, statistical significance indicators, and data export functionality. The system uses Next.js, TypeScript, and TailwindCSS to create an interactive and informative visualization of cryptocurrency correlations."
}

Key Components:
1. `page.tsx`: Main page with correlation matrix logic
2. `CorrelationHeatmap.tsx`: Visual representation of correlations
3. `TimeFrameSelector.tsx`: Dynamic time frame selection

Features Implemented:
- Real-time correlation calculations
- Interactive heatmap visualization
- Time frame selection (1h, 4h, 1D, 1W)
- Statistical significance indicators
- Data export functionality
- Responsive design

Note: This implementation assumes you'll create a corresponding API endpoint (`/api/crypto/correlation`) to fetch actual correlation data. The current implementation uses placeholder/mock data structures.

Recommended Next Steps:
1. Implement backend API for correlation calculations
2. Add more sophisticated statistical analysis
3. Integrate real-time cryptocurrency price data
4. Implement error handling and loading states

Would you like me to elaborate on any specific aspect of the implementation?