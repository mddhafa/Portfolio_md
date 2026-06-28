"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import id from "./id";
import en from "./en";

type Locale = "id" | "en";
type Translations = typeof id;

const translations = { id, en };

type I18nContextType = {
  locale: Locale;
  t: Translations;
  toggle: () => void;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("id");

  const toggle = () => setLocale((prev) => (prev === "id" ? "en" : "id"));

  return (
    <I18nContext.Provider value={{ locale, t: translations[locale], toggle }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}