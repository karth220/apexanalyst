import type { ResearchReport } from '../types';

// A valid, 500-byte minimal PDF file containing "Stock Research Report - ApexAnalysis"
export const MOCK_PDF_BASE64 = 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCjIgMCBvYmoKICA8PCAvVHlwZSAvUGFnZXMKICAgICAvS2lkcyBbIDMgMCBSIF0KICAgICAvQ291bnQgMQogID4+CmVuZG9iagozIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2UKICAgICAvUGFyZW50IDIgMCBSCiAgICAgL01lZGlhQm94IFsgMCAwIDYxMiA3OTIgXQogICAgIC9Db250ZW50cyA0IDAgUgogICAgIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDUgMCBSID4+ID4+CiAgPj4KZW5kb2JqCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDU2ID4+CnN0cmVhbQpCVAovRjEgMjQgVGYKNzAgNzIwIFRkCihTdG9jayBSZXNlYXJjaCBSZXBvcnQgLSBBcGV4QW5hbHlzdCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCiAgPDwgL1R5cGUgL0ZvbnQKICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAvQmFzZUZvbnQgL0hlbHZldGljYQogID4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA2NiAwMDAwMCBuIAowMDAwMDAwMTIxIDAwMDAwIG4gCjAwMDAwMDAyNzIgMDAwMDAgbiAKMDAwMDAwMDM3OCAwMDAwMCBuIAp0cmFpbGVyCiAgPDwgL1NpemUgNgogICAgIC9Sb290IDEgMCBSCiAgPj4Kc3RhcnR4cmVmCjQ3MAolJUVPRgo=';

export const DEFAULT_REPORTS: ResearchReport[] = [
  {
    id: 'report-aapl-2026',
    stockName: 'Apple Inc.',
    ticker: 'AAPL',
    title: 'Apple Inc.: Navigating Services Growth and AI Integration',
    sector: 'Technology',
    date: '2026-06-01',
    analyst: 'Sarah Jenkins, CFA',
    pdfDataUrl: MOCK_PDF_BASE64,
    fileName: 'AAPL_Research_Report.pdf',
    summary: 'We maintain our BUY rating on AAPL, driven by robust Services segment revenue expansion and the highly anticipated integration of on-device AI capabilities across the upcoming hardware refresh cycle.',
    currentPrice: 182.50,
    targetPrice: 215.00,
    recommendation: 'BUY'
  },
  {
    id: 'report-nvda-2026',
    stockName: 'NVIDIA Corporation',
    ticker: 'NVDA',
    title: 'NVIDIA Corp: AI Supercomputing Dominance and Blackwell Architecture Catalyst',
    sector: 'Semiconductors',
    date: '2026-06-04',
    analyst: 'Marcus Chen, Lead Tech Analyst',
    pdfDataUrl: MOCK_PDF_BASE64,
    fileName: 'NVDA_Blackwell_Analysis.pdf',
    summary: 'NVDA remains our top sector pick. Strong hyperscaler CapEx projections and the rollout of the Blackwell GPU architecture suggest sustained data center revenues through FY27, maintaining a leading competitive moat.',
    currentPrice: 950.00,
    targetPrice: 1150.00,
    recommendation: 'BUY'
  },
  {
    id: 'report-tsla-2026',
    stockName: 'Tesla Inc.',
    ticker: 'TSLA',
    title: 'Tesla Inc.: Production Volatility and Robotaxi Milestones',
    sector: 'Automotive',
    date: '2026-05-28',
    analyst: 'David Vance',
    pdfDataUrl: MOCK_PDF_BASE64,
    fileName: 'TSLA_Q2_Outlook.pdf',
    summary: 'We reiterate our HOLD stance on TSLA. While long-term FSD licensing and Robotaxi potential present asymmetric upside, near-term headwind margins from auto price cuts and temporary factory transitions are likely to cap immediate valuation.',
    currentPrice: 175.20,
    targetPrice: 185.00,
    recommendation: 'HOLD'
  },
  {
    id: 'report-lly-2026',
    stockName: 'Eli Lilly and Company',
    ticker: 'LLY',
    title: 'Eli Lilly: GLP-1 Franchise Scaling and Pipeline Expansion',
    sector: 'Healthcare',
    date: '2026-05-15',
    analyst: 'Dr. Elena Rostova',
    pdfDataUrl: MOCK_PDF_BASE64,
    fileName: 'LLY_GLP1_Expansion.pdf',
    summary: 'We rate LLY as a BUY. The expansion of manufacturing capacity for Mounjaro and Zepbound, along with a rich late-stage clinical pipeline in Alzheimer\'s and metabolic diseases, will continue to drive premium growth.',
    currentPrice: 780.00,
    targetPrice: 920.00,
    recommendation: 'BUY'
  }
];
