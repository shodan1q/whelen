"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

interface MarketItem {
  symbol: string;
  name: string;
  value: number;
  change: number;
  changePct: number;
  category: string;
}

export default function MarketPage() {
  const { t } = useI18n();
  const [data, setData] = useState<MarketItem[]>([]);

  useEffect(() => {
    fetch("/api/market")
      .then((r) => r.json())
      .then((d) => setData(d.data))
      .catch(() => {});
  }, []);

  const grouped = data.reduce<Record<string, MarketItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="pt-28 pb-16 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-3xl font-bold text-gradient-gold mb-4">{t("market.title")}</h1>
          <p className="text-[var(--text-secondary)]">{t("market.subtitle")}</p>
        </motion.div>

        <div className="space-y-10">
          {Object.entries(grouped).map(([cat, items], gi) => (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: gi * 0.1 }}
            >
              <h2 className="text-lg font-semibold mb-4 text-[var(--text-secondary)]">
                {t(`market.categories.${cat}` as any) || cat}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => {
                  const isUp = item.changePct >= 0;
                  return (
                    <div
                      key={item.symbol}
                      className="card-glow rounded-xl bg-[var(--bg-card)] p-5 hover:bg-[var(--bg-card-hover)] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[var(--text-secondary)]">{item.name}</span>
                        <span className="text-xs text-[var(--text-muted)] font-mono">{item.symbol}</span>
                      </div>
                      <div className="text-2xl font-bold font-mono mb-1">
                        {item.value.toLocaleString()}
                      </div>
                      <div className={`text-sm font-mono ${isUp ? "text-[var(--accent-green)]" : "text-[var(--accent-red)]"}`}>
                        {isUp ? "+" : ""}{item.change.toFixed(2)} ({isUp ? "+" : ""}{item.changePct.toFixed(2)}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
