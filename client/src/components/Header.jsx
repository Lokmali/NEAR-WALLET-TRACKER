import './Header.css'

function Header() {
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
            </svg>
            <span className="logo-text">NEAR Wallet Tracker</span>
          </div>
          
          <nav className="nav">
            <a 
              href="https://nearblocks.io" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link"
            >
              Explorer
            </a>
            <a 
              href="https://near.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link"
            >
              NEAR.org
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header


