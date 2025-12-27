import { TimeSeriesAnalyzer } from './time-series-analyzer';
import { MachineLearningModel } from './ml-model';

export enum MarketRegime {
  TRENDING = 'trending',
  RANGING = 'ranging',
  VOLATILE = 'volatile',
  CALM = 'calm'
}

export interface RegimeMetrics {
  trendStrength: number;
  volatilityIndex: number;
  correlation: number;
  entropy: number;
}

export class MarketRegimeDetector {
  private timeSeriesAnalyzer: TimeSeriesAnalyzer;
  private mlModel: MachineLearningModel;

  constructor(assets: string[]) {
    this.timeSeriesAnalyzer = new TimeSeriesAnalyzer(assets);
    this.mlModel = new MachineLearningModel();
  }

  async detectRegime(historicalData: number[]): Promise<{
    currentRegime: MarketRegime;
    metrics: RegimeMetrics;
  }> {
    // Compute advanced regime metrics
    const metrics = this.computeRegimeMetrics(historicalData);
    
    // ML-based regime classification
    const regime = this.mlModel.classifyRegime(metrics);

    return {
      currentRegime: regime,
      metrics
    };
  }

  private computeRegimeMetrics(data: number[]): RegimeMetrics {
    return {
      trendStrength: this.calculateTrendStrength(data),
      volatilityIndex: this.calculateVolatility(data),
      correlation: this.calculateCorrelation(data),
      entropy: this.calculateEntropy(data)
    };
  }

  private calculateTrendStrength(data: number[]): number {
    // Linear regression slope as trend indicator
    const n = data.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = data.reduce((a, b) => a + b, 0);
    const sumXY = data.reduce((sum, value, index) => sum + value * index, 0);
    const sumXSquare = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumXSquare - sumX * sumX);
    return Math.abs(slope);
  }

  private calculateVolatility(data: number[]): number {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / data.length;
    return Math.sqrt(variance);
  }

  private calculateCorrelation(data: number[]): number {
    // Autocorrelation calculation
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const variance = data.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) / data.length;
    
    const lags = [1, 2, 3];
    const correlations = lags.map(lag => {
      let covariance = 0;
      for (let i = lag; i < data.length; i++) {
        covariance += (data[i] - mean) * (data[i - lag] - mean);
      }
      return covariance / ((data.length - lag) * variance);
    });

    return correlations.reduce((a, b) => a + b, 0) / correlations.length;
  }

  private calculateEntropy(data: number[]): number {
    // Shannon entropy calculation for regime complexity
    const uniqueValues = [...new Set(data)];
    const probabilities = uniqueValues.map(
      val => data.filter(d => d === val).length / data.length
    );

    return -probabilities.reduce(
      (entropy, p) => entropy + (p * Math.log2(p)), 0
    );
  }

  adaptStrategy(regime: MarketRegime) {
    switch (regime) {
      case MarketRegime.TRENDING:
        return { leverage: 1.5, stopLoss: 0.05 };
      case MarketRegime.RANGING:
        return { leverage: 1.0, stopLoss: 0.03 };
      case MarketRegime.VOLATILE:
        return { leverage: 0.5, stopLoss: 0.1 };
      case MarketRegime.CALM:
        return { leverage: 2.0, stopLoss: 0.02 };
    }
  }
}

This implementation provides a sophisticated Market Regime Detection Module with:

🔍 Key Features:
- Multiple market regime classifications
- Advanced metrics computation
- Machine learning-based regime detection
- Dynamic strategy adaptation
- Statistical analysis techniques

📊 Computed Metrics:
- Trend Strength
- Volatility Index
- Market Correlation
- Information Entropy

🧠 Regime Detection Logic:
- Time series analysis
- ML model classification
- Multi-dimensional metric assessment

The module uses advanced statistical techniques to classify market conditions and provide adaptive strategy recommendations.

Would you like me to elaborate on any specific aspect of the implementation?