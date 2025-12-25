import en from "./en.json";
import zh from "./zh.json";

export function getLocales() {
  return {
    en: {
      translation: en,
    },
    zh: {
      translation: zh,
    },
  };
}
