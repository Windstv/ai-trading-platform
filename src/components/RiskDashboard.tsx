import React, { useState } from 'react'
import RiskHeatmap from './visualizations/RiskHeatmap'
import PortfolioRiskDecomposition from './visualizations/PortfolioRiskDecomposition'
import CorrelationNetwork from './visualizations/CorrelationNetwork'
import StressTestScenarios from './visualizations/StressTestScenarios'
import MonteCarloSimulation from './visualizations/MonteCarloSimulation'

interface RiskMetrics {
  totalRisk: number
  volatility: number
  sharpeRatio: number
  correlationMatrix: number[][]
}

export default function RiskDashboard() {
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics>({
    totalRisk: 0.45,
    volatility: 0.22,
    sharpeRatio: 1.2,
    correlationMatrix: [[1, 0.5], [0.5, 1]]
  })

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Risk Visualization Engine</h1>
      
      <div className="grid grid-cols-2 gap-6">
        <RiskHeatmap data={riskMetrics} />
        <PortfolioRiskDecomposition data={riskMetrics} />
        <CorrelationNetwork data={riskMetrics.correlationMatrix} />
        <StressTestScenarios />
        <MonteCarloSimulation />
      </div>
    </div>
  )
}