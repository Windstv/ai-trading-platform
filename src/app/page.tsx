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
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Percent,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink
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

// New Types for Trade Execution Module
interface ExchangeConfig {
  id: string;
  name: string;
  apiKey: string;
  apiSecret: string;
  testnet: boolean;
  status: 'connected' | 'disconnected' | 'error';
}

interface TradeOrder {
  id: string;
  exchange: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  quantity: number;
  price?: number;
  status: 'pending' | 'filled' | 'partial' | 'cancelled' | 'rejected';
  filledQuantity: number;
  averagePrice: number;
  fee: number;
  feeCurrency: string;
  timestamp: string;
  updatedAt: string;
}

interface TradeFee {
  maker: number;
  taker: number;
  currency: string;
}

interface OrderValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

const TradeExecutionModule = () => {
  // Exchange connections
  const [exchanges, setExchanges] = useState<ExchangeConfig[]>([
    {
      id: 'binance',
      name: 'Binance',
      apiKey: '',
      apiSecret: '',
      testnet: true,
      status: 'disconnected'
    },
    {
      id: 'kraken',
      name: 'Kraken',
      apiKey: '',
      apiSecret: '',
      testnet: true,
      status: 'disconnected'
    }
  ]);

  // Trade order state
  const [order, setOrder] = useState({
    exchange: 'binance',
    symbol: 'BTCUSDT',
    side: 'buy' as 'buy' | 'sell',
    type: 'limit' as 'market' | 'limit',
    quantity: 0.01,
    price: 50000,
    total: 0
  });

  const [orders, setOrders] = useState<TradeOrder[]>([
    {
      id: '1',
      exchange: 'binance',
      symbol: 'BTCUSDT',
      side: 'buy',
      type: 'limit',
      quantity: 0.02,
      price: 49500,
      status: 'filled',
      filledQuantity: 0.02,
      averagePrice: 49498.50,
      fee: 0.001,
      feeCurrency: 'BTC',
      timestamp: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:05Z'
    },
    {
      id: '2',
      exchange: 'kraken',
      symbol: 'ETHUSD',
      side: 'sell',
      type: 'market',
      quantity: 0.5,
      status: 'filled',
      filledQuantity: 0.5,
      averagePrice: 2650.75,
      fee: 1.32,
      feeCurrency: 'USD',
      timestamp: '2024-01-15T11:15:00Z',
      updatedAt: '2024-01-15T11:15:01Z'
    }
  ]);

  const [isExecuting, setIsExecuting] = useState(false);
  const [validation, setValidation] = useState<OrderValidation>({ isValid: true, errors: [], warnings: [] });
  const [fees, setFees] = useState<TradeFee[]>([
    { maker: 0.001, taker: 0.001, currency: 'BTC' },
    { maker: 0.0016, taker: 0.0026, currency: 'USD' }
  ]);

  // Calculate total
  useEffect(() => {
    const total = order.quantity * (order.price || 0);
    setOrder(prev => ({ ...prev, total }));
    validateOrder();
  }, [order.quantity, order.price, order.type]);

  // Validate order
  const validateOrder = () => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (order.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    }

    if (order.type === 'limit' && (!order.price || order.price <= 0)) {
      errors.push('Limit price must be specified');
    }

    if (order.quantity > 100) {
      warnings.push('Large order size may impact market price');
    }

    setValidation({
      isValid: errors.length === 0,
      errors,
      warnings
    });
  };

  // Calculate fee
  const calculateFee = () => {
    const exchangeFee = fees.find(f => f.currency === (order.symbol.includes('USDT') ? 'BTC' : 'USD'));
    if (!exchangeFee) return 0;

    const feeRate = order.type === 'market' ? exchangeFee.taker : exchangeFee.maker;
    return order.total * feeRate;
  };

  // Connect to exchange
  const connectExchange = async (exchangeId: string) => {
    const exchange = exchanges.find(e => e.id === exchangeId);
    if (!exchange) return;

    try {
      // Simulate API connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setExchanges(prev => prev.map(e => 
        e.id === exchangeId ? { ...e, status: 'connected' } : e
      ));
    } catch (error) {
      setExchanges(prev => prev.map(e => 
        e.id === exchangeId ? { ...e, status: 'error' } : e
      ));
    }
  };

  // Execute trade
  const executeTrade = async () => {
    if (!validation.isValid) return;

    setIsExecuting(true);
    
    try {
      // Simulate API call to exchange
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const fee = calculateFee();
      const newOrder: TradeOrder = {
        id: `order_${Date.now()}`,
        exchange: order.exchange,
        symbol: order.symbol,
        side: order.side,
        type: order.type,
        quantity: order.quantity,
        price: order.price,
        status: 'filled',
        filledQuantity: order.quantity,
        averagePrice: order.price || order.total / order.quantity,
        fee,
        feeCurrency: order.symbol.includes('USDT') ? 'BTC' : 'USD',
        timestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setOrders(prev => [newOrder, ...prev]);
      
      // Reset form
      setOrder({
        exchange: 'binance',
        symbol: 'BTCUSDT',
        side: 'buy',
        type: 'limit',
        quantity: 0.01,
        price: 50000,
        total: 0
      });
      
    } catch (error) {
      console.error('Trade execution failed:', error);
      // Add failed order
      const failedOrder: TradeOrder = {
        id: `order_${Date.now()}`,
        exchange: order.exchange,
        symbol: order.symbol,
        side: order.side,
        type: order.type,
        quantity: order.quantity,
        price: order.price,
        status: 'rejected',
        filledQuantity: 0,
        averagePrice: 0,
        fee: 0,
        feeCurrency: order.symbol.includes('USDT') ? 'BTC' : 'USD',
        timestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setOrders(prev => [failedOrder, ...prev]);
    } finally {
      setIsExecuting(false);
    }
  };

  // Cancel order
  const cancelOrder = async (orderId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: 'cancelled', updatedAt: new Date().toISOString() } : o
      ));
    } catch (error) {
      console.error('Failed to cancel order:', error);
    }
  };

  // Get status badge color
  const getStatusColor = (status: TradeOrder['status']) => {
    switch (status) {
      case 'filled': return 'bg-green-500/20 text-green-400';
      case 'partial': return 'bg-yellow-500/20 text-yellow-400';
      case 'pending': return 'bg-blue-500/20 text-blue-400';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400';
      case 'rejected': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  // Get status icon
  const getStatusIcon = (status: TradeOrder['status']) => {
    switch (status) {
      case 'filled': return <CheckCircle className="w-4 h-4" />;
      case 'partial': return <Clock className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trade Execution Module</h1>
          <p className="text-gray-400">Secure trade execution with real-time order tracking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Exchange Connections & Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exchange Connections */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Exchange Connections
                </CardTitle>
                <CardDescription>Connect to supported exchanges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exchanges.map((exchange) => (
                    <div key={exchange.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          exchange.status === 'connected' ? 'bg-green-500' :
                          exchange.status === 'error' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`} />
                        <div>
                          <div className="font-medium">{exchange.name}</div>
                          <div className="text-sm text-gray-400">
                            {exchange.testnet ? 'Testnet Mode' : 'Live Trading'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(exchange.status as any)}>
                          {exchange.status}
                        </Badge>
                        <Button 
                          size="sm" 
                          onClick={() => connectExchange(exchange.id)}
                          disabled={exchange.status === 'connected'}
                        >
                          {exchange.status === 'connected' ? 'Connected' : 'Connect'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Form */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  New Order
                </CardTitle>
                <CardDescription>Execute trades on connected exchanges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Validation Errors & Warnings */}
                  {validation.errors.length > 0 && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-red-400 mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Validation Errors</span>
                      </div>
                      <ul className="text-sm text-red-300 space-y-1">
                        {validation.errors.map((error, index) => (
                          <li key={index}>• {error}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {validation.warnings.length > 0 && (
                    <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-400 mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium">Warnings</span>
                      </div>
                      <ul className="text-sm text-yellow-300 space-y-1">
                        {validation.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Order Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exchange">Exchange</Label>
                      <Select 
                        value={order.exchange} 
                        onValueChange={(value) => setOrder({...order, exchange: value})}
                      >
                        <SelectTrigger className="bg-gray-900 border-gray-700">
                          <SelectValue placeholder="Select exchange" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          {exchanges.map((ex) => (
                            <SelectItem key={ex.id} value={ex.id}>
                              {ex.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="symbol">Symbol</Label>
                      <Select 
                        value={order.symbol} 
                        onValueChange={(value) => setOrder({...order, symbol: value})}
                      >
                        <SelectTrigger className="bg-gray-900 border-gray-700">
                          <SelectValue placeholder="Select symbol" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700">
                          <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                          <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
                          <SelectItem value="SOLUSDT">SOL/USDT</SelectItem>
                          <SelectItem value="XRPUSDT">XRP/USDT</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="side">Side</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={order.side === 'buy' ? 'default' : 'outline'}
                          className={`flex-1 ${order.side === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                          onClick={() => setOrder({...order, side: 'buy'})}
                        >
                          <ArrowUpRight className="w-4 h-4 mr-2" />
                          Buy
                        </Button>
                        <Button
                          type="button"
                          variant={order.side === 'sell' ? 'default' : 'outline'}
                          className={`flex-1 ${order.side === 'sell' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                          onClick={() => setOrder({...order, side: 'sell'})}
                        >
                          <ArrowDownRight className="w-4 h-4 mr-2" />
                          Sell
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Order Type</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={order.type === 'limit' ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={() => setOrder({...order, type: 'limit'})}
                        >
                          Limit
                        </Button>
                        <Button
                          type="button"
                          variant={order.type === 'market' ? 'default' : 'outline'}
                          className="flex-1"
                          onClick={() => setOrder({...order, type: 'market', price: undefined})}
                        >
                          Market
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <div className="relative">
                        <Input
                          id="quantity"
                          type="number"
                          value={order.quantity}
                          onChange={(e) => setOrder({...order, quantity: parseFloat(e.target.value) || 0})}
                          className="bg-gray-900 border-gray-700 pl-10"
                          step="0.001"
                          min="0"
                        />
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <Calculator className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {order.type === 'limit' && (
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (USD)</Label>
                        <div className="relative">
                          <Input
                            id="price"
                            type="number"
                            value={order.price}
                            onChange={(e) => setOrder({...order, price: parseFloat(e.target.value) || 0})}
                            className="bg-gray-900 border-gray-700 pl-10"
                            step="0.01"
                            min="0"
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <DollarSign className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Order Summary */}
                  <div className="p-4 bg-gray-900/50 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Cost</span>
                      <span className="font-medium">${order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Estimated Fee</span>
                      <span className="font-medium">${calculateFee().toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-700">
                      <span className="text-gray-400">Net Cost</span>
                      <span className="font-bold text-lg">
                        ${(order.total + calculateFee()).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Execute Button */}
                  <Button 
                    className="w-full py-6 text-lg font-medium"
                    onClick={executeTrade}
                    disabled={!validation.isValid || isExecuting}
                  >
                    {isExecuting ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Executing Trade...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5 mr-2" />
                        Execute {order.side.toUpperCase()} Order
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order History & Fees */}
          <div className="space-y-6">
            {/* Order History */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Order History
                </CardTitle>
                <CardDescription>Recent trade executions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                  {orders.map((order) => (
                    <div key={order.id} className="p-3 bg-gray-900/50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{order.symbol}</div>
                          <div className="text-sm text-gray-400">
                            {order.exchange.toUpperCase()} • {order.type.toUpperCase()}
                          </div>
                        </div>
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
                          {getStatusIcon(order.status)}
                          {order.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-gray-400">Side</div>
                          <div className={`font-medium ${order.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                            {order.side.toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-400">Quantity</div>
                          <div className="font-medium">{order.quantity}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Avg Price</div>
                          <div className="font-medium">${order.averagePrice.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Fee</div>
                          <div className="font-medium">{order.fee} {order.feeCurrency}</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-700 text-xs text-gray-400 flex justify-between">
                        <span>{new Date(order.timestamp).toLocaleTimeString()}</span>
                        {order.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-6 text-xs"
                            onClick={() => cancelOrder(order.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fee Calculator */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Fee Calculator
                </CardTitle>
                <CardDescription>Exchange trading fees</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fees.map((fee, index) => (
                    <div key={index} className="p-3 bg-gray-900/50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">Fee Structure</div>
                        <Badge className="bg-blue-500/20 text-blue-400">
                          {fee.currency}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <div className="text-gray-400">Maker Fee</div>
                          <div className="font-medium">{(fee.maker * 100).toFixed(3)}%</div>
                        </div>
                        <div>
                          <div className="text-gray-400">Taker Fee</div>
                          <div className="font-medium">{(fee.taker * 100).toFixed(3)}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="p-3 bg-gray-900/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">Example Calculation</div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Trade Amount:</span>
                        <span>$10,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maker Fee (0.10%):</span>
                        <span>$10.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Taker Fee (0.20%):</span>
                        <span>$20.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeExecutionModule;