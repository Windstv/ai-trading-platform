export interface MarketFeature {
  name: string;
  type: 'price' | 'volume' | 'sentiment' | 'geopolitical';
  value: number;
  timestamp: Date;
}

export interface QuantumCircuit {
  qubits: number;
  entanglementStrength: number;
  superpositionProbability: number;
}

export interface QuantumPredictionModel {
  features: MarketFeature[];
  modelParameters: {
    learningRate?: number;
    regularization?: number;
    quantumNoiseLevel?: number;
  };
  quantumCircuits: QuantumCircuit[];
}

export interface PredictionResult {
  asset: string;
  predictedPrice: number;
  confidenceInterval: [number, number];
  probabilityDistribution: number[];
  timestamp: Date;
}

export interface RiskMetrics {
  volatilityScore: number;
  tailRiskProbability: number;
  uncertaintyIndex: number;
}