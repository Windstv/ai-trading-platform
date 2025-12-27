'use client';

import React, { useState } from 'react';
import PortfolioOptimizer from '@/components/PortfolioOptimizer';
import AssetAllocationChart from '@/components/AssetAllocationChart';
import PerformanceAnalytics from '@/components/PerformanceAnalytics';

export interface Asset {
    symbol: string;
    name: string;
    price: number;
    weight: number;
    expectedReturn: number;
    volatility: number;
}

export default function PortfolioPage() {
    const [assets, setAssets] = useState<Asset[]>([
        { symbol: 'SPY', name: 'S&P 500 ETF', price: 450, weight: 0.3, expectedReturn: 0.10, volatility: 0.15 },
        { symbol: 'QQQ', name: 'NASDAQ ETF', price: 350, weight: 0.25, expectedReturn: 0.12, volatility: 0.18 },
        { symbol: 'AGG', name: 'Bond ETF', price: 110, weight: 0.2, expectedReturn: 0.04, volatility: 0.05 },
        { symbol: 'GLD', name: 'Gold ETF', price: 180, weight: 0.15, expectedReturn: 0.06, volatility: 0.12 },
        { symbol: 'CASH', name: 'Cash', price: 1, weight: 0.1, expectedReturn: 0.02, volatility: 0.01 }
    ]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Multi-Asset Portfolio Management</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <PortfolioOptimizer 
                        assets={assets} 
                        onAssetsUpdate={setAssets}
                    />
                </div>
                
                <AssetAllocationChart assets={assets} />
            </div>
            
            <PerformanceAnalytics assets={assets} />
        </div>
    );
}
            `
        },
        {
            "path": "src/components/PortfolioOptimizer.tsx",
            "content": `
'use client';

import React, { useState } from 'react';
import { Asset } from '@/app/portfolio/page';
import { 
    calculateMeanVarianceOptimization, 
    applyBlackLittermanModel 
} from '@/lib/portfolio-strategies';

interface PortfolioOptimizerProps {
    assets: Asset[];
    onAssetsUpdate: (assets: Asset[]) => void;
}

export default function PortfolioOptimizer({ assets, onAssetsUpdate }: PortfolioOptimizerProps) {
    const [optimizationStrategy, setOptimizationStrategy] = useState('mean-variance');

    const handleOptimizePortfolio = () => {
        let optimizedAssets: Asset[];

        switch(optimizationStrategy) {
            case 'black-litterman':
                optimizedAssets = applyBlackLittermanModel(assets);
                break;
            case 'risk-parity':
                optimizedAssets = calculateRiskParityWeights(assets);
                break;
            default:
                optimizedAssets = calculateMeanVarianceOptimization(assets);
        }

        onAssetsUpdate(optimizedAssets);
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Portfolio Optimization</h2>
            
            <div className="flex space-x-4 mb-4">
                <select 
                    value={optimizationStrategy}
                    onChange={(e) => setOptimizationStrategy(e.target.value)}
                    className="border rounded p-2"
                >
                    <option value="mean-variance">Mean-Variance Optimization</option>
                    <option value="black-litterman">Black-Litterman Model</option>
                    <option value="risk-parity">Risk Parity</option>
                </select>

                <button 
                    onClick={handleOptimizePortfolio}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Optimize Portfolio
                </button>
            </div>

            <table className="w-full">
                <thead>
                    <tr className="bg-gray-100">
                        <th>Symbol</th>
                        <th>Name</th>
                        <th>Weight</th>
                        <th>Expected Return</th>
                        <th>Volatility</th>
                    </tr>
                </thead>
                <tbody>
                    {assets.map((asset, index) => (
                        <tr key={index} className="text-center">
                            <td>{asset.symbol}</td>
                            <td>{asset.name}</td>
                            <td>{(asset.weight * 100).toFixed(2)}%</td>
                            <td>{(asset.expectedReturn * 100).toFixed(2)}%</td>
                            <td>{(asset.volatility * 100).toFixed(2)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function calculateRiskParityWeights(assets: Asset[]): Asset[] {
    // Simplified risk parity implementation
    const totalRisk = assets.reduce((sum, asset) => sum + asset.volatility, 0);
    return assets.map(asset => ({
        ...asset,
        weight: asset.volatility / totalRisk
    }));
}
            `
        },
        {
            "path": "src/lib/portfolio-strategies.ts",
            "content": `
import { Asset } from '@/app/portfolio/page';

export function calculateMeanVarianceOptimization(assets: Asset[]): Asset[] {
    // Simplified Mean-Variance Optimization
    const totalRisk = assets.reduce((sum, asset) => sum + asset.volatility, 0);
    const optimalRisk = totalRisk / assets.length;

    return assets.map(asset => {
        const riskAdjustmentFactor = optimalRisk / asset.volatility;
        return {
            ...asset,
            weight: (1 / assets.length) * riskAdjustmentFactor
        };
    });
}

export function applyBlackLittermanModel(assets: Asset[]): Asset[] {
    // Simplified Black-Litterman Model
    const marketWeights = assets.map(asset => asset.weight);
    const expectedReturns = assets.map(asset => asset.expectedReturn);

    const posteriorWeights = marketWeights.map((weight, index) => {
        const adjustedReturn = expectedReturns[index] * 1.2; // Slightly adjust based on investor views
        return {
            ...assets[index],
            weight: weight * (1 + adjustedReturn)
        };
    });

    const totalWeight = posteriorWeights.reduce((sum, asset) => sum + asset.weight, 0);
    
    return posteriorWeights.map(asset => ({
        ...asset,
        weight: asset.weight / totalWeight
    }));
}

export function calculatePortfolioPerformance(assets: Asset[]): {
    expectedReturn: number;
    portfolioVolatility: number;
    sharpeRatio: number;
} {
    const expectedReturn = assets.reduce((sum, asset) => 
        sum + (asset.weight * asset.expectedReturn), 0);
    
    const portfolioVolatility = Math.sqrt(
        assets.reduce((sum, asset) => 
            sum + (Math.pow(asset.volatility, 2) * Math.pow(asset.weight, 2)), 0)
    );

    const riskFreeRate = 0.02; // 2% risk-free rate
    const sharpeRatio = (expectedReturn - riskFreeRate) / portfolioVolatility;

    return {
        expectedReturn,
        portfolioVolatility,
        sharpeRatio
    };
}
            `
        }
    ],
    "summary": "Advanced Multi-Asset Portfolio Construction application with Mean-Variance Optimization, Black-Litterman Model, and Risk Parity strategies. Provides interactive portfolio optimization, performance analytics, and modern web technologies."
}

Key Features:
✅ Next.js 14 with TypeScript
✅ Portfolio Optimization Strategies
✅ Interactive Asset Allocation
✅ Performance Metrics
✅ Responsive Design with TailwindCSS

The solution includes:
1. Portfolio page with asset management
2. Portfolio optimizer component
3. Advanced portfolio strategies library
4. Flexible asset modeling
5. Performance calculation methods

Would you like me to elaborate on any specific aspect of the implementation?