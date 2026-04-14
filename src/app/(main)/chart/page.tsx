"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import Image from "next/image";

interface ChartData {
  date: string;
  title: string;
  titleEn: string;
  content: string;
  contentEn: string;
  images: string[];
}

const chartData: ChartData = {
  date: "2026-02-27",
  title: "每日一图 - 2026年2月27日",
  titleEn: "Daily Chart - February 27, 2026",
  content: "周四，A股延续分化，算力硬件与电力股领涨，但影视院线持续调整，市场在科技成长与周期资源间反复轮动。预测走势与实际一致。2026年2月27日，预测中证1000小幅下跌，走势参考2023年3月15日，沪深300小幅上涨，走势参考2023年6月13日。",
  contentEn: "Thursday, A-shares continued to diverge, with computing hardware and power stocks leading gains, but cinema chains continued to adjust. The market repeatedly rotated between tech growth and cyclical resources. Predictions matched actual trends. On February 27, 2026, CSI 1000 is predicted to decline slightly (reference: March 15, 2023), while CSI 300 is predicted to rise slightly (reference: June 13, 2023).",
  images: [
    "/daily-charts/image1.png",
    "/daily-charts/image2.png",
    "/daily-charts/image3.png",
    "/daily-charts/image4.png",
    "/daily-charts/image5.png",
  ],
};

export default function ChartPage() {
  const { t } = useI18n();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="pt-28 pb-16 min-h-screen bg-grid-ocean">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">
            每日一图
          </h1>
          <p className="text-[var(--text-secondary)]">
            Helen 的市场预测与实际走势对比
          </p>
        </motion.div>

        {/* 日期标签 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/30">
            <svg className="w-4 h-4 text-[var(--accent-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-[var(--accent-gold)] font-medium">
              {chartData.date}
            </span>
          </div>
        </motion.div>

        {/* 内容描述 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-glow rounded-xl bg-[var(--bg-card)] p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-4 text-gradient-gold">
            {chartData.title}
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
            {chartData.content}
          </p>
          <p className="text-[var(--text-muted)] text-sm leading-relaxed italic">
            {chartData.contentEn}
          </p>
        </motion.div>

        {/* 图片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chartData.images.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              onClick={() => setSelectedImage(img)}
              className="card-glow rounded-xl bg-[var(--bg-card)] overflow-hidden cursor-pointer group hover:bg-[var(--bg-card-hover)] transition-colors"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={img}
                  alt={`Chart ${index + 1}`}
                  className="w-full h-full object-contain bg-white group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-[var(--text-secondary)]">
                  图表 {index + 1} / Chart {index + 1}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 图片查看器 */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-6xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-[var(--accent-gold)] transition-colors"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedImage}
                alt="Full size chart"
                className="w-full h-full object-contain rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
