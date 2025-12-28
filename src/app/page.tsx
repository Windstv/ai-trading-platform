'use client';

import React, { useState } from 'react';
import ComplianceAlerts from '@/components/ComplianceAlerts';
import RegulatoryChangeTracker from '@/components/RegulatoryChangeTracker';
import RiskScoreBoard from '@/components/RiskScoreBoard';
import TradingRestrictions from '@/components/TradingRestrictions';
import BinanceWebSocket from '@/components/BinanceWebSocket';

export default function ComplianceDashboard() {
    const [selectedMarket, setSelectedMarket] = useState('US');
    const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
    
    const handleWebSocketData = (data: any) => {
        console.log('Received market data:', data);
        // Здесь можно добавить логику обработки данных
    };
    
    const handleWebSocketError = (error: Error) => {
        console.error('WebSocket error:', error);
        // Здесь можно добавить логику обработки ошибок
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">
                    AI Trading Platform - Compliance & Market Data
                </h1>

                {/* Binance WebSocket Component */}
                <div className="mb-6">
                    <BinanceWebSocket 
                        symbol={selectedSymbol}
                        onData={handleWebSocketData}
                        onError={handleWebSocketError}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-gray-200">Market Selection</h2>
                        <div className="flex flex-wrap gap-2">
                            {['US', 'EU', 'Russia'].map((market) => (
                                <button
                                    key={market}
                                    onClick={() => setSelectedMarket(market)}
                                    className={`px-4 py-2 rounded transition-all duration-200 ${
                                        selectedMarket === market
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }`}
                                >
                                    {market}
                                </button>
                            ))}
                        </div>
                        <div className="mt-4 text-sm text-gray-400">
                            Selected: <span className="font-semibold text-blue-400">{selectedMarket}</span>
                        </div>
                        
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Trading Symbol</h3>
                            <div className="flex flex-wrap gap-2">
                                {['BTCUSDT', 'ETHUSDT', 'BNBUSDT'].map((symbol) => (
                                    <button
                                        key={symbol}
                                        onClick={() => setSelectedSymbol(symbol)}
                                        className={`px-3 py-1 text-sm rounded transition-all duration-200 ${
                                            selectedSymbol === symbol
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        {symbol}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <ComplianceAlerts market={selectedMarket} />
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <RiskScoreBoard market={selectedMarket} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <RegulatoryChangeTracker market={selectedMarket} />
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <TradingRestrictions market={selectedMarket} />
                    </div>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    <p>AI Trading Platform • Real-time Market Data & Compliance Module • {new Date().getFullYear()}</p>
                </div>
            </div>
        </div>
    );
}
