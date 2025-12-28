export type RiskModel = 'neural-network' | 'bayesian' | 'ensemble';

export interface MarketData {
  timestamp: Date;
  asset: string;
  price: number;
  volume: number;
  volatility: number;
}

export interface RiskFactor {
  name: string;
  score: number;
  category: 'Market' | 'Liquidity' | 'Credit' | 'Operational';
}

export interface RiskPrediction {
  overallRiskScore: number;
  volatilityIndex: number;
  anomalyScore: number;
  predictedRisks: RiskFactor[];
}