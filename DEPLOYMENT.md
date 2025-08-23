# AgriPredict Deployment Guide

## 🚀 Overview

This guide provides comprehensive instructions for deploying the AgriPredict platform across different environments, from development to production.

## 📋 Prerequisites

### System Requirements
- **Node.js**: Version 18+ (for development tools)
- **Python**: Version 3.9+ (for backend API)
- **PostgreSQL**: Version 13+ (for database)
- **Git**: Latest version
- **Docker**: Optional, for containerized deployment

### Required Accounts
- **Vercel** or **Netlify** (Frontend hosting)
- **Render**, **Heroku**, or **Railway** (Backend hosting)  
- **Supabase** or **PostgreSQL Cloud** (Database)
- **OpenWeatherMap** (Weather API)

## 🌐 Frontend Deployment

### Option 1: Vercel Deployment (Recommended)

1. **Setup Repository**
   ```bash
   git clone <your-repo-url>
   cd agri-predict
   ```

2. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

3. **Deploy to Vercel**
   ```bash
   vercel
   # Follow interactive prompts
   # Select framework: Other
   # Build command: (leave empty)
   # Output directory: ./
   ```

4. **Configure Environment Variables**
   ```bash
   # In Vercel dashboard, add:
   NEXT_PUBLIC_API_URL=https://your-api.herokuapp.com
   NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_key
   ```

5. **Custom Domain** (Optional)
   - Add custom domain in Vercel dashboard
   - Update DNS records as instructed

### Option 2: Netlify Deployment

1. **Connect Repository**
   - Login to Netlify dashboard
   - Click "New site from Git"
   - Connect your GitHub repository

2. **Build Settings**
   ```
   Build command: (leave empty)
   Publish directory: ./
   ```

3. **Environment Variables**
   ```
   REACT_APP_API_URL = https://your-api.herokuapp.com
   REACT_APP_WEATHER_API_KEY = your_openweather_key
   ```

### Option 3: Static Hosting

#### GitHub Pages
```bash
# Enable GitHub Pages in repository settings
# Set source to main branch / root folder
# Access via: https://username.github.io/agri-predict
```

#### AWS S3 + CloudFront
```bash
# Create S3 bucket
aws s3 mb s3://agripredict-app
aws s3 sync . s3://agripredict-app --exclude "*.git/*"
aws s3 website s3://agripredict-app --index-document index.html
```

## 🔧 Backend API Deployment

### Option 1: Heroku Deployment

1. **Prepare FastAPI Application**
   
   Create `main.py`:
   ```python
   from fastapi import FastAPI, HTTPException
   from fastapi.middleware.cors import CORSMiddleware
   from pydantic import BaseModel
   import os
   import joblib
   import pandas as pd
   
   app = FastAPI(title="AgriPredict API", version="1.0.0")
   
   # CORS middleware
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   
   # Models
   class YieldPredictionRequest(BaseModel):
       crop: str
       region: str
       temperature: float
       rainfall: float
       soil_ph: float
       soil_nitrogen: float = 30.0
       soil_phosphorus: float = 15.0
       soil_potassium: float = 120.0
   
   class PestRiskRequest(BaseModel):
       crop: str
       region: str
       temperature: float
       humidity: float
       rainfall: float = 0.0
   
   # Endpoints
   @app.get("/")
   async def root():
       return {"message": "AgriPredict API is running"}
   
   @app.post("/api/yield/predict")
   async def predict_yield(request: YieldPredictionRequest):
       # Implement yield prediction logic
       base_yields = {
           "wheat": 4.5, "corn": 9.8, "soybeans": 3.2,
           "rice": 4.0, "cotton": 1.2, "barley": 3.8
       }
       
       base_yield = base_yields.get(request.crop.lower(), 3.0)
       
       # Simple prediction model (replace with actual ML model)
       temp_factor = 1 - abs(request.temperature - 25) * 0.02
       rain_factor = min(request.rainfall / 100, 1.5)
       soil_factor = (request.soil_nitrogen + request.soil_phosphorus + request.soil_potassium) / 200
       
       predicted_yield = base_yield * temp_factor * rain_factor * soil_factor
       predicted_yield = max(0.1, predicted_yield)
       
       return {
           "success": True,
           "prediction": {
               "crop": request.crop,
               "region": request.region,
               "predicted_yield": round(predicted_yield, 2),
               "yield_unit": "tons/hectare",
               "confidence": 0.94,
               "factors": {
                   "temperature_impact": temp_factor,
                   "rainfall_impact": rain_factor,
                   "soil_impact": soil_factor
               }
           }
       }
   
   @app.post("/api/pest/assess")
   async def assess_pest_risk(request: PestRiskRequest):
       # Calculate pest risk based on conditions
       temp_risk = (request.temperature - 15) * 2
       humidity_risk = (request.humidity - 40) * 1.2
       rain_risk = min(request.rainfall / 10, 10)
       
       risk_score = min(100, max(0, temp_risk + humidity_risk + rain_risk))
       
       if risk_score < 30:
           risk_level = "Low"
       elif risk_score < 70:
           risk_level = "Medium"
       else:
           risk_level = "High"
       
       return {
           "success": True,
           "assessment": {
               "crop": request.crop,
               "region": request.region,
               "risk_score": round(risk_score, 1),
               "risk_level": risk_level,
               "recommendations": [
                   "Monitor field conditions",
                   f"Consider preventive measures if risk remains {risk_level.lower()}"
               ]
           }
       }
   
   if __name__ == "__main__":
       import uvicorn
       port = int(os.environ.get("PORT", 8000))
       uvicorn.run(app, host="0.0.0.0", port=port)
   ```

