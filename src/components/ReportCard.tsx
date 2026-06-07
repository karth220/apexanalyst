import { Download, User, Calendar } from 'lucide-react';
import type { ResearchReport } from '../types';

interface ReportCardProps {
  report: ResearchReport;
  onDownloadStart?: () => void;
  onDownloadEnd?: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ 
  report, 
  onDownloadStart,
  onDownloadEnd 
}) => {
  const {
    stockName,
    ticker,
    title,
    sector,
    date,
    analyst,
    pdfDataUrl,
    fileName,
    summary,
    currentPrice,
    targetPrice,
    recommendation,
  } = report;

  // Calculate potential upside
  const upsidePercent = ((targetPrice - currentPrice) / currentPrice) * 100;
  const isPositiveUpside = upsidePercent > 0;
  const isNegativeUpside = upsidePercent < 0;

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onDownloadStart) onDownloadStart();

    try {
      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = fileName || `${ticker}_Research_Report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      if (onDownloadEnd) {
        // Add a slight delay to make the UX download toast feel premium
        setTimeout(onDownloadEnd, 600);
      }
    }
  };

  const getRecommendationClass = () => {
    switch (recommendation) {
      case 'BUY': return 'buy';
      case 'HOLD': return 'hold';
      case 'SELL': return 'sell';
      default: return '';
    }
  };

  return (
    <article className={`report-card ${getRecommendationClass()} animate-fade-in`}>
      <div className="card-header">
        <div className="stock-badge-container">
          <span className="stock-ticker">{ticker}</span>
          <span className="stock-name" title={stockName}>{stockName}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexDirection: 'column', alignItems: 'flex-end' }}>
          <span className={`badge badge-${recommendation.toLowerCase()}`}>
            {recommendation}
          </span>
          <span className="badge badge-sector">{sector}</span>
        </div>
      </div>

      <h3 className="card-title" title={title}>{title}</h3>
      <p className="card-summary" title={summary}>{summary}</p>

      <div className="pricing-grid">
        <div className="price-item">
          <span className="price-label">Current</span>
          <span className="price-value">${currentPrice.toFixed(2)}</span>
        </div>
        <div className="price-item">
          <span className="price-label">Target</span>
          <span className="price-value">${targetPrice.toFixed(2)}</span>
        </div>
        <div className="price-item">
          <span className="price-label">Upside</span>
          <span className={`upside-value ${isPositiveUpside ? 'positive' : isNegativeUpside ? 'negative' : 'neutral'}`}>
            {isPositiveUpside ? '+' : ''}{upsidePercent.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="card-footer">
        <div className="analyst-info">
          <span className="analyst-name" title={analyst}>
            <User size={12} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle', color: 'var(--text-muted)' }} />
            {analyst}
          </span>
          <span className="report-date">
            <Calendar size={12} style={{ display: 'inline', marginRight: '0.25rem', verticalAlign: 'middle', color: 'var(--text-muted)' }} />
            {date}
          </span>
        </div>

        <button 
          className="btn-download"
          onClick={handleDownload}
          title={`Download ${fileName}`}
        >
          <Download size={14} />
          <span>PDF</span>
        </button>
      </div>
    </article>
  );
};
