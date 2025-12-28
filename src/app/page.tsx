'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Bell,
  Users,
  BarChart2,
  Settings,
  User,
  LogOut
} from 'lucide-react';

// Mock data for charts
const chartData = [
  { time: '09:30', price: 45000 },
  { time: '10:00', price: 45200 },
  { time: '10:30', price: 45100 },
  { time: '11:00', price: 45300 },
  { time: '11:30', price: 45500 },
  { time: '12:00', price: 45400 },
  { time: '12:30', price: 45600 },
  { time: '13:00', price: 45700 },
  { time: '13:30', price: 45800 },
  { time: '14:00', price: 45900 },
];

const instruments = [
  { symbol: 'BTC/USDT', price: '45,890.12', change: '+2.34%', volume: '1.2B' },
  { symbol: 'ETH/USDT', price: '2,450.67', change: '+1.23%', volume: '850M' },
  { symbol: 'SOL/USDT', price: '98.45', change: '+5.67%', volume: '320M' },
  { symbol: 'XRP/USDT', price: '0.5678', change: '-0.45%', volume: '450M' },
  { symbol: 'ADA/USDT', price: '0.4321', change: '+0.89%', volume: '210M' },
  { symbol: 'DOT/USDT', price: '6.78', change: '+3.21%', volume: '180M' },
  { symbol: 'LINK/USDT', price: '14.56', change: '-1.23%', volume: '95M' },
  { symbol: 'AVAX/USDT', price: '34.21', change: '+4.56%', volume: '120M' },
];

type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d' | '1w';

