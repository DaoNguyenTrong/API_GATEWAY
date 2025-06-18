<template>
  <dialog-template
    :visible="visible"
    @update:visible="(e) => $emit('update:visible', e)"
    align-center
  >
    <template #header>{{ title }}</template>

    <template #footer>
      <el-button text @click="$emit('update:visible', false)">
        {{ $t("Cancel") }}
      </el-button>
      <el-button type="primary" @click="$emit('complete')">
        {{ $t("Export") }}
      </el-button>
    </template>
  </dialog-template>
</template>

<script setup>
import { shallowRef } from "vue";

const props = defineProps({
  title: String,
  visible: Boolean,
  modelValue: { type: String, default: "" },
});
const emit = defineEmits(["update:modelValue", "update:visible", "complete"]);

const view = shallowRef();
</script>
