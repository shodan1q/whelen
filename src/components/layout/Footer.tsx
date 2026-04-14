"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)] relative overflow-hidden">
      {/* 底部波浪装饰 */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent-gold)]/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-ocean)] to-[var(--accent-blue)]">
                <span className="text-lg font-bold text-[var(--accent-gold)]">H</span>
              </div>
              <span className="text-lg font-semibold text-gradient-gold">{t("nav.brand")}</span>
            </div>
            <p className="text-sm text-[var(--text-muted)] max-w-md">
              {t("footer.tagline")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">{t("footer.platform")}</h3>
            <ul className="space-y-2">
              {[
                { label: t("nav.indicators"), href: "/indicators" },
                { label: t("nav.market"), href: "/market" },
                { label: t("nav.library"), href: "/library" },
                { label: t("nav.daily"), href: "/daily" },
                { label: t("nav.chart"), href: "/chart" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">{t("footer.more")}</h3>
            <ul className="space-y-2">
              {[
                { label: t("nav.chat"), href: "/chat" },
                { label: t("footer.about"), href: "#" },
                { label: t("footer.privacy"), href: "#" },
                { label: t("footer.terms"), href: "#" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--border-color)] pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--text-muted)]">
              {t("footer.copyright")}
            </p>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)]">
              <svg className="w-3.5 h-3.5 text-[var(--accent-gold)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span className="text-xs font-medium text-[var(--text-secondary)]">Powered by OpenClaw Multi-Agent System</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
