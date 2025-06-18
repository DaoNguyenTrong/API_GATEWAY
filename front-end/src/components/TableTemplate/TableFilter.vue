<template>
  <el-popover placement="bottom" :width="200" trigger="click">
    <div class="flex flex-col gap-2">
      <el-input
        class="filled h-5 mb-1"
        :placeholder="$t('Search')"
        prefix-icon="Search"
        :model-value="modelValue"
        @update:model-value="(e) => $emit('update:modelValue', e)"
      ></el-input>
      <el-card shadow="never"></el-card>
      <div class="flex justify-end">
        <el-button link>Clear</el-button>
        <el-button type="primary">Ok</el-button>
      </div>
    </div>

    <template #reference>
      <el-button class="filter-icon" link type="primary" @click.stop="">
        <font-awesome-icon :icon="['fas', 'filter']" />
      </el-button>
    </template>
  </el-popover>
</template>

<script setup>
const props = defineProps({ modelValue: null });
const emit = defineEmits(["update:modelValue"]);
</script>

<style lang="scss" scoped>
.filter-icon {
  position: absolute;
  top: 0px;
  right: 0px;
  font-size: 0.5rem;
}
</style>
