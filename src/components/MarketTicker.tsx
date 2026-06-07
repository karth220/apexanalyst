import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { MarketIndex } from '../types';

export const MarketTicker: React.FC = () => {
  const [indices, setIndices] = useState<MarketIndex[]>([
    { name: 'NIFTY 50', value: 23290.15, change: 125.50, changePercent: 0.54 },
    { name: 'SENSEX', value: 76690.40, change: 430.10, changePercent: 0.56 },
    { name: 'NIFTY BANK', value: 49800.20, change: -110.30, changePercent: -0.22 },
    { name: 'NIFTY IT', value: 34850.60, change: 295.90, changePercent: 0.86 },
    { name: 'INDIA VIX', value: 13.85, change: -0.65, changePercent: -4.48 },
  ]);

  // Simulate market fluctuation to make the dashboard feel live and interactive
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prevIndices => 
        prevIndices.map(index => {
          const isVix = index.name === 'INDIA VIX';
          const maxVolatility = isVix ? 0.08 : 0.005; // VIX moves faster
          const changePercent = (Math.random() - (isVix ? 0.52 : 0.48)) * maxVolatility; // slight upward bias for indices
          const newValue = index.value * (1 + changePercent);
          const valueDiff = newValue - index.value;
          const newChange = index.change + valueDiff;
          // Standard reference price baseline to prevent running away too far
          const baseline = isVix ? 14.00 : index.name === 'NIFTY 50' ? 23300 : index.name === 'SENSEX' ? 76700 : index.name === 'NIFTY BANK' ? 49800 : 34800;
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

    return () => clearInterval(interval);
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
