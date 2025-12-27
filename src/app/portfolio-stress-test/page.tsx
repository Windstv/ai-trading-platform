'use client';

import React, { useState } from 'react';
import { PortfolioRiskAnalyzer } from '@/lib/portfolio-stress-testing/risk-models';
import { AssetCorrelationAnalyzer } from '@/lib/portfolio-stress-testing/correlation-analyzer';
import { PortfolioOptimizer } from '@/lib/portfolio-stress-testing/optimization-strategy';

const SAMPLE_PORTFOLIO = [
  { symbol: 'AAPL', allocation: 0.3, volatility: 0.25 },
  { symbol: 'GOOGL', allocation: 0.2, volatility: 0.22 },
  { symbol: 'BTC', allocation: 0.15, volatility: 0.45 },
  { symbol: 'BONDS', allocation: 0.35, volatility: 0.10 }
];

export default function PortfolioStressTestPage() {
  const [stressTestResults, setStressTestResults] = useState(null);

  const performStressTest = () => {
    const riskAnalyzer = new PortfolioRiskAnalyzer(SAMPLE_PORTFOLIO);
    const correlationAnalyzer = new AssetCorrelationAnalyzer(SAMPLE_PORTFOLIO.map(a => a.symbol));
    const optimizer = new PortfolioOptimizer(SAMPLE_PORTFOLIO);

    const monteCarloResults = riskAnalyzer.monteCarloSimulation();
    const systematicRisk = correlationAnalyzer.calculateSystematicRisk();
    const optimizedAllocation = optimizer.optimizeAllocation();

    setStressTestResults({
      monteCarloResults,
      systematicRisk,
      optimizedAllocation
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Portfolio Stress Testing</h1>
      
      <button 
        onClick={performStressTest} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Run Stress Test
      </button>

      {stressTestResults && (
        <div className="mt-6">
          <h2 className="text-2xl font-semibold">Stress Test Results</h2>
          <pre>{JSON.stringify(stressTestResults, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}