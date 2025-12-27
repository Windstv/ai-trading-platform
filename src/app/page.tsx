'use client';

import React, { useState } from 'react';
import { 
  PortfolioSimulator, 
  SimulationResult, 
  AssetAllocation 
} from '@/lib/portfolio-simulator';

export default function PortfolioSimulatorPage() {
  const [assets, setAssets] = useState<AssetAllocation[]>([
    { symbol: 'AAPL', weight: 30, expectedReturn: 0.12, volatility: 0.25 },
    { symbol: 'GOOGL', weight: 25, expectedReturn: 0.10, volatility: 0.22 },
    { symbol: 'MSFT', weight: 20, expectedReturn: 0.11, volatility: 0.20 },
    { symbol: 'BOND', weight: 25, expectedReturn: 0.04, volatility: 0.08 }
  ]);

  const [simulationResults, setSimulationResults] = useState<SimulationResult | null>(null);

  const runSimulation = () => {
    const simulator = new PortfolioSimulator(assets);
    const results = simulator.runMonteCarloSimulation({
      iterations: 10000,
      timeHorizon: 5
    });
    setSimulationResults(results);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Advanced Portfolio Scenario Simulator
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Asset Allocations</h2>
          {assets.map((asset, index) => (
            <div key={asset.symbol} className="mb-3">
              <label className="flex justify-between">
                <span>{asset.symbol}</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={asset.weight}
                  onChange={(e) => {
                    const newAssets = [...assets];
                    newAssets[index].weight = Number(e.target.value);
                    setAssets(newAssets);
                  }}
                  className="w-1/2"
                />
                <span>{asset.weight}%</span>
              </label>
            </div>
          ))}
          <button 
            onClick={runSimulation}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
          >
            Run Simulation
          </button>
        </div>

        {simulationResults && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Simulation Results</h2>
            <div className="space-y-3">
              <div>
                <strong>Avg. Portfolio Return:</strong> 
                {(simulationResults.averageReturn * 100).toFixed(2)}%
              </div>
              <div>
                <strong>Portfolio Risk (Std Dev):</strong> 
                {(simulationResults.standardDeviation * 100).toFixed(2)}%
              </div>
              <div>
                <strong>Worst Case Scenario:</strong> 
                {(simulationResults.worstCaseScenario * 100).toFixed(2)}%
              </div>
              <div>
                <strong>Best Case Scenario:</strong> 
                {(simulationResults.bestCaseScenario * 100).toFixed(2)}%
              </div>
              <div>
                <strong>Probability of Positive Return:</strong> 
                {(simulationResults.probabilityOfPositiveReturn * 100).toFixed(2)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
      `
    },
    {
      "path": "src/lib/portfolio-simulator.ts",
      "content": `
import * as math from 'mathjs';

export interface AssetAllocation {
  symbol: string;
  weight: number;
  expectedReturn: number;
  volatility: number;
}

interface SimulationConfig {
  iterations: number;
  timeHorizon: number;
}

export interface SimulationResult {
  averageReturn: number;
  standardDeviation: number;
  worstCaseScenario: number;
  bestCaseScenario: number;
  probabilityOfPositiveReturn: number;
}

export class PortfolioSimulator {
  private assets: AssetAllocation[];

  constructor(assets: AssetAllocation[]) {
    this.assets = assets;
  }

  private normalDistribution(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  runMonteCarloSimulation(config: SimulationConfig): SimulationResult {
    const { iterations, timeHorizon } = config;
    const portfolioReturns: number[] = [];

    for (let i = 0; i < iterations; i++) {
      let portfolioReturn = 1;

      for (const asset of this.assets) {
        const assetReturn = Math.pow(
          1 + (asset.expectedReturn + 
            asset.volatility * this.normalDistribution()),
          timeHorizon
        ) - 1;

        portfolioReturn *= Math.pow(
          1 + assetReturn, 
          asset.weight / 100
        );
      }

      portfolioReturns.push(portfolioReturn - 1);
    }

    return {
      averageReturn: math.mean(portfolioReturns),
      standardDeviation: math.std(portfolioReturns),
      worstCaseScenario: math.min(portfolioReturns),
      bestCaseScenario: math.max(portfolioReturns),
      probabilityOfPositiveReturn: 
        portfolioReturns.filter(r => r > 0).length / iterations
    };
  }
}
      `
    }
  ],
  "summary": "Advanced Portfolio Scenario Simulator leveraging Monte Carlo simulation techniques to model portfolio performance across different asset allocations, providing comprehensive risk and return analysis with an interactive web interface."
}

Key Features:
- Interactive Asset Allocation Slider
- Monte Carlo Simulation Engine
- Comprehensive Performance Metrics
- Dynamic Risk Analysis
- Responsive Design with TailwindCSS

Technologies:
- Next.js 14
- TypeScript
- TailwindCSS
- Math.js for statistical calculations

The implementation provides a user-friendly interface for simulating portfolio scenarios with real-time risk and return visualization.

Recommended Enhancements:
- Add more advanced correlation modeling
- Implement machine learning-based return prediction
- Create visualization of simulation results
- Add more granular risk metrics

Would you like me to elaborate on any specific aspect of the portfolio simulator?