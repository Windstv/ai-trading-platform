import * as math from 'mathjs';
import { TimeSeries, Asset } from './types';

export class CorrelationAnalysis {
    private assets: Asset[] = [];

    // Cross-asset correlation matrix
    calculateCorrelationMatrix(): number[][] {
        const priceMatrices = this.assets.map(asset => asset.prices);
        return math.corr(priceMatrices);
    }

    // Real-time correlation tracking
    trackRealTimeCorrelations(window: number = 30): Map<string, number> {
        const correlations = new Map<string, number>();
        
        this.assets.forEach((asset1, i) => {
            this.assets.slice(i + 1).forEach(asset2 => {
                const correlation = this.calculatePearsonCorrelation(
                    asset1.prices.slice(-window), 
                    asset2.prices.slice(-window)
                );
                correlations.set(`${asset1.symbol}-${asset2.symbol}`, correlation);
            });
        });

        return correlations;
    }

    // Lagged correlation detection
    detectLaggedCorrelations(maxLag: number = 10): Map<string, number[]> {
        const laggedCorrelations = new Map<string, number[]>();

        this.assets.forEach((asset1, i) => {
            this.assets.slice(i + 1).forEach(asset2 => {
                const lagCorrelations = Array.from({length: maxLag}, (_, lag) => 
                    this.calculateLaggedCorrelation(asset1.prices, asset2.prices, lag)
                );
                laggedCorrelations.set(`${asset1.symbol}-${asset2.symbol}`, lagCorrelations);
            });
        });

        return laggedCorrelations;
    }

    // Predictive correlation modeling
    predictCorrelationTrend(timeframe: number = 60): Map<string, number> {
        const predictions = new Map<string, number>();

        this.assets.forEach((asset1, i) => {
            this.assets.slice(i + 1).forEach(asset2 => {
                const historicalCorrelations = this.calculateHistoricalCorrelations(
                    asset1.prices, 
                    asset2.prices, 
                    timeframe
                );
                const prediction = this.forecastCorrelation(historicalCorrelations);
                predictions.set(`${asset1.symbol}-${asset2.symbol}`, prediction);
            });
        });

        return predictions;
    }

    // Utility methods
    private calculatePearsonCorrelation(x: number[], y: number[]): number {
        return math.correlation(x, y);
    }

    private calculateLaggedCorrelation(x: number[], y: number[], lag: number): number {
        const laggedX = x.slice(lag);
        const laggedY = y.slice(0, -lag);
        return this.calculatePearsonCorrelation(laggedX, laggedY);
    }

    private calculateHistoricalCorrelations(x: number[], y: number[], window: number): number[] {
        return x.slice(-window).map((_, i) => 
            this.calculatePearsonCorrelation(
                x.slice(i, i + window), 
                y.slice(i, i + window)
            )
        );
    }

    private forecastCorrelation(correlations: number[]): number {
        // Simple moving average forecast
        return math.mean(correlations);
    }

    // Add asset for analysis
    addAsset(asset: Asset) {
        this.assets.push(asset);
    }
}

// src/modules/correlation/types.ts
export interface Asset {
    symbol: string;
    prices: number[];
    type: 'stock' | 'crypto' | 'forex' | 'commodity';
}

export interface TimeSeries {
    timestamp: Date;
    value: number;
}

// src/modules/correlation/CorrelationVisualization.tsx
import React from 'react';
import { HeatMap } from 'react-vis';
import { CorrelationAnalysis } from './CorrelationAnalysis';

interface CorrelationHeatmapProps {
    correlationAnalysis: CorrelationAnalysis;
}

export const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({ correlationAnalysis }) => {
    const correlationMatrix = correlationAnalysis.calculateCorrelationMatrix();

    return (
        <HeatMap
            data={correlationMatrix}
            colorRange={['red', 'white', 'green']}
            height={400}
            width={400}
        />
    );
};

// Example usage
const analysis = new CorrelationAnalysis();
analysis.addAsset({
    symbol: 'BTC/USDT', 
    prices: [50000, 52000, 51000],
    type: 'crypto'
});
analysis.addAsset({
    symbol: 'SPY', 
    prices: [400, 405, 403],
    type: 'stock'
});

const correlations = analysis.trackRealTimeCorrelations();
const laggedCorrelations = analysis.detectLaggedCorrelations();
const predictedCorrelations = analysis.predictCorrelationTrend();

Key Features:
1. Cross-asset Correlation Matrix Calculation
2. Real-time Correlation Tracking
3. Lagged Correlation Detection
4. Predictive Correlation Modeling
5. Correlation Heatmap Visualization
6. Support for Multiple Asset Types
7. Flexible Time Series Analysis

Technologies Used:
- TypeScript
- Math.js for Statistical Calculations
- React-Vis for Visualization
- Modular and Extensible Design

Potential Use Cases:
- Portfolio Diversification
- Risk Management
- Trading Strategy Development
- Market Trend Analysis

The implementation provides a comprehensive framework for analyzing market correlations across different asset classes with advanced statistical techniques.

Recommended Improvements:
1. Add more sophisticated prediction models
2. Implement machine learning correlation forecasting
3. Create more advanced visualization techniques
4. Add support for more complex time series analysis

Would you like me to elaborate on any specific aspect of the implementation?