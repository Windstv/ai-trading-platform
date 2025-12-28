import axios from 'axios';
import { RiskModel, RiskPrediction, MarketData } from '@/types/risk';

export class RiskPredictionService {
  private apiBase = '/api/risk-prediction';

  async getPredictiveRiskData(model: RiskModel): Promise<RiskPrediction> {
    try {
      const response = await axios.post(`${this.apiBase}/predict`, { model });
      return response.data;
    } catch (error) {
      console.error('Risk prediction failed', error);
      return {
        overallRiskScore: 0,
        volatilityIndex: 0,
        anomalyScore: 0,
        predictedRisks: []
      };
    }
  }

  async simulateRiskScenarios(marketData: MarketData[]): Promise<RiskPrediction[]> {
    try {
      const response = await axios.post(`${this.apiBase}/simulate`, { marketData });
      return response.data;
    } catch (error) {
      console.error('Risk scenario simulation failed', error);
      return [];
    }
  }

  async detectMarketAnomalies(data: MarketData[]): Promise<number> {
    try {
      const response = await axios.post(`${this.apiBase}/anomalies`, { data });
      return response.data.anomalyScore;
    } catch (error) {
      console.error('Anomaly detection failed', error);
      return 0;
    }
  }
}