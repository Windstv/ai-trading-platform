'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { classifyMarketRegime } from '@/lib/market-regime-ml';
import { RefreshCw, Info } from 'lucide-react';

const LineChart = dynamic(() => import('@/components/charts/LineChart'), { ssr: false });

interface MarketRegimeData {
    timestamp: string;
    regime: 'Trending' | 'Ranging' | 'Volatile' | 'Calm';
    confidence: number;
}

export default function MarketRegimeClassifier() {
    const [marketRegimes, setMarketRegimes] = useState<MarketRegimeData[]>([]);
    const [currentRegime, setCurrentRegime] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchMarketRegimes = async () => {
        setIsRefreshing(true);
        try {
            const historicalData = await fetchHistoricalMarketData();
            const regimeClassifications = classifyMarketRegime(historicalData);
            setMarketRegimes(regimeClassifications);
            setCurrentRegime(regimeClassifications[regimeClassifications.length - 1].regime);
            setLastUpdated(new Date());
        } catch (error) {
            console.error('Market regime classification error:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMarketRegimes();
        const intervalId = setInterval(fetchMarketRegimes, 60000); // Refresh every minute
        return () => clearInterval(intervalId);
    }, []);

    const regimeColors = {
        'Trending': 'green',
        'Ranging': 'blue', 
        'Volatile': 'red',
        'Calm': 'gray'
    };

    return (
        <div className="market-regime-classifier p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Market Regime Classifier</h2>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <div className="flex items-center">
                        <Info className="w-4 h-4 mr-1" />
                        <span>Data Source: Yahoo Finance</span>
                    </div>
                    
                    <div className="flex items-center">
                        <RefreshCw 
                            className={`w-4 h-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} 
                            onClick={fetchMarketRegimes}
                        />
                        {lastUpdated ? (
                            <span>
                                Last Updated: {lastUpdated.toLocaleTimeString()}
                            </span>
                        ) : (
                            <span>Initializing...</span>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="flex items-center mb-4">
                <div 
                    className={`w-4 h-4 mr-2 rounded-full bg-${regimeColors[currentRegime] || 'gray'}`}
                />
                <span className="text-lg">
                    Current Market Regime: {currentRegime || 'Analyzing...'}
                </span>
            </div>

            <LineChart 
                data={marketRegimes.map(regime => ({
                    x: regime.timestamp,
                    y: regime.confidence,
                    label: regime.regime
                }))}
                color={regimeColors[currentRegime] || 'gray'}
            />

            <div className="regime-history mt-4">
                <h3 className="font-semibold mb-2">Recent Regime History</h3>
                <table className="w-full">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Regime</th>
                            <th>Confidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marketRegimes.slice(-5).map((regime, index) => (
                            <tr key={index}>
                                <td>{new Date(regime.timestamp).toLocaleString()}</td>
                                <td>{regime.regime}</td>
                                <td>{(regime.confidence * 100).toFixed(2)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-xs text-gray-500">
                <p>
                    Refresh Interval: 60 seconds 
                    • Automatic updates enabled 
                    • Manual refresh available
                </p>
            </div>
        </div>
    );
}

async function fetchHistoricalMarketData() {
    const response = await fetch('/api/market-data');
    return response.json();
}

Key UX Improvements:
1. Added last updated timestamp
2. Included data source information
3. Manual refresh button with spinning animation
4. Refresh interval explanation
5. Visual indicators for refresh status
6. Improved timestamp formatting

The changes address the original UX issue by:
- Clearly indicating the data source (Yahoo Finance)
- Showing the last update time
- Providing a manual refresh option
- Adding context about the refresh mechanism

This implementation uses Lucide React icons for visual indicators and provides more transparency about the data retrieval process.