# 🚀 Deployment Guide

## Production Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy dist/ folder to Vercel
```

Vercel configuration (`vercel.json`):
```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend.railway.app/api/$1"
    }
  ]
}
```

#### Backend (Railway)
1. Push to GitHub
2. Connect Railway to repository
3. Add environment variables:
   - `API_BASE_URL=https://api.nearblocks.io/v1`
   - `API_KEY=your_key`
   - `PORT=3001`
   - `CACHE_TTL=30`

### Option 2: Single Server Deployment

Serve frontend from Express:

```javascript
// Add to server.js
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static files from client/dist
app.use(express.static(join(__dirname, 'client/dist')));

// Handle React routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'client/dist/index.html'));
});
```

Then:
```bash
cd client && npm run build && cd ..
node server.js
```

### Option 3: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY package*.json ./
RUN npm install

# Install frontend dependencies and build
COPY client/package*.json ./client/
RUN cd client && npm install
COPY client/ ./client/
RUN cd client && npm run build

# Copy backend code
COPY server.js start-server.js ./

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "start-server.js"]
```

Build and run:
```bash
docker build -t near-wallet-tracker .
docker run -p 3001:3001 -e API_KEY=your_key near-wallet-tracker
```

## Environment Variables for Production

```env
NODE_ENV=production
API_BASE_URL=https://api.nearblocks.io/v1
API_KEY=your_production_api_key
PORT=3001
CACHE_TTL=60
```

## Performance Optimizations

### 1. Increase Cache TTL
```javascript
process.env.CACHE_TTL = '300'; // 5 minutes
```

### 2. Add Redis Caching
```javascript
import Redis from 'ioredis';
const redis = new Redis(process.env.REDIS_URL);
```

### 3. Enable Compression
```javascript
import compression from 'compression';
app.use(compression());
```

### 4. Add Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Security Checklist

- ✅ API key in environment variables
- ✅ CORS enabled
- ✅ Input validation
- ✅ Error handling
- ✅ Request timeouts
- ⬜ Add helmet for security headers
- ⬜ Add rate limiting
- ⬜ Add request logging
- ⬜ Enable HTTPS

## Monitoring

### Add Health Check Endpoint (Already Included)
```javascript
GET /api/health
```

### Add Logging
```javascript
import morgan from 'morgan';
app.use(morgan('combined'));
```

### Add Error Tracking
```javascript
// Example with Sentry
import * as Sentry from "@sentry/node";
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

## Scaling Considerations

1. **Horizontal Scaling**: Deploy multiple instances behind a load balancer
2. **Caching Layer**: Use Redis for shared cache across instances
3. **CDN**: Serve static assets from CDN
4. **Database**: Add PostgreSQL for storing historical data

## Cost Estimation

### Free Tier Options
- **Vercel**: Free for hobby projects
- **Railway**: $5/month with free trial
- **Render**: Free tier available
- **NearBlocks API**: Check their pricing

### Recommended for Production
- **Backend**: Railway/Render ($5-10/month)
- **Frontend**: Vercel (Free)
- **Total**: ~$5-10/month

## Maintenance

### Update Dependencies
```bash
npm update
cd client && npm update
```

### Monitor API Usage
- Check NearBlocks dashboard
- Monitor cache hit rates
- Track error rates

### Backup Strategy
- Version control (Git)
- Export transaction data periodically
- Document API key rotation process

