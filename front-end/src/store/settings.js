import { defineStore } from "pinia";
import { changeLanguage } from "@/lang/index";
import { ref } from "vue";
import storage from "@/storage";
import { getPageTitle } from "@/utils";
import { useRoute } from "vue-router";
import { t } from "i18next";

export const useSettingsStore = defineStore("settingStore", () => {
  const route = useRoute();
  const language = ref("vi");

  language.value = storage.local.getLanguage() || "vi";
  document.documentElement.setAttribute("lang", language.value);

  function changeLang(lang) {
    if (lang !== "vi" && lang !== "en") {
      throw "Only accept vi and en";
    }
    changeLanguage(lang);
    document.title = getPageTitle(t(route.meta.title));
    language.value = lang;
    document.documentElement.setAttribute("lang", lang);
  }

  return {
    language,
    changeLang,
  };
});
