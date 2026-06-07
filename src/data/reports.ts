import type { ResearchReport } from '../types';

// A valid, 500-byte minimal PDF file containing "Stock Research Report - ApexAnalysis"
export const MOCK_PDF_BASE64 = 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCjIgMCBvYmoKICA8PCAvVHlwZSAvUGFnZXMKICAgICAvS2lkcyBbIDMgMCBSIF0KICAgICAvQ291bnQgMQogID4+CmVuZG9iagozIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2UKICAgICAvUGFyZW50IDIgMCBSCiAgICAgL01lZGlhQm94IFsgMCAwIDYxMiA3OTIgXQogICAgIC9Db250ZW50cyA0IDAgUgogICAgIC9SZXNvdXJjZXMgPDwgL0ZvbnQgPDwgL0YxIDUgMCBSID4+ID4+CiAgPj4KZW5kb2JqCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDU2ID4+CnN0cmVhbQpCVAovRjEgMjQgVGYKNzAgNzIwIFRkCihTdG9jayBSZXNlYXJjaCBSZXBvcnQgLSBBcGV4QW5hbHlzdCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCiAgPDwgL1R5cGUgL0ZvbnQKICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAvQmFzZUZvbnQgL0hlbHZldGljYQogID4+CmVuZG9iagp4cmVmCjAgNgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA2NiAwMDAwMCBuIAowMDAwMDAwMTIxIDAwMDAwIG4gCjAwMDAwMDAyNzIgMDAwMDAgbiAKMDAwMDAwMDM3OCAwMDAwMCBuIAp0cmFpbGVyCiAgPDwgL1NpemUgNgogICAgIC9Sb290IDEgMCBSCiAgPj4Kc3RhcnR4cmVmCjQ3MAolJUVPRgo=';

export const DEFAULT_REPORTS: ResearchReport[] = [
  {
    id: 'report-honasa',
    stockName: 'Honasa Consumer',
    ticker: 'HONASA',
    title: 'Honasa Consumer: Expanding Brand Reach and Product Line Extension',
    sector: 'Consumer Staples',
    date: '2026-06-04',
    analyst: 'ICICI Securities Limited',
    pdfDataUrl: MOCK_PDF_BASE64,
    fileName: 'Honasa_Consumer_Research.pdf',
    summary: 'We maintain our BUY rating on Honasa Consumer (Mamaearth) driven by strong distribution expansion in offline markets and positive customer response to newly launched personal care product lines.',
    currentPrice: 416.10,
    targetPrice: 550.00,
    recoPrice: 417.05,
    recommendation: 'BUY'
  },
  {
    id: 'report-ambuja',
    stockName: 'Ambuja Cements',
    ticker: 'AMBUJACEM',
    title: 'Ambuja Cements: Capacity Integration and Infrastructure Catalysts',
    sector: 'Materials',
    date: '2026-06-04',
    analyst: 'Motilal Oswal',
    pdfDataUrl: MOCK_PDF_BASE64,
    fileName: 'Ambuja_Cements_Analysis.pdf',
    summary: 'We rate Ambuja Cements as a BUY. The rapid capacity expansion integration and strong national infrastructure project pipelines will support elevated demand and improve cement realizations in the upcoming quarters.',
    currentPrice: 417.55,
    targetPrice: 530.00,
    recoPrice: 426.35,
    recommendation: 'BUY'
  },
  {
    id: 'report-midhani',
    stockName: 'Mishra Dhatu Nigam',
    ticker: 'MIDHANI',
    title: 'Mishra Dhatu Nigam: Defense Orders Scaling and Superalloy Demand',
    sector: 'Defense / Industrials',
    date: '2026-06-04',
    analyst: 'ICICI Securities Limited',
    pdfDataUrl: MOCK_PDF_BASE64,
    fileName: 'MIDHANI_Research_Report.pdf',
    summary: 'Midhani is a BUY, supported by a healthy defense and space order book, increasing domestic sourcing for specialty alloys, and the operational ramp-up of new production facilities.',
    currentPrice: 435.55,
    targetPrice: 480.00,
    recoPrice: 443.25,
    recommendation: 'BUY'
  },
  {
    id: 'report-ahluwalia',
    stockName: 'Ahluwalia Contracts',
    ticker: 'AHLUCONT',
    title: 'Ahluwalia Contracts: Order Book Diversification and Margin Resiliency',
    sector: 'Construction / Industrials',
    date: '2026-06-04',
    analyst: 'Anand Rathi',
    pdfDataUrl: MOCK_PDF_BASE64,
    fileName: 'Ahluwalia_Contracts_Q1.pdf',
    summary: 'Ahluwalia Contracts remains a BUY as order book diversification across commercial, residential, and healthcare sectors provides strong revenue visibility. Stable raw material pricing maintains margin resilience.',
    currentPrice: 792.95,
    targetPrice: 1009.00,
    recoPrice: 785.30,
    recommendation: 'BUY'
  },
  {
    id: 'report-balkrishna',
    stockName: 'Balkrishna Industries',
    ticker: 'BALKRISIND',
    title: 'Balkrishna Industries: Off-Highway Tyre Export Market Recovery',
    sector: 'Auto Components',
    date: '2026-06-04',
    analyst: 'Geojit BNP Paribas',
    pdfDataUrl: MOCK_PDF_BASE64,
    fileName: 'Balkrishna_Industries_Insight.pdf',
    summary: 'Balkrishna Industries is rated BUY. Global Off-Highway Tyre (OHT) destocking is nearing completion, and export demand recovery from European markets is poised to support capacity utilization and margins.',
    currentPrice: 2142.00,
    targetPrice: 2547.00,
    recoPrice: 2191.90,
    recommendation: 'BUY'
  },
  {
    id: 'report-lupin',
    stockName: 'Lupin',
    ticker: 'LUPIN',
    title: 'Lupin: US Generic Launches and Complex Injectables Growth',
    sector: 'Healthcare',
    date: '2026-06-04',
    analyst: 'Geojit BNP Paribas',
    pdfDataUrl: MOCK_PDF_BASE64,
    fileName: 'Lupin_Healthcare_Outlook.pdf',
    summary: 'We maintain our BUY stance on Lupin. Growth is driven by the scaling up of gSpiriva and key complex generic product launches in the US market, combined with strong double-digit growth in the chronic cardiac therapy segment in India.',
    currentPrice: 2267.70,
    targetPrice: 2606.00,
    recoPrice: 2249.80,
    recommendation: 'BUY'
  }
];
