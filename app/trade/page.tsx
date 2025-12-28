'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTradeStore } from '@/stores/tradeStore';
import { ExchangeAPI } from '@/lib/exchange-api';
import OrderExecutionPanel from '@/components/trade/OrderExecutionPanel';
import TradeHistoryTable from '@/components/trade/TradeHistoryTable';
import RealTimeMarketData from '@/components/trade/RealTimeMarketData';
import RiskManagementWidget from '@/components/trade/RiskManagementWidget';
import PositionMonitor from '@/components/trade/PositionMonitor';
import ExchangeConnectionStatus from '@/components/trade/ExchangeConnectionStatus';
import InstrumentSelector from '@/components/trade/InstrumentSelector';
import OrderBook from '@/components/trade/OrderBook';
import { OrderType, OrderSide, TimeInForce, OrderStatus, Trade, Position, Exchange } from '@/types/trade';
import { toast } from 'sonner';

type MarketData = {
  symbol: string;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  change: number;
  changePercent: number;
  timestamp: string;
};

type OrderFormData = {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  quantity: number;
  price?: number;
  stopPrice?: number;
  timeInForce?: TimeInForce;
};

export default function TradeExecutionPage() {
  const {
    selectedExchange,
    selectedSymbol,
    orders,
    trades,
    positions,
    connectionStatus,
    addOrder,
    updateOrder,
    addTrade,
    updatePosition,
    setConnectionStatus,
    setMarketData,
    setSelectedSymbol,
    setSelectedExchange
  } = useTradeStore();
  
  const [isConnecting, setIsConnecting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [localMarketData, setLocalMarketData] = useState<MarketData | null>(null);
  const [isExecutingOrder, setIsExecutingOrder] = useState(false);
  
  // Available exchanges
  const availableExchanges: Exchange[] = [
    { id: 'moex', name: 'MOEX', type: 'stock', status: 'available' },
    { id: 'tinkoff', name: 'Tinkoff', type: 'broker', status: 'available' },
    { id: 'binance', name: 'Binance', type: 'crypto', status: 'available' },
    { id: 'bybit', name: 'Bybit', type: 'crypto', status: 'available' }
  ];
  
  // Available symbols for selected exchange
  const getAvailableSymbols = useCallback(() => {
    if (!selectedExchange) return [];
    
    const symbolsByExchange: Record<string, string[]> = {
      'moex': ['SBER', 'GAZP', 'LKOH', 'YNDX', 'VTBR'],
      'tinkoff': ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN'],
      'binance': ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT'],
      'bybit': ['BTCUSDT', 'ETHUSDT', 'XRPUSDT', 'DOGEUSDT', 'LINKUSDT']
    };
    
    return symbolsByExchange[selectedExchange] || [];
  }, [selectedExchange]);
  
  // Initialize exchange connection
  const connectToExchange = useCallback(async () => {
    if (!selectedExchange) {
      setApiError('Please select an exchange first');
      toast.error('Select an exchange first');
      return;
    }
    
    setIsConnecting(true);
    setApiError(null);
    
    try {
      await ExchangeAPI.connect(selectedExchange);
      setConnectionStatus('connected');
      toast.success(`Connected to ${selectedExchange}`);
      
      // Subscribe to market data for selected symbol
      if (selectedSymbol) {
        await ExchangeAPI.subscribeToMarketData(selectedSymbol, (data: MarketData) => {
          setMarketData(data);
          setLocalMarketData(data);
        });
      }
      
    } catch (error: any) {
      console.error('Connection failed:', error);
      const errorMsg = `Failed to connect to ${selectedExchange}: ${error.message}`;
      setApiError(errorMsg);
      setConnectionStatus('disconnected');
      toast.error(errorMsg);
    } finally {
      setIsConnecting(false);
    }
  }, [selectedExchange, selectedSymbol, setConnectionStatus, setMarketData]);
  
  // Disconnect from exchange
  const disconnectFromExchange = useCallback(async () => {
    try {
      await ExchangeAPI.disconnect();
      setConnectionStatus('disconnected');
      setLocalMarketData(null);
      toast.info('Disconnected from exchange');
    } catch (error: any) {
      console.error('Disconnection failed:', error);
      const errorMsg = `Failed to disconnect: ${error.message}`;
      setApiError(errorMsg);
      toast.error(errorMsg);
    }
  }, [setConnectionStatus]);
  
  // Handle exchange change
  const handleExchangeChange = useCallback((exchangeId: string) => {
    setSelectedExchange(exchangeId);
    
    // Reset symbol when exchange changes
    setSelectedSymbol('');
    setLocalMarketData(null);
    
    // Disconnect if currently connected
    if (connectionStatus === 'connected') {
      disconnectFromExchange();
    }
  }, [connectionStatus, disconnectFromExchange, setSelectedExchange, setSelectedSymbol]);
  
  // Handle symbol change
  const handleSymbolChange = useCallback(async (symbol: string) => {
    setSelectedSymbol(symbol);
    
    if (connectionStatus === 'connected') {
      try {
        // Unsubscribe from previous symbol
        if (selectedSymbol) {
          await ExchangeAPI.unsubscribeFromMarketData(selectedSymbol);
        }
        
        // Subscribe to new symbol
        await ExchangeAPI.subscribeToMarketData(symbol, (data: MarketData) => {
          setMarketData(data);
          setLocalMarketData(data);
        });
        
        toast.success(`Switched to ${symbol}`);
      } catch (error: any) {
        console.error('Symbol change failed:', error);
        const errorMsg = `Failed to change symbol: ${error.message}`;
        setApiError(errorMsg);
        toast.error(errorMsg);
      }
    }
  }, [connectionStatus, selectedSymbol, setMarketData, setSelectedSymbol]);
  
  // Handle order execution
  const handleOrderSubmit = useCallback(async (orderData: OrderFormData) => {
    if (connectionStatus !== 'connected') {
      const errorMsg = 'Not connected to exchange';
      setApiError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    if (!selectedExchange) {
      const errorMsg = 'No exchange selected';
      setApiError(errorMsg);
      toast.error(errorMsg);
      return;
    }
    
    setIsExecutingOrder(true);
    setApiError(null);
    
    try {
      // Create pending order
      const pendingOrder = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...orderData,
        status: 'pending' as OrderStatus,
        timestamp: new Date().toISOString(),
        exchange: selectedExchange,
        filledQuantity: 0,
        remainingQuantity: orderData.quantity,
        avgPrice: 0,
        fees: 0,
        lastUpdate: new Date().toISOString()
      };
      
      addOrder(pendingOrder);
      toast.info('Order submitted...');
      
      // Execute order via exchange API
      const result = await ExchangeAPI.executeOrder({
        ...orderData,
        exchange: selectedExchange
      });
      
      // Update order status
      updateOrder(pendingOrder.id, {
        status: result.status,
        orderId: result.orderId,
        filledQuantity: result.filledQuantity,
        remainingQuantity: result.remainingQuantity,
        avgPrice: result.avgPrice,
        fees: result.fees,
        lastUpdate: new Date().toISOString()
      });
      
      // If order was filled, add to trade history
      if (result.filledQuantity > 0) {
        const trade: Trade = {
          id: `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          orderId: pendingOrder.id,
          exchangeOrderId: result.orderId,
          symbol: orderData.symbol,
          side: orderData.side,
          quantity: result.filledQuantity,
          price: result.avgPrice,
          fees: result.fees,
          timestamp: new Date().toISOString(),
          exchange: selectedExchange
        };
        
        addTrade(trade);
        
        // Update position
        const positionUpdate: Partial<Position> = {
          symbol: orderData.symbol,
          side: orderData.side,
          quantity: result.filledQuantity,
          avgEntryPrice: result.avgPrice,
          unrealizedPnl: 0,
          realizedPnl: 0,
          lastUpdate: new Date().toISOString()
        };
        
        updatePosition(positionUpdate);
        
        toast.success(`Order executed: ${result.filledQuantity} @ ${result.avgPrice}`);
      } else if (result.status === 'open') {
        toast.info('Order placed successfully');
      }
      
    } catch (error: any) {
      console.error('Order execution failed:', error);
      const errorMsg = `Order failed: ${error.message}`;
      setApiError(errorMsg);
      toast.error(errorMsg);
      
      // Update order status to failed
      const failedOrderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      updateOrder(failedOrderId, {
        status: 'failed' as OrderStatus,
        error: error.message,
        lastUpdate: new Date().toISOString()
      });
    } finally {
      setIsExecutingOrder(false);
    }
  }, [connectionStatus, selectedExchange, addOrder, updateOrder, addTrade, updatePosition]);
  
  // Handle position close
  const handleClosePosition = useCallback(async (symbol: string, side: OrderSide, quantity: number) => {
    if (connectionStatus !== 'connected') {
      toast.error('Not connected to exchange');
      return;
    }
    
    if (!selectedExchange) {
      toast.error('No exchange selected');
      return;
    }
    
    setIsExecutingOrder(true);
    
    try {
      // Determine opposite side for closing
      const closeSide: OrderSide = side === 'buy' ? 'sell' : 'buy';
      
      // Get current market price
      const currentPrice = localMarketData?.last || 0;
      
      // Create market order to close position
      const orderData: OrderFormData = {
        symbol,
        side: closeSide,
        type: 'market',
        quantity,
        timeInForce: 'IOC'
      };
      
      // Execute closing order
      const result = await ExchangeAPI.executeOrder({
        ...orderData,
        exchange: selectedExchange
      });
      
      if (result.filledQuantity > 0) {
        // Add trade record
        const trade: Trade = {
          id: `trade_close_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          orderId: `close_${Date.now()}`,
          exchangeOrderId: result.orderId,
          symbol,
          side: closeSide,
          quantity: result.filledQuantity,
          price: result.avgPrice,
          fees: result.fees,
          timestamp: new Date().toISOString(),
          exchange: selectedExchange
        };
        
        addTrade(trade);
        
        // Update position (reduce quantity)
        updatePosition({
          symbol,
          side,
          quantity: -result.filledQuantity, // Negative to reduce position
          avgEntryPrice: 0,
          unrealizedPnl: 0,
          realizedPnl: (result.avgPrice - currentPrice) * result.filledQuantity * (side === 'buy' ? 1 : -1),
          lastUpdate: new Date().toISOString()
        });
        
        toast.success(`Position closed: ${result.filledQuantity} @ ${result.avgPrice}`);
      }
      
    } catch (error: any) {
      console.error('Position close failed:', error);
      toast.error(`Failed to close position: ${error.message}`);
    } finally {
      setIsExecutingOrder(false);
    }
  }, [connectionStatus, selectedExchange, localMarketData, addTrade, updatePosition]);
  
  // Auto-connect when exchange and symbol are selected
  useEffect(() => {
    if (selectedExchange && selectedSymbol && connectionStatus === 'disconnected') {
      const timer = setTimeout(() => {
        connectToExchange();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedExchange, selectedSymbol, connectionStatus, connectToExchange]);
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Trade Execution Module</h1>
          <p className="text-gray-400">Execute trades on multiple exchanges with real-time market data</p>
        </header>
        
        {/* Error Display */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-300">{apiError}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Trading Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Exchange and Instrument Selection */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-2">Exchange & Instrument</h2>
                  <p className="text-gray-400 text-sm">Select exchange and trading instrument</p>
                </div>
                <ExchangeConnectionStatus 
                  status={connectionStatus}
                  isConnecting={isConnecting}
                  onConnect={connectToExchange}
                  onDisconnect={disconnectFromExchange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InstrumentSelector
                  exchanges={availableExchanges}
                  selectedExchange={selectedExchange}
                  onExchangeChange={handleExchangeChange}
                  availableSymbols={getAvailableSymbols()}
                  selectedSymbol={selectedSymbol}
                  onSymbolChange={handleSymbolChange}
                  disabled={isConnecting || connectionStatus === 'connected'}
                />
                
                <RealTimeMarketData 
                  marketData={localMarketData}
                  isLoading={isConnecting}
                />
              </div>
            </div>
            
            {/* Order Execution Panel */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Order Execution</h2>
              <OrderExecutionPanel
                selectedSymbol={selectedSymbol}
                marketData={localMarketData}
                onSubmit={handleOrderSubmit}
                isSubmitting={isExecutingOrder}
                isConnected={connectionStatus === 'connected'}
              />
            </div>
            
            {/* Order Book */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Order Book</h2>
              <OrderBook 
                symbol={selectedSymbol}
                exchange={selectedExchange}
                isConnected={connectionStatus === 'connected'}
              />
            </div>
          </div>
          
          {/* Right Column - Risk Management & Positions */}
          <div className="space-y-6">
            {/* Risk Management */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Risk Management</h2>
              <RiskManagementWidget
                positions={positions}
                marketData={localMarketData}
                onClosePosition={handleClosePosition}
                isConnected={connectionStatus === 'connected'}
              />
            </div>
            
            {/* Position Monitor */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Open Positions</h2>
              <PositionMonitor 
                positions={positions}
                marketData={localMarketData}
                onClosePosition={handleClosePosition}
                isConnected={connectionStatus === 'connected'}
              />
            </div>
            
            {/* Recent Trades */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Recent Trades</h2>
              <TradeHistoryTable 
                trades={trades.slice(0, 5)}
                isLoading={false}
              />
            </div>
          </div>
        </div>
        
        {/* Connection Status Footer */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-400">
                {connectionStatus === 'connected' ? 'Connected' : 
                 connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected'}
              </span>
            </div>
            <div className="text-sm text-gray-500">
              {selectedExchange && (
                <span>Exchange: <span className="text-gray-300">{selectedExchange.toUpperCase()}</span></span>
              )}
              {selectedSymbol && (
                <span className="ml-4">Symbol: <span className="text-gray-300">{selectedSymbol}</span></span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
