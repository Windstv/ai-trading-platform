'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Plotly } from 'plotly.js-dist';
import { fetchOptionsData } from '@/lib/services/options-data';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

interface OptionsVolatilitySurface {
  strikes: number[];
  expirations: string[];
  volatilities: number[][];
}

export default function OptionsVolatilitySurfaceDashboard() {
  const [volatilitySurface, setVolatilitySurface] = useState<OptionsVolatilitySurface>({
    strikes: [],
    expirations: [],
    volatilities: []
  });
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch Options Volatility Data
  useEffect(() => {
    const loadVolatilitySurface = async () => {
      setLoading(true);
      try {
        const data = await fetchOptionsData(selectedSymbol);
        setVolatilitySurface(data);
      } catch (error) {
        console.error('Failed to load volatility surface:', error);
      } finally {
        setLoading(false);
      }
    };

    loadVolatilitySurface();
  }, [selectedSymbol]);

  // 3D Volatility Surface Visualization
  const surfacePlotData = {
    z: volatilitySurface.volatilities,
    x: volatilitySurface.strikes,
    y: volatilitySurface.expirations,
    type: 'surface',
    colorscale: 'Viridis',
    colorbar: { title: 'Implied Volatility %' }
  };

  const surfaceLayout = {
    title: `Options Volatility Surface - ${selectedSymbol}`,
    scene: {
      xaxis: { title: 'Strike Price' },
      yaxis: { title: 'Expiration' },
      zaxis: { title: 'Implied Volatility' }
    }
  };

  // Volatility Skew/Smile Detection
  const detectVolatilitySkew = () => {
    const flattenedVols = volatilitySurface.volatilities.flat();
    const avgVol = flattenedVols.reduce((a, b) => a + b, 0) / flattenedVols.length;
    
    const skewIndicator = flattenedVols.map(vol => vol - avgVol);
    return {
      avgVolatility: avgVol,
      skewDirection: skewIndicator.some(v => v > 0) ? 'Positive' : 'Negative'
    };
  };

  // Export Volatility Data
  const exportVolatilityData = () => {
    const csvContent = [
      ['Strike', 'Expiration', 'Volatility'],
      ...volatilitySurface.strikes.flatMap((strike, i) => 
        volatilitySurface.expirations.map((exp, j) => [
          strike, 
          exp, 
          volatilitySurface.volatilities[i][j]
        ])
      )
    ].map(e => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedSymbol}_volatility_surface.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Options Volatility Surface Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-1 bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          
          <div className="mb-4">
            <label className="block mb-2">Select Symbol</label>
            <select 
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {['AAPL', 'GOOGL', 'MSFT', 'SPY'].map(symbol => (
                <option key={symbol} value={symbol}>{symbol}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={exportVolatilityData}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Export Data
          </button>
        </div>

        <div className="col-span-3 bg-white p-4 rounded shadow">
          {loading ? (
            <div className="text-center">Loading Volatility Surface...</div>
          ) : (
            <Plot
              data={[surfacePlotData]}
              layout={surfaceLayout}
              style={{ width: '100%', height: '500px' }}
            />
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Volatility Skew Analysis</h3>
          <pre>{JSON.stringify(detectVolatilitySkew(), null, 2)}</pre>
        </div>
        {/* Additional analysis components can be added here */}
      </div>
    </div>
  );
}

export default OptionsVolatilitySurfaceDashboard;

And a corresponding data service:

typescript
// src/lib/services/options-data.ts
import axios from 'axios';

export async function fetchOptionsData(symbol: string) {
  try {
    const response = await axios.get(`https://options-api.example.com/volatility-surface/${symbol}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch options data:', error);
    // Fallback mock data
    return {
      strikes: [50, 55, 60, 65, 70],
      expirations: ['2023-09', '2023-10', '2023-11', '2023-12'],
      volatilities: [
        [0.3, 0.35, 0.4, 0.45],
        [0.32, 0.37, 0.42, 0.47],
        [0.34, 0.39, 0.44, 0.49],
        [0.36, 0.41, 0.46, 0.51],
        [0.38, 0.43, 0.48, 0.53]
      ]
    };
  }
}

Key Features:
- 3D Volatility Surface Visualization
- Symbol Selection
- Volatility Skew Detection
- Data Export Functionality
- Responsive Design
- Error Handling
- Loading States

Technologies Used:
- Next.js 14
- TypeScript
- React
- Plotly.js
- Tailwind CSS
- Axios

This dashboard provides a comprehensive view of options implied volatility across different strike prices and expiration dates, with interactive and analytical features.