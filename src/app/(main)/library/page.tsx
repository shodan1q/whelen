"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { allBooks } from "@/data/books";

interface LibraryItem {
  id: string;
  title: string;
  type: "video" | "article" | "book-note";
  description: string;
  content: string;
  date: string;
  videoUrl?: string;
  coverIndex?: number;
}

// 原有的5个项目
const originalItems: LibraryItem[] = [
  {
    id: "1",
    title: "《关键矿物：战略分析》读书笔记",
    type: "book-note",
    description: "克雷格·廷戴尔的报告解读，关于关键矿物在军事和工业中的战略地位。每一枚战斧巡航导弹含有约500盎司白银。",
    content: `关键矿物的战略意义远超市场定价所反映的。

**核心观点：**

1. **军事依赖**：每一枚战斧巡航导弹含有约500盎司白银。F-35战斗机需要大量稀土元素。现代军事装备对关键矿物的依赖程度远超想象。

2. **供应链风险**：全球关键矿物供应高度集中。中国控制了全球约60%的稀土开采和90%的加工能力。这种集中度在地缘政治紧张时期构成重大风险。

3. **能源转型加速需求**：电动汽车、风力发电、太阳能电池板都需要大量关键矿物。到2030年，锂需求预计增长40倍，钴需求增长20倍。

4. **白银的双重属性**：白银既是贵金属（货币属性），又是工业金属（光伏、电子、医疗）。光伏产业每年消耗约1.4亿盎司白银，占全球产量的15%以上。

**Helen的思考：**

关键矿物正在成为21世纪的"石油"。谁控制了关键矿物的供应链，谁就掌握了未来工业和军事的命脉。投资者应该关注矿业公司的战略价值，而不仅仅是短期利润。`,
    date: "2026-02-11",
  },
  {
    id: "2",
    title: "盘后3点：为什么高开后急转直下",
    type: "video",
    description: "2025年10月14日盘后分析，解读当日市场高开低走的原因和后续走势判断。",
    content: `**盘后复盘要点：**

1. **高开原因**：周末利好政策预期发酵，北向资金早盘大幅流入，市场情绪亢奋。

2. **急转直下的三个信号**：
   - 11:00 北向资金突然转为净流出
   - 权重股（银行、保险）集体跳水
   - 融资盘开始平仓，形成踩踏

3. **技术面分析**：上证在3400点附近遇到强阻力，前期套牢盘集中释放。MACD日线级别出现顶背离信号。

4. **后续判断**：短期需要回踩确认支撑，3200-3250区间是关键支撑位。如果守住，后续仍有上攻动力。

**操作建议**：不追高，等回调到支撑位再考虑加仓。控制仓位在6成以下。`,
    date: "2025-10-14",
    videoUrl: "#",
  },
  {
    id: "3",
    title: "黄金定价权转移的底层逻辑",
    type: "article",
    description: "从布雷顿森林体系到石油美元，再到今天的央行购金潮，黄金定价权正在发生历史性转移。",
    content: `**黄金定价权的三次转移：**

**第一次：布雷顿森林体系（1944-1971）**
美元与黄金挂钩，35美元/盎司。美国掌握全球70%的黄金储备，拥有绝对定价权。1971年尼克松关闭黄金窗口，第一次转移开始。

**第二次：石油美元体系（1971-2022）**
美元与石油挂钩，黄金被"去货币化"。COMEX期货市场成为定价中心，华尔街通过纸黄金（期货、ETF）控制价格。实物黄金与纸黄金的比例一度达到1:100。

**第三次：央行购金潮（2022-至今）**
俄乌冲突后，美国冻结俄罗斯外汇储备，全球央行意识到美元资产的风险。2022年以来，全球央行连续三年净购金超过1000吨。中国、印度、土耳其、波兰成为最大买家。

**底层逻辑：**
- 美元信用在下降（债务/GDP超过120%）
- 地缘政治推动去美元化
- 东方实物需求正在压倒西方纸黄金供给
- COMEX库存持续下降，交割压力增大

**Helen的判断：**
黄金定价权正在从华尔街（纸黄金）转向东方央行（实物黄金）。这个过程可能持续10-20年，期间金价中枢将持续上移。当前的金价可能只是长期牛市的中段。`,
    date: "2026-02-26",
  },
  {
    id: "4",
    title: "白银：被严重低估的战略金属",
    type: "article",
    description: "白银的金融属性和工业属性正在共振，金银比暗示白银有巨大补涨空间。",
    content: `**白银的双重身份：**

白银是唯一同时具备贵金属（货币属性）和工业金属（刚性需求）双重属性的金属。

**工业需求爆发：**
- 光伏产业：每GW太阳能电池需要约20吨白银，2025年全球光伏装机预计超过500GW
- 电动汽车：每辆EV使用约25-50克白银（传统汽车仅15-28克）
- 5G基站：每个基站需要约1盎司白银
- AI服务器：数据中心对银的需求快速增长

**供给困境：**
- 全球白银矿产量已连续5年下降
- 70%的白银是铜、锌、铅矿的副产品，无法独立增产
- COMEX白银库存降至历史低位

**金银比信号：**
当前金银比约85:1，历史均值约60:1。如果回归均值，以当前金价计算，银价应在85美元以上。

**Helen的观点：**
白银是当前最被低估的大宗商品之一。工业需求的结构性增长叠加货币属性回归，白银可能迎来超级周期。`,
    date: "2026-02-20",
  },
  {
    id: "5",
    title: "宏观分析框架：如何看懂一轮行情",
    type: "book-note",
    description: "Helen 多年宏观分析的方法论总结，从流动性、政策、估值三个维度判断市场方向。",
    content: `**Helen 的宏观分析三角框架：**

每一轮大行情的启动和结束，都可以从三个维度来判断：

**1. 流动性（最重要）**
- M2增速：货币供应量是市场的"水位"
- 社融数据：实体经济的融资需求
- 央行操作：降准、降息、MLF、逆回购
- 北向资金/外资流向

**2. 政策（催化剂）**
- 财政政策：专项债、减税、基建投资
- 产业政策：新能源、AI、半导体
- 监管政策：IPO节奏、融资融券、印花税
- 地产政策：限购、限贷、利率

**3. 估值（安全边际）**
- PE/PB分位数：当前估值在历史中的位置
- 股债性价比：10年国债收益率 vs 沪深300股息率
- 破净率：市场底部的重要信号
- 换手率/成交量：情绪指标

**实战应用：**
- 三个维度同时向好 → 大牛市（如2014-2015、2019-2021）
- 流动性好 + 政策好 + 估值高 → 结构性行情，选对方向
- 流动性差 + 政策紧 + 估值低 → 磨底阶段，逢低布局
- 流动性差 + 政策紧 + 估值高 → 系统性风险，减仓避险`,
    date: "2026-01-15",
  },
];

