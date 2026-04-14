export interface Article {
  id: string;
  title: string;
  summary: string;
  category: "gold-macro" | "metal-stock";
  date: string;
  source: string;
  sourceUrl?: string;
  views?: number;
  comments?: number;
}

// 黄金相关宏观
export const goldMacroArticles: Article[] = [
  {
    id: "1",
    title: "黄金正在告别\"华尔街定价\"",
    summary: "黄金定价权正在从华尔街转移，央行购金和东方需求正在重塑黄金市场格局。",
    category: "gold-macro",
    date: "2026-02-26",
    source: "我爱分析的笔记",
    views: 299,
    comments: 1,
  },
  {
    id: "2",
    title: "人民币的\"双锚\"：黄金压舱，电力满格",
    summary: "1971年尼克松宣布美元跟黄金脱钩，美国转头找到石油搞出\"石油美元\"。今天轮到中国，黄金和电力成为人民币的双锚。",
    category: "gold-macro",
    date: "2026-02-21",
    source: "我爱分析的笔记",
  },
  {
    id: "3",
    title: "美军11天的库存，逼出一个\"黄金时代\"",
    summary: "美军战略储备仅够11天，关键矿物依赖进口，这背后是一个被忽视的黄金时代逻辑。",
    category: "gold-macro",
    date: "2026-02-22",
    source: "我爱分析的笔记",
    views: 48,
    comments: 3,
  },
  {
    id: "4",
    title: "白银还会上涨吗？",
    summary: "COMEX白银持仓和库存数据分析，总未平仓合约135,120手，3月合约37,651手。白银的工业属性和金融属性双重驱动。",
    category: "gold-macro",
    date: "2026-02-25",
    source: "我爱分析的笔记",
    views: 633,
    comments: 1,
  },
  {
    id: "5",
    title: "中国的\"绿色补贴\"，正在让美国提前输掉下一场战争",
    summary: "读完克雷格·廷戴尔的《关键矿物:战略分析》报告，每一枚战斧巡航导弹含有约500盎司白银。",
    category: "gold-macro",
    date: "2026-02-11",
    source: "我爱分析的笔记",
  },
  {
    id: "6",
    title: "对周五42号文的解读，券商很可能下周发节前红包",
    summary: "这份文件很重要：以前一刀切全禁止，现在划赛道开正门。虚拟资产监管思路的重大转变。",
    category: "gold-macro",
    date: "2026-02-08",
    source: "我爱分析的笔记",
    comments: 26,
  },
  {
    id: "7",
    title: "谷歌发了个\"百年债\"，却给美股敲响了警钟？",
    summary: "谷歌母公司Alphabet发行100年期债券，市场超额认购。一个公司对债主承诺100年后还钱，这意味着什么？",
    category: "gold-macro",
    date: "2026-02-11",
    source: "我爱分析的笔记",
    comments: 1,
  },
  {
    id: "8",
    title: "当AI把失业率推到8%",
    summary: "AI对就业市场的冲击正在加速，失业率攀升背后的宏观经济影响分析。",
    category: "gold-macro",
    date: "2026-02-28",
    source: "我爱分析的笔记",
    views: 44,
  },
];

// 有色相关个股
export const metalStockArticles: Article[] = [
  {
    id: "101",
    title: "电的逻辑，在变",
    summary: "电在换角色。以前电是成本，现在电在换角色。一年前DeepSeek免费、现在豆包随便用——算力需求爆发，电力成为新的战略资源。",
    category: "metal-stock",
    date: "2026-02-19",
    source: "我爱分析的笔记",
    comments: 4,
  },
  {
    id: "102",
    title: "芯片背后是电网",
    summary: "卡越多通信延迟越严重，散热越难搞，能耗越高。分析师们都在算功耗墙这笔账，堆叠方案虽然绕过制程限制，但代价是电力。",
    category: "metal-stock",
    date: "2026-02-21",
    source: "我爱分析的笔记",
  },
];

export const allArticles = [...goldMacroArticles, ...metalStockArticles];
