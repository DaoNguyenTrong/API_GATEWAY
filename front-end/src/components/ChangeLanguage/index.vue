<template>
  <el-dropdown trigger="click" @command="selectLang">
    <span class="hov-pointer text-white">
      {{ settings.language === "vi" ? $t("vietnam") : $t("english") }}
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="vi">{{ $t("vietnam") }}</el-dropdown-item>
        <el-dropdown-item command="en">{{ $t("english") }}</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
<script setup>
import { ref } from "vue";
import { useSettingsStore } from "@/store";
import { t } from "i18next";

const settings = useSettingsStore();

function selectLang(e) {
  settings.changeLang(e);
}
</script>
<style scoped>
.lang-select {
  width: 200px !important;
}
</style>
