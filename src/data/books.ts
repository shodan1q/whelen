export interface Book {
  id: string;
  title: string;
  titleEn: string;
  type: "book-note";
  description: string;
  descriptionEn: string;
  content: string;
  contentEn: string;
  date: string;
}

export const allBooks: Book[] = [
  {
    id: "1",
    title: "《炒股的智慧》",
    titleEn: "The Wisdom of Stock Trading",
    type: "book-note",
    description: "把长期稳定赚钱作为唯一评判标准，强调股市的难点不在知识，而在人性。",
    descriptionEn: "Focuses on long-term stable profits as the only criterion.",
    content: "本书把长期稳定赚钱作为唯一评判标准，强调股市的难点不在知识，而在人性：贪婪、恐惧、从众、急于求成与不愿认错。",
    contentEn: "This book uses long-term stable profits as the only criterion.",
    date: "2026-03-01",
  },
  {
    id: "2",
    title: "《股票深度交易心理学》",
    titleEn: "Deep Trading Psychology",
    type: "book-note",
    description: "提出优秀交易=20%方法+80%心理，解释了为何模拟盘常常盈利、真金白银却频繁失误。",
    descriptionEn: "Proposes Excellent Trading = 20% Method + 80% Psychology.",
    content: "本书提出优秀交易=20%方法+80%心理，解释了为何模拟盘常常盈利、真金白银却频繁失误：金钱压力会放大情绪反应。",
    contentEn: "This book proposes Excellent Trading = 20% Method + 80% Psychology.",
    date: "2026-03-01",
  },
  {
    id: "3",
    title: "《通向成功的交易心理学》",
    titleEn: "Trading Psychology for Success",
    type: "book-note",
    description: "把稳定绩效视为心理训练的结果，提出提高抗压与复原力的方法。",
    descriptionEn: "Views stable performance as the result of psychological training.",
    content: "本书把稳定绩效视为心理训练的结果：交易环境充满不确定性，恐惧会促使过度保守与错失机会。",
    contentEn: "This book views stable performance as the result of psychological training.",
    date: "2026-03-01",
  },
  {
    id: "4",
    title: "《交易》",
    titleEn: "Trading",
    type: "book-note",
    description: "强调基本面是战略，技术面是战术。基本面用于识别大方向与周期。",
    descriptionEn: "Emphasizes fundamentals are strategy, technicals are tactics.",
    content: "本书强调基本面是战略，技术面是战术。基本面用于识别大方向与周期。",
    contentEn: "This book emphasizes fundamentals are strategy, technicals are tactics.",
    date: "2026-03-01",
  },
  {
    id: "5",
    title: "《低风险高回报》",
    titleEn: "Low Risk, High Return",
    type: "book-note",
    description: "讨论低波动之谜：风险更低、波动更小的资产组合往往能获得更好的回报。",
    descriptionEn: "Discusses the low volatility anomaly.",
    content: "本书讨论低波动之谜：在长期权益市场中，风险更低、波动更小的资产组合往往能获得不逊于、甚至优于高波动组合的回报。",
    contentEn: "This book discusses the low volatility anomaly.",
    date: "2026-03-01",
  },
  {
    id: "6",
    title: "《基金作战笔记》",
    titleEn: "Fund Combat Notes",
    type: "book-note",
    description: "面向基金投资的全流程，核心目标是把买基金从跟风变为配置与管理。",
    descriptionEn: "Covers the full process of fund investment.",
    content: "本书面向基金投资的全流程，核心目标是把买基金从跟风变为配置与管理。",
    contentEn: "This book covers the full process of fund investment.",
    date: "2026-03-01",
  },
  {
    id: "7",
    title: "《最懂输的人才能成为赢家》",
    titleEn: "The Best Losers Become Winners",
    type: "book-note",
    description: "以逆向思维解释交易的少数人胜出逻辑：想获得非凡结果，需要先理解大众输钱的路径。",
    descriptionEn: "Uses contrarian thinking to explain the minority winner logic in trading.",
    content: "本书以逆向思维解释交易的少数人胜出逻辑：想获得非凡结果，需要先理解大众输钱的路径，再系统性地反着做。",
    contentEn: "This book uses contrarian thinking to explain the minority winner logic in trading.",
    date: "2026-03-01",
  },
  {
    id: "8",
    title: "《以交易为生》",
    titleEn: "Trading for a Living",
    type: "book-note",
    description: "经典交易系统教材，提出成功交易的三大支柱：心理、方法与资金管理。",
    descriptionEn: "Classic trading system textbook.",
    content: "本书是经典交易系统教材，提出成功交易的三大支柱：心理、方法与资金管理，并强调交易记录与复盘是持续进化的发动机。",
    contentEn: "This book is a classic trading system textbook.",
    date: "2026-03-01",
  },
  {
    id: "9",
    title: "《以交易为生 第二部》",
    titleEn: "Trading for a Living Part 2",
    type: "book-note",
    description: "聚焦卖出的艺术，认为多数亏损并非来自买错，而是来自不会卖。",
    descriptionEn: "Focuses on the art of selling.",
    content: "本书聚焦卖出的艺术，认为多数亏损并非来自买错，而是来自不会卖：盈利时过早兑现、亏损时拖延止损、行情反转时缺乏计划。",
    contentEn: "This book focuses on the art of selling.",
    date: "2026-03-01",
  },
  {
    id: "10",
    title: "《技术分析》",
    titleEn: "Technical Analysis",
    type: "book-note",
    description: "把技术分析定义为对市场行为的系统研究，核心目的是识别趋势、衡量风险收益。",
    descriptionEn: "Defines technical analysis as systematic study of market behavior.",
    content: "本书把技术分析定义为对市场行为的系统研究，核心目的不是预测每一次涨跌，而是识别趋势、衡量风险收益并制定可执行的交易计划。",
    contentEn: "This book defines technical analysis as systematic study of market behavior.",
    date: "2026-03-01",
  },
];
