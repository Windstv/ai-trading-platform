import yfinance as yf
import pandas as pd
import numpy as np
from typing import List

class DataCollector:
    def __init__(self, symbols: List[str], start_date: str, end_date: str):
        self.symbols = symbols
        self.start_date = start_date
        self.end_date = end_date
    
    def fetch_historical_data(self) -> pd.DataFrame:
        data = yf.download(self.symbols, 
                            start=self.start_date, 
                            end=self.end_date)
        return data
    
    def calculate_technical_indicators(self, data: pd.DataFrame) -> pd.DataFrame:
        # Add technical indicators
        data['SMA_20'] = data['Close'].rolling(window=20).mean()
        data['SMA_50'] = data['Close'].rolling(window=50).mean()
        data['RSI'] = self._calculate_rsi(data['Close'])
        return data
    
    def _calculate_rsi(self, prices, periods=14):
        delta = prices.diff()
        
        gain = (delta.where(delta > 0, 0)).rolling(window=periods).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=periods).mean()
        
        rs = gain / loss
        rsi = 100 - (100 / (1 + rs))
        return rsi"
        }],
        {
            "path": "src/ml/model_training.py",
            "content": "import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestRegressor
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense

class PricePredictionModel:
    def __init__(self, data: pd.DataFrame):
        self.data = data
        self.scaler = StandardScaler()
        
    def prepare_data(self, target_column='Close', look_back=30):
        # Prepare sequential data for time series prediction
        X, y = [], []
        for i in range(len(self.data) - look_back):
            X.append(self.data.iloc[i:i+look_back].values)
            y.append(self.data[target_column].iloc[i+look_back])
        
        return np.array(X), np.array(y)
    
    def train_random_forest(self, X, y):
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        
        rf_model = RandomForestRegressor(n_estimators=100)
        rf_model.fit(X_train, y_train)
        
        return rf_model, rf_model.score(X_test, y_test)
    
    def train_lstm(self, X, y):
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
        
        X_train = X_train.reshape((X_train.shape[0], X_train.shape[1], 1))
        X_test = X_test.reshape((X_test.shape[0], X_test.shape[1], 1))
        
        model = Sequential([
            LSTM(50, activation='relu', input_shape=(X_train.shape[1], 1)),
            Dense(1)
        ])
        
        model.compile(optimizer='adam', loss='mse')
        model.fit(X_train, y_train, epochs=50, batch_size=32)
        
        return model, model.evaluate(X_test, y_test)"
        }],
        {
            "path": "src/ml/prediction_service.py",
            "content": "import pandas as pd
import numpy as np

class PredictionService:
    def __init__(self, models):
        self.models = models
    
    def ensemble_predict(self, input_data):
        predictions = [model.predict(input_data) for model in self.models]
        return np.mean(predictions, axis=0)
    
    def calculate_prediction_confidence(self, predictions):
        return {
            'mean_prediction': np.mean(predictions),
            'prediction_variance': np.var(predictions),
            'confidence_interval': np.percentile(predictions, [25, 75])
        }"
        }
    ]
}

### Recommendation for Next.js Frontend Integration

typescript
// src/app/page.tsx
'use client'

import React, { useState, useEffect } from 'react'
import { PredictionChart } from '@/components/PredictionChart'
import { fetchPredictions } from '@/services/predictionService'

export default function PricePredictionDashboard() {
  const [predictions, setPredictions] = useState(null)

  useEffect(() => {
    async function loadPredictions() {
      const result = await fetchPredictions()
      setPredictions(result)
    }
    loadPredictions()
  }, [])

  return (
    <div>
      <PredictionChart predictions={predictions} />
    </div>
  )
}

### Key Components & Features:
1. Data Collection Module
   - Fetch historical stock data
   - Calculate technical indicators
   - Support multiple symbols

2. Machine Learning Models
   - Random Forest Regressor
   - LSTM Neural Network
   - Ensemble prediction strategy

3. Prediction Service
   - Aggregated predictions
   - Confidence interval calculation
   - Variance analysis

### Recommended Improvements:
- Add more advanced feature engineering
- Implement real-time data streaming
- Create model monitoring dashboard
- Add hyperparameter tuning
- Integrate risk management metrics

### Technology Stack:
- Python (Data Science)
- scikit-learn
- TensorFlow/Keras
- Next.js 14
- TypeScript
- Tailwind CSS

The provided solution offers a robust prototype for machine learning-based price prediction with modular, extensible architecture.

Would you like me to elaborate on any specific aspect of the implementation?