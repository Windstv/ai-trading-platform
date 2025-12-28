'use client';

import React, { useState, useEffect } from 'react';

interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

interface OrderBookProps {
  symbol: string;
  exchange: string;
  isConnected: boolean;
}

export default function OrderBook({ symbol, exchange, isConnected }: OrderBookProps) {
  const [bids, setBids] = useState<OrderBookEntry[]>([
    { price: 49950, quantity: 2.5, total: 124875 },
    { price: 49900, quantity: 1.8, total: 89820 },
    { price: 49850, quantity: 3.2, total: 159520 },
    { price: 49800, quantity: 2.1, total: 104580 },
    { price: 49750, quantity: 1.5, total: 74625 },
  ]);
  
  const [asks, setAsks] = useState<OrderBookEntry[]>([
    { price: 50050, quantity: 1.2, total: 60060 },
    { price: 50100, quantity: 2.3, total: 115230 },
    { price: 50150, quantity: 1.8, total: 90270 },
    { price: 50200, quantity: 3.1, total: 155620 },
    { price: 50250, quantity: 2.4, total: 120600 },
  ]);
  
  const [spread, setSpread] = useState(100);
  
  // Simulate real-time updates
  useEffect(() => {
    if (!isConnected || !symbol) return;
    
    const interval = setInterval(() => {
      // Simulate order book updates
      setBids(prev => prev.map(bid => ({
        ...bid,
        quantity: Math.max(0.1, bid.quantity + (Math.random() - 0.5) * 0.2),
        total: bid.price * bid.quantity
      })).sort((a, b) => b.price - a.price));
      
      setAsks(prev => prev.map(ask => ({
        ...ask,
        quantity: Math.max(0.1, ask.quantity + (Math.random() - 0.5) * 0.2),
        total: ask.price * ask.quantity
      })).sort((a, b) => a.price - b.price));
      
      setSpread(Math.floor(50 + Math.random() * 50));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isConnected, symbol]);
  
  if (!symbol) {
    return (
      <div className="text-center py-8 text-gray-500">
        Select a symbol to view order book
      </div>
    );
  }
  
  if (!isConnected) {
    return (
      <div className="text-center py-8 text-gray-500">
        Connect to exchange to view order book
      </div>
    );
  }
  
  const maxTotal = Math.max(
    ...bids.map(b => b.total),
    ...asks.map(a => a.total)
  );
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center text-sm text-gray-400">
        <span>{symbol} Order Book</span>
        <span className="px-2 py-1 bg-gray-700 rounded">
          Spread: {spread}
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 mb-2">
        <div className="text-left">Price</div>
        <div className="text-right">Size</div>
        <div className="text-right">Total</div>
      </div>
      
      {/* Asks */}
      <div className="space-y-1">
        {asks.map((ask, index) => (
          <div 
            key={`ask-${index}`}
            className="grid grid-cols-3 gap-2 text-sm hover:bg-red-900/20 rounded px-2 py-1 cursor-pointer transition-colors"
            onClick={() => console.log('Clicked ask:', ask.price)}
          >
            <div className="text-left text-red-400 font-medium">
              {ask.price.toLocaleString()}
            </div>
            <div className="text-right text-gray-300">
              {ask.quantity.toFixed(2)}
            </div>
            <div className="text-right text-gray-300 relative">
              {ask.total.toLocaleString()}
              <div 
                className="absolute right-0 top-0 h-full bg-red-900/30"
                style={{ width: `${(ask.total / maxTotal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      {/* Market Price Separator */}
      <div className="flex items-center justify-center my-2">
        <div className="flex-1 h-px bg-gray-700" />
        <div className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-sm text-gray-300">
          {(bids[0]?.price + asks[0]?.price) / 2 || '--'}
        </div>
        <div className="flex-1 h-px bg-gray-700" />
      </div>
      
      {/* Bids */}
      <div className="space-y-1">
        {bids.map((bid, index) => (
          <div 
            key={`bid-${index}`}
            className="grid grid-cols-3 gap-2 text-sm hover:bg-green-900/20 rounded px-2 py-1 cursor-pointer transition-colors"
            onClick={() => console.log('Clicked bid:', bid.price)}
          >
            <div className="text-left text-green-400 font-medium">
              {bid.price.toLocaleString()}
            </div>
            <div className="text-right text-gray-300">
              {bid.quantity.toFixed(2)}
            </div>
            <div className="text-right text-gray-300 relative">
              {bid.total.toLocaleString()}
              <div 
                className="absolute right-0 top-0 h-full bg-green-900/30"
                style={{ width: `${(bid.total / maxTotal) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="pt-4 border-t border-gray-700 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Exchange: {exchange || '--'}</span>
          <span>Depth: 5 levels</span>
        </div>
      </div>
    </div>
  );
}
