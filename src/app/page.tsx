import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.feature_selection import SelectKBest, f_regression
from ta import add_all_ta_features
import numpy as np

class MLFeatureEngineeringModule:
    def __init__(self, data):
        self.original_data = data
        self.preprocessed_data = None
        self.features = None
        self.scalers = {}

    def preprocess_data(self, 
        handle_missing=True, 
        remove_duplicates=True,
        normalize_column_names=True
    ):
        """
        Comprehensive data preprocessing pipeline
        """
        df = self.original_data.copy()

        # Handle missing values
        if handle_missing:
            df.fillna(method='ffill', inplace=True)
            df.fillna(df.mean(), inplace=True)

        # Remove duplicate rows
        if remove_duplicates:
            df.drop_duplicates(inplace=True)

        # Normalize column names
        if normalize_column_names:
            df.columns = [col.lower().replace(' ', '_') for col in df.columns]

        self.preprocessed_data = df
        return self.preprocessed_data

    def extract_technical_indicators(self, 
        indicators=['rsi', 'macd', 'bollinger', 'ema', 'sma']
    ):
        """
        Extract advanced technical indicators as features
        """
        if self.preprocessed_data is None:
            raise ValueError("Preprocess data first")

        # Use TA library for comprehensive technical indicators
        df = add_all_ta_features(
            self.preprocessed_data, 
            open='open', 
            high='high', 
            low='low', 
            close='close', 
            volume='volume'
        )

        self.features = df
        return self.features

    def feature_scaling(self, scaling_method='standard'):
        """
        Advanced feature scaling and normalization
        """
        if self.features is None:
            raise ValueError("Extract features first")

        X = self.features.copy()

        if scaling_method == 'standard':
            scaler = StandardScaler()
            scaled_features = scaler.fit_transform(X)
            self.scalers['standard'] = scaler
        elif scaling_method == 'minmax':
            scaler = MinMaxScaler()
            scaled_features = scaler.fit_transform(X)
            self.scalers['minmax'] = scaler
        
        scaled_df = pd.DataFrame(
            scaled_features, 
            columns=X.columns, 
            index=X.index
        )

        return scaled_df

    def feature_importance(self, target_column, top_k=10):
        """
        Feature importance and selection
        """
        X = self.features.drop(columns=[target_column])
        y = self.features[target_column]

        selector = SelectKBest(score_func=f_regression, k=top_k)
        selector.fit(X, y)

        # Get feature scores and names
        feature_scores = pd.DataFrame({
            'feature': X.columns,
            'score': selector.scores_
        }).sort_values('score', ascending=False)

        return feature_scores.head(top_k)

    def generate_ml_dataset(self, target_column, test_size=0.2):
        """
        Prepare dataset for multiple ML models
        """
        from sklearn.model_selection import train_test_split

        X = self.features.drop(columns=[target_column])
        y = self.features[target_column]

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, 
            test_size=test_size, 
            random_state=42
        )

        return {
            'X_train': X_train,
            'X_test': X_test,
            'y_train': y_train,
            'y_test': y_test
        }

# Example Usage
def main():
    # Sample financial data
    data = pd.read_csv('financial_data.csv')
    
    feature_engine = MLFeatureEngineeringModule(data)
    
    # Run preprocessing pipeline
    preprocessed_data = feature_engine.preprocess_data()
    
    # Extract technical indicators
    features = feature_engine.extract_technical_indicators()
    
    # Scale features
    scaled_features = feature_engine.feature_scaling()
    
    # Analyze feature importance
    importance = feature_engine.feature_importance(target_column='close')
    print(importance)

    # Prepare ML dataset
    ml_dataset = feature_engine.generate_ml_dataset(target_column='close')

if __name__ == "__main__":
    main()

Key Features:
✅ Comprehensive Data Preprocessing
✅ Technical Indicator Extraction
✅ Advanced Feature Scaling
✅ Feature Importance Analysis
✅ ML Dataset Generation

Dependencies:
- pandas
- numpy
- scikit-learn
- ta-lib (technical analysis library)

Recommended Next Steps:
1. Integrate with specific ML models
2. Add more advanced feature engineering techniques
3. Implement cross-validation strategies
4. Create visualization methods for features

Would you like me to elaborate on any specific aspect of the feature engineering module?