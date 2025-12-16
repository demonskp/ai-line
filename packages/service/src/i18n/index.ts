import zh from "./message/zh.json";
import en from "./message/en.json";

export function getMessage() {
  return {
    zh: {
      translation: zh,
    },
    en: {
      translation: en,
    },
  };
}
