'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, ScatterChart, Scatter, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Heatmap, HeatmapCell, PieChart, Pie, Cell, AreaChart, Area,
  ComposedChart
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Filter, 
  Download, 
  Play, 
  Pause, 
  RefreshCw, 
  BarChart3, 
  TrendingUp, 
  Cpu, 
  Zap, 
  Shield, 
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Activity,
  Globe,
  Layers,
  AlertCircle,
  Target,
  PieChart as PieChartIcon,
  Network,
  TrendingDown,
  MessageSquare,
  Twitter,
  Reddit,
  Hash,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Bell,
  Users,
  Hash as HashIcon,
  BarChart2,
  Link as LinkIcon,
  FileText,
  FileSpreadsheet,
  Calculator,
  Cpu as CpuIcon,
  Wind,
  Target as TargetIcon,
  AlertOctagon,
  TrendingUp as TrendingUpIcon2,
  TrendingDown as TrendingDownIcon2,
  BarChart as BarChartIcon,
  LineChart as LineChartIcon,
  Newspaper,
  TrendingUp as TrendingUpIcon3,
  TrendingDown as TrendingDownIcon3,
  AlertCircle as AlertCircleIcon,
  Activity as ActivityIcon,
  Hash as HashIcon2,
  MessageSquare as MessageSquareIcon,
  Globe as GlobeIcon,
  Users as UsersIcon,
  Bell as BellIcon,
  Filter as FilterIcon,
  Download as DownloadIcon,
  Brain,
  Sparkles,
  Code,
  FileJson,
  BarChart4,
  Target as TargetIcon2,
  AlertOctagon as AlertOctagonIcon,
  Zap as ZapIcon,
  Shield as ShieldIcon,
  Cpu as CpuIcon2,
  Menu,
  X,
  Home,
  Settings,
  User,
  LogOut
} from 'lucide-react';

// Types
interface StatisticalArbitragePair {
  id: string;
  asset1: string;
  asset2: string;
  correlation: number;
  spread: number;
  zScore: number;
  halfLife: number;
  entryThreshold: number;
  exitThreshold: number;
  sharpeRatio: number;
  status: 'active' | 'inactive' | 'alert';
}

interface MLFeature {
  name: string;
  type: 'technical' | 'fundamental' | 'market' | 'sentiment';
  importance: number;
  correlation: number;
  stability: number;
}

interface FactorModel {
  factor: string;
  exposure: number;
  riskPremium: number;
  tStat: number;
  pValue: number;
  rSquared: number;
}

interface PortfolioWeight {
  symbol: string;
  name: string;
  mvoWeight: number;
  riskParityWeight: number;
  blackLittermanWeight: number;
  currentWeight: number;
}

interface MonteCarloResult {
  iteration: number;
  portfolioReturn: number;
  portfolioVolatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

interface PerformanceMetric {
  metric: string;
  value: number;
  benchmark: number;
  explanation: string;
}

interface RiskFactor {
  factor: string;
  exposure: number;
  contribution: number;
  risk: number;
  color: string;
}

interface CrossAssetCorrelation {
  asset1: string;
  asset2: string;
  correlation: number;
  rollingCorrelation: number[];
  regime: 'high' | 'medium' | 'low';
}

// New Types for AI Trade Strategy Generator
interface AIStrategy {
  id: string;
  name: string;
  description: string;
  type: 'mean_reversion' | 'momentum' | 'breakout' | 'arbitrage' | 'ml_based' | 'hybrid';
  complexity: number; // 1-10
  winRate: number; // 0-100%
}

// Mock data for instruments
const instruments = [
  { symbol: 'SBER', name: 'Сбербанк', price: 320.45, change: 1.23, volume: '12.5M' },
  { symbol: 'GAZP', name: 'Газпром', price: 168.90, change: -0.45, volume: '8.7M' },
  { symbol: 'LKOH', name: 'Лукойл', price: 7450.20, change: 2.15, volume: '3.2M' },
  { symbol: 'YNDX', name: 'Яндекс', price: 2850.75, change: -1.80, volume: '5.1M' },
  { symbol: 'BTC/USD', name: 'Bitcoin', price: 68500.50, change: 3.45, volume: '32.1B' },
  { symbol: 'ETH/USD', name: 'Ethereum', price: 3850.25, change: 2.15, volume: '18.7B' },
  { symbol: 'AAPL', name: 'Apple Inc', price: 185.32, change: 0.85, volume: '45.2M' },
  { symbol: 'MSFT', name: 'Microsoft', price: 415.67, change: 1.23, volume: '28.9M' },
];

// Mock data for chart
const chartData = [
  { time: '09:30', price: 320.10, volume: 125000 },
  { time: '10:00', price: 321.50, volume: 98000 },
  { time: '10:30', price: 319.80, volume: 145000 },
  { time: '11:00', price: 322.30, volume: 112000 },
  { time: '11:30', price: 320.45, volume: 89000 },
  { time: '12:00', price: 321.90, volume: 156000 },
  { time: '12:30', price: 323.20, volume: 134000 },
  { time: '13:00', price: 322.80, volume: 101000 },
];

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState('SBER');
  const [timeframe, setTimeframe] = useState('1D');
  
