'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { SentimentAnalyzer } from '@/lib/services/SentimentAnalyzer';
import { 
  SentimentDataPoint, 
  SentimentSource, 
  SentimentTrend 
} from '@/types/sentiment';

const SentimentChart = dynamic(() => import('@/components/Sentiment/SentimentChart'), { ssr: false });
const SentimentSourceBreakdown = dynamic(() => import('@/components/Sentiment/SentimentSourceBreakdown'), { ssr: false });
const SentimentPredictionModel = dynamic(() => import('@/components/Sentiment/SentimentPredictionModel'), { ssr: false });

export default function CryptoSentimentDashboard() {
  const [sentimentData, setSentimentData] = useState<SentimentDataPoint[]>([]);
  const [sources, setSources] = useState<SentimentSource[]>([
    { name: 'Twitter', weight: 0.3 },
    { name: 'Reddit', weight: 0.25 },
    { name: 'Crypto Forums', weight: 0.2 },
    { name: 'Stock Boards', weight: 0.15 },
    { name: 'News Media', weight: 0.1 }
  ]);

  const [selectedAsset, setSelectedAsset] = useState<string>('BTC');
  const [timeFrame, setTimeFrame] = useState<'1D' | '7D' | '30D'>('7D');

  const sentimentAnalyzer = new SentimentAnalyzer();

  useEffect(() => {
    const fetchSentimentData = async () => {
      const data = await sentimentAnalyzer.analyzeSentiment({
        asset: selectedAsset,
        timeFrame: timeFrame
      });
      setSentimentData(data);
    };

    fetchSentimentData();
  }, [selectedAsset, timeFrame]);

  const handleSourceWeightUpdate = (updatedSources: SentimentSource[]) => {
    setSources(updatedSources);
  };

  return (
    <div className="sentiment-dashboard container mx-auto p-8 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
        Crypto Sentiment Intelligence
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 bg-white rounded-lg shadow-md p-4">
          <SentimentChart 
            data={sentimentData}
            asset={selectedAsset}
            timeFrame={timeFrame}
          />
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4">
          <SentimentSourceBreakdown 
            sources={sources}
            onSourceWeightUpdate={handleSourceWeightUpdate}
          />
        </div>
        
        <div className="col-span-3 bg-white rounded-lg shadow-md p-4">
          <SentimentPredictionModel 
            historicalData={sentimentData}
            asset={selectedAsset}
          />
        </div>
      </div>
    </div>
  );
}
`
    },
    {
      "path": "src/components/Sentiment/SentimentChart.tsx",
      "content": `
import React from 'react';
import { Line } from 'react-chartjs-2';
import { SentimentDataPoint } from '@/types/sentiment';

interface SentimentChartProps {
  data: SentimentDataPoint[];
  asset: string;
  timeFrame: string;
}

const SentimentChart: React.FC<SentimentChartProps> = ({ data, asset, timeFrame }) => {
  const chartData = {
    labels: data.map(point => new Date(point.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: `${asset} Sentiment`,
        data: data.map(point => point.sentimentScore),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }
    ]
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{asset} Sentiment Trend ({timeFrame})</h2>
      <Line data={chartData} />
    </div>
  );
};

export default SentimentChart;
`
    }
  ],
  "summary": "AI-Powered Cryptocurrency Sentiment Dashboard leveraging machine learning to analyze real-time sentiment across multiple sources, providing predictive insights and interactive visualizations for crypto market sentiment analysis."
}

Key enhancements in this version:
1. Enhanced UI with Tailwind CSS styling
2. More modular component structure
3. Dynamic chart rendering
4. Responsive design
5. Sentiment data visualization

Would you like me to expand on any specific component or feature?