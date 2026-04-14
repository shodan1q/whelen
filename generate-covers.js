const fs = require('fs');
const { createCanvas } = require('canvas');

// 书籍数据
const books = [
  { id: 1, title: "《关键矿物：战略分析》", color1: "#667eea", color2: "#764ba2" },
  { id: 2, title: "盘后3点：为什么高开后急转直下", color1: "#f093fb", color2: "#f5576c", isVideo: true },
  { id: 3, title: "黄金定价权转移的底层逻辑", color1: "#4facfe", color2: "#00f2fe" },
  { id: 4, title: "白银：被严重低估的战略金属", color1: "#43e97b", color2: "#38f9d7" },
  { id: 5, title: "宏观分析框架：如何看懂一轮行情", color1: "#fa709a", color2: "#fee140" },
  { id: 6, title: "《炒股的智慧》", color1: "#30cfd0", color2: "#330867" },
  { id: 7, title: "《股票深度交易心理学》", color1: "#a8edea", color2: "#fed6e3" },
  { id: 8, title: "《通向成功的交易心理学》", color1: "#ff9a9e", color2: "#fecfef" },
  { id: 9, title: "《交易》", color1: "#ffecd2", color2: "#fcb69f" },
  { id: 10, title: "《低风险高回报》", color1: "#ff6e7f", color2: "#bfe9ff" },
  { id: 11, title: "《基金作战笔记》", color1: "#e0c3fc", color2: "#8ec5fc" },
  { id: 12, title: "《最懂输的人才能成为赢家》", color1: "#f093fb", color2: "#f5576c" },
  { id: 13, title: "《以交易为生》", color1: "#4facfe", color2: "#00f2fe" },
  { id: 14, title: "《以交易为生 第二部》", color1: "#43e97b", color2: "#38f9d7" },
  { id: 15, title: "《技术分析》", color1: "#fa709a", color2: "#fee140" },
];

// 生成封面
books.forEach(book => {
  const width = 400;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 渐变背景
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, book.color1);
  gradient.addColorStop(1, book.color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // 半透明遮罩
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.fillRect(0, 0, width, height);

  // 如果是视频，添加播放图标
  if (book.isVideo) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, 60, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = book.color1;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 20, height / 2 - 30);
    ctx.lineTo(width / 2 - 20, height / 2 + 30);
    ctx.lineTo(width / 2 + 30, height / 2);
    ctx.closePath();
    ctx.fill();
  }

  // 标题文字
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 32px "PingFang SC", "Microsoft YaHei", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // 分行显示标题
  const maxWidth = width - 60;
  const lines = [];
  let currentLine = '';
  
  for (let char of book.title) {
    const testLine = currentLine + char;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  
  const lineHeight = 45;
  const startY = height - 120 - (lines.length - 1) * lineHeight / 2;
  
  lines.forEach((line, i) => {
    ctx.fillText(line, width / 2, startY + i * lineHeight);
  });

  // 保存图片
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/covers/book-${book.id}.png`, buffer);
  console.log(`Generated cover for: ${book.title}`);
});

console.log('All covers generated!');
