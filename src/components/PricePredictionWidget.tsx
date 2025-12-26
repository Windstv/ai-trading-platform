'use client';

import { useState, useEffect } from 'react';
import { PricePredictionService } from '@/services/price_prediction_service';

interface PredictionWidgetProps {
  cryptocurrency: string;
}

export function PricePredictionWidget({ cryptocurrency }: PredictionWidgetProps) {
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      const service = new PricePredictionService();
      try {
        const result = await service.predictPrice(cryptocurrency);
        setPrediction(result);
        setLoading(false);
      } catch (error) {
        console.error('Prediction error', error);
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [cryptocurrency]);

  if (loading) return <div>Loading prediction...</div>;

  return (
    <div className="bg-white shadow-md rounded p-4">
      <h3 className="text-lg font-bold mb-2">{cryptocurrency} Price Prediction</h3>
      <div className="flex justify-between">
        <span>Predicted Price:</span>
        <strong>${prediction.predicted_price.toFixed(2)}</strong>
      </div>
      <div className="flex justify-between">
        <span>Confidence:</span>
        <strong>{prediction.confidence_score.toFixed(2)}%</strong>
      </div>
    </div>
  );
}