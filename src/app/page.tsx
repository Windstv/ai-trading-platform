'use client'

import React, { useState, useEffect } from 'react';
import { RiskScoreGenerator } from '@/lib/risk-score-generator';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';

export default function RiskScorePage() {
  const [riskScore, setRiskScore] = useState(0);
  const [riskFactors, setRiskFactors] = useState({});
  const [historicalRiskProfile, setHistoricalRiskProfile] = useState([]);

  useEffect(() => {
    const riskGenerator = new RiskScoreGenerator();
    
    const tradeData = {
      asset: 'BTCUSD',
      strategy: 'Momentum',
      parameters: {
        leverage: 2,
        stopLoss: 0.05,
        takeProfit: 0.1
      },
      marketConditions: {
        volatility: 'high',
        trend: 'bullish'
      }
    };

    const analysis = riskGenerator.calculateRiskScore(tradeData);
    
    setRiskScore(analysis.overallRiskScore);
    setRiskFactors(analysis.riskComponents);
    setHistoricalRiskProfile(analysis.historicalProfile);
  }, []);

  const getRiskLevelColor = (score: number) => {
    if (score < 3) return 'bg-green-100 text-green-800';
    if (score < 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-gray-50 to-blue-50">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-900">
        Risk Score Generator
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Overall Risk Score */}
        <div className="col-span-1 bg-white shadow-lg rounded-lg p-6 text-center">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            Overall Risk Score
          </h2>
          <div className={`text-6xl font-bold p-4 rounded ${getRiskLevelColor(riskScore)}`}>
            {riskScore.toFixed(2)}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Risk Level: {
              riskScore < 3 ? 'Low' : 
              riskScore < 6 ? 'Medium' : 'High'
            }
          </div>
        </div>

        {/* Risk Factors Breakdown */}
        <div className="col-span-2 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            Risk Factors
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={Object.entries(riskFactors).map(([name, value]) => ({ name, value }))}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Historical Risk Profile */}
        <div className="col-span-3 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            Historical Risk Profile
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalRiskProfile}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="riskScore" stroke="#3B82F6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

Complementary Risk Score Generator Library:

typescript
// src/lib/risk-score-generator.ts
import * as mathjs from 'mathjs';

export class RiskScoreGenerator {
  calculateRiskScore(tradeData: {
    asset: string,
    strategy: string,
    parameters: {
      leverage: number,
      stopLoss: number,
      takeProfit: number
    },
    marketConditions: {
      volatility: string,
      trend: string
    }
  }) {
    // Multi-factor risk calculation
    const riskComponents = {
      volatility: this.calculateVolatilityRisk(tradeData.marketConditions.volatility),
      leverage: this.calculateLeverageRisk(tradeData.parameters.leverage),
      stopLossSensitivity: this.calculateStopLossRisk(tradeData.parameters.stopLoss),
      marketTrend: this.calculateTrendRisk(tradeData.marketConditions.trend)
    };

    // Weighted risk aggregation
    const weights = {
      volatility: 0.3,
      leverage: 0.25,
      stopLossSensitivity: 0.25,
      marketTrend: 0.2
    };

    const overallRiskScore = this.calculateWeightedRiskScore(riskComponents, weights);

    return {
      overallRiskScore,
      riskComponents,
      historicalProfile: this.generateHistoricalRiskProfile()
    };
  }

  private calculateVolatilityRisk(volatility: string): number {
    const volatilityMap = {
      'low': 1,
      'medium': 5,
      'high': 8
    };
    return volatilityMap[volatility] || 5;
  }

  private calculateLeverageRisk(leverage: number): number {
    return Math.min(leverage * 2, 10);
  }

  private calculateStopLossRisk(stopLossPercent: number): number {
    return Math.max(10 - (stopLossPercent * 100), 1);
  }

  private calculateTrendRisk(trend: string): number {
    const trendRiskMap = {
      'bearish': 8,
      'neutral': 5,
      'bullish': 3
    };
    return trendRiskMap[trend] || 5;
  }

  private calculateWeightedRiskScore(
    components: Record<string, number>, 
    weights: Record<string, number>
  ): number {
    return Object.keys(components).reduce(
      (score, key) => score + (components[key] * weights[key]), 
      0
    );
  }

  private generateHistoricalRiskProfile() {
    // Simulated historical risk data
    return Array.from({ length: 30 }, (_, i) => ({
      date: `Day ${i + 1}`,
      riskScore: mathjs.randomInt(1, 10)
    }));
  }
}

Key Features:
- Multi-factor risk calculation
- Dynamic risk scoring
- Weighted risk aggregation
- Historical risk profile generation
- Color-coded risk levels
- Responsive visualizations
- Flexible trade parameter assessment

Recommended Dependencies:
- recharts
- mathjs
- tailwindcss

This implementation provides a comprehensive, visually appealing, and analytically robust risk scoring system for trading strategies.

Would you like me to elaborate on any specific aspect of the risk score generation approach?