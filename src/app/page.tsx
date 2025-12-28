'use client';

import React, { useState, useEffect } from 'react';
import ComplianceAlerts from '@/components/ComplianceAlerts';
import RegulatoryChangeTracker from '@/components/RegulatoryChangeTracker';
import RiskScoreBoard from '@/components/RiskScoreBoard';
import TradingRestrictions from '@/components/TradingRestrictions';
import BinanceWebSocket from '@/components/BinanceWebSocket';
import CorrelationHeatMap from '@/components/risk-dashboard/CorrelationHeatMap';
import HistoricalCorrelationChart from '@/components/risk-dashboard/HistoricalCorrelationChart';
import VolatilityImpactAnalysis from '@/components/risk-dashboard/VolatilityImpactAnalysis';
import CurrencyRiskScoring from '@/components/risk-dashboard/CurrencyRiskScoring';
import GeopoliticalRiskIntegration from '@/components/risk-dashboard/GeopoliticalRiskIntegration';
import CorrelationCoefficientCalculator from '@/components/risk-dashboard/CorrelationCoefficientCalculator';
import PredictiveCorrelationModel from '@/components/risk-dashboard/PredictiveCorrelationModel';
import { CorrelationData, CurrencyPair, RiskScore } from '@/types/risk-dashboard';

