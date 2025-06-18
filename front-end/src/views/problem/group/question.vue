<template>
  <el-card shadow="never" class="no-border pos-relative">
    <el-button
      text
      icon="Close"
      circle
      class="absolute"
      style="z-index: 10; top: 1px; right: 1px"
      size="small"
      @click="$emit('remove')"
    ></el-button>
    <el-form-item :rules="rules">
      <el-input
        class="filled outlined"
        type="textarea"
        :modelValue="modelValue"
        @update:model-value="(e) => $emit('update:modelValue', e)"
      ></el-input>
    </el-form-item>
    <el-switch
      :model-value="type"
      @update:model-value="(e) => $emit('update:type', e)"
      :active-text="$t('Yes no question')"
      :active-value="0"
      :inactive-value="1"
    ></el-switch>
  </el-card>
</template>

<script setup>
import { t } from "i18next";

const props = defineProps({ label: String, modelValue: String, type: Number });
const emit = defineEmits(["update:modelValue", "remove", "update:type"]);

const rules = [
  { required: true, message: () => t("Required field"), trigger: "change" },
];
</script>

<style lang="scss" scoped></style>
