'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AlertCircle, Wifi, WifiOff, RefreshCw, Zap } from 'lucide-react';

interface BinanceWebSocketProps {
  symbol?: string;
  onData?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface WebSocketStatus {
  connected: boolean;
  lastUpdate: Date | null;
  error: string | null;
  reconnectAttempts: number;
  subscribedSymbols: string[];
}

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: number;
}

export default function BinanceWebSocket({ 
  symbol = 'BTCUSDT',
  onData,
  onError 
}: BinanceWebSocketProps) {
  const [status, setStatus] = useState<WebSocketStatus>({
    connected: false,
    lastUpdate: null,
    error: null,
    reconnectAttempts: 0,
    subscribedSymbols: [symbol]
  });
  
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [connectionStats, setConnectionStats] = useState({
    messagesReceived: 0,
    bytesReceived: 0,
    latency: 0
  });
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastPingTimeRef = useRef<number>(0);
  
  // WebSocket URL для Binance
  const getWebSocketUrl = useCallback(() => {
    return `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@ticker`;
  }, [symbol]);
  
  // Подключение к WebSocket
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }
    
    try {
      const wsUrl = getWebSocketUrl();
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log(`Binance WebSocket connected for ${symbol}`);
        setStatus(prev => ({
          ...prev,
          connected: true,
          error: null,
          reconnectAttempts: 0
        }));
        
        // Начинаем пинг
        startPingInterval();
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          setConnectionStats(prev => ({
            ...prev,
            messagesReceived: prev.messagesReceived + 1,
            bytesReceived: prev.bytesReceived + event.data.length
          }));
          
          // Обработка тикера
          if (data.e === '24hrTicker') {
            const marketData: MarketData = {
              symbol: data.s,
              price: parseFloat(data.c),
              change: parseFloat(data.p),
              changePercent: parseFloat(data.P),
              volume: parseFloat(data.v),
              timestamp: data.E
            };
            
            setMarketData(marketData);
            setStatus(prev => ({ ...prev, lastUpdate: new Date() }));
            
            if (onData) {
              onData(marketData);
            }
          }
          
          // Обработка пинга
          if (data.pong) {
            const latency = Date.now() - lastPingTimeRef.current;
            setConnectionStats(prev => ({ ...prev, latency }));
          }
          
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          if (onError) onError(error as Error);
        }
      };
      
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setStatus(prev => ({
          ...prev,
          error: 'Connection error',
          connected: false
        }));
        
        if (onError) onError(new Error('WebSocket connection error'));
      };
      
      ws.onclose = (event) => {
        console.log(`WebSocket closed: ${event.code} ${event.reason}`);
        setStatus(prev => ({
          ...prev,
          connected: false,
          error: `Connection closed: ${event.reason || 'Unknown reason'}`
        }));
        
        // Очистка интервалов
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }
        
        // Автоматическое переподключение
        scheduleReconnect();
      };
      
      wsRef.current = ws;
      
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setStatus(prev => ({
        ...prev,
        error: 'Failed to establish connection',
        connected: false
      }));
      
      scheduleReconnect();
    }
  }, [symbol, getWebSocketUrl, onData, onError]);
  
  // Планирование переподключения
  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    const attempts = status.reconnectAttempts;
    const delay = Math.min(1000 * Math.pow(2, attempts), 30000); // Экспоненциальная задержка
    
    reconnectTimeoutRef.current = setTimeout(() => {
      setStatus(prev => ({
        ...prev,
        reconnectAttempts: prev.reconnectAttempts + 1
      }));
      connectWebSocket();
    }, delay);
  }, [status.reconnectAttempts, connectWebSocket]);
  
  // Интервал пинга
  const startPingInterval = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
    }
    
    pingIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        lastPingTimeRef.current = Date.now();
        wsRef.current.send(JSON.stringify({ ping: Date.now() }));
      }
    }, 30000); // Пинг каждые 30 секунд
  }, []);
  
  // Ручное переподключение
  const handleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    if (wsRef.current) {
      wsRef.current.close();
    }
    
    setStatus(prev => ({ ...prev, reconnectAttempts: 0 }));
    connectWebSocket();
  }, [connectWebSocket]);
  
  // Подписка на новый символ
  const subscribeToSymbol = useCallback((newSymbol: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      // В реальном приложении здесь была бы логика подписки на новый символ
      console.log(`Subscribing to ${newSymbol}`);
      setStatus(prev => ({
        ...prev,
        subscribedSymbols: [...new Set([...prev.subscribedSymbols, newSymbol])]
      }));
    }
  }, []);
  
  // Инициализация
  useEffect(() => {
    connectWebSocket();
    
    return () => {
      // Очистка при размонтировании
      if (wsRef.current) {
        wsRef.current.close();
      }
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
      }
    };
  }, [connectWebSocket]);
  
  // Форматирование времени
  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString();
  };
  
  // Форматирование числа
  const formatNumber = (num: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Zap className="h-6 w-6 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-200">
            Binance Real-time Data
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full ${status.connected ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
            {status.connected ? (
              <>
                <Wifi className="h-4 w-4" />
                <span className="text-sm font-medium">Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4" />
                <span className="text-sm font-medium">Disconnected</span>
              </>
            )}
          </div>
          
          <button
            onClick={handleReconnect}
            className="flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm font-medium">Reconnect</span>
          </button>
        </div>
      </div>
      
      {/* Статус подключения */}
      <div className="mb-6 p-3 bg-gray-900/50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <div className="text-xs text-gray-400 mb-1">Symbol</div>
            <div className="font-medium text-gray-200">{symbol}</div>
          </div>
          
          <div>
            <div className="text-xs text-gray-400 mb-1">Last Update</div>
            <div className="font-medium text-gray-200">{formatTime(status.lastUpdate)}</div>
          </div>
          
          <div>
            <div className="text-xs text-gray-400 mb-1">Reconnect Attempts</div>
            <div className="font-medium text-gray-200">{status.reconnectAttempts}</div>
          </div>
          
          <div>
            <div className="text-xs text-gray-400 mb-1">Latency</div>
            <div className={`font-medium ${connectionStats.latency < 100 ? 'text-green-400' : connectionStats.latency < 300 ? 'text-yellow-400' : 'text-red-400'}`}>
              {connectionStats.latency}ms
            </div>
          </div>
        </div>
        
        {status.error && (
          <div className="mt-3 flex items-center space-x-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{status.error}</span>
          </div>
        )}
      </div>
      
      {/* Рыночные данные */}
      {marketData && (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Price</div>
              <div className="text-2xl font-bold text-gray-100">
                ${formatNumber(marketData.price, marketData.price > 1000 ? 0 : 2)}
              </div>
            </div>
            
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">24h Change</div>
              <div className={`text-xl font-bold ${marketData.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {marketData.change >= 0 ? '+' : ''}{formatNumber(marketData.change)} ({formatNumber(marketData.changePercent)}%)
              </div>
            </div>
            
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">24h Volume</div>
              <div className="text-xl font-bold text-gray-100">
                {formatNumber(marketData.volume)}
              </div>
            </div>
            
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">Messages Received</div>
              <div className="text-xl font-bold text-gray-100">
                {connectionStats.messagesReceived.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Статистика подключения */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Connection Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="text-sm">
            <div className="text-gray-500">Bytes Received</div>
            <div className="font-medium text-gray-300">
              {(connectionStats.bytesReceived / 1024).toFixed(2)} KB
            </div>
          </div>
          
          <div className="text-sm">
            <div className="text-gray-500">Subscribed Symbols</div>
            <div className="font-medium text-gray-300">
              {status.subscribedSymbols.length}
            </div>
          </div>
          
          <div className="text-sm">
            <div className="text-gray-500">WebSocket State</div>
            <div className="font-medium text-gray-300">
              {wsRef.current ? wsRef.current.readyState : 'Not initialized'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Быстрая подписка на символы */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <h3 className="text-sm font-medium text-gray-400 mb-2">Quick Subscribe</h3>
        <div className="flex flex-wrap gap-2">
          {['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'ADAUSDT'].map((sym) => (
            <button
              key={sym}
              onClick={() => subscribeToSymbol(sym)}
              className={`px-3 py-1 text-sm rounded-full transition-colors duration-200 ${
                status.subscribedSymbols.includes(sym)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