export default function ComplianceDashboard() {
    const [selectedMarket, setSelectedMarket] = useState('US');
    const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
    const [selectedCurrencyPair, setSelectedCurrencyPair] = useState<CurrencyPair>('EUR/USD');
    const [timeframe, setTimeframe] = useState('1D');
    const [correlationData, setCorrelationData] = useState<CorrelationData[]>([]);
    const [riskScores, setRiskScores] = useState<RiskScore[]>([]);
    
    const currencyPairs: CurrencyPair[] = [
        'EUR/USD', 'USD/JPY', 'GBP/USD', 'USD/CHF', 
        'AUD/USD', 'USD/CAD', 'NZD/USD', 'BTC/USD',
        'ETH/USD', 'XAU/USD', 'OIL/USD'
    ];
    
    const handleWebSocketData = (data: any) => {
        console.log('Received market data:', data);
        // Здесь можно добавить логику обработки данных
    };
    
    const handleWebSocketError = (error: Error) => {
        console.error('WebSocket error:', error);
        // Здесь можно добавить логику обработки ошибок
    };

    // Инициализация демо-данных
    useEffect(() => {
        // Демо-данные для корреляции
        const demoCorrelationData: CorrelationData[] = currencyPairs.map(pair => ({
            pair,
            correlation: Math.random() * 2 - 1, // от -1 до 1
            volatility: Math.random() * 0.1 + 0.02, // 2-12%
            volume: Math.random() * 1000000 + 500000,
            timestamp: new Date().toISOString()
        }));
        
        // Демо-данные для оценки риска
        const demoRiskScores: RiskScore[] = currencyPairs.map(pair => ({
            pair,
            riskScore: Math.random() * 100,
            volatilityScore: Math.random() * 100,
            liquidityScore: Math.random() * 100,
            geopoliticalScore: Math.random() * 100,
            technicalScore: Math.random() * 100
        }));
        
        setCorrelationData(demoCorrelationData);
        setRiskScores(demoRiskScores);
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-6">
            <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-2 text-center text-gray-100">
                    AI Trading Platform - Multi-Currency Risk Correlation Dashboard
                </h1>
                <p className="text-gray-400 text-center mb-6">
                    Real-time cross-currency risk analysis and correlation monitoring
                </p>

                {/* Binance WebSocket Component */}
                <div className="mb-6">
                    <BinanceWebSocket 
                        symbol={selectedSymbol}
                        onData={handleWebSocketData}
                        onError={handleWebSocketError}
                    />
                </div>

                {/* Market and Timeframe Selection */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <h2 className="text-xl font-semibold mb-4 text-gray-200">Market Selection</h2>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {['US', 'EU', 'Russia', 'Asia', 'Global'].map((market) => (
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
                        <div className="text-sm text-gray-400">
                            Selected Market: <span className="font-semibold text-blue-400">{selectedMarket}</span>
                        </div>
                        
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Trading Symbol</h3>
                            <div className="flex flex-wrap gap-2">
                                {['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'XRPUSDT'].map((symbol) => (
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
                        <h2 className="text-xl font-semibold mb-4 text-gray-200">Analysis Parameters</h2>
                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Timeframe</h3>
                            <div className="flex flex-wrap gap-2">
                                {['1H', '4H', '1D', '1W', '1M'].map((tf) => (
                                    <button
                                        key={tf}
                                        onClick={() => setTimeframe(tf)}
                                        className={`px-3 py-1 text-sm rounded transition-all duration-200 ${
                                            timeframe === tf
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                        }`}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="text-sm font-medium text-gray-400 mb-2">Currency Pair Focus</h3>
                            <select 
                                value={selectedCurrencyPair}
                                onChange={(e) => setSelectedCurrencyPair(e.target.value as CurrencyPair)}
                                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {currencyPairs.map(pair => (
                                    <option key={pair} value={pair}>{pair}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Risk Correlation Dashboard */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Correlation Heat Map */}
                    <div className="lg:col-span-2 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <CorrelationHeatMap 
                            data={correlationData}
                            selectedPair={selectedCurrencyPair}
                            onPairSelect={setSelectedCurrencyPair}
                        />
                    </div>

                    {/* Historical Correlation Trending */}
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <HistoricalCorrelationChart 
                            pair={selectedCurrencyPair}
                            timeframe={timeframe}
                        />
                    </div>

                    {/* Volatility Impact Analysis */}
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <VolatilityImpactAnalysis 
                            data={correlationData}
                            selectedPair={selectedCurrencyPair}
                        />
                    </div>

                    {/* Currency Pair Risk Scoring */}
                    <div className="lg:col-span-2 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <CurrencyRiskScoring 
                            riskScores={riskScores}
                            selectedPair={selectedCurrencyPair}
                            onPairSelect={setSelectedCurrencyPair}
                        />
                    </div>

                    {/* Geopolitical Risk Integration */}
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <GeopoliticalRiskIntegration 
                            market={selectedMarket}
                        />
                    </div>

                    {/* Dynamic Correlation Coefficient Calculator */}
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <CorrelationCoefficientCalculator 
                            pair1={selectedCurrencyPair}
                            pair2={currencyPairs.find(p => p !== selectedCurrencyPair) || 'USD/JPY'}
                            timeframe={timeframe}
                        />
                    </div>

                    {/* Machine Learning Predictive Correlation Modeling */}
                    <div className="lg:col-span-2 bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <PredictiveCorrelationModel 
                            pair={selectedCurrencyPair}
                            timeframe={timeframe}
                        />
                    </div>
                </div>

                {/* Original Compliance Components */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <ComplianceAlerts market={selectedMarket} />
                    <RegulatoryChangeTracker market={selectedMarket} />
                    <RiskScoreBoard market={selectedMarket} />
                    <TradingRestrictions market={selectedMarket} />
                </div>

                {/* Dashboard Summary */}
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">Dashboard Summary</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-700 rounded">
                            <div className="text-2xl font-bold text-blue-400">
                                {currencyPairs.length}
                            </div>
                            <div className="text-sm text-gray-400">Currency Pairs</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded">
                            <div className="text-2xl font-bold text-green-400">
                                {timeframe}
                            </div>
                            <div className="text-sm text-gray-400">Timeframe</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded">
                            <div className="text-2xl font-bold text-yellow-400">
                                {selectedMarket}
                            </div>
                            <div className="text-sm text-gray-400">Market Region</div>
                        </div>
                        <div className="text-center p-3 bg-gray-700 rounded">
                            <div className="text-2xl font-bold text-purple-400">
                                Real-time
                            </div>
                            <div className="text-sm text-gray-400">Data Updates</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}