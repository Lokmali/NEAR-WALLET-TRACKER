import { useState, useEffect } from 'react'
import axios from 'axios'
import { formatDistanceToNow } from 'date-fns'
import './TransactionList.css'

function TransactionList({ accountId }) {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [perPage] = useState(10)

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await axios.get(`/api/account/${accountId}/txns`, {
          params: { page, per_page: perPage }
        })
        setTransactions(response.data.transactions || [])
      } catch (err) {
        console.error('Error fetching transactions:', err)
        setError(err.response?.data?.error || 'Failed to fetch transactions')
      } finally {
        setLoading(false)
      }
    }

    if (accountId) {
      fetchTransactions()
    }
  }, [accountId, page, perPage])

  const formatTimestamp = (timestamp) => {
    try {
      const date = new Date(parseInt(timestamp) / 1000000)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch {
      return 'Unknown'
    }
  }

  const shortenHash = (hash) => {
    if (!hash) return ''
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 8)}`
  }

  const getActionBadgeClass = (action) => {
    const type = action.action?.toLowerCase() || ''
    if (type.includes('transfer')) return 'badge-success'
    if (type.includes('function')) return 'badge-info'
    if (type.includes('stake')) return 'badge-warning'
    if (type.includes('delete')) return 'badge-error'
    return 'badge-info'
  }

  const getActionName = (action) => {
    return action.action?.replace('_', ' ') || 'Unknown'
  }

  if (loading) {
    return (
      <div className="transaction-list">
        <div className="section-header">
          <h2>Recent Transactions</h2>
        </div>
        <div className="transactions-container">
          {[1, 2, 3].map(i => (
            <div key={i} className="transaction-item">
              <div className="skeleton" style={{ height: '24px', width: '40%', marginBottom: '8px' }}></div>
              <div className="skeleton" style={{ height: '20px', width: '60%' }}></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="transaction-list">
        <div className="section-header">
          <h2>Recent Transactions</h2>
        </div>
        <div className="error-card">
          <svg className="error-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="transaction-list fade-in">
      <div className="section-header">
        <h2>Recent Transactions</h2>
        <span className="transaction-count">{transactions.length} transactions</span>
      </div>

      {transactions.length === 0 ? (
        <div className="empty-state">
          <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p><strong>No transactions found</strong></p>
          <p className="empty-hint">This account has no transaction history yet, or transactions haven't been indexed.</p>
          <div className="empty-actions">
            <p>Try these active accounts:</p>
            <div className="example-buttons">
              <button className="btn btn-secondary btn-small" onClick={() => window.location.href = '/?account=nearblocks.near'}>
                nearblocks.near
              </button>
              <button className="btn btn-secondary btn-small" onClick={() => window.location.href = '/?account=zavodil.near'}>
                zavodil.near
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="transactions-container">
            {transactions.map((tx, index) => (
              <div key={tx.transaction_hash || index} className="transaction-item">
                <div className="transaction-header">
                  <div className="transaction-info">
                    <a
                      href={`https://nearblocks.io/txns/${tx.transaction_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transaction-hash"
                    >
                      <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                      {shortenHash(tx.transaction_hash)}
                    </a>
                    <span className="transaction-time">{formatTimestamp(tx.block_timestamp)}</span>
                  </div>
                  <div className="transaction-status">
                    {tx.status ? (
                      <span className="badge badge-success">
                        <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Success
                      </span>
                    ) : (
                      <span className="badge badge-error">
                        <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Failed
                      </span>
                    )}
                  </div>
                </div>

                <div className="transaction-details">
                  <div className="transaction-row">
                    <span className="label">From:</span>
                    <span className="value address">{tx.signer_account_id}</span>
                  </div>
                  <div className="transaction-row">
                    <span className="label">To:</span>
                    <span className="value address">{tx.receiver_account_id}</span>
                  </div>
                  <div className="transaction-row">
                    <span className="label">Block:</span>
                    <span className="value">#{tx.block_height?.toLocaleString()}</span>
                  </div>
                </div>

                {tx.actions && tx.actions.length > 0 && (
                  <div className="transaction-actions">
                    <span className="actions-label">Actions:</span>
                    <div className="actions-list">
                      {tx.actions.slice(0, 3).map((action, i) => (
                        <span key={i} className={`badge ${getActionBadgeClass(action)}`}>
                          {getActionName(action)}
                        </span>
                      ))}
                      {tx.actions.length > 3 && (
                        <span className="badge">+{tx.actions.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}

                <div className="transaction-footer">
                  {parseFloat(tx.deposit) > 0 && (
                    <div className="transaction-amount">
                      <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="amount-value">{parseFloat(tx.deposit).toFixed(4)} Ⓝ</span>
                    </div>
                  )}
                  <div className="transaction-fee">
                    <span className="fee-label">Fee:</span>
                    <span className="fee-value">{parseFloat(tx.transaction_fee).toFixed(6)} Ⓝ</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {transactions.length >= perPage && (
            <div className="pagination">
              <button
                className="btn btn-secondary"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <span className="page-info">Page {page}</span>
              <button
                className="btn btn-secondary"
                onClick={() => setPage(p => p + 1)}
                disabled={transactions.length < perPage}
              >
                Next
                <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TransactionList


