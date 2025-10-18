# NEAR Wallet Tracker 🚀

A real-time blockchain explorer for NEAR Protocol wallets. Track account balances, transactions, tokens, and NFTs using the NearBlocks API.

![NEAR Wallet Tracker](https://img.shields.io/badge/NEAR-Protocol-00C08B?style=for-the-badge&logo=near&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)

## ✨ Features

- 💰 **Account Balance** - View NEAR balance, staked amount, and storage usage
- 📊 **Transaction History** - Real-time transaction tracking with pagination
- 🪙 **Fungible Tokens** - Monitor all FT holdings
- 🖼️ **NFT Collections** - Track NFT collections
- ⚡ **Real-time Data** - Live data from NearBlocks API
- 🎨 **Modern UI** - Beautiful, responsive design
- 🔍 **Smart Search** - Search any NEAR account
- 📱 **Mobile Friendly** - Works on all devices

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express** - RESTful API server
- **Axios** - HTTP client for NearBlocks API
- **Node-Cache** - Smart caching layer (30s TTL)
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Axios** - API communication
- **date-fns** - Date formatting
- **React Icons** - Beautiful icons

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- NearBlocks API key

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd near-wallet-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

3. **Configure environment**
   ```bash
   # Create .env file in root directory
   cp .env.example .env
   ```
   
   Edit `.env` with your API key:
   ```env
   API_BASE_URL=https://api.nearblocks.io/v1
   API_KEY=your_api_key_here
   PORT=3001
   CACHE_TTL=30
   ```

4. **Run the application**
   
   **Option 1: Development mode (both servers)**
   ```bash
   npm run dev
   ```
   
   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Backend
   npm run server
   
   # Terminal 2 - Frontend
   npm run client
   ```

5. **Open your browser**
   ```
   Frontend: http://localhost:5173
   Backend API: http://localhost:3001
   ```

## 🔧 API Endpoints

### Account Information
```http
GET /api/account/:accountId
```
Returns account balance, staked amount, storage usage, and block information.

### Transactions
```http
GET /api/account/:accountId/txns?page=1&per_page=10
```
Returns paginated transaction history.

### Tokens
```http
GET /api/account/:accountId/tokens
```
Returns fungible tokens and NFT collections.

### Transaction Details
```http
GET /api/txns/:txHash
```
Returns detailed transaction information.

### Health Check
```http
GET /api/health
```
Returns API status.

## 📝 Usage Examples

### Search for an Account
1. Enter a NEAR account ID (e.g., `nearblocks.near`)
2. Click "Search" or press Enter
3. View account overview, transactions, and tokens

### Example Accounts to Try
- `nearblocks.near` - NearBlocks official account
- `zavodil.near` - Active community member
- `nearcrowd.near` - NEAR Crowd platform

### View Transactions
- Scroll to "Recent Transactions" section
- Click on transaction hash to view on NearBlocks Explorer
- Use pagination to browse transaction history

### Check Tokens
- View fungible tokens (FTs) and NFT collections
- Click "View on Explorer" to see token details
- Track all token holdings in one place

## 🏗️ Project Structure

```
near-wallet-tracker/
├── server.js                 # Express backend server
├── package.json             # Backend dependencies
├── .env                     # Environment variables
├── README.md               # This file
│
└── client/                  # React frontend
    ├── src/
    │   ├── components/     # React components
    │   │   ├── Header.jsx
    │   │   ├── SearchBar.jsx
    │   │   ├── AccountOverview.jsx
    │   │   ├── TransactionList.jsx
    │   │   ├── TokenList.jsx
    │   │   └── Footer.jsx
    │   ├── App.jsx         # Main app component
    │   ├── main.jsx        # React entry point
    │   └── index.css       # Global styles
    ├── package.json        # Frontend dependencies
    └── vite.config.js      # Vite configuration
```

## 🔒 Security Features

- ✅ API key stored in environment variables
- ✅ CORS protection
- ✅ Input validation
- ✅ Error handling middleware
- ✅ Request timeout (10s)
- ✅ Secure external links (`rel="noopener noreferrer"`)

## ⚡ Performance

- **Caching**: 30-second cache TTL reduces API calls
- **Pagination**: Efficient data loading
- **Lazy Loading**: Components load on demand
- **Optimized Builds**: Vite for fast production builds

## 🎨 Customization

### Change Theme Colors
Edit `client/src/index.css`:
```css
:root {
  --primary-color: #00C08B;  /* NEAR green */
  --accent-color: #6366F1;   /* Indigo */
}
```

### Adjust Cache Duration
Edit `.env`:
```env
CACHE_TTL=60  # 60 seconds
```

### Modify Pagination
Edit `client/src/components/TransactionList.jsx`:
```javascript
const [perPage] = useState(20)  // Show 20 transactions
```

## 🚀 Production Build

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Serve static files** (update `server.js` to serve `client/dist`)

3. **Use process manager**
   ```bash
   pm2 start server.js
   ```

## 🐛 Troubleshooting

### API Rate Limits
- The NearBlocks API has usage limits
- Caching helps reduce API calls
- Monitor your usage in the NearBlocks dashboard

### Port Already in Use
```bash
# Change port in .env
PORT=3002
```

### CORS Errors
- Ensure backend is running
- Check Vite proxy configuration in `client/vite.config.js`

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- **NearBlocks** - For providing the excellent API
- **NEAR Protocol** - For building an amazing blockchain
- **React & Vite** - For the modern development experience

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Support

For issues with:
- **This application**: Open a GitHub issue
- **NearBlocks API**: Visit [nearblocks.io](https://nearblocks.io)
- **NEAR Protocol**: Visit [near.org](https://near.org)

---

**Built with ❤️ for the NEAR community**

