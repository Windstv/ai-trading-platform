import React from 'react';
import { RiskFactor } from '@/types/risk';

interface RiskHeatMapProps {
  risks: RiskFactor[];
}

const RiskHeatMap: React.FC<RiskHeatMapProps> = ({ risks }) => {
  const getRiskColor = (score: number) => {
    if (score < 0.3) return 'bg-green-200';
    if (score < 0.7) return 'bg-yellow-200';
    return 'bg-red-200';
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-bold mb-4">Risk Heat Map</h3>
      {risks.map((risk, index) => (
        <div 
          key={index} 
          className={`mb-2 p-3 rounded ${getRiskColor(risk.score)}`}
        >
          <div className="flex justify-between">
            <span>{risk.name}</span>
            <span>{(risk.score * 100).toFixed(2)}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RiskHeatMap;