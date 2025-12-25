import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { getLocales } from "./locales";

export function loadI18n(): typeof i18n {
  const messages = getLocales();
  i18n
    .use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
      resources: messages,
      lng: navigator.language.split("-")[0],
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      debug: true,
    })
    .catch((e) => {
      console.error(e);
    });

  console.log("messages: ", messages);

  return i18n;
}
