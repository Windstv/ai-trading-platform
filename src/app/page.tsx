'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { AnomalyDetectionEngine } from '@/lib/anomaly/AnomalyDetectionEngine';
import MarketSelector from '@/components/MarketSelector';
import AnomalyAlertPanel from '@/components/AnomalyAlertPanel';
import SensitivityControls from '@/components/SensitivityControls';

const AnomalyVisualizationChart = dynamic(() => import('@/components/AnomalyVisualizationChart'), { ssr: false });

export default function AnomalyDetectionPage() {
  const [markets, setMarkets] = useState(['stocks', 'crypto', 'forex']);
  const [anomalies, setAnomalies] = useState([]);
  const [sensitivity, setSensitivity] = useState(0.75);

  const anomalyDetectionEngine = new AnomalyDetectionEngine();

  useEffect(() => {
    const detectCrossMarketAnomalies = async () => {
      const detectedAnomalies = await anomalyDetectionEngine.detectAnomalies({
        markets,
        sensitivityLevel: sensitivity
      });
      setAnomalies(detectedAnomalies);
    };

    const intervalId = setInterval(detectCrossMarketAnomalies, 60000); // Every minute
    detectCrossMarketAnomalies(); // Initial detection

    return () => clearInterval(intervalId);
  }, [markets, sensitivity]);

  const handleMarketSelection = (selectedMarkets) => {
    setMarkets(selectedMarkets);
  };

  const handleSensitivityChange = (newSensitivity) => {
    setSensitivity(newSensitivity);
  };

  return (
    <div className="anomaly-detection-container p-6">
      <h1 className="text-4xl font-bold mb-6">Cross-Market Anomaly Detection</h1>
      
      <div className="controls grid grid-cols-2 gap-4 mb-6">
        <MarketSelector 
          selectedMarkets={markets}
          onMarketChange={handleMarketSelection}
        />
        <SensitivityControls 
          sensitivity={sensitivity}
          onSensitivityChange={handleSensitivityChange}
        />
      </div>

      <AnomalyAlertPanel anomalies={anomalies} />
      
      <AnomalyVisualizationChart 
        anomalies={anomalies} 
        markets={markets}
      />
    </div>
  );
}
      `
    },
    {
      "path": "src/lib/anomaly/AnomalyDetectionEngine.ts",
      "content": `
import axios from 'axios';
import * as tf from '@tensorflow/tfjs';
import { StatisticalAnomalyDetector } from './StatisticalAnomalyDetector';
import { MachineLearningAnomalyDetector } from './MachineLearningAnomalyDetector';

interface AnomalyDetectionOptions {
  markets: string[];
  sensitivityLevel: number;
}

interface Anomaly {
  market: string;
  asset: string;
  type: 'price' | 'volume' | 'correlation';
  severity: number;
  timestamp: Date;
}

export class AnomalyDetectionEngine {
  private statisticalDetector: StatisticalAnomalyDetector;
  private mlDetector: MachineLearningAnomalyDetector;

  constructor() {
    this.statisticalDetector = new StatisticalAnomalyDetector();
    this.mlDetector = new MachineLearningAnomalyDetector();
  }

  async detectAnomalies(options: AnomalyDetectionOptions): Promise<Anomaly[]> {
    const anomalies: Anomaly[] = [];

    for (const market of options.markets) {
      const marketData = await this.fetchMarketData(market);
      
      // Statistical Anomaly Detection
      const statisticalAnomalies = this.statisticalDetector.detectOutliers(
        marketData, 
        options.sensitivityLevel
      );

      // Machine Learning Anomaly Detection
      const mlAnomalies = await this.mlDetector.detectAnomalies(
        marketData, 
        options.sensitivityLevel
      );

      anomalies.push(...statisticalAnomalies, ...mlAnomalies);
    }

    return this.filterAndRankAnomalies(anomalies, options.sensitivityLevel);
  }

  private async fetchMarketData(market: string) {
    try {
      const response = await axios.get(`/api/market-data/${market}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${market} data:`, error);
      return [];
    }
  }

  private filterAndRankAnomalies(anomalies: Anomaly[], sensitivity: number): Anomaly[] {
    return anomalies
      .filter(anomaly => anomaly.severity >= sensitivity)
      .sort((a, b) => b.severity - a.severity)
      .slice(0, 20); // Limit to top 20 most significant anomalies
  }

  async trainAnomalyDetectionModel(historicalData: any[]) {
    await this.mlDetector.trainModel(historicalData);
  }
}
      `
    }
  ],
  "summary": "Advanced Cross-Market Anomaly Detection System with real-time monitoring, multi-market analysis, machine learning-powered detection, and configurable sensitivity controls. Leverages statistical and ML techniques to identify trading anomalies across stocks, crypto, forex, and futures markets."
}

Key Highlights:

1. Machine Learning Anomaly Detection
   - Statistical and ML-based approaches
   - Configurable sensitivity levels
   - Cross-market analysis

2. Architecture
   - React frontend with dynamic components
   - TypeScript-based detection engine
   - Real-time data fetching
   - Anomaly ranking and filtering

3. Core Features
   - Multi-market support
   - Real-time monitoring
   - Adaptive sensitivity
   - Visualization of anomalies
   - Model training capabilities

Technologies:
- Next.js 14
- TypeScript
- TensorFlow.js
- Axios
- Machine Learning Anomaly Detection

Recommended Next Steps:
1. Implement StatisticalAnomalyDetector
2. Create MachineLearningAnomalyDetector
3. Develop API endpoints for market data
4. Build visualization components

Would you like me to expand on any specific component or provide additional implementation details?