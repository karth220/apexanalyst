import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { MarketIndex } from '../types';

export const MarketTicker: React.FC = () => {
  const [indices, setIndices] = useState<MarketIndex[]>([
    { name: 'S&P 500', value: 5410.25, change: 32.50, changePercent: 0.60 },
    { name: 'NASDAQ', value: 18720.40, change: 185.10, changePercent: 1.00 },
    { name: 'DOW JONES', value: 39110.15, change: -45.30, changePercent: -0.12 },
    { name: 'RUSSELL 2000', value: 2085.60, change: 8.90, changePercent: 0.43 },
    { name: 'VIX', value: 12.85, change: -0.45, changePercent: -3.38 },
  ]);

  // Simulate market fluctuation to make the dashboard feel live and interactive
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices(prevIndices => 
        prevIndices.map(index => {
          const isVix = index.name === 'VIX';
          const maxVolatility = isVix ? 0.08 : 0.005; // VIX moves faster
          const changePercent = (Math.random() - (isVix ? 0.52 : 0.48)) * maxVolatility; // slight upward bias for indices
          const newValue = index.value * (1 + changePercent);
          const valueDiff = newValue - index.value;
          const newChange = index.change + valueDiff;
          // Standard reference price baseline to prevent running away too far
          const baseline = isVix ? 13.00 : index.name === 'S&P 500' ? 5400 : index.name === 'NASDAQ' ? 18700 : index.name === 'DOW JONES' ? 39100 : 2080;
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
