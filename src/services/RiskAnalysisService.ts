import axios from 'axios';
import { RiskPredictionModel } from '../models/RiskPredictionModel';

interface RiskAnalysis {
    riskScore: number;
    volatilityForecast: number;
    drawdownProbability: number;
    recommendedAction: 'HOLD' | 'REDUCE' | 'EXIT';
}

export class RiskAnalysisService {
    private model: RiskPredictionModel;

    constructor() {
        this.model = new RiskPredictionModel();
    }

    async analyzeMarketRisk(marketData: any): Promise<RiskAnalysis> {
        const riskScore = this.model.predict_risk(marketData);

        return {
            riskScore,
            volatilityForecast: this._calculateVolatilityForecast(riskScore),
            drawdownProbability: this._calculateDrawdownProbability(riskScore),
            recommendedAction: this._determineRecommendedAction(riskScore)
        };
    }

    private _calculateVolatilityForecast(riskScore: number): number {
        return riskScore * 0.5;
    }

    private _calculateDrawdownProbability(riskScore: number): number {
        return Math.min(riskScore / 100, 1);
    }

    private _determineRecommendedAction(riskScore: number): 'HOLD' | 'REDUCE' | 'EXIT' {
        if (riskScore < 30) return 'HOLD';
        if (riskScore < 70) return 'REDUCE';
        return 'EXIT';
    }
}