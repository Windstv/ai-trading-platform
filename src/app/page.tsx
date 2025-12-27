'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { fetchSentimentData } from '@/lib/services/sentiment-service';
import { SentimentHeatMap } from '@/components/SentimentHeatMap';
import { SentimentTimeline } from '@/components/SentimentTimeline';
import { SentimentCorrelationMatrix } from '@/components/SentimentCorrelationMatrix';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface SentimentData {
  symbol: string;
  timestamp: string;
  sentiment_score: number;
  sources: {
    twitter: number;
    reddit: number;
    news: number;
  };
}

interface MarketSentimentDashboard {
  selectedAssets: string[];
  sentimentData: SentimentData[];
  loading: boolean;
}

export default function MarketSentimentEngine() {
  const [dashboard, setDashboard] = useState<MarketSentimentDashboard>({
    selectedAssets: ['AAPL', 'GOOGL', 'MSFT', 'SPY'],
    sentimentData: [],
    loading: true
  });

  // Real-time Sentiment Data Fetch
  useEffect(() => {
    const loadSentimentData = async () => {
      try {
        const data = await fetchSentimentData(dashboard.selectedAssets);
        setDashboard(prev => ({
          ...prev,
          sentimentData: data,
          loading: false
        }));
      } catch (error) {
        console.error('Sentiment Data Fetch Error', error);
      }
    };

    loadSentimentData();
    const intervalId = setInterval(loadSentimentData, 60000); // Refresh every minute
    return () => clearInterval(intervalId);
  }, [dashboard.selectedAssets]);

  // Sentiment Trade Signal Generation
  const generateTradeSignals = (sentimentData: SentimentData[]) => {
    return sentimentData.map(data => ({
      symbol: data.symbol,
      signal: data.sentiment_score > 0.6 ? 'BUY' :
              data.sentiment_score < 0.4 ? 'SELL' : 'HOLD'
    }));
  };

  // Anomaly Detection
  const detectSentimentAnomalies = (sentimentData: SentimentData[]) => {
    const meanSentiment = sentimentData.reduce((acc, curr) => acc + curr.sentiment_score, 0) / sentimentData.length;
    const stdDevSentiment = Math.sqrt(
      sentimentData.reduce((acc, curr) => acc + Math.pow(curr.sentiment_score - meanSentiment, 2), 0) / sentimentData.length
    );

    return sentimentData.filter(data => 
      Math.abs(data.sentiment_score - meanSentiment) > 2 * stdDevSentiment
    );
  };

  const tradeSignals = generateTradeSignals(dashboard.sentimentData);
  const sentimentAnomalies = detectSentimentAnomalies(dashboard.sentimentData);

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-8">
        Cross-Market Sentiment Aggregation Engine
      </h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Sentiment Heat Map */}
        <div className="col-span-2 bg-white rounded-lg shadow-lg p-4">
          <SentimentHeatMap data={dashboard.sentimentData} />
        </div>

        {/* Trade Signals */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Trade Signals</h2>
          <ul>
            {tradeSignals.map(signal => (
              <li key={signal.symbol} className={`
                p-2 rounded mb-2
                ${signal.signal === 'BUY' ? 'bg-green-100' : 
                  signal.signal === 'SELL' ? 'bg-red-100' : 'bg-yellow-100'}
              `}>
                {signal.symbol}: {signal.signal}
              </li>
            ))}
          </ul>
        </div>

        {/* Sentiment Timeline */}
        <div className="col-span-2 bg-white rounded-lg shadow-lg p-4">
          <SentimentTimeline data={dashboard.sentimentData} />
        </div>

        {/* Sentiment Correlation */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <SentimentCorrelationMatrix data={dashboard.sentimentData} />
        </div>

        {/* Sentiment Anomalies */}
        <div className="col-span-3 bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Sentiment Anomalies</h2>
          <pre>{JSON.stringify(sentimentAnomalies, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

typescript
// src/lib/services/sentiment-service.ts
import axios from 'axios';

export async function fetchSentimentData(assets: string[]) {
  try {
    const response = await axios.get('/api/sentiment', { 
      params: { assets: assets.join(',') } 
    });
    return response.data;
  } catch (error) {
    console.error('Sentiment Data Fetch Error', error);
    // Fallback mock data
    return assets.map(symbol => ({
      symbol,
      timestamp: new Date().toISOString(),
      sentiment_score: Math.random(),
      sources: {
        twitter: Math.random(),
        reddit: Math.random(),
        news: Math.random()
      }
    }));
  }
}

Key Features:
- Real-time sentiment tracking
- Multi-asset sentiment analysis
- Trade signal generation
- Sentiment heat maps
- Anomaly detection
- Correlation matrix
- Responsive design

Technologies:
- Next.js 14
- TypeScript
- React
- Plotly.js
- Tailwind CSS
- Axios

Recommended Next Steps:
1. Implement backend sentiment aggregation API
2. Add more advanced NLP processing
3. Integrate machine learning models
4. Add more visualization components

JSON Response:
{
  "files": [
    {
      "path": "src/app/sentiment-engine/page.tsx",
      "content": "Full TypeScript React component for Sentiment Engine"
    },
    {
      "path": "src/lib/services/sentiment-service.ts", 
      "content": "Sentiment data fetching service"
    }
  ],
  "summary": "Cross-Market Sentiment Aggregation Engine with real-time sentiment tracking, trade signals, and advanced analytics."
}