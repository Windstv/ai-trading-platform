'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { RiskPredictionService } from '@/services/risk-prediction-service';
import RiskScoreChart from '@/components/risk/RiskScoreChart';
import RiskModelSelector from '@/components/risk/RiskModelSelector';
import RiskSimulationPanel from '@/components/risk/RiskSimulationPanel';

const RiskHeatMap = dynamic(() => import('@/components/risk/RiskHeatMap'), { ssr: false });

export default function RiskEnginePage() {
  const [riskData, setRiskData] = useState({
    overallRiskScore: 0,
    volatilityIndex: 0,
    anomalyScore: 0,
    predictedRisks: []
  });

  const [selectedModel, setSelectedModel] = useState('neural-network');

  const riskService = new RiskPredictionService();

  useEffect(() => {
    const fetchRiskData = async () => {
      const data = await riskService.getPredictiveRiskData(selectedModel);
      setRiskData(data);
    };

    fetchRiskData();
    const interval = setInterval(fetchRiskData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedModel]);

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RiskModelSelector 
          selectedModel={selectedModel} 
          onModelChange={setSelectedModel} 
        />
        <RiskScoreChart riskScore={riskData.overallRiskScore} />
        <RiskHeatMap risks={riskData.predictedRisks} />
      </div>
      <RiskSimulationPanel 
        volatilityIndex={riskData.volatilityIndex}
        anomalyScore={riskData.anomalyScore}
      />
    </div>
  );
}