<template>
  <div class="grid grid-cols-5 gap-3">
    <el-input
      prefix-icon="search"
      :placeholder="$t('Search')"
      clearable
      :model-value="modelValue.keyword"
      @update:model-value="
        (e) => $emit('update:modelValue', { ...modelValue, keyword: e })
      "
      @input="handleSearch($event)"
      class="overlay col-span-full lg:col-span-1 borderless"
    />
    <el-select
      class="overlay col-span-full lg:col-span-1 borderless"
      :placeholder="$t('Select status')"
      :model-value="modelValue.status"
      @update:model-value="
        (e) => $emit('update:modelValue', { ...modelValue, status: e })
      "
      @change="$emit('filterChange')"
      clearable
    >
      <el-option :label="$t('Active')" :value="1" />
      <el-option :label="$t('Inactive')" :value="0" />
    </el-select>
    <div class="col-span-full lg:col-span-1">
      <el-button @click="$emit('clear')"> {{ $t("Clear") }}</el-button>
      <el-button type="primary" @click="$emit('addKey')" icon="Plus">
        {{ $t("Add key") }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { shallowRef } from "vue";

const emit = defineEmits(["update:modelValue", "addKey", "filterChange"]);
const props = defineProps({
  modelValue: {
    type: Object,
    default: {},
  },
});

const searchTimeout = shallowRef(null);
const handleSearch = (e) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value);
  }
  searchTimeout.value = setTimeout(() => {
    emit("filterChange");
  }, 500);
};
</script>

<style lang="scss" scoped></style>
