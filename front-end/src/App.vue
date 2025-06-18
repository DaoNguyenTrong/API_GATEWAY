<template>
  <el-config-provider :locale="locale" size="default">
    <router-view />
  </el-config-provider>
</template>
<script setup>
import { computed } from "vue";
import vi from "element-plus/dist/locale/vi";
import en from "element-plus/dist/locale/en";
import { useSettingsStore } from "@/store";

const settings = useSettingsStore();

const locale = computed(() => (settings.language === "vi" ? vi : en));
</script>

<style>
#app {
  color: var(--el-text-color-primary);
}

.element-plus-logo {
  width: 50%;
}
</style>
