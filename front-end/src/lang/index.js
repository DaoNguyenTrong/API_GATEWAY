import i18next from "i18next";
import I18NextVue from "i18next-vue";
import LanguageDetector from "i18next-browser-languagedetector";
import vi from "./vi.json";
import en from "./en.json";
import config from "@/configs/constant";

const isDevelopment = config.nodeEnv === "development";
const Language = config.language;

i18next
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    detection: {
      lookupLocalStorage: Language,
      lookupSessionStorage: Language,
      lookupCookie: Language,
    },
    debug: isDevelopment,
    fallbackLng: "vi",
    resources: { vi, en },
  });

export function changeLanguage(lang = "vi") {
  i18next.changeLanguage(lang);
}

export const t = i18next.t;

export default function (app) {
  app.use(I18NextVue, { i18next });
  return app;
}
