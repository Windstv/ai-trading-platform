import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier

class RiskPredictionModel:
    def __init__(self):
        self.rf_model = RandomForestRegressor()
        self.xgb_model = XGBClassifier()
        self.scaler = StandardScaler()

    def prepare_data(self, market_data):
        # Feature engineering and preprocessing
        features = self._extract_features(market_data)
        X = features.drop(['risk_score'], axis=1)
        y = features['risk_score']
        return train_test_split(X, y, test_size=0.2)

    def _extract_features(self, market_data):
        # Advanced feature extraction
        features = {
            'volatility': market_data['close'].pct_change().std(),
            'momentum': self._calculate_momentum(market_data),
            'trend_strength': self._calculate_trend_strength(market_data),
            'risk_score': self._calculate_risk_score(market_data)
        }
        return pd.DataFrame(features)

    def _calculate_momentum(self, data):
        # Calculate price momentum
        return data['close'].pct_change(periods=10).mean()

    def _calculate_trend_strength(self, data):
        # Calculate trend strength using moving averages
        short_ma = data['close'].rolling(window=20).mean()
        long_ma = data['close'].rolling(window=50).mean()
        return abs(short_ma - long_ma).mean()

    def _calculate_risk_score(self, data):
        # Complex risk scoring algorithm
        volatility = data['close'].pct_change().std()
        drawdown = self._calculate_max_drawdown(data)
        return volatility * drawdown * 100

    def _calculate_max_drawdown(self, data):
        cumulative_returns = (1 + data['close'].pct_change()).cumprod()
        peak = cumulative_returns.cummax()
        drawdown = (cumulative_returns - peak) / peak
        return abs(drawdown.min())

    def train_model(self, market_data):
        X_train, X_test, y_train, y_test = self.prepare_data(market_data)
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        self.rf_model.fit(X_train_scaled, y_train)
        self.xgb_model.fit(X_train_scaled, y_train)

    def predict_risk(self, new_market_data):
        features = self._extract_features(new_market_data)
        X_scaled = self.scaler.transform(features)

        rf_prediction = self.rf_model.predict(X_scaled)
        xgb_prediction = self.xgb_model.predict(X_scaled)

        # Ensemble prediction
        return np.mean([rf_prediction, xgb_prediction])
