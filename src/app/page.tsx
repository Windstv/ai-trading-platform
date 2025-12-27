'use client'

import React, { useState, useEffect } from 'react';
import { RiskSimulator } from '@/services/risk-management/risk-simulator';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ComposedChart } from 'recharts';

interface RiskMetrics {
  timestamp: string;
  varMetric: number;
  cvarMetric: number;
  drawdownRisk: number;
  portfolioValue: number;
}

export default function RiskManagementDashboard() {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics[]>([]);
  const [riskParameters, setRiskParameters] = useState({
    confidenceLevel: 0.95,
    simulationIterations: 10000,
    portfolioAssets: ['AAPL', 'GOOGL', 'AMZN']
  });

  const riskSimulator = new RiskSimulator();

  const runRiskSimulation = async () => {
    try {
      const simulationResults = await riskSimulator.runMonteCarloSimulation(riskParameters);
      setRiskMetrics(simulationResults);
    } catch (error) {
      console.error('Risk simulation failed', error);
    }
  };

  useEffect(() => {
    runRiskSimulation();
  }, [JSON.stringify(riskParameters)]);

  return (
    <div className="container mx-auto p-8 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
        Advanced Risk Management Simulator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Risk Configuration</h2>
          <div className="space-y-4">
            <div>
              <label>Confidence Level</label>
              <input 
                type="number" 
                value={riskParameters.confidenceLevel}
                onChange={(e) => setRiskParameters(prev => ({
                  ...prev, 
                  confidenceLevel: parseFloat(e.target.value)
                }))}
                className="w-full border p-2"
              />
            </div>
            <div>
              <label>Simulation Iterations</label>
              <input 
                type="number" 
                value={riskParameters.simulationIterations}
                onChange={(e) => setRiskParameters(prev => ({
                  ...prev, 
                  simulationIterations: parseInt(e.target.value)
                }))}
                className="w-full border p-2"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Risk Metrics</h2>
          <div className="space-y-4">
            <div>
              <strong>Value at Risk (VaR):</strong> 
              {riskMetrics.length > 0 
                ? riskMetrics[riskMetrics.length - 1].varMetric.toFixed(2) 
                : 'N/A'}%
            </div>
            <div>
              <strong>Conditional VaR (CVaR):</strong> 
              {riskMetrics.length > 0 
                ? riskMetrics[riskMetrics.length - 1].cvarMetric.toFixed(2) 
                : 'N/A'}%
            </div>
            <div>
              <strong>Max Drawdown:</strong> 
              {riskMetrics.length > 0 
                ? riskMetrics[riskMetrics.length - 1].drawdownRisk.toFixed(2) 
                : 'N/A'}%
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Risk Budget</h2>
          <div className="space-y-4">
            {riskParameters.portfolioAssets.map(asset => (
              <div key={asset} className="flex justify-between">
                <span>{asset}</span>
                <span>25%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Risk Simulation Trends</h2>
        <ComposedChart width={800} height={400} data={riskMetrics}>
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="varMetric" stroke="#8884d8" name="VaR" />
          <Line type="monotone" dataKey="cvarMetric" stroke="#82ca9d" name="CVaR" />
          <Line type="monotone" dataKey="drawdownRisk" stroke="#ff7300" name="Drawdown" />
        </ComposedChart>
      </div>
    </div>
  );
}`
    },
    {
      "path": "src/services/risk-management/risk-simulator.ts",
      "content": `import * as mathjs from 'mathjs';

export class RiskSimulator {
  async runMonteCarloSimulation(config: any) {
    const { confidenceLevel, simulationIterations, portfolioAssets } = config;
    const simulationResults = [];

    // Simulate portfolio performance
    for (let i = 0; i < simulationIterations; i++) {
      const iteration = this.simulateSingleIteration(portfolioAssets);
      simulationResults.push(iteration);
    }

    // Calculate risk metrics
    return this.calculateRiskMetrics(simulationResults, confidenceLevel);
  }

  private simulateSingleIteration(assets: string[]) {
    const returns = assets.map(() => mathjs.random(-0.05, 0.05));
    const portfolioReturn = mathjs.mean(returns);
    const portfolioVolatility = mathjs.std(returns);

    return {
      timestamp: new Date().toISOString(),
      varMetric: this.calculateVaR(returns),
      cvarMetric: this.calculateCVaR(returns),
      drawdownRisk: this.calculateMaxDrawdown(returns),
      portfolioValue: portfolioReturn
    };
  }

  private calculateVaR(returns: number[], confidenceLevel: number = 0.95) {
    const sortedReturns = returns.sort((a, b) => a - b);
    const index = Math.floor(sortedReturns.length * (1 - confidenceLevel));
    return Math.abs(sortedReturns[index]);
  }

  private calculateCVaR(returns: number[], confidenceLevel: number = 0.95) {
    const sortedReturns = returns.sort((a, b) => a - b);
    const varIndex = Math.floor(sortedReturns.length * (1 - confidenceLevel));
    const cvarReturns = sortedReturns.slice(0, varIndex);
    return mathjs.mean(cvarReturns);
  }

  private calculateMaxDrawdown(returns: number[]) {
    let maxDrawdown = 0;
    let peak = returns[0];

    for (const ret of returns) {
      peak = Math.max(peak, ret);
      const drawdown = (peak - ret) / peak;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }

    return maxDrawdown * 100;
  }
}`
    }
  ],
  "summary": "An advanced Risk Management Simulator leveraging Monte Carlo simulation techniques to assess portfolio risk, calculate Value at Risk (VaR), Conditional Value at Risk (CVaR), and maximum drawdown predictions with interactive configuration and visualization."
}

Key Features:
1. Monte Carlo Risk Simulation
2. Dynamic Risk Parameter Configuration
3. Portfolio Risk Metrics Calculation
4. Interactive Visualization
5. Risk Budget Allocation
6. Advanced Statistical Analysis

Technologies:
- Next.js 14
- TypeScript
- Tailwind CSS
- Recharts
- Math.js for statistical computations

The implementation provides a flexible, data-driven approach to portfolio risk management with real-time simulation and comprehensive risk assessment.

Would you like me to elaborate on any specific aspect of the implementation?