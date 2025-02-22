import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

def analyze_maternal_health_data(df):
    # Prepare the data
    X = df.drop('RiskLevel', axis=1)
    y = df['RiskLevel']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train the model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train_scaled, y_train)
    
    # Get feature importance
    feature_importance = dict(zip(X.columns, model.feature_importances_))
    
    # Get risk level distribution
    risk_distribution = y.value_counts().to_dict()
    
    # Prepare the result
    result = {
        'risk_levels': {
            'high': int(risk_distribution.get('high', 0)),
            'mid': int(risk_distribution.get('mid', 0)),
            'low': int(risk_distribution.get('low', 0))
        },
        'risk_distribution': {
            'high': int(risk_distribution.get('high', 0)),
            'mid': int(risk_distribution.get('mid', 0)),
            'low': int(risk_distribution.get('low', 0))
        },
        'feature_importance': {k: float(v) for k, v in feature_importance.items()}
    }
    
    return result
