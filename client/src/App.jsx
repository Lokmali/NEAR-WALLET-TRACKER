import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import AccountOverview from './components/AccountOverview'
import TransactionList from './components/TransactionList'
import TokenList from './components/TokenList'
import SecurityAudit from './components/SecurityAudit'
import Footer from './components/Footer'

function App() {
  const [accountId, setAccountId] = useState('')
  const [activeAccount, setActiveAccount] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = (searchAccountId) => {
    if (!searchAccountId || searchAccountId.trim() === '') {
      setError('Please enter a valid NEAR account ID')
      return
    }

    setAccountId(searchAccountId.trim())
    setActiveAccount(searchAccountId.trim())
    setError(null)
  }

  const handleReset = () => {
    setAccountId('')
    setActiveAccount(null)
    setError(null)
  }

  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="container">
          {/* Hero Section */}
          {!activeAccount && (
            <div className="hero-section fade-in">
              <h1 className="hero-title">
                Track Any NEAR Wallet
              </h1>
              <p className="hero-subtitle">
                Real-time insights into NEAR Protocol accounts, transactions, tokens, and NFTs
              </p>
            </div>
          )}

          {/* Search Bar */}
          <SearchBar 
            onSearch={handleSearch} 
            onReset={handleReset}
            hasActiveAccount={!!activeAccount}
          />

          {/* Error Message */}
          {error && (
            <div className="error-banner fade-in">
              <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          {/* Account Data */}
          {activeAccount && !error && (
            <div className="account-data fade-in">
              <AccountOverview accountId={activeAccount} />
              
              {/* Tabs */}
              <div className="tabs-container">
                <div className="tabs">
                  <button 
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <svg className="tab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    Transactions
                  </button>
                  <button 
                    className={`tab ${activeTab === 'tokens' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tokens')}
                  >
                    <svg className="tab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Tokens & NFTs
                  </button>
                  <button 
                    className={`tab ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                  >
                    <svg className="tab-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Security
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              <div className="tab-content">
                {activeTab === 'overview' && <TransactionList accountId={activeAccount} />}
                {activeTab === 'tokens' && <TokenList accountId={activeAccount} />}
                {activeTab === 'security' && <SecurityAudit accountId={activeAccount} />}
              </div>
            </div>
          )}

          {/* Getting Started */}
          {!activeAccount && !error && (
            <div className="getting-started fade-in">
              <h3>🚀 Getting Started</h3>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">💰</div>
                  <h4>Account Balance</h4>
                  <p>View NEAR balance, staked amount, and storage usage</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h4>Transaction History</h4>
                  <p>Track all transactions with detailed information</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🪙</div>
                  <h4>Tokens & NFTs</h4>
                  <p>Monitor fungible tokens and NFT collections</p>
                </div>
              </div>
              
              <div className="example-accounts">
                <p className="example-title">Try these example accounts:</p>
                <div className="example-buttons">
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleSearch('nearblocks.near')}
                  >
                    nearblocks.near
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleSearch('zavodil.near')}
                  >
                    zavodil.near
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => handleSearch('nearcrowd.near')}
                  >
                    nearcrowd.near
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
