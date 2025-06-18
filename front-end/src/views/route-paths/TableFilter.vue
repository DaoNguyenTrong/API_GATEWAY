<template>
  <div class="grid grid-cols-6 gap-3">
    <el-input
      prefix-icon="search"
      :placeholder="$t('Search')"
      clearable
      :model-value="modelValue.keyword"
      @update:model-value="
        $emit('update:modelValue', { ...modelValue, keyword: $event })
      "
      class="overlay col-span-full lg:col-span-1 borderless"
    />
    <el-select
      class="overlay col-span-full lg:col-span-1 borderless"
      :placeholder="$t('Select status')"
      :model-value="modelValue.status"
      @update:model-value="
        $emit('update:modelValue', { ...modelValue, status: $event })
      "
    >
      <el-option
        v-for="item in [
          { label: 'Active', value: true },
          { label: 'Inactive', value: false },
        ]"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-select
      class="overlay col-span-full lg:col-span-1 borderless"
      :placeholder="$t('Select method')"
      :model-value="modelValue.method"
      @update:model-value="
        $emit('update:modelValue', { ...modelValue, method: $event })
      "
    >
      <el-option
        v-for="item in [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' },
          { label: 'PATCH', value: 'PATCH' },
          { label: 'HEAD', value: 'HEAD' },
          { label: 'OPTIONS', value: 'OPTIONS' },
        ]"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <div class="col-span-full lg:col-span-3 flex">
      <el-button @click="$emit('clear')" icon="Refresh">
        {{ $t("Clear") }}
      </el-button>
      <el-button type="primary" @click="$emit('addPath')" icon="Plus">
        {{ $t("Add proxy") }}
      </el-button>
      <div class="grow"></div>
      <el-button
        type="warning"
        @click="$emit('reloadRoutes')"
        icon="Warning"
        plain
      >
        {{ $t("Reload proxies") }}
      </el-button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits([
  "update:modelValue",
  "addPath",
  "clear",
  "reloadRoutes",
]);
</script>

<style lang="scss" scoped></style>