2. **Create Requirements**
   
   `requirements.txt`:
   ```
   fastapi==0.104.1
   uvicorn[standard]==0.24.0
   pandas==2.1.0
   numpy==1.24.3
   scikit-learn==1.3.0
   requests==2.31.0
   python-multipart==0.0.6
   python-dotenv==1.0.0
   ```

3. **Create Procfile**
   ```
   web: python main.py
   ```

4. **Deploy to Heroku**
   ```bash
   # Install Heroku CLI
   heroku login
   heroku create agripredict-api
   
   # Set environment variables
   heroku config:set WEATHER_API_KEY=your_openweather_key
   heroku config:set DATABASE_URL=your_postgresql_url
   
   # Deploy
   git add .
   git commit -m "Deploy API"
   git push heroku main
   ```

### Option 2: Render Deployment

1. **Create `render.yaml`**
   ```yaml
   services:
     - type: web
       name: agripredict-api
       env: python
       buildCommand: "pip install -r requirements.txt"
       startCommand: "python main.py"
       envVars:
         - key: WEATHER_API_KEY
           value: your_openweather_key
         - key: DATABASE_URL
           value: your_postgresql_url
   ```

2. **Connect Repository**
   - Login to Render dashboard
   - Create new Web Service
   - Connect GitHub repository
   - Deploy automatically on push

### Option 3: Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)

