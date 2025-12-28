'use client';

import React, { useState, useEffect } from 'react';
import BlockchainAnalyticsService from '@/services/blockchain-analytics-service';
import TransactionVolumeChart from '@/components/blockchain/TransactionVolumeChart';
import WhaleTradingTracker from '@/components/blockchain/WhaleTradingTracker';
import NetworkSelector from '@/components/blockchain/NetworkSelector';
import TokenFlowVisualization from '@/components/blockchain/TokenFlowVisualization';

export default function BlockchainAnalyticsPage() {
  const [network, setNetwork] = useState('ethereum');
  const [analyticsData, setAnalyticsData] = useState({
    transactionVolume: [],
    whaleTransactions: [],
    tokenFlows: [],
    onChainMetrics: {
      totalTransactions: 0,
      averageTransactionValue: 0,
      activeAddresses: 0
    }
  });

  const analyticsService = new BlockchainAnalyticsService();

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const data = await analyticsService.getNetworkAnalytics(network);
        setAnalyticsData(data);
      } catch (error) {
        console.error('Failed to fetch blockchain analytics', error);
      }
    };

    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [network]);

  return (
    <div className="container mx-auto p-6 bg-gray-50">
      <div className="mb-6">
        <NetworkSelector 
          selectedNetwork={network} 
          onNetworkChange={setNetwork} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Transaction Volume</h2>
          <TransactionVolumeChart 
            data={analyticsData.transactionVolume} 
          />
        </div>

        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">On-Chain Metrics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-600">Total Transactions</p>
              <h3 className="text-2xl font-bold">
                {analyticsData.onChainMetrics.totalTransactions.toLocaleString()}
              </h3>
            </div>
            <div>
              <p className="text-gray-600">Avg Transaction Value</p>
              <h3 className="text-2xl font-bold">
                ${analyticsData.onChainMetrics.averageTransactionValue.toFixed(2)}
              </h3>
            </div>
            <div>
              <p className="text-gray-600">Active Addresses</p>
              <h3 className="text-2xl font-bold">
                {analyticsData.onChainMetrics.activeAddresses.toLocaleString()}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <WhaleTradingTracker 
          whaleTransactions={analyticsData.whaleTransactions} 
        />
        
        <TokenFlowVisualization 
          tokenFlows={analyticsData.tokenFlows} 
        />
      </div>
    </div>
  );
}`
    },
    {
      "path": "src/services/blockchain-analytics-service.ts",
      "content": `import axios from 'axios';

interface BlockchainAnalyticsParams {
  network: string;
  startDate?: Date;
  endDate?: Date;
}

export default class BlockchainAnalyticsService {
  private apiBase = '/api/blockchain-analytics';

  async getNetworkAnalytics(network: string, params: BlockchainAnalyticsParams = {}) {
    try {
      const response = await axios.get(`${this.apiBase}/network/${network}`, { 
        params: {
          network,
          ...params
        }
      });
      return response.data;
    } catch (error) {
      console.error('Blockchain analytics fetch failed', error);
      return this.getDefaultAnalyticsData();
    }
  }

  async detectWhaleMovements(network: string, thresholdAmount: number) {
    try {
      const response = await axios.get(`${this.apiBase}/whale-movements`, {
        params: { network, thresholdAmount }
      });
      return response.data;
    } catch (error) {
      console.error('Whale movement detection failed', error);
      return [];
    }
  }

  async analyzeSmartContractInteractions(contractAddress: string) {
    try {
      const response = await axios.get(`${this.apiBase}/contract-interactions/${contractAddress}`);
      return response.data;
    } catch (error) {
      console.error('Smart contract interaction analysis failed', error);
      return null;
    }
  }

  private getDefaultAnalyticsData() {
    return {
      transactionVolume: [],
      whaleTransactions: [],
      tokenFlows: [],
      onChainMetrics: {
        totalTransactions: 0,
        averageTransactionValue: 0,
        activeAddresses: 0
      }
    };
  }
}`
    },
    {
      "path": "src/types/blockchain-analytics.ts",
      "content": `export interface TransactionData {
  timestamp: Date;
  volume: number;
  price: number;
}

export interface WhaleTransaction {
  address: string;
  amount: number;
  timestamp: Date;
  transactionHash: string;
}

export interface TokenFlow {
  source: string;
  destination: string;
  amount: number;
  timestamp: Date;
}

export interface OnChainMetrics {
  totalTransactions: number;
  averageTransactionValue: number;
  activeAddresses: number;
}

export type SupportedNetwork = 'ethereum' | 'bitcoin' | 'binance-smart-chain';`
    }
  ],
  "summary": "Advanced Blockchain Transaction Analytics Platform with multi-network support, real-time tracking of transaction volumes, whale movements, and comprehensive on-chain metrics visualization using Next.js, TypeScript, and modern web technologies."
}

Key Features Implemented:
1. Multi-network blockchain analytics
2. Real-time transaction volume tracking
3. Whale transaction monitoring
4. On-chain metrics dashboard
5. Flexible analytics service
6. Comprehensive TypeScript typing

Recommended Next Steps:
- Implement WebSocket for real-time updates
- Add machine learning-based anomaly detection
- Create more granular component visualizations
- Implement advanced filtering and export capabilities

Would you like me to elaborate on any specific aspect of the implementation?