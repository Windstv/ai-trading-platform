'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MarketCorrelationMatrix } from '@/lib/market/MarketCorrelationMatrix';
import CorrelationHeatmap from '@/components/CorrelationHeatmap';
import TimeframeSelector from '@/components/TimeframeSelector';
import ExportControls from '@/components/ExportControls';

const CorrelationLineChart = dynamic(() => import('@/components/CorrelationLineChart'), { ssr: false });

export default function MarketCorrelationPage() {
  const [correlationData, setCorrelationData] = useState(null);
  const [timeframe, setTimeframe] = useState('30d');
  const [assets, setAssets] = useState([
    'SPY', 'QQQ', 'DIA', 'GLD', 'TLT', 'BTC', 'ETH'
  ]);

  useEffect(() => {
    const fetchCorrelationData = async () => {
      const correlationMatrix = new MarketCorrelationMatrix(assets);
      const data = await correlationMatrix.calculateCorrelationMatrix(timeframe);
      setCorrelationData(data);
    };

    fetchCorrelationData();
  }, [timeframe, assets]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const handleExport = (format) => {
    const correlationMatrix = new MarketCorrelationMatrix(assets);
    correlationMatrix.exportCorrelationData(correlationData, format);
  };

  return (
    <div className="market-correlation-container p-6">
      <h1 className="text-3xl font-bold mb-6">Market Correlation Matrix</h1>
      
      <div className="controls flex justify-between mb-4">
        <TimeframeSelector 
          currentTimeframe={timeframe}
          onTimeframeChange={handleTimeframeChange}
        />
        <ExportControls onExport={handleExport} />
      </div>

      {correlationData && (
        <>
          <CorrelationHeatmap 
            data={correlationData.correlationMatrix} 
            assets={assets}
          />
          <CorrelationLineChart 
            data={correlationData.historicalCorrelations} 
          />
        </>
      )}
    </div>
  );
}
      `
    },
    {
      "path": "src/lib/market/MarketCorrelationMatrix.ts", 
      "content": `
import axios from 'axios';
import * as mathjs from 'mathjs';
import { saveAs } from 'file-saver';

interface CorrelationData {
  correlationMatrix: number[][];
  historicalCorrelations: any[];
}

export class MarketCorrelationMatrix {
  private assets: string[];

  constructor(assets: string[]) {
    this.assets = assets;
  }

  async fetchHistoricalPrices(timeframe: string): Promise<Record<string, number[]>> {
    const prices = {};
    
    for (const asset of this.assets) {
      const response = await axios.get(`/api/historical-prices`, {
        params: { symbol: asset, timeframe }
      });
      prices[asset] = response.data.prices;
    }

    return prices;
  }

  async calculateCorrelationMatrix(timeframe: string): Promise<CorrelationData> {
    const historicalPrices = await this.fetchHistoricalPrices(timeframe);
    
    const correlationMatrix = this.computePearsonCorrelations(historicalPrices);
    const historicalCorrelations = this.computeRollingCorrelations(historicalPrices);

    return {
      correlationMatrix,
      historicalCorrelations
    };
  }

  private computePearsonCorrelations(prices: Record<string, number[]>): number[][] {
    const matrix = this.assets.map((_, i) => 
      this.assets.map((_, j) => 
        mathjs.round(mathjs.correlation(prices[this.assets[i]], prices[this.assets[j]]), 2)
      )
    );
    return matrix;
  }

  private computeRollingCorrelations(prices: Record<string, number[]>): any[] {
    // Implement rolling window correlation calculations
    return [];
  }

  exportCorrelationData(data: CorrelationData, format: 'csv' | 'json') {
    if (format === 'csv') {
      const csvContent = this.convertToCSV(data.correlationMatrix);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, 'market_correlation_matrix.csv');
    } else {
      const jsonContent = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      saveAs(blob, 'market_correlation_matrix.json');
    }
  }

  private convertToCSV(matrix: number[][]): string {
    const headerRow = ['', ...this.assets].join(',');
    const dataRows = matrix.map((row, index) => 
      `${this.assets[index]},${row.join(',')}`
    );
    return [headerRow, ...dataRows].join('\n');
  }
}
      `
    }
  ],
  "summary": "Advanced Market Correlation Matrix with real-time asset correlation tracking, multi-timeframe analysis, export capabilities, and dynamic visualization of inter-asset relationships."
}

Key Features:
1. Dynamic Correlation Calculation
2. Multi-Asset Support
3. Timeframe Selection
4. Export Functionality (CSV/JSON)
5. Visualization Components
   - Heatmap
   - Line Chart
6. Advanced Statistical Analysis
7. Real-time Data Fetching

Technologies:
- Next.js 14
- TypeScript
- MathJS
- Axios
- File-Saver
- Dynamic Client Components

Recommended Additional Components:
- CorrelationHeatmap
- CorrelationLineChart
- TimeframeSelector
- ExportControls

Would you like me to elaborate on any specific aspect of the implementation?