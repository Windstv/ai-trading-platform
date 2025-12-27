'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';

interface MarketRegimeData {
    timestamp: string;
    regime: 'Trending' | 'Ranging' | 'Volatile' | 'Calm';
    confidence: number;
}

export default function MarketRegimeClassifier() {
    const [marketRegimes, setMarketRegimes] = useState<MarketRegimeData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            // Simulated data fetch (replace with actual data fetching logic)
            const data: MarketRegimeData[] = [
                { timestamp: '2023-06-15 10:30', regime: 'Trending', confidence: 0.85 },
                { timestamp: '2023-06-15 11:00', regime: 'Ranging', confidence: 0.65 },
                { timestamp: '2023-06-15 11:30', regime: 'Volatile', confidence: 0.75 },
                { timestamp: '2023-06-15 12:00', regime: 'Calm', confidence: 0.55 }
            ];

            if (!data || data.length === 0) {
                throw new Error('No market data available');
            }

            setMarketRegimes(data);
        } catch (error) {
            console.error('Failed to fetch market regime:', error);
            setError(error instanceof Error ? error.message : 'Unable to retrieve market data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Render loading state
    if (isLoading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <Loader2 className="animate-spin text-blue-500 mx-auto" size={48} />
                <p className="text-center mt-4 text-gray-600">Loading market data...</p>
            </div>
        );
    }

    // Render error state
    if (error) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md text-center">
                <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                    onClick={fetchData} 
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center mx-auto"
                >
                    <RefreshCw className="mr-2" size={16} />
                    Retry
                </button>
            </div>
        );
    }

    // Render complete table with all data
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Market Regime Analysis</h2>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 text-left">Timestamp</th>
                            <th className="border p-2 text-left">Regime</th>
                            <th className="border p-2 text-left">Confidence</th>
                        </tr>
                    </thead>
                    <tbody>
                        {marketRegimes.map((regime, index) => (
                            <tr 
                                key={index} 
                                className={`
                                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} 
                                    hover:bg-gray-100 transition-colors
                                `}
                            >
                                <td className="border p-2">{regime.timestamp}</td>
                                <td className="border p-2">
                                    <span 
                                        className={`
                                            px-2 py-1 rounded 
                                            ${regime.regime === 'Trending' ? 'bg-green-100 text-green-800' : 
                                              regime.regime === 'Ranging' ? 'bg-blue-100 text-blue-800' : 
                                              regime.regime === 'Volatile' ? 'bg-yellow-100 text-yellow-800' : 
                                              'bg-gray-100 text-gray-800'}
                                        `}
                                    >
                                        {regime.regime}
                                    </span>
                                </td>
                                <td className="border p-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div 
                                            className="bg-blue-600 h-2.5 rounded-full" 
                                            style={{width: `${regime.confidence * 100}%`}}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {(regime.confidence * 100).toFixed(0)}%
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

JSON Response:
{
    "files": [
        {
            "path": "src/app/market-regime-classifier.tsx",
            "content": "Complete market regime classifier with full table rendering"
        }
    ],
    "summary": "Enhanced table rendering with comprehensive display of market regime data, including timestamps, regimes, and confidence levels with visual indicators"
}

Key Improvements:
1. Complete Table Rendering
   - Full display of all market regime data
   - Responsive table design
   - Overflow handling for small screens

2. Visual Enhancements
   - Color-coded regime indicators
   - Confidence level progress bars
   - Alternating row colors
   - Hover effects

3. Data Presentation
   - Timestamp display
   - Regime classification
   - Confidence percentage
   - Visually appealing layout

4. Error and Loading States
   - Consistent error handling
   - Loading spinner
   - Retry mechanism

5. Responsive Design
   - Overflow-x-auto for small screens
   - Adaptive table layout

The implementation ensures that all market regime data is displayed completely, with clear visual cues and comprehensive information presentation.