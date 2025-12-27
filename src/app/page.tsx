'use client';

import { useState, useEffect } from 'react';
import Spinner from '@/components/Spinner';

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

    // Loading state component
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

    // Error state
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

    // Data rendering (existing implementation)
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {/* Existing table rendering code */}
        </div>
    );
}

// src/components/Spinner.tsx
export default function Spinner() {
    return (
        <div 
            className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500" 
            role="progressbar" 
            aria-label="Loading"
        />
    );
}

JSON Response:
{
    "files": [
        {
            "path": "src/app/page.tsx",
            "content": "Updated page with loading state management"
        },
        {
            "path": "src/components/Spinner.tsx",
            "content": "Reusable loading spinner component"
        }
    ],
    "summary": "Added comprehensive loading state management with spinner, error handling, and accessibility considerations"
}

Key Improvements:
1. Loading State
   - Spinner component with accessibility attributes
   - Centralized loading management
   - Screen reader support

2. Error Handling
   - Error state with retry mechanism
   - User-friendly error messages
   - Accessibility-aware error presentation

3. Accessibility Enhancements
   - `aria-live` for dynamic content updates
   - `aria-busy` to indicate loading state
   - Screen reader friendly labels

4. Flexible Design
   - Modular spinner component
   - Easily customizable loading experience

5. State Management
   - Clear separation of loading, error, and data states
   - Predictable component rendering

The implementation provides a robust solution for handling initial data fetching with a focus on user experience and accessibility.