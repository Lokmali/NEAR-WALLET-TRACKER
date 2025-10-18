import { useState, useEffect } from 'react'
import axios from 'axios'
import './TokenList.css'

function TokenList({ accountId }) {
  const [tokens, setTokens] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await axios.get(`/api/account/${accountId}/tokens`)
        setTokens(response.data)
      } catch (err) {
        console.error('Error fetching tokens:', err)
        setError(err.response?.data?.error || 'Failed to fetch tokens')
      } finally {
        setLoading(false)
      }
    }

    if (accountId) {
      fetchTokens()
    }
  }, [accountId])

  const shortenAddress = (address) => {
    if (!address) return ''
    if (address.length <= 20) return address
    return `${address.substring(0, 12)}...${address.substring(address.length - 8)}`
  }

  if (loading) {
    return (
      <div className="token-list">
        <div className="section-header">
          <h2>Tokens & NFTs</h2>
        </div>
        <div className="tokens-grid">
          {[1, 2].map(i => (
            <div key={i} className="token-section">
              <div className="skeleton" style={{ height: '24px', width: '40%', marginBottom: '12px' }}></div>
              <div className="skeleton" style={{ height: '60px', width: '100%' }}></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="token-list">
        <div className="section-header">
          <h2>Tokens & NFTs</h2>
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

  if (!tokens) return null

  const hasFTs = tokens.fungible_tokens && tokens.fungible_tokens.length > 0
  const hasNFTs = tokens.nfts && tokens.nfts.length > 0

  return (
    <div className="token-list fade-in">
      <div className="section-header">
        <h2>Tokens & NFTs</h2>
        <div className="token-counts">
          <span className="token-count-badge ft">
            <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {tokens.ft_count} FT{tokens.ft_count !== 1 ? 's' : ''}
          </span>
          <span className="token-count-badge nft">
            <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {tokens.nft_count} NFT{tokens.nft_count !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {!hasFTs && !hasNFTs ? (
        <div className="empty-state">
          <svg className="empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p><strong>No tokens or NFTs found</strong></p>
          <p className="empty-hint">This account doesn't hold any fungible tokens (FTs) or NFT collections yet.</p>
          <div className="empty-actions">
            <p>Try accounts with tokens:</p>
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
        <div className="tokens-grid">
          {/* Fungible Tokens */}
          {hasFTs && (
            <div className="token-section">
              <h3 className="section-title">
                <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Fungible Tokens ({tokens.ft_count})
              </h3>
              <div className="token-items">
                {tokens.fungible_tokens.map((token, index) => (
                  <div key={token || index} className="token-item">
                    <div className="token-icon-placeholder ft-icon">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="token-info">
                      <div className="token-name">{shortenAddress(token)}</div>
                      <a
                        href={`https://nearblocks.io/token/${token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="token-link"
                      >
                        View on Explorer
                        <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NFTs */}
          {hasNFTs && (
            <div className="token-section">
              <h3 className="section-title">
                <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                NFT Collections ({tokens.nft_count})
              </h3>
              <div className="token-items">
                {tokens.nfts.map((nft, index) => (
                  <div key={nft || index} className="token-item">
                    <div className="token-icon-placeholder nft-icon">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="token-info">
                      <div className="token-name">{shortenAddress(nft)}</div>
                      <a
                        href={`https://nearblocks.io/nft-token/${nft}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="token-link"
                      >
                        View Collection
                        <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TokenList


