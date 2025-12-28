'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Cpu, TrendingUp, TrendingDown, Layers, Target, RefreshCw, Eye, EyeOff } from 'lucide-react';
import OrderFlowChart from '@/components/market-microstructure/OrderFlowChart';
import LimitOrderBook from '@/components/market-microstructure/LimitOrderBook';
import HFTDetectionPanel from '@/components/market-microstructure/HFTDetectionPanel';
import LiquidityMetrics from '@/components/market-microstructure/LiquidityMetrics';

interface OrderFlowImbalance {
  timestamp: number;
  buyPressure: number;
  sellPressure: number;
  imbalance: number;
  price: number;
}

interface HFTPattern {
  id: string;
  type: 'Spoofing' | 'QuoteStuffing' | 'MomentumIgnition' | 'Layering';
  confidence: number;
  timestamp: number;
  impact: 'High' | 'Medium' | 'Low';
}

interface LiquidityMetric {
  metric: string;
  value: number;
  quality: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  trend: 'up' | 'down' | 'stable';
}

const AdvancedMarketMicrostructure = () => {
  const [activeTab, setActiveTab] = useState('order-flow');
  const [timeframe, setTimeframe] = useState('1m');
  const [symbol, setSymbol] = useState('BTC/USDT');
  const [isLive, setIsLive] = useState(true);
  
  const [orderFlowData, setOrderFlowData] = useState<OrderFlowImbalance[]>([
    { timestamp: Date.now() - 60000, buyPressure: 65, sellPressure: 35, imbalance: 30, price: 45890 },
    { timestamp: Date.now() - 50000, buyPressure: 72, sellPressure: 28, imbalance: 44, price: 45920 },
    { timestamp: Date.now() - 40000, buyPressure: 48, sellPressure: 52, imbalance: -4, price: 45880 },
    { timestamp: Date.now() - 30000, buyPressure: 55, sellPressure: 45, imbalance: 10, price: 45900 },
    { timestamp: Date.now() - 20000, buyPressure: 40, sellPressure: 60, imbalance: -20, price: 45850 },
    { timestamp: Date.now() - 10000, buyPressure: 68, sellPressure: 32, imbalance: 36, price: 45950 },
  ]);
  
  const [hftPatterns, setHftPatterns] = useState<HFTPattern[]>([
    { id: '1', type: 'Spoofing', confidence: 87, timestamp: Date.now() - 45000, impact: 'High' },
    { id: '2', type: 'QuoteStuffing', confidence: 92, timestamp: Date.now() - 32000, impact: 'Medium' },
    { id: '3', type: 'MomentumIgnition', confidence: 78, timestamp: Date.now() - 15000, impact: 'High' },
    { id: '4', type: 'Layering', confidence: 85, timestamp: Date.now() - 8000, impact: 'Medium' },
  ]);
  
  const [liquidityMetrics, setLiquidityMetrics] = useState<LiquidityMetric[]>([
    { metric: 'Market Depth', value: 85, quality: 'Excellent', trend: 'up' },
    { metric: 'Spread Quality', value: 72, quality: 'Good', trend: 'stable' },
    { metric: 'Slippage Risk', value: 34, quality: 'Good', trend: 'down' },
    { metric: 'Order Fill Rate', value: 91, quality: 'Excellent', trend: 'up' },
    { metric: 'Price Impact', value: 28, quality: 'Excellent', trend: 'down' },
  ]);
  
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      const now = Date.now();
      const newData = {
        timestamp: now,
        buyPressure: Math.floor(Math.random() * 30) + 35,
        sellPressure: Math.floor(Math.random() * 30) + 35,
        imbalance: 0,
        price: 45800 + Math.random() * 200
      };
      newData.imbalance = newData.buyPressure - newData.sellPressure;
      
      setOrderFlowData(prev => {
        const updated = [...prev.slice(1), newData];
        return updated;
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isLive]);
  
  const HeaderSection = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Market Microstructure</h1>
        <p className="text-gray-400 mt-1">Advanced order flow and liquidity analysis</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <select 
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="BTC/USDT">BTC/USDT</option>
            <option value="ETH/USDT">ETH/USDT</option>
            <option value="SOL/USDT">SOL/USDT</option>
          </select>
          
          <select 
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="1m">1m</option>
            <option value="5m">5m</option>
            <option value="15m">15m</option>
            <option value="1h">1h</option>
          </select>
        </div>
        
        <Button 
          variant={isLive ? "default" : "outline"}
          size="sm"
          onClick={() => setIsLive(!isLive)}
          className="flex items-center gap-2"
        >
          {isLive ? <EyeOff size={16} /> : <Eye size={16} />}
          {isLive ? 'Live' : 'Paused'}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>
    </div>
  );
  
  const MetricsOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Order Flow Imbalance</p>
              <p className="text-2xl font-bold mt-1">
                {orderFlowData[orderFlowData.length - 1].imbalance > 0 ? '+' : ''}
                {orderFlowData[orderFlowData.length - 1].imbalance}%
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <Badge variant={orderFlowData[orderFlowData.length - 1].imbalance > 0 ? "default" : "destructive"}>
                {orderFlowData[orderFlowData.length - 1].imbalance > 0 ? 'Buying' : 'Selling'} Pressure
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">HFT Patterns Detected</p>
              <p className="text-2xl font-bold mt-1">{hftPatterns.length}</p>
            </div>
            <Cpu className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {hftPatterns.filter(p => p.impact === 'High').length} High Impact
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Liquidity Score</p>
              <p className="text-2xl font-bold mt-1">
                {Math.round(liquidityMetrics.reduce((acc, m) => acc + m.value, 0) / liquidityMetrics.length)}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {liquidityMetrics.filter(m => m.quality === 'Excellent').length} Excellent
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Current Price</p>
              <p className="text-2xl font-bold mt-1">
                ${orderFlowData[orderFlowData.length - 1].price.toLocaleString()}
              </p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {symbol}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <HeaderSection />
      <MetricsOverview />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-auto">
          <TabsTrigger value="order-flow" className="flex items-center gap-2">
            <Activity size={16} />
            Order Flow
          </TabsTrigger>
          <TabsTrigger value="order-book" className="flex items-center gap-2">
            <Layers size={16} />
            Order Book
          </TabsTrigger>
          <TabsTrigger value="hft-detection" className="flex items-center gap-2">
            <Cpu size={16} />
            HFT Detection
          </TabsTrigger>
          <TabsTrigger value="liquidity" className="flex items-center gap-2">
            <Target size={16} />
            Liquidity
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="order-flow" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Flow Imbalance</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderFlowChart data={orderFlowData} />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Imbalances</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orderFlowData.slice().reverse().map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                      <div>
                        <p className="text-sm">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        <p className="text-xs text-gray-400">${item.price.toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${item.imbalance > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {item.imbalance > 0 ? '+' : ''}{item.imbalance}%
                        </p>
                        <p className="text-xs text-gray-400">
                          {item.buyPressure}/{item.sellPressure}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Market Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Average Imbalance</p>
                    <p className="text-2xl font-bold">
                      {Math.round(orderFlowData.reduce((acc, item) => acc + item.imbalance, 0) / orderFlowData.length)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Buy/Sell Ratio</p>
                    <p className="text-2xl font-bold">
                      {(
                        orderFlowData.reduce((acc, item) => acc + item.buyPressure, 0) / 
                        orderFlowData.reduce((acc, item) => acc + item.sellPressure, 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Volatility Score</p>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        Math.max(...orderFlowData.map(d => d.price)) - 
                        Math.min(...orderFlowData.map(d => d.price))
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="order-book">
          <Card>
            <CardHeader>
              <CardTitle>Limit Order Book</CardTitle>
            </CardHeader>
            <CardContent>
              <LimitOrderBook symbol={symbol} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hft-detection">
          <HFTDetectionPanel patterns={hftPatterns} />
        </TabsContent>
        
        <TabsContent value="liquidity">
          <LiquidityMetrics metrics={liquidityMetrics} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedMarketMicrostructure;