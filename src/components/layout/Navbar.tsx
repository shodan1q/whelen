"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { locale, setLocale, t } = useI18n();

  const navItems = [
    { label: t("nav.indicators"), href: "/indicators" },
    { label: t("nav.market"), href: "/market" },
    { label: t("nav.library"), href: "/library" },
    { label: t("nav.daily"), href: "/daily" },
    { label: t("nav.chart"), href: "/chart" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/85 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-ocean)] to-[var(--accent-blue)] overflow-hidden">
              <span className="text-lg font-bold text-[var(--accent-gold)]">H</span>
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-[var(--accent-gold)]/30 to-transparent" />
            </div>
            <div>
              <span className="text-lg font-semibold text-gradient-gold">{t("nav.brand")}</span>
              <span className="ml-2 text-xs text-[var(--text-muted)]">{locale === "zh" ? "问海伦" : ""}</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-sm transition-colors ${
                    isActive
                      ? "text-[var(--accent-gold)] font-medium"
                      : "text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-[var(--accent-gold)]" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* 语言切换 */}
            <button
              onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors"
            >
              {locale === "zh" ? "EN" : "中文"}
            </button>

            <Link
              href="/chat"
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-opacity ${
                pathname === "/chat"
                  ? "bg-[var(--accent-gold)] text-[var(--bg-primary)]"
                  : "bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-gold-light)] text-[var(--bg-primary)] hover:opacity-90"
              }`}
            >
              {t("nav.chat")}
            </Link>
          </div>

          <button className="md:hidden text-[var(--text-secondary)]" onClick={() => setIsOpen(!isOpen)}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-[var(--border-color)] py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block py-2 text-sm ${
                    isActive
                      ? "text-[var(--accent-gold)] font-medium"
                      : "text-[var(--text-secondary)] hover:text-[var(--accent-gold)]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              href="/chat"
              className={`block py-2 text-sm ${pathname === "/chat" ? "text-[var(--accent-gold)] font-medium" : "text-[var(--accent-gold)]"}`}
              onClick={() => setIsOpen(false)}
            >
              {t("nav.chat")}
            </Link>
            <button
              onClick={() => {
                setLocale(locale === "zh" ? "en" : "zh");
                setIsOpen(false);
              }}
              className="block py-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent-gold)] text-left"
            >
              {locale === "zh" ? "English" : "中文"}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
