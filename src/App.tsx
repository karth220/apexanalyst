import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MarketTicker } from './components/MarketTicker';
import { ReportForm } from './components/ReportForm';
import { DEFAULT_REPORTS } from './data/reports';
import type { ResearchReport } from './types';
import { Search, Filter, CheckCircle, Download, Lock, Trash2, ChevronUp, ChevronDown, ArrowUpDown } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'apexanalysis_reports';
const ANALYST_PASSCODE = 'APEX99';

function App() {
  const [activePage, setActivePage] = useState<'home' | 'upload'>('home');
  const [reports, setReports] = useState<ResearchReport[]>([]);
  
  // Authorization states
  const [isAuthorized, setIsAuthorized] = useState(() => sessionStorage.getItem('apex_analyst_authorized') === 'true');
  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [passcodeError, setPasscodeError] = useState('');

  // LTP editing states
  const [editingLtpId, setEditingLtpId] = useState<string | null>(null);
  const [editingLtpValue, setEditingLtpValue] = useState('');

  // Sort states
  const [sortField, setSortField] = useState<keyof ResearchReport | 'upside' | 'changeSinceReco'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof ResearchReport | 'upside' | 'changeSinceReco') => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedReports = () => {
    const sorted = [...filteredReports];
    sorted.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (sortField === 'upside') {
        valA = ((a.targetPrice - a.currentPrice) / a.currentPrice) * 100;
        valB = ((b.targetPrice - b.currentPrice) / b.currentPrice) * 100;
      } else if (sortField === 'changeSinceReco') {
        valA = ((a.currentPrice - a.recoPrice) / a.recoPrice) * 100;
        valB = ((b.currentPrice - b.recoPrice) / b.recoPrice) * 100;
      } else {
        valA = a[sortField as keyof ResearchReport];
        valB = b[sortField as keyof ResearchReport];
      }

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      } else {
        if (sortField === 'date') {
          return sortDirection === 'asc'
            ? new Date(valA).getTime() - new Date(valB).getTime()
            : new Date(valB).getTime() - new Date(valA).getTime();
        }
        return sortDirection === 'asc' 
          ? (valA as number) - (valB as number) 
          : (valB as number) - (valA as number);
      }
    });
    return sorted;
  };

  const renderSortIcon = (field: keyof ResearchReport | 'upside' | 'changeSinceReco') => {
    if (sortField !== field) {
      return <ArrowUpDown size={10} className="sort-icon-muted" style={{ marginLeft: '0.25rem', verticalAlign: 'middle' }} />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp size={10} className="sort-icon-active" style={{ marginLeft: '0.25rem', verticalAlign: 'middle' }} /> 
      : <ChevronDown size={10} className="sort-icon-active" style={{ marginLeft: '0.25rem', verticalAlign: 'middle' }} />;
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      return `${String(d.getDate()).padStart(2, '0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
    } catch (e) {
      return dateStr;
    }
  };

  
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
          // Self-healing database reset: if it contains old US stock tickers, reset to Indian default listings
          const hasOldStocks = parsed.some(r => r.ticker === 'AAPL' || r.ticker === 'NVDA' || r.ticker === 'TSLA');
          if (hasOldStocks) {
            setReports(DEFAULT_REPORTS);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(DEFAULT_REPORTS));
          } else {
            setReports(parsed);
          }
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

  // Simulate live stock price (LTP) fluctuations in the background when market is open
  useEffect(() => {
    // Only tick when on the homepage and we have reports
    if (activePage !== 'home' || reports.length === 0) return;

    const interval = setInterval(() => {
      setReports(prevReports => {
        return prevReports.map(report => {
          // Normal market fluctuation (-0.08% to +0.08%)
          const fluctuation = (Math.random() - 0.485) * 0.0012; // slight upward bias
          const newPrice = Math.max(0.01, report.currentPrice * (1 + fluctuation));
          
          return {
            ...report,
            currentPrice: Number(newPrice.toFixed(2))
          };
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [activePage, reports.length]);

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
    const password = prompt(`Enter analyst passcode to confirm deletion of ${ticker} report:`);
    if (password === null) return; // user cancelled

    if (password === ANALYST_PASSCODE) {
      const updated = reports.filter(r => r.id !== id);
      setReports(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      showToast(`Report for ${ticker} deleted successfully.`, 'success');
    } else {
      alert('Incorrect passcode. Deletion aborted.');
    }
  };

  // Save manually edited LTP
  const handleSaveLtp = (id: string) => {
    const val = parseFloat(editingLtpValue);
    if (!isNaN(val) && val > 0) {
      const updated = reports.map(r => {
        if (r.id === id) {
          return { ...r, currentPrice: Number(val.toFixed(2)) };
        }
        return r;
      });
      setReports(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      setEditingLtpId(null);
      showToast(`LTP updated successfully.`, 'success');
    } else {
      setEditingLtpId(null);
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

            {/* Reports Display Table */}
            <div className="table-responsive-container animate-fade-in" style={{ animationDelay: '0.15s' }}>
              {filteredReports.length > 0 ? (
                <table className="research-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('date')} className="sortable-header">
                        <div className="header-cell">
                          <span>DATE</span>
                          {renderSortIcon('date')}
                        </div>
                      </th>
                      <th onClick={() => handleSort('stockName')} className="sortable-header">
                        <div className="header-cell">
                          <span>STOCK</span>
                          {renderSortIcon('stockName')}
                        </div>
                      </th>
                      <th onClick={() => handleSort('analyst')} className="sortable-header">
                        <div className="header-cell">
                          <span>AUTHOR</span>
                          {renderSortIcon('analyst')}
                        </div>
                      </th>
                      <th onClick={() => handleSort('currentPrice')} className="sortable-header text-right">
                        <div className="header-cell justify-end">
                          <span>LTP</span>
                          {renderSortIcon('currentPrice')}
                        </div>
                      </th>
                      <th onClick={() => handleSort('targetPrice')} className="sortable-header text-right">
                        <div className="header-cell justify-end">
                          <span>TARGET</span>
                          {renderSortIcon('targetPrice')}
                        </div>
                      </th>
                      <th onClick={() => handleSort('recoPrice')} className="sortable-header text-right">
                        <div className="header-cell justify-end">
                          <span>PRICE AT RECO</span>
                          {renderSortIcon('recoPrice')}
                        </div>
                      </th>
                      <th onClick={() => handleSort('upside')} className="sortable-header text-right">
                        <div className="header-cell justify-end">
                          <span>UPSIDE(%)</span>
                          {renderSortIcon('upside')}
                        </div>
                      </th>
                      <th onClick={() => handleSort('recommendation')} className="sortable-header">
                        <div className="header-cell">
                          <span>TYPE</span>
                          {renderSortIcon('recommendation')}
                        </div>
                      </th>
                      <th className="text-center" style={{ width: '120px' }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedReports().map((report) => {
                      const upsidePercent = ((report.targetPrice - report.currentPrice) / report.currentPrice) * 100;
                      const changeSinceReco = ((report.currentPrice - report.recoPrice) / report.recoPrice) * 100;
                      const isPositiveUpside = upsidePercent > 0;
                      const isNegativeUpside = upsidePercent < 0;
                      const isPositiveChange = changeSinceReco > 0;
                      const isNegativeChange = changeSinceReco < 0;

                      // Download function
                      const handleDownload = (e: React.MouseEvent) => {
                        e.preventDefault();
                        showToast(`Preparing ${report.fileName || report.ticker + '.pdf'} for download...`, 'download');
                        try {
                          const link = document.createElement('a');
                          link.href = report.pdfDataUrl;
                          link.download = report.fileName || `${report.ticker}_Research_Report.pdf`;
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          setTimeout(() => showToast(`Report for ${report.ticker} downloaded!`, 'success'), 600);
                        } catch (err) {
                          console.error('Download failed', err);
                        }
                      };

                      return (
                        <tr key={report.id} className="table-row-hover">
                          {/* Date */}
                          <td className="monospace">{formatDate(report.date)}</td>
                          
                          {/* Stock */}
                          <td>
                            <div className="stock-info-cell">
                              <span className="stock-link-name">{report.stockName}</span>
                              <span className="stock-ticker-label">{report.ticker}</span>
                            </div>
                          </td>
                          
                          {/* Author */}
                          <td>
                            <div className="author-info-cell">
                              <span className="author-name-text">{report.analyst}</span>
                              <div className="author-badges">
                                {report.targetPrice > report.currentPrice ? (
                                  <span className="reco-badge-green">▲ Target</span>
                                ) : (
                                  <span className="reco-badge-red">▼ Target</span>
                                )}
                                {report.currentPrice > report.recoPrice ? (
                                  <span className="reco-badge-green">▲ Reco</span>
                                ) : report.currentPrice < report.recoPrice ? (
                                  <span className="reco-badge-red">▼ Reco</span>
                                ) : null}
                              </div>
                            </div>
                          </td>
                          
                          {/* LTP */}
                          <td className="text-right monospace">
                            {editingLtpId === report.id ? (
                              <input
                                type="number"
                                step="0.01"
                                className="table-ltp-input monospace"
                                value={editingLtpValue}
                                onChange={(e) => setEditingLtpValue(e.target.value)}
                                onBlur={() => handleSaveLtp(report.id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleSaveLtp(report.id);
                                  if (e.key === 'Escape') setEditingLtpId(null);
                                }}
                                autoFocus
                              />
                            ) : (
                              <div 
                                className="ltp-display-cell"
                                onClick={() => {
                                  if (isAuthorized) {
                                    setEditingLtpId(report.id);
                                    setEditingLtpValue(report.currentPrice.toString());
                                  }
                                }}
                                title={isAuthorized ? "Click to edit LTP" : undefined}
                                style={{ cursor: isAuthorized ? 'pointer' : 'default' }}
                              >
                                <span>{report.currentPrice.toFixed(2)}</span>
                                {isAuthorized && <span className="ltp-edit-indicator">✎</span>}
                              </div>
                            )}
                          </td>
                          
                          {/* Target */}
                          <td className="text-right monospace">{report.targetPrice.toFixed(2)}</td>
                          
                          {/* Price at Reco */}
                          <td className="text-right monospace">
                            <div className="font-semibold">{report.recoPrice.toFixed(2)}</div>
                            <div className={`change-reco-text ${isPositiveChange ? 'positive' : isNegativeChange ? 'negative' : 'neutral'}`}>
                              ({isPositiveChange ? '+' : ''}{changeSinceReco.toFixed(2)}%)
                            </div>
                          </td>
                          
                          {/* Upside */}
                          <td className={`text-right monospace font-semibold ${isPositiveUpside ? 'positive' : isNegativeUpside ? 'negative' : 'neutral'}`}>
                            {isPositiveUpside ? '+' : ''}{upsidePercent.toFixed(2)}%
                          </td>
                          
                          {/* Type */}
                          <td>
                            <div className="type-cell">
                              <span className={`type-dot ${report.recommendation.toLowerCase()}`}></span>
                              <span className="type-label-text">{report.recommendation.charAt(0).toUpperCase() + report.recommendation.slice(1).toLowerCase()}</span>
                            </div>
                          </td>
                          
                          {/* Action */}
                          <td>
                            <div className="action-cell">
                              <button 
                                className="table-btn-pdf"
                                onClick={handleDownload}
                                title={`Download PDF: ${report.fileName}`}
                              >
                                <span className="pdf-icon-red">PDF</span>
                              </button>
                              {isAuthorized && (
                                <button 
                                  className="table-btn-delete"
                                  onClick={() => handleDeleteReport(report.id, report.ticker)}
                                  title="Delete Report"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="empty-state">
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