// 合并原有项目和书籍数据
const items: LibraryItem[] = [
  ...originalItems.map((item, index) => ({ ...item, coverIndex: index + 1 })),
  ...allBooks.map((book, index) => ({
    id: `book-${book.id}`,
    title: book.title,
    type: book.type as "book-note",
    description: book.description,
    content: book.content,
    date: book.date,
    coverIndex: originalItems.length + index + 1,
  })),
];

const typeLabels: Record<string, { label: string; color: string }> = {
  video: { label: "视频", color: "#EF4444" },
  article: { label: "文案", color: "#2E86AB" },
  "book-note": { label: "书摘", color: "#C9A96E" },
};

export default function LibraryPage() {
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<LibraryItem | null>(null);

  const filtered = filter === "all" ? items : items.filter((i) => i.type === filter);

  // 禁止背景滚动
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <div className="pt-28 pb-16 min-h-screen bg-grid-ocean">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">盘后三点</h1>
          <p className="text-[var(--text-secondary)]">学习资料、视频课程、读书笔记</p>
        </motion.div>

        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-3">
            {[
              { key: "all", label: "全部" },
              { key: "video", label: "视频" },
              { key: "article", label: "文案" },
              { key: "book-note", label: "书摘" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filter === t.key
                    ? "bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] border border-[var(--accent-gold)]/30"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button className="rounded-lg border border-dashed border-[var(--border-light)] px-4 py-2 text-sm text-[var(--text-muted)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-all">
            + 上传内容
          </button>
        </div>

        {/* 内容网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, i) => {
            const tl = typeLabels[item.type];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(item)}
                className="card-glow rounded-xl bg-[var(--bg-card)] overflow-hidden hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer group"
              >
                <div className="h-40 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--accent-ocean)]/20 flex items-center justify-center relative overflow-hidden">
                  {item.coverIndex ? (
                    <img 
                      src={`/covers/book-${item.coverIndex}.png`} 
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : item.type === "video" ? (
                    <div className="w-12 h-12 rounded-full bg-[var(--accent-gold)]/20 flex items-center justify-center group-hover:bg-[var(--accent-gold)]/30 transition-colors">
                      <svg className="w-5 h-5 text-[var(--accent-gold)] ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  ) : (
                    <svg className="w-10 h-10 text-[var(--text-muted)]/30 group-hover:text-[var(--accent-gold)]/30 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: tl.color + "20", color: tl.color }}>
                      {tl.label}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">{item.date}</span>
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-[var(--accent-gold)] transition-colors">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{item.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="bg-[var(--bg-card)] rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden border border-[var(--border-color)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 头部 */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: typeLabels[selected.type].color + "20", color: typeLabels[selected.type].color }}>
                    {typeLabels[selected.type].label}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">{selected.date}</span>
                </div>
                <button onClick={() => setSelected(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 内容 */}
              <div className="px-6 py-6 overflow-y-auto" style={{ maxHeight: "calc(85vh - 65px)" }}>
                <h2 className="text-2xl font-bold mb-4">{selected.title}</h2>
                <p className="text-[var(--text-secondary)] mb-6">{selected.description}</p>
                <div className="prose prose-invert max-w-none">
                  {selected.content.split("\n").map((line, i) => {
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return <h3 key={i} className="text-lg font-semibold text-[var(--accent-gold)] mt-6 mb-3">{line.replace(/\*\*/g, "")}</h3>;
                    }
                    if (line.startsWith("**")) {
                      return <p key={i} className="mb-2"><span className="font-semibold text-[var(--text-primary)]">{line.replace(/\*\*/g, "")}</span></p>;
                    }
                    if (line.startsWith("- ")) {
                      return <p key={i} className="mb-1 pl-4 text-sm text-[var(--text-secondary)]">• {line.slice(2)}</p>;
                    }
                    if (line.trim() === "") {
                      return <div key={i} className="h-3" />;
                    }
                    return <p key={i} className="mb-2 text-sm text-[var(--text-secondary)] leading-relaxed">{line}</p>;
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
