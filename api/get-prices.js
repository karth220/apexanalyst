export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { tickers } = req.query;
    if (!tickers) {
      return res.status(400).json({ error: 'Tickers parameter is required' });
    }

    const tickerList = tickers.split(',').map(t => t.trim().toUpperCase());
    const yahooSymbols = tickerList.map(t => {
      if (t.startsWith('^') || t.includes('.')) return t;
      return `${t}.NS`;
    });

    const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(yahooSymbols.join(','))}`;

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Yahoo Finance API responded with status ${response.status}`);
    }

    const data = await response.json();
    const results = data?.quoteResponse?.result || [];

    const prices = {};
    results.forEach(quote => {
      const symbol = quote.symbol;
      let rawTicker = symbol;
      if (!symbol.startsWith('^')) {
        rawTicker = symbol.replace('.NS', '').replace('.BO', '');
      }

      prices[rawTicker] = {
        price: quote.regularMarketPrice || 0,
        change: quote.regularMarketChange || 0,
        changePercent: quote.regularMarketChangePercent || 0,
        name: quote.shortName || quote.longName || rawTicker
      };
    });

    // Cache the response on Edge/CDN for 60 seconds, but client-side revalidate
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');
    return res.status(200).json({ prices });
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    return res.status(500).json({ error: error.message });
  }
}
