'use client';

import React, { useState, useEffect } from 'react';
import { RiskPredictor } from '@/lib/risk-predictor';
import PortfolioOptimizer from '@/components/PortfolioOptimizer';
import RiskVisualization from '@/components/RiskVisualization';

export default function PortfolioPage() {
  const [portfolioData, setPortfolioData] = useState({
    assets: [
      { symbol: 'AAPL', allocation: 25, risk: 0.4 },
      { symbol: 'GOOGL', allocation: 20, risk: 0.5 },
      { symbol: 'AMZN', allocation: 15, risk: 0.6 },
      { symbol: 'BTC', allocation: 10, risk: 0.8 },
      { symbol: 'ETH', allocation: 15, risk: 0.7 },
      { symbol: 'BONDS', allocation: 15, risk: 0.2 }
    ],
    totalRisk: 0.5,
    expectedReturn: 8.5,
    sharpeRatio: 1.2
  });

  const riskPredictor = new RiskPredictor({
    assets: portfolioData.assets.map(a => a.symbol),
    timeframe: 'daily',
    riskModel: 'LSTM'
  });

  useEffect(() => {
    const optimizePortfolio = async () => {
      try {
        const analysis = await riskPredictor.analyzePortfolioRisk();
        // Update portfolio based on risk analysis
        setPortfolioData(prev => ({
          ...prev,
          totalRisk: analysis.riskScore,
          expectedReturn: analysis.expectedReturn || 8.5
        }));
      } catch (error) {
        console.error('Portfolio Optimization Error', error);
      }
    };

    optimizePortfolio();
  }, []);

  return (
    <div className="container mx-auto p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">
        AI Portfolio Optimizer
      </h1>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-7">
          <PortfolioOptimizer 
            assets={portfolioData.assets}
            onOptimize={(newAssets) => setPortfolioData(prev => ({
              ...prev,
              assets: newAssets
            }))}
          />
        </div>
        
        <div className="col-span-5">
          <RiskVisualization 
            totalRisk={portfolioData.totalRisk}
            expectedReturn={portfolioData.expectedReturn}
            sharpeRatio={portfolioData.sharpeRatio}
          />
        </div>
      </div>
    </div>
  );
}
`
    },
    {
      "path": "src/components/PortfolioOptimizer.tsx",
      "content": `
import React, { useState } from 'react';
import { 
  performModernPortfolioTheoryOptimization,
  rebalancePortfolio 
} from '@/lib/portfolio-optimization';

interface Asset {
  symbol: string;
  allocation: number;
  risk: number;
}

interface PortfolioOptimizerProps {
  assets: Asset[];
  onOptimize: (assets: Asset[]) => void;
}

const PortfolioOptimizer: React.FC<PortfolioOptimizerProps> = ({ 
  assets, 
  onOptimize 
}) => {
  const [riskTolerance, setRiskTolerance] = useState(0.5);

  const handleOptimize = () => {
    const optimizedAssets = performModernPortfolioTheoryOptimization(
      assets, 
      riskTolerance
    );
    onOptimize(optimizedAssets);
  };

  const handleRebalance = () => {
    const rebalancedAssets = rebalancePortfolio(assets);
    onOptimize(rebalancedAssets);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Portfolio Configuration</h2>
      
      <div className="mb-4">
        <label className="block mb-2">Risk Tolerance</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          value={riskTolerance}
          onChange={(e) => setRiskTolerance(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>Conservative</span>
          <span>Aggressive</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={handleOptimize}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Optimize Portfolio
        </button>
        <button 
          onClick={handleRebalance}
          className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Rebalance
        </button>
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Current Asset Allocation</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th>Symbol</th>
              <th>Allocation</th>
              <th>Risk</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset, index) => (
              <tr key={index} className="text-center">
                <td>{asset.symbol}</td>
                <td>{asset.allocation}%</td>
                <td>{(asset.risk * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PortfolioOptimizer;
`
    }
  ],
  "summary": "Advanced AI-powered portfolio optimization platform with dynamic asset allocation, risk management, and interactive portfolio configuration interface"
}

Key features in this implementation:

1. Dynamic Portfolio Optimization
2. Risk Tolerance Slider
3. Modern Portfolio Theory Integration
4. Asset Allocation Visualization
5. Rebalancing Mechanism
6. Machine Learning Risk Assessment

The solution provides a comprehensive, user-friendly approach to portfolio management with AI-driven insights and optimization strategies.

Would you like me to elaborate on any specific component or explain the underlying optimization algorithms?