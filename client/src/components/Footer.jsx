import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>NEAR Wallet Tracker</h4>
            <p>Real-time blockchain explorer for NEAR Protocol</p>
          </div>
          
          <div className="footer-section">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li>
                <a href="https://near.org" target="_blank" rel="noopener noreferrer">
                  NEAR Protocol
                </a>
              </li>
              <li>
                <a href="https://nearblocks.io" target="_blank" rel="noopener noreferrer">
                  NearBlocks Explorer
                </a>
              </li>
              <li>
                <a href="https://docs.near.org" target="_blank" rel="noopener noreferrer">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Powered By</h4>
            <p className="powered-by">
              <a href="https://nearblocks.io" target="_blank" rel="noopener noreferrer">
                NearBlocks API
              </a>
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} NEAR Wallet Tracker. Built with ❤️ for the NEAR community.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

