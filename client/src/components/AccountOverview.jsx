import { useState, useEffect } from 'react'
import axios from 'axios'
import { analyzeAccountSecurity } from '../services/securityService'
import './AccountOverview.css'

function AccountOverview({ accountId }) {
  const [accountData, setAccountData] = useState(null)
  const [healthScore, setHealthScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAccountData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const [accountResponse, healthAnalysis] = await Promise.all([
          axios.get(`/api/account/${accountId}`),
          analyzeAccountSecurity(accountId).catch(() => null)
        ])
        
        setAccountData(accountResponse.data)
        if (healthAnalysis) {
          setHealthScore({
            grade: healthAnalysis.healthGrade,
            score: healthAnalysis.healthScore,
            issues: healthAnalysis.totalIssues
          })
        }
      } catch (err) {
        console.error('Error fetching account data:', err)
        setError(err.response?.data?.error || 'Failed to fetch account data')
      } finally {
        setLoading(false)
      }
    }

    if (accountId) {
      fetchAccountData()
    }
  }, [accountId])

  if (loading) {
    return (
      <div className="account-overview">
        <div className="section-header">
          <h2>Account Overview</h2>
        </div>
        <div className="stats-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="stat-card">
              <div className="skeleton" style={{ height: '20px', width: '60%', marginBottom: '8px' }}></div>
              <div className="skeleton" style={{ height: '32px', width: '80%' }}></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="account-overview">
        <div className="error-card">
          <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!accountData) return null

  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    })
  }

  const formatBytes = (bytes) => {
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(2)} KB`
    const mb = kb / 1024
    return `${mb.toFixed(2)} MB`
  }

  return (
    <div className="account-overview fade-in">
      <div className="section-header">
        <h2>Account Overview</h2>
        <div className="header-badges">
          <div className="account-id-badge">
            <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {accountData.account_id}
          </div>
          {healthScore && (
            <div 
              className={`health-score-mini health-${healthScore.grade.toLowerCase()}`}
              title={`Security Health: ${healthScore.score}/100 - ${healthScore.issues} issue(s)`}
            >
              <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Health: {healthScore.grade}
            </div>
          )}
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-header">
            <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="stat-label">NEAR Balance</span>
          </div>
          <div className="stat-value">{formatNumber(accountData.balance)} Ⓝ</div>
          <div className="stat-subtext">{accountData.balance_raw} yoctoNEAR</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="stat-label">Staked</span>
          </div>
          <div className="stat-value">{formatNumber(accountData.staked)} Ⓝ</div>
          <div className="stat-subtext">{accountData.staked_raw} yoctoNEAR</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span className="stat-label">Storage Used</span>
          </div>
          <div className="stat-value">{formatBytes(accountData.storage_used)}</div>
          <div className="stat-subtext">{parseInt(accountData.storage_used).toLocaleString()} bytes</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="stat-label">Block Height</span>
          </div>
          <div className="stat-value">{parseInt(accountData.block_height).toLocaleString()}</div>
          <div className="stat-subtext">Latest update</div>
        </div>
      </div>

      {accountData.cached && (
        <div className="cache-notice">
          <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Cached data - refreshes every 30 seconds</span>
        </div>
      )}
    </div>
  )
}

export default AccountOverview


