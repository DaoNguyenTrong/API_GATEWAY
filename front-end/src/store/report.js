import { defineStore } from "pinia";
import { ref } from "vue";
import { downloadReport } from "@/utils/export-LaTeX/index";

export const useReportStore = defineStore("reportStore", () => {
  const tex = ref("");
  const visible = ref(false);
  const fileName = ref("");
  const title = ref("");

  function setReport(content, name, t) {
    tex.value = content;
    fileName.value = name;
    title.value = t;
  }

  function exportReport() {
    downloadReport(tex.value, fileName.value);
  }

  return { tex, visible, fileName, title, exportReport, setReport };
});
