import React, { useState, useEffect } from 'react';
import { RiskAnalysisService } from '../services/RiskAnalysisService';

const RiskDashboard: React.FC = () => {
    const [riskAnalysis, setRiskAnalysis] = useState(null);
    const riskService = new RiskAnalysisService();

    useEffect(() => {
        async function fetchRiskAnalysis() {
            const marketData = await fetchMarketData();
            const analysis = await riskService.analyzeMarketRisk(marketData);
            setRiskAnalysis(analysis);
        }

        fetchRiskAnalysis();
        const interval = setInterval(fetchRiskAnalysis, 15 * 60 * 1000); // Refresh every 15 minutes
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="risk-dashboard">
            {riskAnalysis && (
                <>
                    <div>Risk Score: {riskAnalysis.riskScore}</div>
                    <div>Volatility Forecast: {riskAnalysis.volatilityForecast}</div>
                    <div>Drawdown Probability: {riskAnalysis.drawdownProbability}</div>
                    <div>Recommended Action: {riskAnalysis.recommendedAction}</div>
                </>
            )}
        </div>
    );
};

export default RiskDashboard;