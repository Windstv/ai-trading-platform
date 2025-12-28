'use client';

import React from 'react';
import { Exchange } from '@/types/trade';

interface InstrumentSelectorProps {
  exchanges: Exchange[];
  selectedExchange: string;
  onExchangeChange: (exchangeId: string) => void;
  availableSymbols: string[];
  selectedSymbol: string;
  onSymbolChange: (symbol: string) => void;
  disabled?: boolean;
}

export default function InstrumentSelector({
  exchanges,
  selectedExchange,
  onExchangeChange,
  availableSymbols,
  selectedSymbol,
  onSymbolChange,
  disabled = false
}: InstrumentSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Exchange
        </label>
        <div className="grid grid-cols-2 gap-2">
          {exchanges.map((exchange) => (
            <button
              key={exchange.id}
              onClick={() => onExchangeChange(exchange.id)}
              disabled={disabled}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                selectedExchange === exchange.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {exchange.name}
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Select Instrument
        </label>
        <div className="relative">
          <select
            value={selectedSymbol}
            onChange={(e) => onSymbolChange(e.target.value)}
            disabled={disabled || !selectedExchange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">Select symbol</option>
            {availableSymbols.map((symbol) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        {selectedExchange && availableSymbols.length === 0 && (
          <p className="mt-2 text-sm text-yellow-500">
            No symbols available for this exchange
          </p>
        )}
      </div>
      
      <div className="pt-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          <p className="mb-1">Selected:</p>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-1 bg-gray-700 rounded text-gray-300">
              {selectedExchange || 'None'}
            </span>
            <span className="text-gray-500">→</span>
            <span className="px-2 py-1 bg-gray-700 rounded text-gray-300">
              {selectedSymbol || 'None'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
