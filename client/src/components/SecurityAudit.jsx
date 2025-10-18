import { useState, useEffect } from 'react'
import { 
  analyzeAccountSecurity, 
  getSecurityRecommendations, 
  formatPublicKey,
  getRevokeInstructions 
} from '../services/securityService'
import './SecurityAudit.css'

function SecurityAudit({ accountId }) {
  const [analysis, setAnalysis] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedKey, setSelectedKey] = useState(null)
  const [expandedKeys, setExpandedKeys] = useState(new Set())

  useEffect(() => {
    const analyzeAccount = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const result = await analyzeAccountSecurity(accountId)
        setAnalysis(result)
        setRecommendations(getSecurityRecommendations(result))
      } catch (err) {
        console.error('Security analysis error:', err)
        setError(err.message || 'Failed to analyze account security')
      } finally {
        setLoading(false)
      }
    }

    if (accountId) {
      analyzeAccount()
    }
  }, [accountId])

  const toggleKeyExpand = (publicKey) => {
    const newExpanded = new Set(expandedKeys)
    if (newExpanded.has(publicKey)) {
      newExpanded.delete(publicKey)
    } else {
      newExpanded.add(publicKey)
    }
    setExpandedKeys(newExpanded)
  }

  const getGradeColor = (grade) => {
    switch(grade) {
      case 'A': return '#10B981'
      case 'B': return '#3B82F6'
      case 'C': return '#F59E0B'
      case 'D': return '#EF4444'
      case 'F': return '#991B1B'
      default: return '#6B7280'
    }
  }

  const getSeverityBadgeClass = (severity) => {
    switch(severity) {
      case 'high': return 'severity-high'
      case 'medium': return 'severity-medium'
      case 'low': return 'severity-low'
      default: return 'severity-info'
    }
  }

  if (loading) {
    return (
      <div className="security-audit">
        <div className="section-header">
          <h2>Security & Health Audit</h2>
        </div>
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Analyzing account security...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="security-audit">
        <div className="section-header">
          <h2>Security & Health Audit</h2>
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

  if (!analysis) return null

  return (
    <div className="security-audit fade-in">
      {/* Header with Health Score */}
      <div className="section-header">
        <h2>Security & Health Audit</h2>
        <div className="health-badge" style={{ backgroundColor: getGradeColor(analysis.healthGrade) }}>
          <span className="health-grade">{analysis.healthGrade}</span>
          <span className="health-score">{analysis.healthScore}/100</span>
        </div>
      </div>

      {/* Security Overview Stats */}
      <div className="security-stats">
        <div className="stat-item">
          <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <span className="stat-label">Total Keys</span>
          <span className="stat-value">{analysis.totalKeys}</span>
        </div>
        <div className="stat-item">
          <svg className="stat-icon danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="stat-label">Full-Access</span>
          <span className="stat-value danger">{analysis.fullAccessKeys}</span>
        </div>
        <div className="stat-item">
          <svg className="stat-icon safe" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="stat-label">Function-Call</span>
          <span className="stat-value safe">{analysis.functionCallKeys}</span>
        </div>
        <div className="stat-item">
          <svg className="stat-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="stat-label">Issues</span>
          <span className="stat-value warning">{analysis.totalIssues}</span>
        </div>
      </div>

      {/* Issues Summary */}
      {analysis.totalIssues > 0 && (
        <div className="issues-summary">
          <h3>
            <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Security Issues Found ({analysis.totalIssues})
          </h3>
          <div className="issues-list">
            {analysis.allIssues.map((issue, idx) => (
              <div key={idx} className={`issue-card ${getSeverityBadgeClass(issue.severity)}`}>
                <div className="issue-header">
                  <span className={`severity-badge ${getSeverityBadgeClass(issue.severity)}`}>
                    {issue.severity.toUpperCase()}
                  </span>
                  <span className="issue-message">{issue.message}</span>
                </div>
                <p className="issue-description">{issue.description}</p>
                <div className="issue-action">
                  <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {issue.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Access Keys Details */}
      <div className="keys-section">
        <h3>
          <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Access Keys ({analysis.totalKeys})
        </h3>

        <div className="keys-list">
          {analysis.keys.map((key, idx) => {
            const isExpanded = expandedKeys.has(key.publicKey)
            const instructions = getRevokeInstructions(key.keyType)
            
            return (
              <div key={idx} className="key-card">
                <div className="key-header" onClick={() => toggleKeyExpand(key.publicKey)}>
                  <div className="key-info">
                    <span className={`key-type-badge ${key.isFullAccess ? 'full-access' : 'function-call'}`}>
                      {key.isFullAccess ? '🔓 Full-Access' : '🔐 Function-Call'}
                    </span>
                    <span className="key-public">{formatPublicKey(key.publicKey)}</span>
                    {key.knownApp && (
                      <span className="key-app-badge">
                        ✓ {key.knownApp.name}
                      </span>
                    )}
                  </div>
                  <svg 
                    className={`expand-icon ${isExpanded ? 'expanded' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {isExpanded && (
                  <div className="key-details">
                    {key.isFunctionCall && (
                      <>
                        <div className="detail-row">
                          <span className="detail-label">Contract:</span>
                          <span className="detail-value">{key.receiverId}</span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Allowance:</span>
                          <span className="detail-value">
                            {key.allowance ? `${(parseFloat(key.allowance) / 1e24).toFixed(4)} NEAR` : 'Unlimited'}
                          </span>
                        </div>
                        <div className="detail-row">
                          <span className="detail-label">Methods:</span>
                          <span className="detail-value">
                            {key.methodNames.length > 0 ? key.methodNames.join(', ') : 'All methods'}
                          </span>
                        </div>
                      </>
                    )}
                    
                    <div className="detail-row">
                      <span className="detail-label">Nonce:</span>
                      <span className="detail-value">{key.nonce}</span>
                    </div>

                    {(key.issues.length > 0 || key.warnings.length > 0) && (
                      <div className="key-issues">
                        {[...key.issues, ...key.warnings].map((issue, i) => (
                          <div key={i} className={`key-issue ${getSeverityBadgeClass(issue.severity)}`}>
                            <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{issue.message}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="key-actions">
                      <button 
                        className="btn btn-secondary btn-small"
                        onClick={() => setSelectedKey(key)}
                      >
                        How to Revoke
                      </button>
                      <a 
                        href={`https://nearblocks.io/address/${accountId}#keys`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-small"
                      >
                        View on Explorer
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>
            <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Security Recommendations
          </h3>
          <div className="recommendations-list">
            {recommendations.map((rec, idx) => (
              <div key={idx} className={`recommendation-card priority-${rec.priority}`}>
                <div className="rec-header">
                  <span className={`priority-badge priority-${rec.priority}`}>
                    {rec.priority}
                  </span>
                  <h4>{rec.title}</h4>
                </div>
                <p>{rec.description}</p>
                <div className="rec-action">
                  <span>✓ {rec.action}</span>
                  {rec.link && (
                    <a href={rec.link} target="_blank" rel="noopener noreferrer">
                      {rec.linkText} →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Revoke Instructions Modal */}
      {selectedKey && (
        <div className="modal-overlay" onClick={() => setSelectedKey(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>How to Revoke This Key</h3>
              <button className="modal-close" onClick={() => setSelectedKey(null)}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-box">
                <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>{getRevokeInstructions(selectedKey.keyType).warning}</p>
              </div>
              <ol className="steps-list">
                {getRevokeInstructions(selectedKey.keyType).steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ol>
              <a 
                href={getRevokeInstructions(selectedKey.keyType).link}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                {getRevokeInstructions(selectedKey.keyType).linkText}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Footer Notice */}
      <div className="security-footer">
        <svg className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Read-only analysis using NEAR RPC. No keys collected or stored.</span>
      </div>
    </div>
  )
}

export default SecurityAudit

