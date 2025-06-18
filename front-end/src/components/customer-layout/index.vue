<template>
  <div class="app-wrapper color-text-regular">
    <div class="main-container customer-container">
      <div class="fixed-header" id="main-app">
        <navbar></navbar>
      </div>
      <app-main />
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  onBeforeUnmount,
  onBeforeMount,
  watch,
  computed,
} from "vue";
import {
  useAppStore,
  useAuthStore,
  useOptionsStore,
  useReportStore,
} from "@/store";
import { useRoute } from "vue-router";

const route = useRoute();
const app = useAppStore();
const auth = useAuthStore();
const options = useOptionsStore();
const report = useReportStore();

watch(
  () => route,
  () => {
    if (app.device === "mobile" && app.sidebar) {
      app.closeSideBar();
    }
  }
);

onBeforeMount(async () => {
  window.addEventListener("resize", resizeHandler());
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", resizeHandler());
});

onMounted(() => {
  const isMobile = isMobileFunc();
  if (isMobile) {
    app.toggleDevice("mobile");
    app.closeSideBar();
  }
});

async function initInformation() {
  const promises = [options.getOptions()];
  await Promise.all(promises);
}

function isMobileFunc() {
  const { body } = document;
  const WIDTH = 992; // refer to Bootstrap's responsive design
  const rect = body.getBoundingClientRect();
  return rect.width - 1 < WIDTH;
}

function resizeHandler() {
  if (!document.hidden) {
    const isMobile = isMobileFunc();
    app.toggleDevice(isMobile ? "mobile" : "desktop");
    if (isMobile) {
      app.closeSideBar();
    }
  }
}

function handleClickOutside() {
  app.closeSideBar();
}

const classObj = computed(() => {
  return {
    hideSidebar: !app.sidebar,
    openSidebar: app.sidebar,
    mobile: app.device === "mobile",
  };
});
</script>

<style lang="scss" scoped></style>
