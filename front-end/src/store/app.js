import { defineStore } from "pinia";
import { ref } from "vue";
import storage from "@/storage";

export const useAppStore = defineStore("appStore", () => {
  const device = ref("desktop");
  const sidebar = ref(true);
  sidebar.value = storage.local.getSidebar()
    ? !!+storage.local.getSidebar()
    : true;

  function toggleDevice(value) {
    device.value = value;
  }

  function toggleSidebar() {
    sidebar.value = !sidebar.value;
    if (sidebar.value) {
      storage.local.setSidebar(1);
    } else {
      storage.local.setSidebar(0);
    }
  }

  function closeSideBar() {
    sidebar.value = false;
    storage.local.setSidebar(0);
  }

  return {
    device,
    sidebar,
    toggleDevice,
    toggleSidebar,
    closeSideBar,
  };
});
