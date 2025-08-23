# AgriPredict API Documentation

## 🌾 Overview

This document describes the RESTful API endpoints for the AgriPredict platform. The API provides crop yield predictions, pest risk assessments, weather forecasting, and agricultural recommendations.

**Base URL**: `https://api.agripredict.com/v1`

## 🔐 Authentication

All API endpoints require authentication using API keys. Include your API key in the request header:

```http
Authorization: Bearer YOUR_API_KEY
```

## 📊 Data Models

### Crop Yield Prediction

```json
{
  "id": "integer",
  "crop": "string",
  "region": "string",
  "predicted_yield": "float",
  "confidence": "float",
  "factors": {
    "temperature": "float",
    "rainfall": "float",
    "soil_ph": "float",
    "soil_nitrogen": "float",
    "soil_phosphorus": "float",
    "soil_potassium": "float"
  },
  "prediction_date": "string (ISO 8601)",
  "harvest_window": {
    "start_date": "string",
    "end_date": "string"
  }
}
```

### Pest Risk Assessment

```json
{
  "id": "integer",
  "crop": "string",
  "region": "string",
  "pest": "string",
  "risk_score": "integer (0-100)",
  "risk_level": "string (Low|Medium|High)",
  "factors": {
    "temperature": "float",
    "humidity": "float",
    "rainfall": "float"
  },
  "recommended_actions": ["string"],
  "assessment_date": "string (ISO 8601)"
}
```

### Weather Forecast

```json
{
  "date": "string",
  "location": {
    "region": "string",
    "coordinates": {
      "latitude": "float",
      "longitude": "float"
    }
  },
  "temperature": {
    "max": "float",
    "min": "float",
    "avg": "float"
  },
  "humidity": "float",
  "precipitation": "float",
  "wind_speed": "float",
  "pressure": "float",
  "uv_index": "integer",
  "conditions": "string"
}
```

## 🎯 API Endpoints

### 1. Crop Yield Prediction

#### Predict Crop Yield
```http
POST /yield/predict
```

**Request Body:**
```json
{
  "crop": "wheat",
  "region": "iowa-usa",
  "soil_conditions": {
    "ph": 6.8,
    "nitrogen": 35.5,
    "phosphorus": 18.2,
    "potassium": 145.0
  },
  "weather_conditions": {
    "temperature": 22.5,
    "rainfall": 45.2,
    "humidity": 65.0
  },
  "field_size": 100.0,
  "planting_date": "2025-04-15"
}
```

**Response (200):**
```json
{
  "success": true,
  "prediction": {
    "crop": "wheat",
    "region": "iowa-usa",
    "predicted_yield": 4.2,
    "yield_unit": "tons/hectare",
    "confidence": 0.94,
    "total_production": 420.0,
    "harvest_window": {
      "start_date": "2025-09-01",
      "end_date": "2025-09-15"
    },
    "contributing_factors": {
      "soil_quality": 0.85,
      "weather_favorability": 0.78,
      "pest_risk": 0.23
    }
  }
}
```

#### Get Historical Yield Data
```http
GET /yield/history?crop={crop}&region={region}&years={years}
```

