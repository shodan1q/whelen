"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export function HelenIntro() {
  const [showVideo, setShowVideo] = useState(false);
  const videoUrl = "/videos/helen-intro.mp4";
  const { t } = useI18n();

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 relative bg-[var(--bg-secondary)]"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* 左侧文字 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                <span className="text-gradient-gold">{t("helenIntro.title")}</span>
              </h2>
              <p className="text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">
                {t("helenIntro.desc1")}
              </p>
              <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
                {t("helenIntro.desc2")}
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setShowVideo(true)}
                  className="group inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold-light)] px-6 py-3 text-base font-medium text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  {t("helenIntro.watchVideo")}
                </button>
                <a
                  href="https://play.google.com/store/apps/details?id=com.dlzq.rongmai&hl=zh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-lg border-2 border-[var(--accent-gold)] px-6 py-3 text-base font-medium text-[var(--accent-gold)] hover:bg-[var(--accent-gold)] hover:text-[var(--bg-primary)] transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {t("helenIntro.downloadNeuralFin")}
                </a>
              </div>
            </motion.div>

            {/* 右侧视频预览 */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div
                onClick={() => setShowVideo(true)}
                className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--accent-ocean)]/20 cursor-pointer group"
              >
                {/* 视频封面图 */}
                <img 
                  src="/videos/helen-intro-poster.jpg" 
                  alt="Helen 介绍视频"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* 渐变遮罩 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                
                {/* 播放按钮 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[var(--accent-gold)]/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-[var(--accent-gold)]/30 transition-all group-hover:scale-110">
                    <svg className="w-8 h-8 text-[var(--accent-gold)] ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* 装饰元素 */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[var(--bg-card)]/80 backdrop-blur-sm">
                  <span className="text-xs text-[var(--accent-gold)]">3:45</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 视频弹窗 */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowVideo(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 关闭按钮 */}
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* 视频播放器 */}
              {videoUrl ? (
                <video
                  src={videoUrl}
                  poster="/videos/helen-intro-poster.jpg"
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-[var(--accent-gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg">{t("helenIntro.comingSoon")}</p>
                    <p className="text-sm text-gray-400 mt-2">{t("helenIntro.stayTuned")}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
