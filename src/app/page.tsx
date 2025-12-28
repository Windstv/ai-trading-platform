'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  AssetCorrelation, 
  MarketNetwork, 
  SystemicRiskScore, 
  GeopoliticalRiskData 
} from '@/types/systemic-risk';

// Dynamic imports for performance optimization
const CorrelationHeatmap = dynamic(() => import('@/components/systemic-risk/CorrelationHeatmap'), { ssr: false });
const MarketNetworkGraph = dynamic(() => import('@/components/systemic-risk/MarketNetworkGraph'), { ssr: false });
const RiskScoreIndicator = dynamic(() => import('@/components/systemic-risk/RiskScoreIndicator'), { ssr: false });
const GeopoliticalRiskPanel = dynamic(() => import('@/components/systemic-risk/GeopoliticalRiskPanel'), { ssr: false });

export default function SystemicRiskMonitor() {
  const [correlationData, setCorrelationData] = useState<AssetCorrelation[]>([]);
  const [marketNetwork, setMarketNetwork] = useState<MarketNetwork>({
    nodes: [],
    edges: []
  });
  const [systemicRiskScore, setSystemicRiskScore] = useState<SystemicRiskScore>({
    currentScore: 0,
    historicalTrend: []
  });
  const [geopoliticalRisks, setGeopoliticalRisks] = useState<GeopoliticalRiskData[]>([]);

  useEffect(() => {
    const fetchSystemicRiskData = async () => {
      try {
        const [
          correlationResponse,
          networkResponse,
          riskScoreResponse,
          geopoliticalResponse
        ] = await Promise.all([
          fetch('/api/systemic-risk/correlations'),
          fetch('/api/systemic-risk/market-network'),
          fetch('/api/systemic-risk/score'),
          fetch('/api/systemic-risk/geopolitical')
        ]);

        const correlationData = await correlationResponse.json();
        const networkData = await networkResponse.json();
        const riskScoreData = await riskScoreResponse.json();
        const geopoliticalData = await geopoliticalResponse.json();

        setCorrelationData(correlationData);
        setMarketNetwork(networkData);
        setSystemicRiskScore(riskScoreData);
        setGeopoliticalRisks(geopoliticalData);

        calculateCompositRiskScore(correlationData, networkData, riskScoreData);
      } catch (error) {
        console.error('Failed to fetch systemic risk data', error);
      }
    };

    fetchSystemicRiskData();
    const intervalId = setInterval(fetchSystemicRiskData, 10 * 60 * 1000); // Refresh every 10 minutes
    return () => clearInterval(intervalId);
  }, []);

  const calculateCompositRiskScore = (
    correlations: AssetCorrelation[], 
    network: MarketNetwork, 
    riskScore: SystemicRiskScore
  ) => {
    // Advanced composite risk scoring algorithm
    const correlationRisk = correlations.reduce((acc, corr) => acc + Math.abs(corr.correlation), 0);
    const networkComplexity = network.edges.length / (network.nodes.length || 1);
    const historicalVolatility = riskScore.historicalTrend.slice(-5).reduce((a, b) => a + b, 0) / 5;

    const compositScore = (
      correlationRisk * 0.4 + 
      networkComplexity * 0.3 + 
      historicalVolatility * 0.3
    );

    setSystemicRiskScore(prev => ({
      ...prev,
      compositScore: Math.min(compositScore, 100)
    }));
  };

  const generateRiskReport = () => {
    fetch('/api/systemic-risk/generate-report', { method: 'POST' })
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `systemic_risk_report_${new Date().toISOString()}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6">Cross-Asset Systemic Risk Monitor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RiskScoreIndicator 
          score={systemicRiskScore.currentScore} 
          compositScore={systemicRiskScore.compositScore}
        />
        
        <CorrelationHeatmap 
          correlations={correlationData} 
        />
        
        <GeopoliticalRiskPanel 
          risks={geopoliticalRisks} 
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <MarketNetworkGraph 
          network={marketNetwork} 
        />
        
        <div className="bg-white shadow-md rounded-lg p-4">
          <button 
            onClick={generateRiskReport}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Generate Systemic Risk Report
          </button>
        </div>
      </div>
    </div>
  );
}
`
    },
    {
      "path": "src/types/systemic-risk.ts",
      "content": `export interface AssetCorrelation {
  assets: string[];
  correlation: number;
  timestamp: Date;
}

export interface MarketNetwork {
  nodes: {
    id: string;
    type: 'equity' | 'bond' | 'commodity' | 'currency';
    risk: number;
  }[];
  edges: {
    source: string;
    target: string;
    strength: number;
  }[];
}

export interface SystemicRiskScore {
  currentScore: number;
  compositScore?: number;
  historicalTrend: number[];
  timestamp?: Date;
}

export interface GeopoliticalRiskData {
  region: string;
  tension: number;
  economicImpact: number;
  probabilityOfEscalation: number;
  timestamp: Date;
}

export interface TailRiskProbability {
  scenario: string;
  probability: number;
  potentialImpact: number;
}

export interface SystemicRiskReport {
  generatedAt: Date;
  overallRiskScore: number;
  correlationAnalysis: AssetCorrelation[];
  networkComplexity: number;
  tailRiskScenarios: TailRiskProbability[];
  geopoliticalRisks: GeopoliticalRiskData[];
}`
    }
  ],
  "summary": "A sophisticated Cross-Asset Systemic Risk Monitoring system that provides real-time analysis of market interconnectedness, risk scoring, and comprehensive risk reporting across multiple financial dimensions."
}

Key Features of the Systemic Risk Monitor:

1. Multi-Asset Correlation Analysis
   - Heatmap visualization of asset correlations
   - Real-time correlation tracking

2. Market Network Interdependency Mapping
   - Network graph showing market connections
   - Strength and risk of interconnections

3. Advanced Risk Scoring
   - Composite risk calculation
   - Historical trend analysis
   - Multiple risk dimension integration

4. Geopolitical Risk Integration
   - Region-specific tension tracking
   - Economic impact assessment

5. Automated Reporting
   - PDF report generation
   - Comprehensive risk snapshot

Technologies:
- Next.js 14
- TypeScript
- TailwindCSS
- Dynamic imports
- Responsive design

The implementation provides a holistic view of systemic risk, enabling financial analysts and risk managers to understand complex market dynamics and potential contagion risks.

Would you like me to elaborate on any specific component or aspect of the systemic risk monitoring system?