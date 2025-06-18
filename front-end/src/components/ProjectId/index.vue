<template>
  <el-card shadow="hover" class="no-border mb-2">
    <el-form label-position="left">
      <el-form-item prop="projectId" :label="`${$t('Project')}:`">
        <el-select
          :model-value="projectId"
          @update:model-value="updateModelValue"
          class="w-100 filled"
          filterable
          @change="(e) => $emit('change', e)"
          :placeholder="$t('Select project')"
        >
          <el-option
            v-for="option in options"
            :key="option.projectId"
            :value="option.projectId"
            :label="option.PrjName"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script setup>
import storage from "@/storage";
const props = defineProps({
  projectId: String,
  options: Array,
});
const emit = defineEmits(["update:projectId", "change"]);

function updateModelValue(e) {
  storage.local.setProjectId(e);
  emit("update:projectId", e);
}
</script>
