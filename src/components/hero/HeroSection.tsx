"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { HelenAvatar } from "./HelenAvatar";
import { useI18n } from "@/lib/i18n";

const OceanScene = dynamic(
  () => import("@/components/ui/OceanScene").then((m) => m.OceanScene),
  { ssr: false }
);

export function HeroSection() {
  const { t } = useI18n();
  const router = useRouter();

  const handleStartChat = () => {
    // 直接跳转到聊天页面，无需登录
    router.push("/chat");
  };

  return (
    <section className="relative pt-24 pb-16 overflow-hidden bg-ocean">
      {/* 3D 海洋 + 金色沉淀粒子 */}
      <OceanScene />

      {/* 背景光效 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--accent-blue)]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--accent-gold)]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          {/* 左侧文案 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-gold)]/30 bg-[var(--accent-gold)]/5 px-4 py-1.5 mb-6">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-green)] animate-pulse" />
              <span className="text-xs text-[var(--accent-gold)]">{t("hero.online")}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="text-gradient-gold">{t("hero.title1")}</span>
              <br />
              <span className="text-[var(--text-primary)]">{t("hero.title2")}</span>
              <br />
              <span className="text-gradient-ocean">{t("hero.title3")}</span>
            </h1>

            <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-lg">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleStartChat}
                className="rounded-lg bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold-light)] px-6 py-3 text-base font-medium text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
              >
                {t("hero.cta1")}
              </button>
              <a href="/indicators" className="rounded-lg border border-[var(--border-light)] px-6 py-3 text-base text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)] transition-all">
                {t("hero.cta2")}
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6">
              {[
                { value: "200+", label: t("hero.stat1") },
                { value: "50+", label: t("hero.stat2") },
                { value: "24/7", label: t("hero.stat3") },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                >
                  <div className="text-2xl font-bold text-gradient-gold">{stat.value}</div>
                  <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 右侧 Helen 数字人 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <HelenAvatar />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
