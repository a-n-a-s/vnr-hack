from fastapi import APIRouter, HTTPException
import json
import os
from utils.anomaly_detection import detect_anomalies
from typing import List, Dict, Any

router = APIRouter()

@router.get("/anomalies")
async def get_anomalies():
    """
    Detect and return anomalies in the realistic financial data.
    """
    try:
        # Load the realistic financial data from the backend directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        data_path = os.path.join(current_dir, "..", "realistic_financial_data.json")
        
        if not os.path.exists(data_path):
            raise HTTPException(status_code=404, detail="Realistic financial data file not found")
        
        with open(data_path, 'r') as file:
            financial_data = json.load(file)

        print(financial_data)
        
        # Apply anomaly detection
        anomalies = detect_anomalies(financial_data)
        
        return {
            "anomalies": anomalies,
            "count": len(anomalies)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting anomalies: {str(e)}")


@router.post("/anomalies")
async def detect_anomalies_from_data(financial_data: Dict[str, Any]):
    """
    Detect anomalies in provided financial data.
    """
    try:
        # Apply anomaly detection to the provided data
        anomalies = detect_anomalies(financial_data)
        
        return {
            "anomalies": anomalies,
            "count": len(anomalies)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting anomalies: {str(e)}")