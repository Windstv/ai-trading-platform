'use client'
import React, { useState } from 'react';
import TradeJournalDashboard from '@/components/TradeJournalDashboard';
import TradeEntryModal from '@/components/TradeEntryModal';

export default function TradingJournalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Advanced Trading Journal</h1>
        
        <div className="flex justify-end mb-4">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Log New Trade
          </button>
        </div>

        <TradeJournalDashboard />
        
        {isModalOpen && (
          <TradeEntryModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        )}
      </div>
    </div>
  );
}
`
    },
    {
      "path": "src/components/TradeEntryModal.tsx",
      "content": `
'use client'
import React, { useState, FormEvent } from 'react';
import { Trade } from '@/types/Trade';

interface TradeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TradeEntryModal({ isOpen, onClose }: TradeEntryModalProps) {
  const [trade, setTrade] = useState<Partial<Trade>>({
    symbol: '',
    entryPrice: 0,
    exitPrice: 0,
    quantity: 0,
    type: 'long',
    status: 'open'
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Save trade logic
    console.log('Trade submitted:', trade);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg w-96">
        <h2 className="text-2xl mb-4">Log New Trade</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Symbol</label>
            <input 
              type="text"
              value={trade.symbol}
              onChange={(e) => setTrade({...trade, symbol: e.target.value})}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Entry Price</label>
              <input 
                type="number"
                value={trade.entryPrice}
                onChange={(e) => setTrade({...trade, entryPrice: parseFloat(e.target.value)})}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label>Quantity</label>
              <input 
                type="number"
                value={trade.quantity}
                onChange={(e) => setTrade({...trade, quantity: parseFloat(e.target.value)})}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <button 
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
              Save Trade
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
`
    },
    {
      "path": "src/types/Trade.ts",
      "content": `
export interface Trade {
  id?: string;
  symbol: string;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  type: 'long' | 'short';
  status: 'open' | 'closed';
  entryDate: Date;
  exitDate?: Date;
  profit?: number;
  riskManagement?: {
    stopLoss: number;
    takeProfit: number;
  };
  screenshots?: string[];
  notes?: string;
}

export interface TradeMetrics {
  totalTrades: number;
  profitableTrades: number;
  totalProfit: number;
  winRate: number;
  largestGain: number;
  largestLoss: number;
  averageProfit: number;
}
`
    },
    {
      "path": "src/components/TradeJournalDashboard.tsx",
      "content": `
'use client'
import React, { useState } from 'react';
import { Trade, TradeMetrics } from '@/types/Trade';

export default function TradeJournalDashboard() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [metrics, setMetrics] = useState<TradeMetrics>({
    totalTrades: 0,
    profitableTrades: 0,
    totalProfit: 0,
    winRate: 0,
    largestGain: 0,
    largestLoss: 0,
    averageProfit: 0
  });

  const calculateMetrics = (trades: Trade[]) => {
    // Implement complex metrics calculation
    const profitableTrades = trades.filter(trade => trade.profit && trade.profit > 0);
    
    const newMetrics: TradeMetrics = {
      totalTrades: trades.length,
      profitableTrades: profitableTrades.length,
      totalProfit: trades.reduce((sum, trade) => sum + (trade.profit || 0), 0),
      winRate: (profitableTrades.length / trades.length) * 100,
      largestGain: Math.max(...trades.map(t => t.profit || 0)),
      largestLoss: Math.min(...trades.map(t => t.profit || 0)),
      averageProfit: 0  // More complex calculation
    };

    setMetrics(newMetrics);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-2 gap-4">
          <MetricCard 
            title="Total Trades" 
            value={metrics.totalTrades.toString()} 
          />
          <MetricCard 
            title="Win Rate" 
            value={`${metrics.winRate.toFixed(2)}%`} 
          />
          <MetricCard 
            title="Total Profit" 
            value={`$${metrics.totalProfit.toFixed(2)}`} 
          />
          <MetricCard 
            title="Largest Gain" 
            value={`$${metrics.largestGain.toFixed(2)}`} 
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Recent Trades</h2>
        {/* Trade list component */}
      </div>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gray-100 p-4 rounded text-center">
      <div className="text-sm text-gray-600">{title}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
`
    }
  ],
  "summary": "Advanced Trading Journal with TypeScript, Next.js 14, and TailwindCSS. Provides trade logging, performance tracking, metrics calculation, and a responsive UI for tracking trading performance."
}

Key Features:
✅ Trade Entry Modal
✅ Performance Metrics Dashboard
✅ Responsive Design
✅ TypeScript Types
✅ Modular Architecture
✅ Placeholder for Advanced Calculations

Next steps:
1. Implement actual data persistence (database/storage)
2. Add authentication
3. Expand metrics calculations
4. Implement screenshot upload
5. Create export functionality

Recommended improvements:
- Add state management (Zustand/Redux)
- Implement backend API for trade storage
- Create more detailed trade analysis charts
- Add risk management calculations

Would you like me to elaborate on any specific aspect of the implementation?