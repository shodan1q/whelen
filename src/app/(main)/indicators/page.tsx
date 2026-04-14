"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

interface KlineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export default function IndicatorsPage() {
  const { t } = useI18n();

  const symbols: Array<{ symbol: string; nameKey: string; category: string; badge?: string }> = [
    { symbol: "PAXG-USD", nameKey: "paxgGold", category: "commodity", badge: t("indicators.binanceRealtime") },
    { symbol: "GC=F", nameKey: "goldFutures", category: "commodity" },
    { symbol: "SI=F", nameKey: "silver", category: "commodity" },
    { symbol: "CL=F", nameKey: "oil", category: "commodity" },
    { symbol: "HG=F", nameKey: "copper", category: "commodity" },
    { symbol: "^GSPC", nameKey: "sp500", category: "index" },
    { symbol: "^IXIC", nameKey: "nasdaq", category: "index" },
    { symbol: "000001.SS", nameKey: "shanghai", category: "index" },
    { symbol: "^HSI", nameKey: "hsi", category: "index" },
    { symbol: "BTC-USD", nameKey: "btc", category: "crypto", badge: t("indicators.binanceRealtime") },
    { symbol: "DX-Y.NYB", nameKey: "dxy", category: "forex" },
  ];

  const [selected, setSelected] = useState(symbols[0]);
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeframe, setTimeframe] = useState("1d");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    loadData(selected.symbol, timeframe);
  }, [selected, timeframe]);

  useEffect(() => {
    if (klineData.length > 0) drawKline();
  }, [klineData]);

  async function loadData(symbol: string, tf: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/kline?symbol=${encodeURIComponent(symbol)}&interval=${tf}`);
      const data = await res.json();
      if (data.candles) setKlineData(data.candles);
    } catch {
      // 用模拟数据
      setKlineData(generateMockKline(100));
    } finally {
      setLoading(false);
    }
  }

  function drawKline() {
    const canvas = canvasRef.current;
    if (!canvas || klineData.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.offsetWidth * 2;
    const H = canvas.offsetHeight * 2;
    canvas.width = W;
    canvas.height = H;

    const padding = { top: 40, right: 80, bottom: 40, left: 20 };
    const chartW = W - padding.left - padding.right;
    const chartH = H - padding.top - padding.bottom;

    ctx.fillStyle = "#0A1628";
    ctx.fillRect(0, 0, W, H);

    const data = klineData.slice(-80);
    const highs = data.map((d) => d.high);
    const lows = data.map((d) => d.low);
    const maxPrice = Math.max(...highs);
    const minPrice = Math.min(...lows);
    const priceRange = maxPrice - minPrice || 1;

    const barW = chartW / data.length;
    const bodyW = barW * 0.6;

    // 网格线
    ctx.strokeStyle = "rgba(46, 134, 171, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartH / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(W - padding.right, y);
      ctx.stroke();

      const price = maxPrice - (priceRange / 5) * i;
      ctx.fillStyle = "#5A7A9A";
      ctx.font = "20px monospace";
      ctx.textAlign = "left";
      ctx.fillText(price.toFixed(2), W - padding.right + 8, y + 6);
    }

    // K线
    data.forEach((d, i) => {
      const x = padding.left + i * barW + barW / 2;
      const isUp = d.close >= d.open;
      const color = isUp ? "#10B981" : "#EF4444";

      const openY = padding.top + ((maxPrice - d.open) / priceRange) * chartH;
      const closeY = padding.top + ((maxPrice - d.close) / priceRange) * chartH;
      const highY = padding.top + ((maxPrice - d.high) / priceRange) * chartH;
      const lowY = padding.top + ((maxPrice - d.low) / priceRange) * chartH;

      // 影线
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // 实体
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(Math.abs(closeY - openY), 2);
      ctx.fillStyle = isUp ? "transparent" : color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x - bodyW / 2, bodyTop, bodyW, bodyHeight);
      if (!isUp) ctx.fillRect(x - bodyW / 2, bodyTop, bodyW, bodyHeight);
    });

    // 最新价格线
    const lastClose = data[data.length - 1].close;
    const lastY = padding.top + ((maxPrice - lastClose) / priceRange) * chartH;
    ctx.setLineDash([6, 4]);
    ctx.strokeStyle = "#C9A96E";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, lastY);
    ctx.lineTo(W - padding.right, lastY);
    ctx.stroke();
    ctx.setLineDash([]);

    // 最新价格标签
    ctx.fillStyle = "#C9A96E";
    ctx.fillRect(W - padding.right, lastY - 12, 75, 24);
    ctx.fillStyle = "#0A1628";
    ctx.font = "bold 18px monospace";
    ctx.textAlign = "center";
    ctx.fillText(lastClose.toFixed(2), W - padding.right + 37, lastY + 5);
  }

  return (
    <div className="pt-28 pb-16 min-h-screen bg-grid-ocean">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">{t("indicators.title")}</h1>
          <p className="text-[var(--text-secondary)]">{t("indicators.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧品种列表 */}
          <div className="lg:col-span-1 space-y-2">
            {symbols.map((s) => (
              <button
                key={s.symbol}
                onClick={() => setSelected(s)}
                className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                  selected.symbol === s.symbol
                    ? "bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30 text-[var(--accent-gold)]"
                    : "bg-[var(--bg-card)] text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{t(`indicators.symbols.${s.nameKey}`)}</span>
                  {"badge" in s && s.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--accent-gold)]/15 text-[var(--accent-gold)]">{s.badge}</span>
                  )}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-0.5">{s.symbol}</div>
              </button>
            ))}
          </div>

          {/* 右侧K线图 */}
          <div className="lg:col-span-3">
            <div className="card-glow rounded-xl bg-[var(--bg-card)] overflow-hidden">
              {/* 头部 */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
                <div>
                  <span className="text-lg font-semibold">{t(`indicators.symbols.${selected.nameKey}`)}</span>
                  <span className="text-sm text-[var(--text-muted)] ml-2">{selected.symbol}</span>
                </div>
                <div className="flex gap-2">
                  {["1m", "5m", "15m", "1h", "1d", "1wk"].map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1 rounded text-xs transition-all ${
                        timeframe === tf
                          ? "bg-[var(--accent-gold)]/10 text-[var(--accent-gold)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* K线画布 */}
              <div className="relative" style={{ height: "500px" }}>
                {loading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-card)]/80 z-10">
                    <span className="text-[var(--text-muted)] animate-pulse">加载中...</span>
                  </div>
                )}
                <canvas ref={canvasRef} className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function generateMockKline(count: number): KlineData[] {
  const data: KlineData[] = [];
  let price = 2900 + Math.random() * 200;
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.48) * price * 0.02;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * price * 0.005;
    const low = Math.min(open, close) - Math.random() * price * 0.005;
    data.push({
      time: now - (count - i) * 86400000,
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume: Math.floor(Math.random() * 100000),
    });
    price = close;
  }
  return data;
}
