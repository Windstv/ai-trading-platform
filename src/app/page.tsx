import React from 'react';
import FundingRatesDashboard from '@/components/FundingRatesDashboard';
import ExchangeComparison from '@/components/ExchangeComparison';
import FundingRateAlerts from '@/components/FundingRateAlerts';

export default function CryptoFundingRatesPage() {
  return (
    <div className='container mx-auto p-6 bg-gray-50 min-h-screen'>
      <h1 className='text-4xl font-bold text-center mb-8 text-blue-600'>
        Crypto Funding Rates Monitor
      </h1>
      
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <FundingRatesDashboard />
        </div>
        
        <div className='lg:col-span-1'>
          <FundingRateAlerts />
        </div>
      </div>
      
      <div className='mt-8'>
        <ExchangeComparison />
      </div>
    </div>
  );
}`
    },
    {
      "path": "src/components/FundingRatesDashboard.tsx",
      "content": `'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchFundingRates } from '@/services/crypto-funding-rates';

interface FundingRate {
  symbol: string;
  rate: number;
  timestamp: string;
  exchange: string;
}

export default function FundingRatesDashboard() {
  const [fundingRates, setFundingRates] = useState<FundingRate[]>([]);

  useEffect(() => {
    async function loadFundingRates() {
      const rates = await fetchFundingRates();
      setFundingRates(rates);
    }
    
    loadFundingRates();
    const interval = setInterval(loadFundingRates, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <h2 className='text-2xl font-semibold mb-4'>Live Funding Rates</h2>
      
      <ResponsiveContainer width='100%' height={400}>
        <LineChart data={fundingRates}>
          <XAxis dataKey='timestamp' />
          <YAxis />
          <Tooltip />
          <Legend />
          {fundingRates.map((rate, index) => (
            <Line 
              key={index}
              type='monotone' 
              dataKey='rate' 
              stroke={`hsl(${index * 60}, 70%, 50%)`}
              name={`${rate.symbol} - ${rate.exchange}`}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      <table className='w-full mt-4 text-sm'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='p-2'>Symbol</th>
            <th className='p-2'>Exchange</th>
            <th className='p-2'>Funding Rate</th>
            <th className='p-2'>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {fundingRates.map((rate, index) => (
            <tr key={index} className='border-b'>
              <td className='p-2 text-center'>{rate.symbol}</td>
              <td className='p-2 text-center'>{rate.exchange}</td>
              <td className='p-2 text-center'>
                <span className={`
                  px-2 py-1 rounded 
                  ${rate.rate > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                `}>
                  {rate.rate.toFixed(4)}%
                </span>
              </td>
              <td className='p-2 text-center'>{rate.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}`
    },
    {
      "path": "src/services/crypto-funding-rates.ts",
      "content": `import axios from 'axios';

const EXCHANGES = [
  'Binance', 'Bybit', 'OKX', 'FTX', 'Deribit'
];

const SYMBOLS = [
  'BTC-PERP', 'ETH-PERP', 'BNB-PERP', 
  'XRP-PERP', 'ADA-PERP'
];

export async function fetchFundingRates() {
  try {
    // Simulated API calls - replace with actual exchange APIs
    const fundingRates = EXCHANGES.flatMap(exchange => 
      SYMBOLS.map(symbol => ({
        symbol,
        exchange,
        rate: generateMockFundingRate(),
        timestamp: new Date().toISOString()
      }))
    );

    return fundingRates;
  } catch (error) {
    console.error('Failed to fetch funding rates:', error);
    return [];
  }
}

function generateMockFundingRate(): number {
  // Generate realistic funding rate between -1% and 1%
  return Number((Math.random() * 2 - 1).toFixed(4));
}

export function calculateArbitrageOpportunities(fundingRates) {
  const opportunityThreshold = 0.5; // 0.5% difference
  const opportunities = [];

  for (let i = 0; i < fundingRates.length; i++) {
    for (let j = i + 1; j < fundingRates.length; j++) {
      const rateDiff = Math.abs(fundingRates[i].rate - fundingRates[j].rate);
      
      if (rateDiff > opportunityThreshold) {
        opportunities.push({
          symbol1: fundingRates[i].symbol,
          exchange1: fundingRates[i].exchange,
          rate1: fundingRates[i].rate,
          symbol2: fundingRates[j].symbol,
          exchange2: fundingRates[j].exchange,
          rate2: fundingRates[j].rate,
          rateDifference: rateDiff
        });
      }
    }
  }

  return opportunities;
}`
    },
    {
      "path": "src/components/FundingRateAlerts.tsx",
      "content": `'use client';
import React, { useState, useEffect } from 'react';
import { calculateArbitrageOpportunities } from '@/services/crypto-funding-rates';

export default function FundingRateAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    async function checkArbitrageOpportunities() {
      const fundingRates = await fetchFundingRates();
      const opportunities = calculateArbitrageOpportunities(fundingRates);
      setAlerts(opportunities);
    }

    checkArbitrageOpportunities();
    const interval = setInterval(checkArbitrageOpportunities, 120000); // Check every 2 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <h2 className='text-2xl font-semibold mb-4 text-yellow-600'>
        Arbitrage Alerts
      </h2>
      {alerts.length === 0 ? (
        <p className='text-gray-500'>No current arbitrage opportunities</p>
      ) : (
        <ul className='space-y-2'>
          {alerts.map((alert, index) => (
            <li 
              key={index} 
              className='bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-500'
            >
              <div className='font-semibold'>
                {alert.symbol1} Opportunity
              </div>
              <div className='text-sm text-gray-600'>
                {alert.exchange1} vs {alert.exchange2}
              </div>
              <div className='text-xs text-yellow-700'>
                Rate Difference: {alert.rateDifference.toFixed(2)}%
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}`
    },
    {
      "path": "src/components/ExchangeComparison.tsx",
      "content": `'use client';
import React, { useState, useEffect } from 'react';
import { Bar } from 'recharts';
import { fetchFundingRates } from '@/services/crypto-funding-rates';

export default function ExchangeComparison() {
  const [exchangeData, setExchangeData] = useState([]);

  useEffect(() => {
    async function loadExchangeComparison() {
      const rates = await fetchFundingRates();
      
      const aggregatedData = rates.reduce((acc, rate) => {
        const existing = acc.find(item => item.exchange === rate.exchange);
        if (existing) {
          existing.totalRate += rate.rate;
          existing.count++;
        } else {
          acc.push({ 
            exchange: rate.exchange, 
            totalRate: rate.rate, 
            count: 1 
          });
        }
        return acc;
      }, []);

      const processedData = aggregatedData.map(item => ({
        exchange: item.exchange,
        averageRate: item.totalRate / item.count
      }));

      setExchangeData(processedData);
    }

    loadExchangeComparison();
  }, []);

  return (
    <div className='bg-white shadow-lg rounded-lg p-6'>
      <h2 className='text-2xl font-semibold mb-4'>
        Exchange Funding Rate Comparison
      </h2>
      <ResponsiveContainer width='100%' height={300}>
        <BarChart data={exchangeData}>
          <XAxis dataKey='exchange' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='averageRate' fill='#3182ce' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}`
    }
  ],
  "summary": "Comprehensive Cryptocurrency Funding Rates Dashboard with real-time tracking, arbitrage alerts, exchange comparisons, and interactive visualizations using Next.js 14, TypeScript, and advanced data visualization techniques."
}

Key Features:
1. Real-time Funding Rates Tracking
2. Interactive Visualizations
3. Arbitrage Opportunity Detection
4. Exchange Comparison
5. Responsive Design
6. Client-Side Rendering
7. Mock Data Generation

Technologies:
- Next.js 14
- TypeScript
- TailwindCSS
- Recharts (Visualization)
- Axios (API Calls)

Recommended Enhancements:
1. Implement actual exchange API integrations
2. Add more sophisticated arbitrage calculations
3. Implement user authentication for personalized alerts
4. Create more advanced risk models

Would you like me to elaborate on any specific component or feature?