"use client";

import { motion } from "framer-motion";
import { HeroSection } from "@/components/hero/HeroSection";
import { MarketTicker } from "@/components/market/MarketTicker";
import { FeaturesSection } from "@/components/hero/FeaturesSection";
import { HelenIntro } from "@/components/hero/HelenIntro";
import { PricingSection } from "@/components/pricing/PricingSection";
import { ChatPreview } from "@/components/chat/ChatPreview";
import { WaveBackground } from "@/components/ui/WaveBackground";
import { useI18n } from "@/lib/i18n";

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="bg-grid-ocean relative">
      <MarketTicker />
      <HeroSection />

      {/* 对话预览 */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="py-20 relative"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gradient-gold mb-4">{t("chat.title")}</h2>
            <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
              {t("chat.subtitle")}
            </p>
          </div>
          <ChatPreview />
        </div>
      </motion.section>

      {/* Helen 介绍视频 */}
      <HelenIntro />

      <FeaturesSection />

      {/* 定价方案 */}
      <PricingSection />

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <WaveBackground />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-[var(--accent-gold)]/20 bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-primary)] p-12"
          >
            <h2 className="text-3xl font-bold mb-4">{t("cta.title")}</h2>
            <p className="text-[var(--text-secondary)] mb-8 max-w-lg mx-auto">
              {t("cta.subtitle")}
            </p>
            <a
              href="/auth"
              className="rounded-lg bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold-light)] px-8 py-3 text-base font-medium text-[var(--bg-primary)] hover:opacity-90 transition-opacity inline-block"
            >
              {t("cta.button")}
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
