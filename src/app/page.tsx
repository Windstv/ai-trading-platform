'use client';

import { useState, useEffect } from 'react';
import Spinner from '@/components/Spinner';
import Tooltip from '@/components/Tooltip';

// Market Regime Explanations
const REGIME_EXPLANATIONS = {
    'Bull Market': 'A sustained period of rising prices, typically characterized by optimism, investor confidence, and economic growth.',
    'Bear Market': 'A period of declining prices, often accompanied by pessimism, economic downturn, and reduced investor confidence.',
    'Sideways Market': 'A market that lacks a clear upward or downward trend, with prices moving within a relatively stable range.',
    'High Volatility': 'A market with significant and rapid price fluctuations, indicating uncertainty and potential risk.',
    'Low Volatility': 'A market with minimal price movements, suggesting stability and predictability.'
};

export default function MarketRegimeClassifier() {
    const [marketRegimes, setMarketRegimes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchMarketRegimes() {
            try {
                setIsLoading(true);
                const response = await fetch('/api/market-regimes');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch market regimes');
                }
                
                const data = await response.json();
                setMarketRegimes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMarketRegimes();
    }, []);

    // Loading state component (previous implementation)
    if (isLoading) {
        return (
            <div 
                className="flex justify-center items-center min-h-screen" 
                aria-live="polite" 
                aria-busy="true"
            >
                <Spinner />
                <span className="sr-only">Loading market regime data...</span>
            </div>
        );
    }

    // Error state (previous implementation)
    if (error) {
        return (
            <div 
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" 
                role="alert"
            >
                <p>Error: {error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Market Regimes</h2>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Regime</th>
                        <th className="border p-2">Description</th>
                    </tr>
                </thead>
                <tbody>
                    {marketRegimes.map((regime, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                            <td className="border p-2">
                                <Tooltip 
                                    text={REGIME_EXPLANATIONS[regime.type] || 'No additional information available'}
                                >
                                    <span className="cursor-help underline decoration-dotted">
                                        {regime.type}
                                    </span>
                                </Tooltip>
                            </td>
                            <td className="border p-2">{regime.description}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// Tooltip Component
function Tooltip({ 
    children, 
    text 
}: { 
    children: React.ReactNode, 
    text: string 
}) {
    return (
        <div className="relative group">
            {children}
            <div 
                className="
                    absolute z-10 p-2 bg-black text-white text-sm 
                    rounded opacity-0 group-hover:opacity-100 
                    transition-opacity duration-300 
                    bottom-full left-1/2 transform -translate-x-1/2 
                    pointer-events-none"
            >
                {text}
            </div>
        </div>
    );
}

I've made the following key additions:

1. `REGIME_EXPLANATIONS`: A dictionary with detailed explanations for different market regimes
2. Tooltip component to provide hover-based explanations
3. Added tooltips to market regime types with help text
4. Cursor styling to indicate interactive elements

JSON Response:
{
    "files": [
        {
            "path": "src/app/page.tsx",
            "content": "Updated market regime classifier with tooltips and explanations"
        }
    ],
    "summary": "Added comprehensive tooltips and help text for market regime types, improving user understanding with hover-based explanations"
}

Key UX Improvements:
- Clear, concise explanations of market regimes
- Interactive tooltip mechanism
- Accessibility-friendly hover states
- Visual indication of additional information