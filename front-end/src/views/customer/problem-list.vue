<template>
  <dialog-template
    :visible="modelValue"
    @update:visible="(e) => $emit('update:modelValue', e)"
    width="500px"
    destroy-on-close
    ref="formRef"
  >
    <template #header>{{ $t("Problem list") }}</template>
    <table-template></table-template>
  </dialog-template>
</template>

<script setup>
const props = defineProps({ modelValue: { type: Boolean } });
const emit = defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped></style>
