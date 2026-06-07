export interface ResearchReport {
  id: string;
  stockName: string;
  ticker: string;
  title: string;
  sector: string;
  date: string;
  analyst: string;
  pdfDataUrl: string; // Base64 Data URL of the PDF
  fileName: string;
  summary: string;
  targetPrice: number;
  currentPrice: number;
  recoPrice: number; // Price when recommendation was made
  recommendation: 'BUY' | 'HOLD' | 'SELL';
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
}
