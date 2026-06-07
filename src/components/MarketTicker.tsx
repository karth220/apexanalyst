import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { MarketIndex } from '../types';

const INDEX_MAP: { [key: string]: string } = {
  '^NSEI': 'NIFTY 50',
  '^BSESN': 'SENSEX',
  '^NSEBANK': 'NIFTY BANK',
  '^CNXIT': 'NIFTY IT',
  '^INDIAVIX': 'INDIA VIX',
};

export const MarketTicker: React.FC = () => {
  const [indices, setIndices] = useState<MarketIndex[]>([
    { name: 'NIFTY 50', value: 23366.70, change: -49.30, changePercent: -0.21 },
    { name: 'SENSEX', value: 74243.34, change: -118.90, changePercent: -0.16 },
    { name: 'NIFTY BANK', value: 49800.20, change: -110.30, changePercent: -0.22 },
    { name: 'NIFTY IT', value: 34850.60, change: 295.90, changePercent: 0.86 },
    { name: 'INDIA VIX', value: 13.85, change: -0.65, changePercent: -4.48 },
  ]);

  // Fetch real index prices from serverless API
  useEffect(() => {
    const fetchRealPrices = async () => {
      try {
        const symbols = Object.keys(INDEX_MAP).join(',');
        const response = await fetch(`/api/get-prices?tickers=${symbols}`);
        if (!response.ok) return;
        const data = await response.json();
        if (data && data.prices) {
          setIndices(prevIndices =>
            prevIndices.map(index => {
              // Find matching symbol
              const symbol = Object.keys(INDEX_MAP).find(key => INDEX_MAP[key] === index.name);
              if (symbol && data.prices[symbol]) {
                const fetched = data.prices[symbol];
                return {
                  name: index.name,
                  value: fetched.price,
                  change: fetched.change,
                  changePercent: fetched.changePercent,
                };
              }
              return index;
            })
          );
        }
      } catch (err) {
        console.error('Failed to fetch real-time index prices:', err);
      }
    };

    fetchRealPrices();
    // Poll every 60 seconds
    const apiInterval = setInterval(fetchRealPrices, 60000);
    return () => clearInterval(apiInterval);
  }, []);

  // Simulate market fluctuation to make the dashboard feel live and interactive
  useEffect(() => {
    const simulationInterval = setInterval(() => {
      setIndices(prevIndices => 
        prevIndices.map(index => {
          const isVix = index.name === 'INDIA VIX';
          const maxVolatility = isVix ? 0.005 : 0.0003; // small simulation ticks so it doesn't drift too far
          const changePercent = (Math.random() - 0.5) * maxVolatility;
          const newValue = index.value * (1 + changePercent);
          const valueDiff = newValue - index.value;
          const newChange = index.change + valueDiff;
          const baseline = isVix ? 14.00 : index.name === 'NIFTY 50' ? 23300 : index.name === 'SENSEX' ? 74200 : index.name === 'NIFTY BANK' ? 49800 : 34800;
          const newChangePercent = (newChange / baseline) * 100;

          return {
            ...index,
            value: Number(newValue.toFixed(2)),
            change: Number(newChange.toFixed(2)),
            changePercent: Number(newChangePercent.toFixed(2))
          };
        })
      );
    }, 4000);

    return () => clearInterval(simulationInterval);
  }, []);

  // Duplicate items to ensure smooth loop infinite marquee scrolling effect
  const tickerItems = [...indices, ...indices, ...indices];

  return (
    <div className="ticker-wrapper">
      <div className="ticker-scroll-container">
        {tickerItems.map((item, idx) => {
          const isPositive = item.change >= 0;
          return (
            <div key={`${item.name}-${idx}`} className="ticker-item">
              <span className="ticker-name">{item.name}</span>
              <span className="ticker-value">{item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={`ticker-change ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? (
                  <TrendingUp size={12} style={{ display: 'inline' }} />
                ) : (
                  <TrendingDown size={12} style={{ display: 'inline' }} />
                )}
                {isPositive ? '+' : ''}{item.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

