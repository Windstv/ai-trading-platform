import numpy as np
import pandas as pd
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler

class PricePredictor:
    def __init__(self, cryptocurrency='BTC'):
        self.cryptocurrency = cryptocurrency
        self.model = self._build_model()
        self.scaler = MinMaxScaler()

    def _build_model(self):
        model = tf.keras.Sequential([
            tf.keras.layers.LSTM(50, activation='relu', input_shape=(60, 1)),
            tf.keras.layers.Dense(25, activation='relu'),
            tf.keras.layers.Dense(1)
        ])
        model.compile(optimizer='adam', loss='mse')
        return model

    def prepare_data(self, historical_data):
        # Normalize price data
        scaled_data = self.scaler.fit_transform(historical_data)
        
        # Create sequence data for LSTM
        X, y = [], []
        for i in range(60, len(scaled_data)):
            X.append(scaled_data[i-60:i, 0])
            y.append(scaled_data[i, 0])
        
        return np.array(X).reshape(-1, 60, 1), np.array(y)

    def train(self, historical_data, epochs=50):
        X_train, y_train = self.prepare_data(historical_data)
        history = self.model.fit(
            X_train, y_train, 
            epochs=epochs, 
            validation_split=0.2,
            verbose=1
        )
        return history

    def predict(self, recent_data):
        # Prepare input data
        scaled_recent = self.scaler.transform(recent_data)
        input_sequence = scaled_recent[-60:].reshape(1, 60, 1)
        
        # Make prediction
        predicted_price = self.model.predict(input_sequence)
        
        # Inverse transform to get actual price
        predicted_price = self.scaler.inverse_transform(predicted_price)
        
        # Calculate confidence score
        confidence = self._calculate_confidence(recent_data, predicted_price)
        
        return {
            'predicted_price': predicted_price[0][0],
            'confidence_score': confidence
        }

    def _calculate_confidence(self, historical_data, predicted_price):
        # Simple confidence calculation based on recent price volatility
        recent_prices = historical_data[-30:]
        price_volatility = np.std(recent_prices) / np.mean(recent_prices)
        
        # More complex confidence scoring could be implemented
        confidence = max(0, min(1, 1 - price_volatility))
        return confidence * 100  # Percentage
