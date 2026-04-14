"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import zh from "../../messages/zh.json";
import en from "../../messages/en.json";

type Locale = "zh" | "en";
type Messages = typeof zh;

const messages: Record<Locale, Messages> = { zh, en };

// 辅助函数：根据路径获取嵌套对象的值
function getNestedValue(obj: any, path: string): string {
  return path.split(".").reduce((acc, part) => acc?.[part], obj) || path;
}

const I18nContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  messages: Messages;
}>({
  locale: "zh",
  setLocale: () => {},
  t: (key: string) => getNestedValue(zh, key),
  messages: zh,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("zh");

  const t = (key: string): string => {
    return getNestedValue(messages[locale], key);
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, messages: messages[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