**Parameters:**
- `crop`: Crop type (wheat, corn, soybeans, rice, etc.)
- `region`: Geographic region identifier
- `years`: Number of years of historical data (1-10)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "year": 2024,
      "yield": 4.1,
      "weather_summary": {
        "avg_temperature": 21.8,
        "total_rainfall": 542.3
      }
    }
  ]
}
```

### 2. Pest Risk Assessment

#### Assess Pest Risk
```http
POST /pest/assess
```

**Request Body:**
```json
{
  "crop": "corn",
  "region": "illinois-usa",
  "field_conditions": {
    "growth_stage": "vegetative",
    "irrigation_method": "sprinkler"
  },
  "weather_conditions": {
    "temperature": 24.1,
    "humidity": 68.0,
    "recent_rainfall": 12.5
  },
  "assessment_date": "2025-08-23"
}
```

**Response (200):**
```json
{
  "success": true,
  "assessment": {
    "overall_risk": "Medium",
    "risk_score": 65,
    "pest_risks": [
      {
        "pest": "Corn Borer",
        "risk_level": "High",
        "risk_score": 78,
        "probability": 0.82,
        "potential_damage": "15-25% yield loss"
      },
      {
        "pest": "Aphids",
        "risk_level": "Medium",
        "risk_score": 45,
        "probability": 0.65,
        "potential_damage": "5-10% yield loss"
      }
    ],
    "recommendations": [
      {
        "action": "Monitor corn borer populations",
        "priority": "High",
        "timeline": "Next 7 days"
      },
      {
        "action": "Consider preventive spray application",
        "priority": "Medium",
        "timeline": "Next 14 days"
      }
    ]
  }
}
```

#### Get Pest Monitoring Data
```http
GET /pest/monitor?crop={crop}&region={region}&days={days}
```

**Response (200):**
```json
{
  "success": true,
  "monitoring_data": [
    {
      "date": "2025-08-23",
      "pest_activity": {
        "corn_borer": {
          "activity_level": "High",
          "trap_counts": 45
        },
        "aphids": {
          "activity_level": "Medium",
          "trap_counts": 23
        }
      }
    }
  ]
}
```

### 3. Weather Integration

#### Get Weather Forecast
```http
GET /weather/forecast?region={region}&days={days}
```

**Parameters:**
- `region`: Geographic region identifier
- `days`: Forecast duration (1-14 days)

**Response (200):**
```json
{
  "success": true,
  "forecast": [
    {
      "date": "2025-08-24",
      "temperature": {
        "max": 28.5,
        "min": 18.2,
        "avg": 23.4
      },
      "humidity": 65,
      "precipitation": {
        "amount": 2.5,
        "probability": 30
      },
      "wind": {
        "speed": 12,
        "direction": "SW"
      },
      "conditions": "Partly cloudy",
      "agricultural_impact": {
        "irrigation_needed": false,
        "field_work_suitable": true,
        "pest_risk_factors": {
          "temperature_stress": "Low",
          "moisture_conducive": "Medium"
        }
      }
    }
  ]
}
```

#### Get Agricultural Weather Alerts
```http
GET /weather/alerts?region={region}
```

**Response (200):**
```json
{
  "success": true,
  "alerts": [
    {
      "id": "alert-001",
      "type": "frost_warning",
      "severity": "High",
      "title": "Frost Warning - Protect Sensitive Crops",
      "description": "Temperatures expected to drop below 2°C on August 25th",
      "affected_region": "iowa-usa",
      "start_date": "2025-08-25T02:00:00Z",
      "end_date": "2025-08-25T08:00:00Z",
      "recommendations": [
        "Cover sensitive plants",
        "Run irrigation systems if available",
        "Monitor overnight temperatures"
      ]
    }
  ]
}
```

### 4. Recommendations Engine

#### Get Farming Recommendations
```http
GET /recommendations?crop={crop}&region={region}&stage={growth_stage}
```

**Response (200):**
```json
{
  "success": true,
  "recommendations": [
    {
      "id": "rec-001",
      "type": "irrigation",
      "priority": "High",
      "title": "Optimal Irrigation Schedule",
      "description": "Based on current soil moisture and weather forecast",
      "actions": [
        "Irrigate corn fields on Tuesday morning",
        "Apply 25mm of water",
        "Monitor soil moisture levels"
      ],
      "timing": {
        "start_date": "2025-08-25",
        "duration": "2 hours"
      },
      "expected_impact": "Maintain optimal soil moisture for grain filling stage"
    }
  ]
}
```

#### Submit Feedback
```http
POST /recommendations/feedback
```

**Request Body:**
```json
{
  "recommendation_id": "rec-001",
  "rating": 5,
  "followed": true,
  "results": "Excellent - yield improved by 8%",
  "feedback": "Very helpful timing for irrigation"
}
```

## 🔄 Batch Operations

### Bulk Yield Prediction
```http
POST /yield/predict/batch
```

**Request Body:**
```json
{
  "predictions": [
    {
      "field_id": "field-001",
      "crop": "wheat",
      "region": "iowa-usa",
      // ... other parameters
    }
  ]
}
```

### Bulk Pest Assessment
```http
POST /pest/assess/batch
```

## 📈 Analytics Endpoints

### Farm Analytics Dashboard
```http
GET /analytics/dashboard?farm_id={farm_id}&period={period}
```

**Response (200):**
```json
{
  "success": true,
  "analytics": {
    "yield_trends": {
      "current_season": 4.2,
      "last_season": 3.8,
      "improvement": 10.5
    },
    "pest_incidents": {
      "total": 3,
      "prevented": 2,
      "success_rate": 66.7
    },
    "weather_impact": {
      "favorable_days": 180,
      "adverse_days": 15,
      "favorable_percentage": 92.3
    }
  }
}
```

## 🚨 Error Handling

The API uses conventional HTTP response codes to indicate success or failure:

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `401` - Unauthorized (invalid API key)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

**Error Response Format:**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CROP_TYPE",
    "message": "The specified crop type is not supported",
    "details": {
      "supported_crops": ["wheat", "corn", "soybeans", "rice"]
    }
  }
}
```

## ⚡ Rate Limits

- **Free Tier**: 100 requests per day
- **Basic Plan**: 1,000 requests per day  
- **Premium Plan**: 10,000 requests per day
- **Enterprise**: Unlimited requests

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## 🧪 Testing

### Test API Key
For testing purposes, use the following API key:
```
Bearer test_api_key_agripredict_demo_2025
```

### Sandbox Environment
Base URL: `https://api-sandbox.agripredict.com/v1`

## 📚 SDKs and Libraries

### Python SDK
```bash
pip install agripredict-python
```

```python
import agripredict

client = agripredict.Client(api_key="your_api_key")
prediction = client.yield.predict(
    crop="wheat",
    region="iowa-usa",
    soil_ph=6.8,
    temperature=22.5
)
```

### JavaScript SDK
```bash
npm install agripredict-js
```

```javascript
import AgriPredict from 'agripredict-js';

const client = new AgriPredict({ apiKey: 'your_api_key' });
const prediction = await client.yield.predict({
  crop: 'wheat',
  region: 'iowa-usa',
  soilPh: 6.8,
  temperature: 22.5
});
```

## 📞 Support

- **API Status**: [status.agripredict.com](https://status.agripredict.com)
- **Documentation**: [docs.agripredict.com](https://docs.agripredict.com)
- **Support Email**: api-support@agripredict.com
- **Community Forum**: [community.agripredict.com](https://community.agripredict.com)

---

*Last updated: August 2025 | Version 1.0*