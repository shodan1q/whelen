"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { goldMacroArticles, metalStockArticles, type Article } from "@/data/articles";
import { useI18n } from "@/lib/i18n";

type Tab = "gold-macro" | "metal-stock";

export default function DailyPage() {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("gold-macro");
  const articles = tab === "gold-macro" ? goldMacroArticles : metalStockArticles;

  return (
    <div className="pt-28 pb-16 min-h-screen bg-grid-ocean">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-gold mb-2">{t("daily.title")}</h1>
          <p className="text-[var(--text-secondary)]">{t("daily.subtitle")}</p>
        </motion.div>

        {/* Tab 切换 */}
        <div className="flex gap-4 mb-8">
          {[
            { key: "gold-macro" as Tab, label: t("daily.goldMacro") },
            { key: "metal-stock" as Tab, label: t("daily.metalStock") },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                tab === t.key
                  ? "bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold-light)] text-[var(--bg-primary)]"
                  : "border border-[var(--border-light)] text-[var(--text-secondary)] hover:border-[var(--accent-gold)] hover:text-[var(--accent-gold)]"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* 文章列表 */}
        <div className="space-y-4">
          {articles.map((a, i) => (
            <ArticleCard key={a.id} article={a} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const { t } = useI18n();
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card-glow rounded-xl bg-[var(--bg-card)] p-6 hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-2 hover:text-[var(--accent-gold)] transition-colors">
            {article.title}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">{article.summary}</p>
          <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
            <span>{article.date}</span>
            <span>{article.source}</span>
            {article.views && <span>{article.views} {t("daily.views")}</span>}
            {article.comments && <span>{article.comments} {t("daily.comments")}</span>}
          </div>
        </div>
        <div className={`shrink-0 w-2 h-2 rounded-full mt-2 ${
          article.category === "gold-macro" ? "bg-[var(--accent-gold)]" : "bg-[var(--accent-blue)]"
        }`} />
      </div>
    </motion.article>
  );
}
