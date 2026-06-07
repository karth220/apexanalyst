import { TrendingUp, PlusCircle } from 'lucide-react';

interface HeaderProps {
  activePage: 'home' | 'upload';
  setActivePage: (page: 'home' | 'upload') => void;
}

export const Header: React.FC<HeaderProps> = ({ activePage, setActivePage }) => {
  return (
    <header className="site-header">
      <div className="logo-container" style={{ cursor: 'pointer' }} onClick={() => setActivePage('home')}>
        <div className="logo-icon">
          <TrendingUp size={28} strokeWidth={2.5} />
        </div>
        <span>
          ApexAnalysis
          <span className="logo-badge">PRO</span>
        </span>
      </div>

      <nav className="header-nav">
        <span 
          className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => setActivePage('home')}
        >
          Research Hub
        </span>
        <span 
          className={`nav-link ${activePage === 'upload' ? 'active' : ''}`}
          onClick={() => setActivePage('upload')}
        >
          Analyst Portal
        </span>
        
        {activePage === 'home' && (
          <button 
            className="nav-action-btn"
            onClick={() => setActivePage('upload')}
          >
            <PlusCircle size={16} />
            <span>Publish Report</span>
          </button>
        )}
      </nav>
    </header>
  );
};
