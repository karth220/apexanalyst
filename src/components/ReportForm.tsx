import React, { useState, useRef } from 'react';
import { Upload, X, CheckCircle, Eye, ArrowRight, Download, FileJson } from 'lucide-react';
import type { ResearchReport } from '../types';
import { ReportCard } from './ReportCard';
import { MOCK_PDF_BASE64 } from '../data/reports';

interface ReportFormProps {
  onSubmit: (report: ResearchReport) => void;
  onCancel: () => void;
  reportsList: ResearchReport[];
  onImportDatabase: (imported: ResearchReport[]) => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ 
  onSubmit, 
  onCancel,
  reportsList,
  onImportDatabase
}) => {
  // Form states
  const [stockName, setStockName] = useState('');
  const [ticker, setTicker] = useState('');
  const [title, setTitle] = useState('');
  const [sector, setSector] = useState('Technology');
  const [analyst, setAnalyst] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [recommendation, setRecommendation] = useState<'BUY' | 'HOLD' | 'SELL'>('BUY');
  const [currentPrice, setCurrentPrice] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [recoPrice, setRecoPrice] = useState('');
  const [summary, setSummary] = useState('');
  
  // File upload states
  const [pdfDataUrl, setPdfDataUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sectors list
  const sectors = [
    'Technology',
    'Semiconductors',
    'Healthcare',
    'Financials',
    'Energy',
    'Consumer Discretionary',
    'Consumer Staples',
    'Industrials',
    'Automotive',
    'Materials',
    'Utilities',
    'Real Estate',
    'Other'
  ];

  // Handle PDF file selection and Base64 conversion
  const handleFileChange = (file: File) => {
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('Please upload a valid PDF file.');
      return;
    }

    // PDF Size validation (e.g., limit to 10MB to prevent localStorage overflow, localStorage standard limit is 5MB.
    // Wait, let's warning the user if file is larger than 1.5MB because localStorage is limited to 5MB.
    if (file.size > 2.5 * 1024 * 1024) {
      alert('Warning: File is too large! Please upload a PDF under 2.5MB to ensure it fits in browser memory.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPdfDataUrl(reader.result as string);
      setFileName(file.name);
      setFileSize(file.size);
    };
    reader.onerror = () => {
      alert('Error reading PDF file.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const removeFile = () => {
    setPdfDataUrl('');
    setFileName('');
    setFileSize(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!stockName || !ticker || !title || !analyst || !currentPrice || !targetPrice || !summary || !pdfDataUrl) {
      alert('Please fill out all fields and upload a PDF report.');
      return;
    }

    const newReport: ResearchReport = {
      id: `report-${Date.now()}`,
      stockName,
      ticker: ticker.toUpperCase().trim(),
      title,
      sector,
      date,
      analyst,
      pdfDataUrl,
      fileName,
      summary,
      currentPrice: Number(currentPrice),
      targetPrice: Number(targetPrice),
      recoPrice: recoPrice ? Number(recoPrice) : Number(currentPrice),
      recommendation,
    };

    onSubmit(newReport);
  };

  // Live preview report object
  const previewReport: ResearchReport = {
    id: 'preview',
    stockName: stockName || 'Stock Corporation',
    ticker: (ticker || 'TICKER').toUpperCase().trim(),
    title: title || 'Executive Analysis Title',
    sector,
    date: date || new Date().toISOString().split('T')[0],
    analyst: analyst || 'Lead Analyst',
    pdfDataUrl: pdfDataUrl || MOCK_PDF_BASE64,
    fileName: fileName || 'preview_report.pdf',
    summary: summary || 'A detailed preview of the investment thesis, key metrics, and strategic direction will display here as you write.',
    currentPrice: Number(currentPrice) || 100,
    targetPrice: Number(targetPrice) || 120,
    recoPrice: recoPrice ? Number(recoPrice) : (Number(currentPrice) || 100),
    recommendation,
  };

  // Export current reports as JSON file
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(reportsList, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'apexanalysis_reports_database.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import reports JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          // Quick validation of items
          const isValid = json.every(item => 
            item.id && 
            item.stockName && 
            item.ticker && 
            item.title && 
            item.pdfDataUrl
          );
          if (isValid) {
            onImportDatabase(json);
            alert(`Database imported successfully! Loaded ${json.length} reports.`);
          } else {
            alert('Invalid database format. Ensure items have correct metadata and PDF payloads.');
          }
        } else {
          alert('Invalid format. File must contain a JSON array of reports.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="portal-layout animate-fade-in">
      <div className="portal-form-container">
        <h2 className="portal-title">Analyst Portal</h2>
        <p className="portal-subtitle">Publish new research reports. Complete metadata forms and upload the report PDF.</p>

        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="ticker">Stock Ticker *</label>
            <input 
              className="form-input"
              type="text" 
              id="ticker"
              placeholder="e.g. AAPL"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="stockName">Stock Name *</label>
            <input 
              className="form-input"
              type="text" 
              id="stockName"
              placeholder="e.g. Apple Inc."
              value={stockName}
              onChange={(e) => setStockName(e.target.value)}
              required
            />
          </div>

          <div className="form-group grid-span-2">
            <label className="form-label" htmlFor="title">Report Title *</label>
            <input 
              className="form-input"
              type="text" 
              id="title"
              placeholder="e.g. Navigation Services Expansion and AI Capabilities"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="sector">Sector *</label>
            <select 
              className="form-select"
              id="sector"
              value={sector}
              onChange={(e) => setSector(e.target.value)}
            >
              {sectors.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="recommendation">Analyst Rating *</label>
            <select 
              className="form-select"
              id="recommendation"
              value={recommendation}
              onChange={(e) => setRecommendation(e.target.value as 'BUY' | 'HOLD' | 'SELL')}
            >
              <option value="BUY">BUY</option>
              <option value="HOLD">HOLD</option>
              <option value="SELL">SELL</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="currentPrice">Current Stock Price (LTP) (₹) *</label>
            <input 
              className="form-input"
              type="number" 
              step="0.01"
              id="currentPrice"
              placeholder="e.g. 416.10"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="recoPrice">Price at Recommendation (₹)</label>
            <input 
              className="form-input"
              type="number" 
              step="0.01"
              id="recoPrice"
              placeholder="Defaults to Current Price"
              value={recoPrice}
              onChange={(e) => setRecoPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="targetPrice">Target Price (₹) *</label>
            <input 
              className="form-input"
              type="number" 
              step="0.01"
              id="targetPrice"
              placeholder="e.g. 550.00"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="analyst">Analyst Name / Firm *</label>
            <input 
              className="form-input"
              type="text" 
              id="analyst"
              placeholder="e.g. Sarah Jenkins, CFA"
              value={analyst}
              onChange={(e) => setAnalyst(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="date">Publish Date *</label>
            <input 
              className="form-input"
              type="date" 
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group grid-span-2">
            <label className="form-label" htmlFor="summary">Executive Summary *</label>
            <textarea 
              className="form-textarea"
              id="summary"
              placeholder="Write a concise overview of the stock, investment thesis highlights, or core catalysts..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="form-group grid-span-2">
            <label className="form-label">Upload Report PDF *</label>
            
            {!pdfDataUrl ? (
              <div 
                className={`file-upload-area ${isDragOver ? 'dragover' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="file-input"
                  accept=".pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileChange(file);
                  }}
                />
                <div className="upload-icon">
                  <Upload size={32} />
                </div>
                <p className="upload-text">Drag and drop your report PDF here</p>
                <p className="upload-hint">or click to browse from files (limit 2.5MB)</p>
              </div>
            ) : (
              <div 
                className="file-upload-area" 
                style={{ 
                  borderColor: 'var(--color-emerald)', 
                  backgroundColor: 'rgba(16, 185, 129, 0.02)',
                  cursor: 'default'
                }}
              >
                <div className="upload-success-state">
                  <CheckCircle size={32} className="file-success-icon" />
                  <span className="uploaded-filename" title={fileName}>{fileName}</span>
                  {fileSize && (
                    <span className="uploaded-filesize">{formatBytes(fileSize)}</span>
                  )}
                  <button 
                    type="button" 
                    className="btn-remove-file"
                    onClick={removeFile}
                  >
                    <X size={12} style={{ display: 'inline', marginRight: '0.2rem', verticalAlign: 'middle' }} />
                    Remove PDF
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="form-actions grid-span-2">
            <button 
              type="button" 
              className="btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={!pdfDataUrl || !stockName || !ticker || !title || !currentPrice || !targetPrice || !analyst || !summary}
            >
              Publish Report
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        {/* Database JSON Backup and Import options */}
        <div className="db-management-card">
          <h3 className="db-title">
            <FileJson size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle', color: 'var(--color-cyan)' }} />
            Database Operations
          </h3>
          <p className="db-desc">
            To publish permanently on Vercel, click "Export JSON" to download your current reports. You can copy these into `src/data/reports.ts` or re-import this JSON back into any browser.
          </p>
          <div className="db-actions">
            <button 
              type="button" 
              className="btn-db"
              onClick={handleExportJSON}
            >
              <Download size={14} />
              Export JSON
            </button>
            <label className="btn-db" style={{ cursor: 'pointer' }}>
              <Upload size={14} />
              Import JSON
              <input 
                type="file" 
                accept=".json" 
                style={{ display: 'none' }} 
                onChange={handleImportJSON}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="preview-container">
        <div className="preview-header">
          <Eye size={16} />
          <span>Live Card Preview</span>
        </div>
        <div className="preview-card-wrapper">
          <ReportCard report={previewReport} />
        </div>
      </div>
    </div>
  );
};
