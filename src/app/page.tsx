'use client';
import React from 'react';
import { PortfolioOverview } from '@/components/PortfolioOverview';
import { PerformanceAnalytics } from '@/components/PerformanceAnalytics';

export default function PortfolioPage() {
  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Investment Portfolio Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <PortfolioOverview />
        </div>
        <div className="bg-white shadow-md rounded-lg p-4">
          <PerformanceAnalytics />
        </div>
      </div>
    </div>
  );
}
            `
        },
        {
            "path": "src/components/PerformanceAnalytics.tsx", 
            "content": `
'use client';
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function PerformanceAnalytics() {
  const [performanceData, setPerformanceData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    // Simulated performance data generation
    const generatePerformanceData = () => {
      const labels = Array.from({length: 12}, (_, i) => `Month ${i + 1}`);
      const portfolioReturns = labels.map(() => Math.random() * 10 - 5);
      const benchmarkReturns = labels.map(() => Math.random() * 8 - 4);

      setPerformanceData({
        labels,
        datasets: [
          {
            label: 'Portfolio Returns',
            data: portfolioReturns,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          },
          {
            label: 'Benchmark Index',
            data: benchmarkReturns,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1
          }
        ]
      });
    };

    generatePerformanceData();
  }, []);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Portfolio Performance vs Benchmark'
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Performance Analytics</h2>
      <div className="performance-metrics grid grid-cols-2 gap-4 mb-4">
        <div>
          <span className="text-sm text-gray-600">Total Return</span>
          <p className="font-bold text-green-600">+12.5%</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Sharpe Ratio</span>
          <p className="font-bold">1.25</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Max Drawdown</span>
          <p className="font-bold text-red-600">-3.2%</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Win/Loss Ratio</span>
          <p className="font-bold">2.1</p>
        </div>
      </div>
      <div className="chart-container h-64">
        <Line data={performanceData} options={chartOptions} />
      </div>
    </div>
  );
}
            `
        }
    ],
    "summary": "Performance Analytics Dashboard with Interactive Chart Visualization and Key Performance Metrics"
}