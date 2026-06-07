import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MarketTicker } from './components/MarketTicker';
import { ReportCard } from './components/ReportCard';
import { ReportForm } from './components/ReportForm';
import { DEFAULT_REPORTS } from './data/reports';
import type { ResearchReport } from './types';
import { Search, Filter, CheckCircle, Download, Lock } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'apexanalysis_reports';
const ANALYST_PASSCODE = 'APEX99';

function App() {
  const [activePage, setActivePage] = useState<'home' | 'upload'>('home');
  const [reports, setReports] = useState<ResearchReport[]>([]);
  
  // Authorization states
  const [isAuthorized, setIsAuthorized] = useState(() => sessionStorage.getItem('apex_analyst_authorized') === 'true');
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  
  // Filtering and Searching states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [selectedRating, setSelectedRating] = useState('All Ratings');
  
  // UX Feedback Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastIconType, setToastIconType] = useState<'success' | 'download'>('success');

  // Load reports from LocalStorage or fallback to default mock reports
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReports(parsed);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to parse stored reports', err);
    }
    
    // Fallback if local storage is empty or corrupt
    setReports(DEFAULT_REPORTS);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_REPORTS));
  }, []);

  // Show status toast helper
  const showToast = (message: string, type: 'success' | 'download' = 'success') => {
    setToastMessage(message);
    setToastIconType(type);
    
    const duration = type === 'download' ? 2000 : 3500;
    
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, duration);
    
    return () => clearTimeout(timer);
  };

  // Handle analyst portal passcode verification
  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeAttempt === ANALYST_PASSCODE) {
      setIsAuthorized(true);
      sessionStorage.setItem('apex_analyst_authorized', 'true');
      setPasscodeError('');
      setPasscodeAttempt('');
      showToast('Access granted! Welcome to the Analyst Portal.', 'success');
    } else {
      setPasscodeError('Invalid passcode. Please try again.');
    }
  };

  // Publish new research report
  const handlePublishReport = (newReport: ResearchReport) => {
    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setActivePage('home');
    showToast(`Research report for ${newReport.ticker} published successfully!`, 'success');
  };

  // Delete an existing research report
  const handleDeleteReport = (id: string, ticker: string) => {
    if (window.confirm(`Are you sure you want to delete the research report for ${ticker}?`)) {
      const updated = reports.filter(r => r.id !== id);
      setReports(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      showToast(`Report for ${ticker} deleted successfully.`, 'success');
    }
  };

  // Import external database JSON
  const handleImportDatabase = (importedReports: ResearchReport[]) => {
    setReports(importedReports);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(importedReports));
    setActivePage('home');
    showToast(`Loaded ${importedReports.length} reports from backup!`, 'success');
  };

  // Reset all dashboard search and filters
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedSector('All Sectors');
    setSelectedRating('All Ratings');
  };

  // Get dynamic unique list of sectors currently present in reports
  const availableSectors = ['All Sectors', ...new Set(reports.map(r => r.sector))];

  // Filtering Logic
  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.stockName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.analyst.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector = selectedSector === 'All Sectors' || report.sector === selectedSector;
    const matchesRating = selectedRating === 'All Ratings' || report.recommendation === selectedRating;

    return matchesSearch && matchesSector && matchesRating;
  });

  return (
    <div className="app-container">
      {/* Dynamic Market Stock Ticker */}
      <MarketTicker />

      {/* Website Header */}
      <Header activePage={activePage} setActivePage={setActivePage} />

      {/* Main Container */}
      <main className="main-content">
        {activePage === 'home' ? (
          <>
            {/* Hero Branding Section */}
            <div className="dashboard-hero animate-fade-in">
              <span className="hero-subtitle">Equity Research Hub</span>
              <h1 className="hero-title">Institutional Grade Stock Insights</h1>
              <p className="hero-desc">
                Browse, upload, and download detailed stock analysis PDF reports. 
                Keep track of target price estimates, upside potentials, and analyst theses.
              </p>
            </div>

            {/* Searching and Filtering controls */}
            <div className="filter-bar animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="search-container">
                <Search size={18} className="search-icon" />
                <input 
                  type="text" 
                  className="search-input"
                  placeholder="Search by ticker, stock name, thesis keywords..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filters-group">
                <span className="filter-label">Filter By:</span>
                
                <select 
                  className="select-filter"
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                >
                  {availableSectors.map(sec => (
                    <option key={sec} value={sec}>{sec}</option>
                  ))}
                </select>

                <select 
                  className="select-filter"
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                >
                  <option value="All Ratings">All Ratings</option>
                  <option value="BUY">BUY</option>
                  <option value="HOLD">HOLD</option>
                  <option value="SELL">SELL</option>
                </select>

                {(searchQuery || selectedSector !== 'All Sectors' || selectedRating !== 'All Ratings') && (
                  <button 
                    className="btn-clear" 
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Reports Display Grid */}
            <div className="reports-grid">
              {filteredReports.length > 0 ? (
                filteredReports.map((report, idx) => (
                  <div key={report.id} style={{ animationDelay: `${0.15 + idx * 0.05}s` }}>
                    <ReportCard 
                      report={report} 
                      onDownloadStart={() => showToast(`Preparing ${report.fileName || report.ticker + '.pdf'} for download...`, 'download')}
                      onDownloadEnd={() => showToast(`Report for ${report.ticker} downloaded!`, 'success')}
                      isAnalystMode={isAuthorized}
                      onDelete={() => handleDeleteReport(report.id, report.ticker)}
                    />
                  </div>
                ))
              ) : (
                <div className="empty-state animate-fade-in">
                  <div className="empty-icon">
                    <Filter size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="empty-title">No reports matched your criteria</h3>
                  <p className="empty-desc">
                    Try adjusting your search queries, changing the category filters, or write a new analysis.
                  </p>
                  <button 
                    className="nav-action-btn"
                    style={{ marginTop: '0.75rem' }}
                    onClick={() => {
                      handleClearFilters();
                      setActivePage('upload');
                    }}
                  >
                    Publish a Report
                  </button>
                </div>
              )}
            </div>
          </>
        ) : !isAuthorized ? (
          /* Secure Access Gate */
          <div className="access-gate-container animate-fade-in">
            <div className="access-gate-card">
              <div className="lock-icon-wrapper">
                <Lock size={30} />
              </div>
              <h2>Secure Analyst Portal</h2>
              <p>This section is restricted to authorized contributors. Please enter the passcode to access publishing features.</p>
              
              <form onSubmit={handlePasscodeSubmit} className="gate-form">
                <div className="form-group">
                  <input 
                    type="password" 
                    className="form-input text-center" 
                    placeholder="Enter Access Key" 
                    value={passcodeAttempt}
                    onChange={(e) => setPasscodeAttempt(e.target.value)}
                    autoFocus
                  />
                  {passcodeError && <span className="gate-error">{passcodeError}</span>}
                </div>
                <div className="gate-actions">
                  <button type="button" className="btn-secondary" onClick={() => setActivePage('home')}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Verify Key
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          /* Form for Uploading Reports */
          <ReportForm 
            onSubmit={handlePublishReport} 
            onCancel={() => setActivePage('home')} 
            reportsList={reports}
            onImportDatabase={handleImportDatabase}
          />
        )}
      </main>

      {/* Footer Branding */}
      <footer className="site-footer">
        <div className="footer-brand">ApexAnalysis Inc.</div>
        <p>&copy; {new Date().getFullYear()} ApexAnalysis. All rights reserved. Powered by client-side static storage.</p>
      </footer>

      {/* Dynamic Toast Feedback Overlay */}
      {toastMessage && (
        <div className="toast-notification">
          <div className="toast-icon">
            {toastIconType === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <Download size={20} style={{ animation: 'pulse-light 1.5s infinite ease-in-out' }} />
            )}
          </div>
          <span className="toast-message">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
