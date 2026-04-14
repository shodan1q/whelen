"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

interface Plan {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  period?: string;
  periodEn?: string;
  features: string[];
  featuresEn: string[];
  popular?: boolean;
}

const plans: Plan[] = [
  {
    id: "indicators",
    name: "Helen的指标分时图",
    nameEn: "Helen's Indicators",
    price: 9.9,
    features: [
      "11个品种实时K线",
      "1分钟/5分钟/15分钟/1小时/日线/周线",
      "PAXG黄金 + BTC Binance实时数据",
      "永久访问",
    ],
    featuresEn: [
      "11 real-time K-line symbols",
      "1m/5m/15m/1h/1d/1wk timeframes",
      "PAXG Gold + BTC Binance real-time",
      "Lifetime access",
    ],
  },
  {
    id: "premium-data",
    name: "实时主力数据",
    nameEn: "Premium Data",
    price: 99,
    period: "/ 月",
    periodEn: "/ month",
    features: [
      "Helen 处理过的主力资金流向",
      "机构持仓变化追踪",
      "大宗商品库存数据",
      "宏观经济指标实时更新",
      "每日市场分析报告",
    ],
    featuresEn: [
      "Helen-processed institutional flow",
      "Position change tracking",
      "Commodity inventory data",
      "Real-time macro indicators",
      "Daily market analysis reports",
    ],
    popular: true,
  },
  {
    id: "consultation",
    name: "和 Helen 真人聊解惑",
    nameEn: "Chat with Real Helen",
    price: 999,
    period: "/ 次",
    periodEn: "/ session",
    features: [
      "30分钟一对一视频/语音咨询",
      "针对性投资组合分析",
      "宏观趋势深度解读",
      "个性化策略建议",
      "会后文字总结报告",
    ],
    featuresEn: [
      "30-min 1-on-1 video/voice consultation",
      "Personalized portfolio analysis",
      "In-depth macro trend interpretation",
      "Customized strategy recommendations",
      "Post-session written summary",
    ],
  },
];

export function PricingSection() {
  const { locale } = useI18n();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handlePurchase = (planId: string) => {
    setSelectedPlan(planId);
    // TODO: 接入支付API
    alert(`即将跳转到支付页面：${planId}`);
  };

  return (
    <section className="py-20 bg-[var(--bg-secondary)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="text-gradient-gold">
              {locale === "zh" ? "选择适合你的方案" : "Choose Your Plan"}
            </span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            {locale === "zh"
              ? "大部分内容免费开放，专业数据和咨询服务按需付费"
              : "Most content is free, premium data and consultation services are pay-as-you-go"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-gradient-to-b from-[var(--accent-gold)]/10 to-[var(--bg-card)] border-2 border-[var(--accent-gold)]/30"
                  : "bg-[var(--bg-card)] border border-[var(--border-color)]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold-light)] text-xs font-medium text-[var(--bg-primary)]">
                  {locale === "zh" ? "最受欢迎" : "Most Popular"}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">
                  {locale === "zh" ? plan.name : plan.nameEn}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gradient-gold">¥{plan.price}</span>
                  {plan.period && (
                    <span className="text-sm text-[var(--text-muted)]">
                      {locale === "zh" ? plan.period : plan.periodEn}
                    </span>
                  )}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {(locale === "zh" ? plan.features : plan.featuresEn).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <svg
                      className="w-5 h-5 text-[var(--accent-gold)] flex-shrink-0 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-[var(--text-secondary)]">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(plan.id)}
                className={`w-full py-3 rounded-lg font-medium transition-all ${
                  plan.popular
                    ? "bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold-light)] text-[var(--bg-primary)] hover:opacity-90"
                    : "border border-[var(--accent-gold)]/30 text-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/10"
                }`}
              >
                {locale === "zh" ? "立即购买" : "Purchase Now"}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-sm text-[var(--text-muted)]"
        >
          <p>
            {locale === "zh"
              ? "💳 支持支付宝、微信支付、银行卡。购买后立即开通，7天无理由退款。"
              : "💳 Alipay, WeChat Pay, and bank cards accepted. Instant activation, 7-day money-back guarantee."}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