export default function Home() {
  const [selectedInstrument, setSelectedInstrument] = useState('BTC/USDT');
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('1h');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredInstruments = instruments.filter(instrument =>
    instrument.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const timeFrames: TimeFrame[] = ['1m', '5m', '15m', '1h', '4h', '1d', '1w'];
  
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Cpu className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight">AI Trading Platform</span>
            </div>
            
            <div className="hidden md:flex items-center gap-2 ml-8">
              <Badge variant="outline" className="border-green-500/30 text-green-400">
                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                Live
              </Badge>
              <span className="text-sm text-gray-400">Demo Mode</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
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
            <Button variant="outline" size="sm" className="hidden md:flex">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar */}
        <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 border-r border-gray-800 bg-gray-900`}>
          <div className="flex flex-col h-[calc(100vh-4rem)]">
            {/* Sidebar Toggle */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search instruments..."
                    className="bg-gray-800 border-gray-700 text-sm h-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              >
                {isSidebarCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            {/* Instruments List */}
            <div className="flex-1 overflow-y-auto p-2">
              {!isSidebarCollapsed && (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Markets
                  </div>
                  {filteredInstruments.map((instrument) => (
                    <button
                      key={instrument.symbol}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        selectedInstrument === instrument.symbol
                          ? 'bg-gray-800'
                          : 'hover:bg-gray-800/50'
                      }`}
                      onClick={() => setSelectedInstrument(instrument.symbol)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{instrument.symbol}</div>
                        <div className="text-sm text-gray-400">${instrument.price}</div>
                      </div>
                      <div className={`text-sm font-medium ${
                        instrument.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {instrument.change}
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {/* Collapsed Sidebar Icons */}
              {isSidebarCollapsed && (
                <div className="space-y-2">
                  {instruments.slice(0, 6).map((instrument) => (
                    <button
                      key={instrument.symbol}
                      className="w-full p-2 hover:bg-gray-800 rounded-lg transition-colors"
                      title={instrument.symbol}
                      onClick={() => setSelectedInstrument(instrument.symbol)}
                    >
                      <div className="text-xs font-medium truncate">
                        {instrument.symbol.split('/')[0]}
                      </div>
                      <div className={`text-xs ${
                        instrument.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {instrument.change}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Sidebar Footer */}
            <div className="border-t border-gray-800 p-4">
              {!isSidebarCollapsed && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">AI Confidence</span>
                    <span className="text-sm font-medium text-green-400">87%</span>
                  </div>
                  <Progress value={87} className="h-2 bg-gray-800" />
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Activity className="h-4 w-4" />
                    <span>24h Volume: $4.2B</span>
                  </div>
                </div>
              )}
              {isSidebarCollapsed && (
                <div className="flex flex-col items-center gap-2">
                  <Activity className="h-5 w-5 text-green-400" />
                  <span className="text-xs text-green-400">87%</span>
                </div>
              )}
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="p-6">
            {/* Chart Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold">{selectedInstrument}</h1>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-400">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Bullish
                  </Badge>
                  <span className="text-xl font-bold text-green-400">$45,890.12</span>
                  <span className="text-sm text-green-400">(+2.34%)</span>
                </div>
                <p className="text-gray-400 mt-1">Bitcoin / Tether • 24h High: $46,200 • Low: $44,800</p>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg border border-gray-700 bg-gray-800 p-1">
                  {timeFrames.map((tf) => (
                    <Button
                      key={tf}
                      variant={timeFrame === tf ? 'secondary' : 'ghost'}
                      size="sm"
                      className={`h-8 px-3 ${
                        timeFrame === tf ? 'bg-gray-700' : ''
                      }`}
                      onClick={() => setTimeFrame(tf)}
                    >
                      {tf}
                    </Button>
                  ))}
                </div>
                
                <Button variant="outline" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
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
                        <Button size="sm" variant="ghost">
                          <Play className="h-4 w-4 mr-2" />
                          Live
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis 
                            dataKey="time" 
                            stroke="#9CA3AF"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#9CA3AF"
                            fontSize={12}
                            domain={['dataMin - 100', 'dataMax + 100']}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#1F2937', 
                              borderColor: '#374151',
                              color: 'white'
                            }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#3B82F6" 
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 4 }}
                          />
                        </LineChart>
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
                      <Cpu className="h-5 w-5 text-blue-400" />
                      AI Signals
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Buy Signal</span>
                        <Badge className="bg-green-500/10 text-green-400">Strong</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Risk Level</span>
                        <Badge className="bg-yellow-500/10 text-yellow-400">Medium</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Confidence</span>
                        <span className="text-sm font-medium text-green-400">87%</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-700">
                      <h4 className="text-sm font-medium mb-2">Recommended Actions</h4>
                      <div className="space-y-2">
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          Buy Limit @ $45,500
                        </Button>
                        <Button variant="outline" className="w-full border-red-500 text-red-400 hover:bg-red-500/10">
                          Sell Limit @ $46,500
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-purple-400" />
                      Market Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">24h Volume</span>
                      <span className="font-medium">$1.2B</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Market Cap</span>
                      <span className="font-medium">$890B</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Bid/Ask</span>
                      <span className="font-medium">45,889/45,891</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">Spread</span>
                      <span className="font-medium text-yellow-400">0.004%</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Bottom Tabs */}
            <div className="mt-6">
              <Tabs defaultValue="orders" className="w-full">
                <TabsList className="bg-gray-800 border border-gray-700">
                  <TabsTrigger value="orders" className="data-[state=active]:bg-gray-700">
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="positions" className="data-[state=active]:bg-gray-700">
                    Positions
                  </TabsTrigger>
                  <TabsTrigger value="history" className="data-[state=active]:bg-gray-700">
                    History
                  </TabsTrigger>
                  <TabsTrigger value="logs" className="data-[state=active]:bg-gray-700">
                    AI Logs
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="orders" className="mt-4">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="text-center text-gray-400 py-8">
                        <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                        <p>No active orders. Place your first trade!</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="positions" className="mt-4">
                  <Card className="bg-gray-800 border-gray-700">
                    <CardContent className="p-6">
                      <div className="text-center text-gray-400 py-8">
                        <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                        <p>No open positions.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
