import { NextResponse } from "next/server";

const mockMarketData = [
  { symbol: "000001.SH", name: "上证指数", value: 3284.52, change: 40.12, changePct: 1.23, category: "index" },
  { symbol: "399001.SZ", name: "深证成指", value: 10156.78, change: 87.45, changePct: 0.87, category: "index" },
  { symbol: "399006.SZ", name: "创业板指", value: 2045.33, change: -6.58, changePct: -0.32, category: "index" },
  { symbol: "HSI", name: "恒生指数", value: 22456.12, change: 124.56, changePct: 0.56, category: "index" },
  { symbol: "SPX", name: "S&P 500", value: 5892.34, change: 26.45, changePct: 0.45, category: "index" },
  { symbol: "IXIC", name: "纳斯达克", value: 18234.56, change: -32.78, changePct: -0.18, category: "index" },
  { symbol: "XAUUSD", name: "黄金", value: 2945.80, change: 26.92, changePct: 0.92, category: "commodity" },
  { symbol: "USOIL", name: "原油", value: 78.45, change: -0.89, changePct: -1.12, category: "commodity" },
  { symbol: "BTCUSD", name: "比特币", value: 84523, change: 1934, changePct: 2.34, category: "crypto" },
  { symbol: "DXY", name: "美元指数", value: 104.23, change: -0.16, changePct: -0.15, category: "forex" },
  { symbol: "US10Y", name: "美国10年期国债", value: 4.28, change: -0.03, changePct: -0.70, category: "bond" },
  { symbol: "CN10Y", name: "中国10年期国债", value: 2.35, change: 0.02, changePct: 0.86, category: "bond" },
];

export async function GET() {
  return NextResponse.json({ data: mockMarketData, updatedAt: new Date().toISOString() });
}
