<template>
  <el-tooltip :content="title" v-if="accession">
    <el-button
      :type="type"
      @click="$emit('exportLatex')"
      :size="size"
      text
      placement="top"
    >
      <svg-icon name="download"></svg-icon>
    </el-button>
  </el-tooltip>
  <el-tooltip :content="$t('Technical description')">
    <el-button
      :type="type"
      @click="$emit('exportTechnical')"
      :size="size"
      text
      placement="top"
    >
      <svg-icon name="chat"></svg-icon>
    </el-button>
  </el-tooltip>
</template>
<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/store";
import { allRoles } from "@/configs/roles";

const emit = defineEmits(["exportLatex", "exportTechnical"]);
const props = defineProps({
  title: String,
  size: { type: String, default: "small" },
  type: { type: String, default: "success" },
});
const auth = useAuthStore();

const accession = computed(() => {
  return (
    auth.roles.includes(allRoles.admin) ||
    auth.roles.includes(allRoles.exportLatex)
  );
});
</script>
