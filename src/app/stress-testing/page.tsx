'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Stress Testing Interfaces
interface StressScenario {
  name: string;
  marketCondition: 'crash' | 'recession' | 'volatility';
  severityLevel: number;
}

interface PortfolioStressResult {
  totalLoss: number;
  worstCaseDrawdown: number;
  liquidityRisk: number;
  correlationBreakdown: number[];
}

export default function PortfolioStressTestingModule() {
  const [scenarios, setScenarios] = useState<StressScenario[]>([
    { name: '2008 Financial Crisis', marketCondition: 'crash', severityLevel: 0.85 },
    { name: 'COVID-19 Market Shock', marketCondition: 'volatility', severityLevel: 0.75 }
  ]);

  const [stressResults, setStressResults] = useState<PortfolioStressResult[]>([]);

  const performStressTest = async () => {
    try {
      const response = await fetch('/api/stress-testing', {
        method: 'POST',
        body: JSON.stringify(scenarios)
      });

      const results = await response.json();
      setStressResults(results);
    } catch (error) {
      console.error('Stress Test Failed', error);
    }
  };

  const exportResults = () => {
    // Placeholder for export logic
    console.log('Exporting stress test results');
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Portfolio Stress Testing</h1>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg">
          <h2 className="text-xl mb-4">Stress Scenarios</h2>
          {scenarios.map((scenario, index) => (
            <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
              <p>{scenario.name}</p>
              <p>Severity: {scenario.severityLevel * 100}%</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg">
          <h2 className="text-xl mb-4">Stress Test Results</h2>
          {stressResults.map((result, index) => (
            <div key={index} className="mb-2 p-2 bg-gray-100 rounded">
              <p>Total Loss: {result.totalLoss.toFixed(2)}%</p>
              <p>Worst Case Drawdown: {result.worstCaseDrawdown.toFixed(2)}%</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <button 
          onClick={performStressTest}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Run Stress Test
        </button>
        <button 
          onClick={exportResults}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Export Results
        </button>
      </div>
    </div>
  );
}