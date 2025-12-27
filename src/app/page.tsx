'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { 
  fetchMultiSourceSentiment, 
  calculateCompositeSentiment,
  detectEmotionalTrends
} from '@/lib/sentiment-analysis';
import {
  SentimentHeatmap,
  TimelineSentimentChart,
  PriceCorrelationVisualization
} from '@/components/visualizations';
import { SentimentAlertEngine } from '@/components/alerts';

interface MarketSentimentData {
  symbol: string;
  overallSentiment: number;
  emotionalIntensity: number;
  sources: {
    socialMedia: number;
    newsMedia: number;
    financialForums: number;
  };
  priceCorrelation: number;
}

export default function MarketSentimentDashboard() {
  const [marketData, setMarketData] = useState<MarketSentimentData[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');

  useEffect(() => {
    async function fetchComprehensiveSentimentData() {
      const assets = ['BTC', 'ETH', 'DOGE', 'XRP'];
      
      const sentimentResults = await Promise.all(
        assets.map(async (symbol) => {
          const rawSentiments = await fetchMultiSourceSentiment(symbol);
          const compositeSentiment = calculateCompositeSentiment(rawSentiments);
          const emotionalTrends = detectEmotionalTrends(rawSentiments);

          return {
            symbol,
            overallSentiment: compositeSentiment.score,
            emotionalIntensity: emotionalTrends.intensity,
            sources: rawSentiments,
            priceCorrelation: compositeSentiment.priceImpact
          };
        })
      );

      setMarketData(sentimentResults);
    }

    fetchComprehensiveSentimentData();
    const intervalId = setInterval(fetchComprehensiveSentimentData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="market-sentiment-dashboard">
      <h1>Advanced Market Sentiment Analysis</h1>
      
      <div className="dashboard-grid">
        <SentimentHeatmap data={marketData} />
        <TimelineSentimentChart 
          data={marketData}
          selectedAsset={selectedAsset}
        />
        <PriceCorrelationVisualization data={marketData} />
        <SentimentAlertEngine sentiments={marketData} />
      </div>
    </div>
  );
}