'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CorrelationService } from '@/services/correlation/correlation-service';

// Dynamically import heatmap to avoid SSR issues
const HeatMap = dynamic(() => import('react-heatmap-grid'), { ssr: false });

interface AssetCorrelation {
  symbol: string;
  correlations: { [key: string]: number };
}

export default function CrossAssetCorrelationMatrix() {
  const [assets, setAssets] = useState<string[]>(['BTC', 'ETH', 'AAPL', 'GOOGL', 'GOLD', 'EUR/USD']);
  const [correlationMatrix, setCorrelationMatrix] = useState<number[][]>([]);
  const [correlationService] = useState(new CorrelationService());

  const calculateCorrelations = async () => {
    try {
      const matrix = await correlationService.computeCorrelationMatrix(assets);
      setCorrelationMatrix(matrix);
    } catch (error) {
      console.error('Correlation calculation error', error);
    }
  };

  useEffect(() => {
    calculateCorrelations();
  }, [assets]);

  const renderCorrelationCell = (value: number) => {
    const absValue = Math.abs(value);
    const hue = value >= 0 ? 120 : 0; // Green for positive, Red for negative
    return (
      <div 
        style={{
          backgroundColor: `hsla(${hue}, 70%, 50%, ${absValue})`,
          color: 'white',
          padding: '5px',
          textAlign: 'center'
        }}
      >
        {value.toFixed(2)}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
        Cross-Asset Correlation Matrix
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Asset Selection */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Asset Selection</h2>
          <div className="flex flex-wrap gap-2">
            {['BTC', 'ETH', 'AAPL', 'GOOGL', 'GOLD', 'EUR/USD', 'MSFT', 'AMZN'].map(asset => (
              <button
                key={asset}
                onClick={() => 
                  setAssets(prev => 
                    prev.includes(asset) 
                      ? prev.filter(a => a !== asset) 
                      : [...prev, asset]
                  )
                }
                className={`px-3 py-1 rounded ${
                  assets.includes(asset) 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {asset}
              </button>
            ))}
          </div>
        </div>

        {/* Correlation Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Correlation Insights</h2>
          <div>
            <div>
              <strong>Correlation Method:</strong> Pearson & Spearman
            </div>
            <div>
              <strong>Assets Analyzed:</strong> {assets.join(', ')}
            </div>
            <div>
              <strong>Statistical Significance:</strong> p-value {'<'} 0.05
            </div>
          </div>
        </div>
      </div>

      {/* Correlation Matrix Visualization */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <h2 className="text-2xl font-semibold mb-4">Correlation Heatmap</h2>
        {correlationMatrix.length > 0 ? (
          <div className="grid grid-flow-col auto-cols-max gap-1">
            {/* Asset Labels */}
            <div className="grid grid-rows-subgrid">
              {assets.map(asset => (
                <div key={asset} className="text-right pr-2 self-center">{asset}</div>
              ))}
            </div>

            {/* Correlation Grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(50px,1fr))]">
              {correlationMatrix.map((row, rowIndex) => 
                row.map((value, colIndex) => (
                  <div key={`${rowIndex}-${colIndex}`}>
                    {renderCorrelationCell(value)}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <p>Calculating correlations...</p>
        )}
      </div>

      {/* Export and ML Prediction Section */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Export</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Export Correlation Matrix
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Predictive Insights</h2>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Generate Correlation Forecast
          </button>
        </div>
      </div>
    </div>
  );
}