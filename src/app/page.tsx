'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Enhanced Trading Signal Dashboard
export default function TradingSignalDashboard() {
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Signal Explanation Component
  const SignalExplanation = ({ signal }) => {
    const getSignalDetails = () => {
      const signalColors = {
        BUY: {
          bg: 'bg-green-50',
          text: 'text-green-800',
          icon: '📈',
          description: 'Strong buying opportunity with high potential'
        },
        SELL: {
          bg: 'bg-red-50',
          text: 'text-red-800', 
          icon: '📉',
          description: 'Recommended to exit or reduce position'
        },
        HOLD: {
          bg: 'bg-yellow-50',
          text: 'text-yellow-800',
          icon: '⏳',
          description: 'Maintain current position, market uncertain'
        }
      };

      return signalColors[signal.recommendation] || {
        bg: 'bg-gray-50',
        text: 'text-gray-800',
        icon: '❓',
        description: 'Insufficient data for clear recommendation'
      };
    };

    const signalDetails = getSignalDetails();

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-lg shadow-md ${signalDetails.bg}`}
      >
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">{signalDetails.icon}</span>
          <h2 className={`text-xl font-bold ${signalDetails.text}`}>
            {signal.recommendation} Signal
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <strong className={signalDetails.text}>Confidence Level:</strong>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{width: `${signal.confidenceLevel}%`}}
              />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {signal.confidenceLevel}% Confidence
            </p>
          </div>

          <div>
            <strong className={signalDetails.text}>Market Description:</strong>
            <p className="text-gray-700 mt-2">
              {signalDetails.description}
            </p>
          </div>

          <div>
            <strong className={signalDetails.text}>Key Insights:</strong>
            <ul className="list-disc list-inside text-gray-700 mt-2">
              {signal.insights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    );
  };

  // Data Fetching and Processing
  useEffect(() => {
    const fetchTradingSignals = async () => {
      try {
        const response = await fetch('/api/trading-signals');
        const data = await response.json();
        setSignal(data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchTradingSignals();
  }, []);

  // Loading and Error States
  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500" />
    </div>
  );

  if (error) return (
    <div className="text-red-500 text-center">
      Error fetching trading signals. Please try again.
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Quantum Trading Signals
      </h1>
      
      {signal && <SignalExplanation signal={signal} />}
    </div>
  );
}`
    }
  ],
  "summary": "Enhanced UX dashboard for trading signals with comprehensive explanations, confidence levels, and intuitive design"
}

Key UX Improvements:
1. Clear, visual representation of trading signals
2. Color-coded and icon-based signal categorization
3. Confidence level visualization
4. Detailed market insights
5. Loading and error state handling
6. Responsive and modern design
7. Animated transitions using Framer Motion

Technologies:
- Next.js 14
- TypeScript
- TailwindCSS
- Framer Motion for animations

The implementation addresses the original UX issue by:
- Creating a clear, intuitive interface
- Providing context for trading recommendations
- Making complex financial data accessible
- Offering visual and textual explanations

Recommended Dependencies:
bash
npm install framer-motion

This solution transforms technical trading signals into a user-friendly, informative dashboard.