"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export function MarketTicker() {
  const { t } = useI18n();
  const [offset, setOffset] = useState(0);

  const mockData = [
    { key: "shanghai", value: "3,284.52", change: "+1.23%", up: true },
    { key: "shenzhen", value: "10,156.78", change: "+0.87%", up: true },
    { key: "chinext", value: "2,045.33", change: "-0.32%", up: false },
    { key: "hsi", value: "22,456.12", change: "+0.56%", up: true },
    { key: "sp500", value: "5,892.34", change: "+0.45%", up: true },
    { key: "nasdaq", value: "18,234.56", change: "-0.18%", up: false },
    { key: "gold", value: "2,945.80", change: "+0.92%", up: true },
    { key: "oil", value: "78.45", change: "-1.12%", up: false },
    { key: "btc", value: "84,523", change: "+2.34%", up: true },
    { key: "dxy", value: "104.23", change: "-0.15%", up: false },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setOffset((prev) => prev - 1);
    }, 30);
    return () => clearInterval(timer);
  }, []);

  const items = [...mockData, ...mockData];

  return (
    <div className="fixed top-16 left-0 right-0 z-40 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/90 backdrop-blur-sm overflow-hidden">
      <div
        className="flex items-center gap-8 py-2 whitespace-nowrap"
        style={{ transform: `translateX(${offset % (mockData.length * 160)}px)` }}
      >
        {items.map((item, i) => (
          <div key={`${item.key}-${i}`} className="flex items-center gap-2 text-xs">
            <span className="text-[var(--text-secondary)]">{t(`ticker.${item.key}`)}</span>
            <span className="text-[var(--text-primary)] font-mono">{item.value}</span>
            <span className={item.up ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"}>
              {item.change}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