1. **Create Project**
   - Sign up at [supabase.com](https://supabase.com)
   - Create new project
   - Note connection string

2. **Create Tables**
   ```sql
   -- Yield predictions table
   CREATE TABLE yield_predictions (
       id SERIAL PRIMARY KEY,
       crop VARCHAR(50) NOT NULL,
       region VARCHAR(100) NOT NULL,
       predicted_yield DECIMAL(10,2),
       temperature DECIMAL(5,2),
       rainfall DECIMAL(6,2),
       soil_ph DECIMAL(3,1),
       soil_nitrogen DECIMAL(5,1),
       soil_phosphorus DECIMAL(5,1),
       soil_potassium DECIMAL(5,1),
       prediction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   -- Pest assessments table  
   CREATE TABLE pest_assessments (
       id SERIAL PRIMARY KEY,
       crop VARCHAR(50) NOT NULL,
       region VARCHAR(100) NOT NULL,
       pest VARCHAR(50) NOT NULL,
       risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
       risk_level VARCHAR(20) CHECK (risk_level IN ('Low', 'Medium', 'High')),
       temperature DECIMAL(5,2),
       humidity DECIMAL(5,2),
       rainfall DECIMAL(6,2),
       assessment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   -- Weather forecasts table
   CREATE TABLE weather_forecasts (
       id SERIAL PRIMARY KEY,
       region VARCHAR(100) NOT NULL,
       forecast_date DATE NOT NULL,
       temp_max DECIMAL(5,2),
       temp_min DECIMAL(5,2),
       humidity DECIMAL(5,2),
       precipitation DECIMAL(6,2),
       wind_speed DECIMAL(5,2),
       pressure DECIMAL(7,2),
       uv_index INTEGER,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   -- Recommendations table
   CREATE TABLE recommendations (
       id SERIAL PRIMARY KEY,
       type VARCHAR(50) NOT NULL,
       title VARCHAR(200) NOT NULL,
       description TEXT,
       priority VARCHAR(20) CHECK (priority IN ('Low', 'Medium', 'High')),
       crop VARCHAR(50),
       region VARCHAR(100),
       action_date DATE,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **Seed Data**
   ```bash
   # Use provided JSON files to populate tables
   python seed_database.py
   ```

### Option 2: PostgreSQL on Heroku

```bash
# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Get database URL
heroku config:get DATABASE_URL

# Connect and create tables
heroku pg:psql
```

## 🔐 Environment Variables

### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_URL=https://agripredict-api.herokuapp.com
NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Backend (.env)
```bash
DATABASE_URL=postgresql://user:password@host:port/database
WEATHER_API_KEY=your_openweather_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
SECRET_KEY=your_secret_key_for_jwt
ALLOWED_ORIGINS=https://agripredict.vercel.app,https://agripredict.com
```

## 🐳 Docker Deployment

### Frontend Dockerfile
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile
```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["python", "main.py"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    environment:
      - REACT_APP_API_URL=http://localhost:8000

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:password@db:5432/agripredict
      - WEATHER_API_KEY=${WEATHER_API_KEY}
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=agripredict
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

## ☁️ Cloud Platform Deployment

### AWS Deployment

#### Frontend (S3 + CloudFront)
```bash
# Create S3 bucket
aws s3 mb s3://agripredict-frontend

# Upload files
aws s3 sync ./dist s3://agripredict-frontend

# Create CloudFront distribution
aws cloudfront create-distribution --distribution-config file://cloudfront-config.json
```

#### Backend (ECS Fargate)
```bash
# Build and push Docker image
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
docker build -t agripredict-backend .
docker tag agripredict-backend:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/agripredict-backend:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/agripredict-backend:latest

# Create ECS service
aws ecs create-service --service-name agripredict-backend --task-definition agripredict-backend --desired-count 1
```

### Google Cloud Deployment

#### Frontend (Cloud Storage + CDN)
```bash
# Create bucket
gsutil mb gs://agripredict-frontend

# Upload files
gsutil -m rsync -r ./dist gs://agripredict-frontend

# Set up load balancer with CDN
gcloud compute backend-buckets create agripredict-backend-bucket --gcs-bucket-name=agripredict-frontend
```

#### Backend (Cloud Run)
```bash
# Build and deploy
gcloud builds submit --tag gcr.io/your-project-id/agripredict-backend
gcloud run deploy agripredict-backend --image gcr.io/your-project-id/agripredict-backend --platform managed --region us-central1
```

## 🔍 Monitoring & Logging

### Application Monitoring

#### Sentry Integration
```javascript
// Frontend
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
});
```

```python
# Backend
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn="YOUR_SENTRY_DSN",
    integrations=[FastApiIntegration()],
)
```

#### Health Check Endpoints
```python
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.get("/health/db")
async def database_health():
    # Check database connection
    try:
        # Test database query
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        return {"status": "unhealthy", "database": "disconnected", "error": str(e)}
```

### Performance Monitoring

#### Frontend Performance
```javascript
// Web Vitals monitoring
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

#### Backend Performance
```python
import time
from fastapi import Request

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response
```

## 🚦 CI/CD Pipeline

### GitHub Actions Workflow

`.github/workflows/deploy.yml`:
```yaml
name: Deploy AgriPredict

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          npm test
          python -m pytest

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-org-id: ${{ secrets.ORG_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "agripredict-api"
          heroku_email: "your-email@example.com"
```

## 🔧 Troubleshooting

### Common Issues

#### CORS Errors
```python
# Ensure proper CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Database Connection Issues
```python
# Test database connection
import psycopg2

try:
    conn = psycopg2.connect(DATABASE_URL)
    print("Database connected successfully")
except Exception as e:
    print(f"Database connection error: {e}")
```

#### API Rate Limiting
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.get("/api/yield/predict")
@limiter.limit("10/minute")
async def predict_yield(request: Request):
    # Your endpoint logic
    pass
```

## 📊 Performance Optimization

### Frontend Optimization
- Enable gzip compression
- Optimize images and assets
- Implement lazy loading
- Use CDN for static assets
- Minimize JavaScript bundles

### Backend Optimization
- Implement response caching
- Use connection pooling for database
- Optimize database queries
- Implement request/response compression
- Use async/await for I/O operations

## 🔐 Security Checklist

- [ ] Enable HTTPS/SSL certificates
- [ ] Implement API rate limiting
- [ ] Validate all input data
- [ ] Use environment variables for secrets
- [ ] Enable CORS properly
- [ ] Implement authentication/authorization
- [ ] Regular security updates
- [ ] Database connection encryption
- [ ] Input sanitization
- [ ] Error handling without exposing sensitive info

## 📚 Additional Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Heroku Documentation**: [devcenter.heroku.com](https://devcenter.heroku.com)
- **FastAPI Documentation**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **Supabase Documentation**: [supabase.com/docs](https://supabase.com/docs)
- **OpenWeatherMap API**: [openweathermap.org/api](https://openweathermap.org/api)

---

**Need Help?** Contact our support team at deployment-help@agripredict.com