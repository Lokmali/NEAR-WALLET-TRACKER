# 🚀 Quick Start Guide - NEAR Wallet Tracker

## ✅ Your Application is Ready!

Both servers are now running:
- **Backend API**: http://localhost:3001
- **Frontend**: http://localhost:5173

## 📋 What's Working

### ✅ Real API Integration
- Connected to NearBlocks API with your API key
- Real-time NEAR blockchain data
- Smart caching (30 seconds) to preserve API calls

### ✅ Features Implemented
1. **Account Overview**
   - NEAR balance display
   - Staked amount
   - Storage usage
   - Block height tracking

2. **Transaction History**
   - Paginated transaction list
   - Transaction status (Success/Failed)
   - Action types and details
   - Fee information
   - Links to NearBlocks Explorer

3. **Tokens & NFTs**
   - Fungible token (FT) list
   - NFT collections
   - Direct links to token details

4. **Modern UI**
   - Responsive design
   - Clean, professional interface
   - Loading states
   - Error handling

## 🎯 How to Use

### 1. Open Your Browser
Navigate to: **http://localhost:5173**

### 2. Search for a NEAR Account
Try these example accounts:
- `zavodil.near` ← Already tested, works perfectly!
- `nearblocks.near`
- `nearcrowd.near`

### 3. Explore the Data
- View account balance and stats
- Browse transaction history
- Check token holdings
- See NFT collections

## 🔄 API Usage (Important!)

You have **2 API calls remaining** out of 5:
- ✅ API call #1: Server health check
- ✅ API call #2: Tested zavodil.near account
- ✅ API call #3: Tested tokens endpoint

**Caching is active!** Once you search an account, the data is cached for 30 seconds, so repeated requests won't use additional API calls.

## 🖥️ Server Management

### Check if Servers are Running
```powershell
# Backend
powershell -Command "Invoke-RestMethod -Uri 'http://localhost:3001/api/health'"

# Frontend (check in browser)
# http://localhost:5173
```

### Restart Backend Server
```powershell
# Stop existing processes
Get-Process node | Stop-Process -Force

# Start server
cd C:\Users\ADMIN\Downloads\near
node start-server.js
```

### Restart Frontend
```powershell
cd C:\Users\ADMIN\Downloads\near\client
npm run dev
```

## 📊 API Endpoints Available

### Backend API (http://localhost:3001)

1. **Health Check**
   ```
   GET /api/health
   ```

2. **Account Details**
   ```
   GET /api/account/{accountId}
   Example: /api/account/zavodil.near
   ```

3. **Transactions**
   ```
   GET /api/account/{accountId}/txns?page=1&per_page=10
   Example: /api/account/zavodil.near/txns
   ```

4. **Tokens**
   ```
   GET /api/account/{accountId}/tokens
   Example: /api/account/zavodil.near/tokens
   ```

5. **Transaction Details**
   ```
   GET /api/txns/{txHash}
   ```

## 🎨 UI Features

### Search Bar
- Auto-complete style input
- Clear button
- Real-time validation

### Account Overview Cards
- NEAR balance with yoctoNEAR display
- Staked amount
- Storage usage in KB/MB
- Latest block height

### Transaction List
- Transaction hash with clickable link
- From/To addresses
- Block height
- Action badges (color-coded)
- Deposit amounts
- Transaction fees
- Success/Failed status
- Pagination controls

### Token Display
- Separate sections for FTs and NFTs
- Token count badges
- Contract addresses
- Links to NearBlocks Explorer

## 🛠️ Configuration

### Change Cache Duration
Edit `start-server.js`:
```javascript
process.env.CACHE_TTL = '60'; // 60 seconds
```

### Change Port
```javascript
process.env.PORT = '3002';
```

Don't forget to update the Vite proxy in `client/vite.config.js` if you change the backend port.

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Kill processes on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Kill processes on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Server Not Responding
1. Check if node process is running:
   ```powershell
   Get-Process node
   ```

2. Restart the server (see commands above)

3. Check the console output for errors

### API Errors
- Verify your API key is correct in `start-server.js`
- Check if you've exceeded API rate limits
- Ensure internet connection is active

## 📸 Screenshots to Test

1. **Homepage** - Hero section with search bar
2. **Account Overview** - 4 stat cards with real data
3. **Transactions** - Paginated list with status badges
4. **Tokens** - FT and NFT sections
5. **Responsive** - Check on mobile viewport

## ✨ What Makes This Special

1. **No Mock Data** - 100% real blockchain data
2. **Smart Caching** - Preserves API calls
3. **Error Handling** - Graceful error messages
4. **Loading States** - Skeleton loaders
5. **Modern Stack** - React 18 + Vite + Express
6. **Beautiful UI** - Professional design
7. **Mobile Ready** - Responsive on all devices
8. **Type-Safe** - Proper data validation

## 🎯 Next Steps (Optional Enhancements)

1. **Add More Features**
   - Account creation date formatting
   - Price charts (if price data available)
   - Export transaction history
   - Favorite/bookmark accounts

2. **Improve Performance**
   - Increase cache TTL
   - Add Redis for persistent caching
   - Implement pagination state management

3. **Enhance UI**
   - Dark mode toggle
   - Custom themes
   - Advanced filters
   - Transaction search

4. **Deploy**
   - Host on Vercel (frontend)
   - Host on Railway/Render (backend)
   - Add production environment variables

## 📱 Access Your Application

**Frontend**: http://localhost:5173
**Backend API**: http://localhost:3001

## 🎉 Enjoy Your NEAR Wallet Tracker!

Your application is fully functional with real NEAR blockchain data. Start by searching for any NEAR account and explore the features!

---

**Need help?** Check the console logs in both frontend (browser DevTools) and backend (PowerShell window) for detailed information.

