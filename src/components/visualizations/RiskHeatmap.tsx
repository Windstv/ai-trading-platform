import React from 'react'

interface RiskHeatmapProps {
  data: any
}

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ data }) => {
  const getRiskColor = (risk: number) => {
    if (risk < 0.2) return 'bg-green-300'
    if (risk < 0.5) return 'bg-yellow-300'
    return 'bg-red-300'
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">3D Risk Heatmap</h2>
      <div className="grid grid-cols-5 gap-2">
        {[...Array(25)].map((_, index) => (
          <div 
            key={index} 
            className={`h-10 w-full ${getRiskColor(Math.random())}`}
          />
        ))}
      </div>
    </div>
  )
}

export default RiskHeatmap