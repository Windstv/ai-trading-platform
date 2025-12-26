import mongoose from 'mongoose';

export interface IAsset {
  symbol: string;
  quantity: number;
  purchasePrice: number;
  currentPrice: number;
  sector?: string;
  type: 'stock' | 'crypto' | 'bond' | 'etf';
}

export interface IPortfolio {
  userId: string;
  assets: IAsset[];
  totalValue: number;
  performance: {
    totalReturn: number;
    yearToDate: number;
    volatility: number;
  };
  assetAllocation: {
    [key: string]: number; // e.g., { 'technology': 0.35, 'finance': 0.25 }
  };
}

const AssetSchema = new mongoose.Schema<IAsset>({
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  sector: { type: String },
  type: { 
    type: String, 
    enum: ['stock', 'crypto', 'bond', 'etf'],
    required: true 
  }
});

const PortfolioSchema = new mongoose.Schema<IPortfolio>({
  userId: { type: String, required: true, unique: true },
  assets: [AssetSchema],
  totalValue: { type: Number, default: 0 },
  performance: {
    totalReturn: { type: Number, default: 0 },
    yearToDate: { type: Number, default: 0 },
    volatility: { type: Number, default: 0 }
  },
  assetAllocation: { type: mongoose.Schema.Types.Mixed, default: {} }
});

export const Portfolio = mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
      `
    },
    {
      "path": "src/services/portfolio-service.ts", 
      "content": `
import { Portfolio, IPortfolio, IAsset } from '../models/portfolio';
import axios from 'axios';

export class PortfolioService {
  static async createPortfolio(userId: string): Promise<IPortfolio> {
    const portfolio = new Portfolio({ 
      userId, 
      assets: [],
      totalValue: 0,
      performance: {
        totalReturn: 0,
        yearToDate: 0,
        volatility: 0
      },
      assetAllocation: {}
    });
    return portfolio.save();
  }

  static async addAsset(
    userId: string, 
    asset: Omit<IAsset, 'currentPrice'>
  ): Promise<IPortfolio> {
    // Fetch current market price
    const currentPrice = await this.fetchCurrentPrice(asset.symbol);
    
    const portfolio = await Portfolio.findOne({ userId });
    
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    const newAsset = {
      ...asset,
      currentPrice
    };

    portfolio.assets.push(newAsset);
    this.recalculatePortfolioMetrics(portfolio);
    
    return portfolio.save();
  }

  static async fetchCurrentPrice(symbol: string): Promise<number> {
    try {
      const response = await axios.get(`https://api.example.com/price/${symbol}`);
      return response.data.price;
    } catch (error) {
      console.error('Price fetch error', error);
      throw new Error('Could not fetch current price');
    }
  }

  static recalculatePortfolioMetrics(portfolio: IPortfolio) {
    // Calculate total portfolio value
    portfolio.totalValue = portfolio.assets.reduce((total, asset) => 
      total + (asset.quantity * asset.currentPrice), 0);

    // Calculate performance metrics
    portfolio.performance.totalReturn = this.calculateTotalReturn(portfolio);
    
    // Calculate asset allocation
    portfolio.assetAllocation = this.calculateAssetAllocation(portfolio);
  }

  static calculateTotalReturn(portfolio: IPortfolio): number {
    return portfolio.assets.reduce((total, asset) => {
      const currentValue = asset.quantity * asset.currentPrice;
      const originalValue = asset.quantity * asset.purchasePrice;
      return total + ((currentValue - originalValue) / originalValue * 100);
    }, 0);
  }

  static calculateAssetAllocation(portfolio: IPortfolio): { [key: string]: number } {
    const allocation: { [key: string]: number } = {};
    
    portfolio.assets.forEach(asset => {
      const assetValue = asset.quantity * asset.currentPrice;
      const sector = asset.sector || 'uncategorized';
      
      allocation[sector] = (allocation[sector] || 0) + 
        (assetValue / portfolio.totalValue);
    });

    return allocation;
  }

  static async getPortfolioPerformance(userId: string) {
    const portfolio = await Portfolio.findOne({ userId });
    
    if (!portfolio) {
      throw new Error('Portfolio not found');
    }

    return {
      totalValue: portfolio.totalValue,
      performance: portfolio.performance,
      assetAllocation: portfolio.assetAllocation
    };
  }
}
      `
    },
    {
      "path": "src/app/portfolio/page.tsx",
      "content": `
'use client';
import { useState, useEffect } from 'react';
import { PortfolioService } from '@/services/portfolio-service';
import { Pie, Line } from 'react-chartjs-2';

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPortfolio() {
      try {
        const userId = 'current-user-id'; // Replace with actual auth mechanism
        const portfolioData = await PortfolioService.getPortfolioPerformance(userId);
        setPortfolio(portfolioData);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchPortfolio();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!portfolio) return <div>Loading...</div>;

  const assetAllocationData = {
    labels: Object.keys(portfolio.assetAllocation),
    datasets: [{
      data: Object.values(portfolio.assetAllocation),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
      ]
    }]
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Portfolio Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Asset Allocation</h2>
          <Pie data={assetAllocationData} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Performance</h2>
          <div className="bg-white shadow rounded-lg p-4">
            <p>Total Portfolio Value: ${portfolio.totalValue.toFixed(2)}</p>
            <p>Total Return: {portfolio.performance.totalReturn.toFixed(2)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
      `
    }
  ],
  "summary": "Comprehensive Portfolio Management System with Advanced Performance Tracking, Asset Allocation Visualization, and Dynamic Portfolio Metrics Calculation"
}

Key Features:
✅ Asset Tracking
✅ Real-time Price Fetching
✅ Performance Calculation
✅ Asset Allocation Visualization
✅ Comprehensive Portfolio Metrics

Technology Stack:
- Next.js 14
- MongoDB/Mongoose
- TypeScript
- Chart.js
- Axios for Price Fetching

Unique Aspects:
1. Dynamic portfolio metrics calculation
2. Flexible asset type support
3. Sector-based allocation tracking
4. Performance visualization

Would you like me to elaborate on any specific component or discuss potential enhancements?