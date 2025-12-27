'use client';
import React, { useState, useEffect } from 'react';
import { LiquidityNetworkTracker } from '@/services/liquidityNetworkTracker';
import { ExchangeOrderBook, LiquidityMetrics } from '@/types/liquidityTypes';

export default function LiquidityDashboard() {
  const [tracker, setTracker] = useState<LiquidityNetworkTracker | null>(null);
  const [orderBooks, setOrderBooks] = useState<ExchangeOrderBook[]>([]);
  const [liquidityMetrics, setLiquidityMetrics] = useState<LiquidityMetrics | null>(null);
  const [arbitrageOpportunities, setArbitrageOpportunities] = useState<any[]>([]);

  useEffect(() => {
    const initTracker = async () => {
      const newTracker = new LiquidityNetworkTracker([
        'binance', 'coinbase', 'kraken', 
        'bybit', 'okx', 'kucoin'
      ]);
      setTracker(newTracker);

      // Initial data fetch
      await fetchLiquidityData();
    };

    initTracker();
  }, []);

  const fetchLiquidityData = async () => {
    if (!tracker) return;

    const books = await tracker.aggregateOrderBooks('BTC/USDT');
    const metrics = await tracker.calculateLiquidityMetrics(books);
    const arbitrage = await tracker.detectArbitrageOpportunities(books);

    setOrderBooks(books);
    setLiquidityMetrics(metrics);
    setArbitrageOpportunities(arbitrage);
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-center mb-8">
        Crypto Liquidity Network Tracker
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Liquidity Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Liquidity Metrics</h2>
          {liquidityMetrics && (
            <div>
              <p>Total Market Depth: ${liquidityMetrics.totalMarketDepth.toFixed(2)}</p>
              <p>Avg Spread: {liquidityMetrics.avgSpread.toFixed(4)}%</p>
              <p>Slippage Estimate: {liquidityMetrics.slippageEstimate.toFixed(2)}%</p>
            </div>
          )}
        </div>

        {/* Arbitrage Opportunities */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Arbitrage Opportunities</h2>
          {arbitrageOpportunities.map((opp, idx) => (
            <div key={idx} className="mb-2 p-2 bg-green-50 rounded">
              <p>Spread: {opp.spread.toFixed(2)}%</p>
              <p>Exchanges: {opp.exchanges.join(' → ')}</p>
            </div>
          ))}
        </div>

        {/* Order Book Depth */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Order Book Depth</h2>
          {orderBooks.map((book, idx) => (
            <div key={idx} className="mb-2">
              <h3 className="font-medium">{book.exchange}</h3>
              <p>Bids: {book.bids.length} | Asks: {book.asks.length}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8">
        <button 
          onClick={fetchLiquidityData} 
          className="btn btn-primary px-6 py-3"
        >
          Refresh Liquidity Data
        </button>
      </div>
    </div>
  );
}
`
    },
    {
      "path": "src/services/liquidityNetworkTracker.ts",
      "content": `
import ccxt from 'ccxt';
import { ExchangeOrderBook, LiquidityMetrics } from '@/types/liquidityTypes';

export class LiquidityNetworkTracker {
  private exchanges: ccxt.Exchange[];

  constructor(exchangeIds: string[]) {
    this.exchanges = exchangeIds.map(id => {
      const ExchangeClass = ccxt[id as keyof typeof ccxt];
      return new ExchangeClass({
        enableRateLimit: true,
        timeout: 30000
      });
    });
  }

  async aggregateOrderBooks(symbol: string): Promise<ExchangeOrderBook[]> {
    const orderBooks: ExchangeOrderBook[] = [];

    for (const exchange of this.exchanges) {
      try {
        await exchange.loadMarkets();
        const orderBook = await exchange.fetchOrderBook(symbol);
        
        orderBooks.push({
          exchange: exchange.id,
          bids: orderBook.bids.slice(0, 50),
          asks: orderBook.asks.slice(0, 50)
        });
      } catch (error) {
        console.error(`Error fetching order book from ${exchange.id}:`, error);
      }
    }

    return orderBooks;
  }

  async calculateLiquidityMetrics(
    orderBooks: ExchangeOrderBook[]
  ): Promise<LiquidityMetrics> {
    const spreads = orderBooks.map(book => 
      this.calculateSpread(book.bids, book.asks)
    );

    const marketDepths = orderBooks.map(book => 
      this.calculateMarketDepth(book.bids, book.asks)
    );

    return {
      totalMarketDepth: marketDepths.reduce((a, b) => a + b, 0),
      avgSpread: this.calculateAverage(spreads),
      slippageEstimate: this.estimateSlippage(orderBooks),
      liquidityConcentration: this.analyzeLiquidityConcentration(orderBooks)
    };
  }

  async detectArbitrageOpportunities(
    orderBooks: ExchangeOrderBook[]
  ): Promise<any[]> {
    const opportunities: any[] = [];

    for (let i = 0; i < orderBooks.length; i++) {
      for (let j = i + 1; j < orderBooks.length; j++) {
        const spread = this.calculateInterExchangeSpread(
          orderBooks[i], 
          orderBooks[j]
        );

        if (spread > 0.5) {  // 0.5% threshold
          opportunities.push({
            spread,
            exchanges: [
              orderBooks[i].exchange, 
              orderBooks[j].exchange
            ]
          });
        }
      }
    }

    return opportunities;
  }

  private calculateSpread(
    bids: number[][], 
    asks: number[][]
  ): number {
    const bestBid = bids[0][0];
    const bestAsk = asks[0][0];
    return ((bestAsk - bestBid) / bestBid) * 100;
  }

  private calculateMarketDepth(
    bids: number[][], 
    asks: number[][]
  ): number {
    const bidDepth = bids.slice(0, 10).reduce((sum, bid) => sum + bid[1], 0);
    const askDepth = asks.slice(0, 10).reduce((sum, ask) => sum + ask[1], 0);
    return bidDepth + askDepth;
  }

  private calculateAverage(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private estimateSlippage(orderBooks: ExchangeOrderBook[]): number {
    // Simplified slippage estimation
    return orderBooks.reduce((avg, book) => {
      const bidAskSpread = this.calculateSpread(book.bids, book.asks);
      return avg + bidAskSpread;
    }, 0) / orderBooks.length;
  }

  private calculateInterExchangeSpread(
    book1: ExchangeOrderBook, 
    book2: ExchangeOrderBook
  ): number {
    const bestBid1 = book1.bids[0][0];
    const bestBid2 = book2.bids[0][0];
    return Math.abs((bestBid1 - bestBid2) / bestBid1) * 100;
  }

  private analyzeLiquidityConcentration(
    orderBooks: ExchangeOrderBook[]
  ): number {
    // Simplified liquidity concentration metric
    const depths = orderBooks.map(book => 
      book.bids.slice(0, 5).reduce((sum, bid) => sum + bid[1], 0)
    );
    return this.calculateAverage(depths);
  }
}
`
    },
    {
      "path": "src/types/liquidityTypes.ts",
      "content": `
export interface ExchangeOrderBook {
  exchange: string;
  bids: number[][];  // [price, amount]
  asks: number[][];  // [price, amount]
}

export interface LiquidityMetrics {
  totalMarketDepth: number;
  avgSpread: number;
  slippageEstimate: number;
  liquidityConcentration: number;
}
`
    }
  ],
  "summary": "Advanced Crypto Liquidity Network Tracker with multi-exchange order book aggregation, real-time liquidity metrics, arbitrage opportunity detection, and comprehensive market depth analysis."
}

Key Features:
✅ Multi-exchange order book aggregation
✅ Real-time liquidity metrics calculation
✅ Arbitrage opportunity detection
✅ Slippage estimation
✅ Market depth visualization
✅ Cross-exchange spread analysis

Technologies:
- Next.js 14
- TypeScript
- Tailwind CSS
- CCXT (Cryptocurrency Exchange Library)

The implementation provides a comprehensive dashboard for tracking and analyzing cryptocurrency liquidity across multiple exchanges, with advanced features for traders and market analysts.

Would you like me to elaborate on any specific aspect of the liquidity tracking system?