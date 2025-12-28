'use client';

import React, { useState } from 'react';
import ComplianceAlerts from '@/components/ComplianceAlerts';
import RegulatoryChangeTracker from '@/components/RegulatoryChangeTracker';
import RiskScoreBoard from '@/components/RiskScoreBoard';
import TradingRestrictions from '@/components/TradingRestrictions';
import BinanceWebSocket from '@/components/BinanceWebSocket';
import { Menu, X, BarChart3, Bell, Settings, User } from 'lucide-react';

export default function ComplianceDashboard() {
    const [selectedMarket, setSelectedMarket] = useState('US');
    const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedInstrument, setSelectedInstrument] = useState('BTCUSDT');
    
    const instruments = [
        { symbol: 'BTCUSDT', name: 'Bitcoin/USDT', exchange: 'Binance', change: '+2.5%' },
        { symbol: 'ETHUSDT', name: 'Ethereum/USDT', exchange: 'Binance', change: '+1.8%' },
        { symbol: 'BNBUSDT', name: 'BNB/USDT', exchange: 'Binance', change: '-0.5%' },
        { symbol: 'AAPL', name: 'Apple Inc', exchange: 'NASDAQ', change: '+0.8%' },
        { symbol: 'GAZP', name: 'Газпром', exchange: 'MOEX', change: '-1.2%' },
        { symbol: 'SBER', name: 'Сбербанк', exchange: 'MOEX', change: '+0.3%' },
        { symbol: 'MSFT', name: 'Microsoft', exchange: 'NASDAQ', change: '+1.5%' },
        { symbol: 'TSLA', name: 'Tesla Inc', exchange: 'NASDAQ', change: '-2.1%' },
    ];
    
    const handleWebSocketData = (data: any) => {
        console.log('Received market data:', data);
    };
    
    const handleWebSocketError = (error: Error) => {
        console.error('WebSocket error:', error);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button 
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                        
                        <div className="flex items-center space-x-2">
                            <BarChart3 className="text-blue-400" size={24} />
                            <h1 className="text-xl font-bold text-gray-100">
                                AI Trading Platform
                            </h1>
                            <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">BETA</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg">
                            <span className="text-gray-400">Selected:</span>
                            <span className="font-semibold text-blue-400">{selectedInstrument}</span>
                        </div>
                        
                        <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        
                        <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                            <Settings size={20} />
                        </button>
                        
                        <button className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
                            <User size={20} />
                        </button>
                    </div>
                </div>
            </header>
            
            <div className="flex">
                {/* Sidebar */}
                <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gray-800 border-r border-gray-700 transition-all duration-300 overflow-hidden`}>
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4 text-gray-200 flex items-center justify-between">
                            <span>Instruments</span>
                            <span className="text-xs text-gray-400">{instruments.length}</span>
                        </h2>
                        
                        <div className="space-y-1">
                            {instruments.map((instrument) => (
                                <button
                                    key={instrument.symbol}
                                    onClick={() => setSelectedInstrument(instrument.symbol)}
                                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between ${
                                        selectedInstrument === instrument.symbol
                                            ? 'bg-blue-600/20 border border-blue-500/30'
                                            : 'hover:bg-gray-700'
                                    }`}
                                >
                                    <div>
                                        <div className="font-medium text-gray-100">{instrument.symbol}</div>
                                        <div className="text-xs text-gray-400">{instrument.name}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-sm font-medium ${
                                            instrument.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                            {instrument.change}
                                        </div>
                                        <div className="text-xs text-gray-500">{instrument.exchange}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-gray-700">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Market Selection</h3>
                            <div className="flex flex-wrap gap-2">
                                {['US', 'EU', 'Russia'].map((market) => (
                                    <button
                                        key={market}
                                        onClick={() => setSelectedMarket(market)}
                                        className={`px-3 py-1 text-sm rounded transition-all duration-200 ${
                                            selectedMarket === market
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        {market}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
                
                {/* Main Content */}
                <main className="flex-1 p-4">
                    <div className="container mx-auto">
                        {/* Chart Area */}
                        <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-100">
                                        {selectedInstrument} Chart
                                    </h2>
                                    <div className="text-sm text-gray-400">
                                        Real-time price data from {instruments.find(i => i.symbol === selectedInstrument)?.exchange}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="text-sm text-gray-400">Timeframe:</div>
                                    <select className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1 text-sm">
                                        <option>1m</option>
                                        <option>5m</option>
                                        <option>15m</option>
                                        <option>1h</option>
                                        <option>4h</option>
                                        <option>1d</option>
                                    </select>
                                </div>
                            </div>
                            
                            {/* Placeholder for TradingView Chart */}
                            <div className="h-[400px] bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center">
                                <div className="text-center">
                                    <BarChart3 className="mx-auto text-gray-600 mb-2" size={48} />
                                    <div className="text-gray-500">TradingView Chart Component</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        {selectedInstrument} • {instruments.find(i => i.symbol === selectedInstrument)?.change}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Chart Controls */}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700">
                                <div className="flex space-x-2">
                                    {['Candles', 'Line', 'Heikin Ashi', 'Area'].map((type) => (
                                        <button 
                                            key={type}
                                            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex space-x-2">
                                    {['MA', 'RSI', 'MACD', 'BB'].map((indicator) => (
                                        <button 
                                            key={indicator}
                                            className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                                        >
                                            {indicator}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Binance WebSocket Component */}
                        <div className="mb-6">
                            <BinanceWebSocket 
                                symbol={selectedSymbol}
                                onData={handleWebSocketData}
                                onError={handleWebSocketError}
                            />
                        </div>

                        {/* Compliance Dashboard Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                <h2 className="text-lg font-semibold mb-4 text-gray-200">Market Selection</h2>
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
                            
                            <ComplianceAlerts />
                            <RegulatoryChangeTracker />
                            <RiskScoreBoard />
                        </div>
                        
                        <TradingRestrictions />
                    </div>
                </main>
            </div>
            
            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-2">
                <div className="flex justify-around">
                    <button className="flex flex-col items-center p-2">
                        <BarChart3 size={20} />
                        <span className="text-xs mt-1">Chart</span>
                    </button>
                    <button className="flex flex-col items-center p-2">
                        <Bell size={20} />
                        <span className="text-xs mt-1">Alerts</span>
                    </button>
                    <button className="flex flex-col items-center p-2">
                        <Settings size={20} />
                        <span className="text-xs mt-1">Settings</span>
                    </button>
                </div>
            </div>
        </div>
    );
}