  // Mock data for demonstration
  const performanceData = [
    { month: 'Jan', returns: 2.3, benchmark: 1.8 },
    { month: 'Feb', returns: 3.1, benchmark: 2.2 },
    { month: 'Mar', returns: 1.8, benchmark: 1.5 },
    { month: 'Apr', returns: 4.2, benchmark: 3.1 },
    { month: 'May', returns: 2.9, benchmark: 2.4 },
    { month: 'Jun', returns: 3.5, benchmark: 2.8 },
  ];

  const riskFactors: RiskFactor[] = [
    { factor: 'Market', exposure: 0.85, contribution: 45, risk: 12.5, color: '#3B82F6' },
    { factor: 'Size', exposure: 0.32, contribution: 18, risk: 8.2, color: '#10B981' },
    { factor: 'Value', exposure: 0.28, contribution: 15, risk: 6.8, color: '#8B5CF6' },
    { factor: 'Momentum', exposure: 0.21, contribution: 12, risk: 5.4, color: '#F59E0B' },
    { factor: 'Quality', exposure: 0.15, contribution: 10, risk: 4.1, color: '#EF4444' },
  ];

  const portfolioWeights: PortfolioWeight[] = [
    { symbol: 'SBER', name: 'Сбербанк', mvoWeight: 25, riskParityWeight: 22, blackLittermanWeight: 24, currentWeight: 23 },
    { symbol: 'GAZP', name: 'Газпром', mvoWeight: 18, riskParityWeight: 20, blackLittermanWeight: 19, currentWeight: 18 },
    { symbol: 'LKOH', name: 'Лукойл', mvoWeight: 15, riskParityWeight: 16, blackLittermanWeight: 17, currentWeight: 16 },
    { symbol: 'YNDX', name: 'Яндекс', mvoWeight: 12, riskParityWeight: 14, blackLittermanWeight: 13, currentWeight: 14 },
    { symbol: 'BTC', name: 'Bitcoin', mvoWeight: 10, riskParityWeight: 8, blackLittermanWeight: 9, currentWeight: 9 },
    { symbol: 'AAPL', name: 'Apple', mvoWeight: 20, riskParityWeight: 20, blackLittermanWeight: 18, currentWeight: 20 },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-xl font-bold tracking-tight">AI Trading Platform</h1>
                <p className="text-xs text-gray-400">Professional Trading with AI Analytics</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Badge variant="outline" className="border-green-500 text-green-500">
                <Activity className="h-3 w-3 mr-1" />
                Live
              </Badge>
              <span className="text-sm text-gray-400">Connected to MOEX</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 w-64 border-r border-gray-800 bg-gray-900 transition-transform md:relative md:translate-x-0`}>
          <div className="flex h-full flex-col">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Search instruments..." 
                  className="pl-9 bg-gray-800 border-gray-700"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <h2 className="mb-3 text-sm font-semibold text-gray-400">WATCHLIST</h2>
                <div className="space-y-2">
                  {instruments.map((instrument) => (
                    <div 
                      key={instrument.symbol}
                      className={`flex items-center justify-between rounded-lg p-3 cursor-pointer transition-colors hover:bg-gray-800 ${selectedInstrument === instrument.symbol ? 'bg-gray-800' : ''}`}
                      onClick={() => setSelectedInstrument(instrument.symbol)}
                    >
                      <div>
                        <div className="font-medium">{instrument.symbol}</div>
                        <div className="text-xs text-gray-400">{instrument.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{instrument.price.toLocaleString('ru-RU')}</div>
                        <div className={`text-xs ${instrument.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {instrument.change >= 0 ? '+' : ''}{instrument.change}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-800 p-4">
                <h2 className="mb-3 text-sm font-semibold text-gray-400">QUICK ACTIONS</h2>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    New Strategy
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Cpu className="mr-2 h-4 w-4" />
                    AI Analysis
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Backtest
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">Demo Account</div>
                <Badge variant="secondary">$100,000</Badge>
              </div>
              <Progress value={65} className="mt-2" />
              <div className="mt-2 text-xs text-gray-400">65% of daily limit used</div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">
            {/* Chart Header */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{selectedInstrument}</h2>
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      MOEX
                    </Badge>
                    <span className="text-xl font-bold">
                      {instruments.find(i => i.symbol === selectedInstrument)?.price.toLocaleString('ru-RU')}
                    </span>
                    <span className="text-green-500">
                      +{instruments.find(i => i.symbol === selectedInstrument)?.change}%
                    </span>
                  </div>
                  <p className="text-gray-400">
                    {instruments.find(i => i.symbol === selectedInstrument)?.name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-gray-700">
                    {['1D', '1W', '1M', '3M', '1Y'].map((tf) => (
                      <Button
                        key={tf}
                        variant={timeframe === tf ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() => setTimeframe(tf)}
                        className="rounded-none first:rounded-l-lg last:rounded-r-lg"
                      >
                        {tf}
                      </Button>
                    ))}
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  
                  <Button size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Trade
                  </Button>
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle>Price Chart</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <LineChartIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <BarChartIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <PieChartIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="time" 
                            stroke="#9CA3AF" 
                            tick={{ fill: '#9CA3AF' }}
                          />
                          <YAxis 
                            stroke="#9CA3AF" 
                            tick={{ fill: '#9CA3AF' }}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              borderColor: '#374151',
                              color: 'white'
                            }}
                          />
                          <Legend />
                          <Area 
                            type="monotone" 
                            dataKey="price" 
                            fill="#3B82F6" 
                            fillOpacity={0.1} 
                            stroke="#3B82F6" 
                            strokeWidth={2}
                          />
                          <Bar 
                            dataKey="volume" 
                            fill="#6B7280" 
                            fillOpacity={0.3}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Panel */}
              <div className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      AI Signals
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-green-900/20 border border-green-800">
                        <div>
                          <div className="font-medium">Strong Buy</div>
                          <div className="text-sm text-gray-400">Momentum + Volume</div>
                        </div>
                        <Badge className="bg-green-500">95%</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-blue-900/20 border border-blue-800">
                        <div>
                          <div className="font-medium">Mean Reversion</div>
                          <div className="text-sm text-gray-400">RSI Oversold</div>
                        </div>
                        <Badge className="bg-blue-500">82%</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-purple-900/20 border border-purple-800">
                        <div>
                          <div className="font-medium">Breakout Alert</div>
                          <div className="text-sm text-gray-400">Resistance Level</div>
                        </div>
                        <Badge className="bg-purple-500">78%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-red-500" />
                      Order Flow
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bid/Ask</span>
                        <span>320.45 / 320.50</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Spread</span>
                        <span>0.05 (0.02%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Volume</span>
                        <span>1.2M</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Trades</span>
                        <span>4,523</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Bottom Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          borderColor: '#374151',
                          color: 'white'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="returns" 
                        stroke="#10B981" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="benchmark" 
                        stroke="#6B7280" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Risk Factors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {riskFactors.map((factor) => (
                      <div key={factor.factor} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{factor.factor}</span>
                          <span>{factor.exposure.toFixed(2)}</span>
                        </div>
                        <Progress 
                          value={factor.contribution} 
                          className="h-2"
                          style={{
                            backgroundColor: `${factor.color}20`,
                            ['--progress-background' as any]: factor.color
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle>Portfolio Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={portfolioWeights}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.symbol}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="currentWeight"
                      >
                        {portfolioWeights.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={[
                            '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#EC4899'
                          ][index % 6]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937', 
                          borderColor: '#374151',
                          color: 'white'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
